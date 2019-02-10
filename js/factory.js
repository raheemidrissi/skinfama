
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////utilitaires :
//////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function() {
	'use strict';
	angular.module('avservicesApp').factory('utilsFactory', utilsFactory);

	utilsFactory.$inject = ['envConstants','$http','$sce',"$location"];
	

	function utilsFactory(envConstants,$http,$sce,$location) {

		var utilsFactory = {};

		utilsFactory.tinify = function (url) {
		   	var MyPromise =  $http({
                method: 'get',
                url: $sce.trustAsResourceUrl(envConstants.urlLuceneServices + 'shortener?url=' + window.encodeURIComponent(url))
            });
			return MyPromise.then(function onSuccess(response){
//				console.log(response);
                var MyUrl = response.data;
                return MyUrl;
            });			
		}

		// fonction qui renvoie la liste formattée des video
		utilsFactory.createVideoVersionsList = function (list, order) {
			var videoVersionsArray = [];
			if (order) {
				for (var i = 0; i < order.length; i++) {
					var lgShortname = Object.keys(order[i])[0];
					var lgFullname = order[i][lgShortname].TEXT;
					var videoArray = {};
					videoArray = (list["16:9"] ? list["16:9"][lgShortname]
							: (list["4:3"] ? list["4:3"][lgShortname] : (list["1:1"] ? list["1:1"][lgShortname] : {}))) || {};
					angular.forEach(videoArray, function(value, key) {
						videoArray[key] = value.replace(/^(https?:|)/, '');
					});
					videoArray.LGSHORT = lgShortname;
					videoArray.LGFULL = lgFullname;
					videoVersionsArray.push(videoArray);
				}
			}
			return videoVersionsArray;
		};

		// fonction qui renvoie le producteur ou le réalisateur d'une vidéo pour une version de langue donnée
		utilsFactory.getCooperator = function (obj, lang) {
			var cooperator;
			if (obj.cooperator_json) {
				// obj = obj.cooperator_json;
				var tmp = obj.cooperator_json[obj.ref + '-' + lang + '-1'];
				if (tmp && tmp.DIRECTOR) {
					cooperator = tmp.DIRECTOR[0];
				} else {
					cooperator = tmp.PRODUCER[0];
				}
			}
			return cooperator;
		};
		
		
		// fonction qui prend un json et renvoie un objet photo
		utilsFactory.createPhotoObj = function (json) {
            var photosObj = {};

            photosObj.ref = json.ref|| json.primary_key;
            photosObj.type = json.type;
            photosObj.doc_ref = json.doc_ref;
            photosObj.title = json.titles_json;
            photosObj.project = json.project_json;
            photosObj.summary = json.summary_json;
            photosObj.legend = json.legend_json;
            photosObj.personnalities = json.pers_json;
            // on mets une valeur par défaut pour le preferedterm : si il existe pas, on prend la première valeur
            if (photosObj.personnalities)
            	photosObj.personnalities.forEach(function(element) {if (! element.preferedterm) element.preferedterm = element.value[0]; });

            if (json.cooperator_json){
                photosObj.photographer = json.cooperator_json;
            }

            photosObj.copyright = json.copyright_json;
            photosObj.location = json.location_json;
            photosObj.thesaurus = json.thesgen_json;
            photosObj.views = json.views;

            photosObj.image = createPhotoList(json.media_json);
            photosObj.thumb = json.media_json ? envConstants.urlPhotoCdn + json.media_json.MED.PATH : undefined;
            photosObj.thumbmini = json.media_json ? envConstants.urlPhotoCdn + json.media_json.LOW.PATH : undefined;
            photosObj.date = json.shootstartdate ? json.shootstartdate.substr(6,2) + '/' + json.shootstartdate.substr(4,2) + '/' + json.shootstartdate.substr(0,4) : undefined;
			return photosObj;
		};
		
		//fonction qui prend un json et renvoie un objet video
		utilsFactory.createVideoObj = function(json){
            var videosObj = {};
            videosObj.ref = json.ref|| json.primary_key;
            videosObj.type = 'VIDEO';
            videosObj.hasShots = json.hasShots;
            videosObj.title = json.titles_json;
            videosObj.project = json.project_json;
            videosObj.duration = json.duration;
           	videosObj.video = (json.media_json && json.mediaorder_json) ? utilsFactory.createVideoVersionsList(json.media_json, json.mediaorder_json) : undefined; 
            videosObj.thumbmini=videosObj.video ? videosObj.video[0].THUMB :'';
            videosObj.thumb=videosObj.video ? videosObj.video[0].IMAGE : "";
//            videosObj.embededvideo = $location.protocol() + "://"+ $location.host() + ":"+ $location.port() + envConstants.UrlChannel + "ref=" + videosObj.ref; // construction de l'url pour la video principale, not allowed in the ng-src

            videosObj.summary = '';
            videosObj.summary =  json.summary_json;
            videosObj.cooperator = json.cooperator_json;
            videosObj.mediaorder = json.mediaorder_json;
            videosObj.languages = json.mediaorder_json ? json.mediaorder_json.map(function(lang){return  {'lang': {'short':Object.keys(lang)[0],'long':lang[Object.keys(lang)[0]].TEXT},'details':lang[Object.keys(lang)[0]]};}) : undefined;
            videosObj.subtitles = (angular.isObject(json.mvtt_json)) ? json.mvtt_json[json.ref] : [];
            videosObj.institution = json.institution_json;
            videosObj.personalities = json.pers_json;
            videosObj.genre =  json.genre_json;
            videosObj.copyright =  json.copyright_json;
            videosObj.location = json.location_json;
            videosObj.thesaurus = json.thesgen_json;
            videosObj.views = json.views;
            videosObj.related = json.relared;
            videosObj.videosRelated = json.relared && json.relared.VIDEO ? 
            		json.relared.VIDEO.docs.filter(function(Myrelated){return Myrelated.type=='VIDEO'}).map(function(MyVideo){return utilsFactory.createVideoObj(MyVideo);})
            		: undefined;
            videosObj.photosRelated = json.relared && json.relared.REPORTAGE ?
            		json.relared.REPORTAGE.docs.filter(function(Myrelated){return Myrelated.type=='REPORTAGE'}).map(function(MyPhoto){return utilsFactory.createPhotoObj(MyPhoto)})
            		: undefined;
            videosObj.date = json.productiondate ? json.productiondate.substr(6,2) + '/' + json.productiondate.substr(4,2) + '/' + json.productiondate.substr(0,4) : undefined;
            return videosObj;
		}

		//fonction qui prend un json et renvoie un objet video
		utilsFactory.createMediagroupObj = function(json){
            var mediagroupObj = {};
            
            if (json){
            // on remplit un objet title media group
            // etc
            mediagroupObj.ref =  json.ref || json.primary_key ;                
            mediagroupObj.title =  json.titles_json;      // titre du mediagroup
            mediagroupObj.description = json.description_json ;   // summary du mediagroup

            mediagroupObj.start_date = (json.start_date) ? moment(json.start_date).format('DD/MM/YYYY') : undefined ;   // date de debut du mediagroup
            mediagroupObj.end_date = (json.end_date) ?  moment(json.end_date).format('DD/MM/YYYY') : undefined ;   // date de fin du mediagroup

            mediagroupObj.focus = json.focus;
            // on decode le primary media, pour le thumbnail
            if (json.primarymedia){
	            switch(json.primarymedia.type){
		            case "REPORTAGE":
		            case "PHOTO":
		                mediagroupObj.primarymedia = utilsFactory.createPhotoObj(json.primarymedia);
		                break;
		            case "VIDEO":
		                mediagroupObj.primarymedia = utilsFactory.createVideoObj(json.primarymedia);
		                break;
		            case "MEDIAGROUP":
		            default:
		                mediagroupObj.primarymedia = utilsFactory.createMediagroupObj(json.primarymedia);
		                break;
	            }
            }
            else
            	mediagroupObj.primarymedia = undefined;
            
            mediagroupObj.thumb = (mediagroupObj.primarymedia && mediagroupObj.primarymedia.thumb) ? mediagroupObj.primarymedia.thumb : undefined;
            // on calcule les chapitres
            mediagroupObj.chapters = [];
            if (json.chapters_json){
            for (var k = 0; k < json.chapters_json.length;k++){
            
            	var chapterObj = {};
            	chapterObj.title = json.chapters_json[k].TITLES || json.chapters_json[k].titles_json  // le titre du chapitre
            	chapterObj.description = json.chapters_json[k].DESCRIPTION || json.chapters_json[k].description_json  // le titre du chapitre
            	chapterObj.medias = [];
            	chapterObj.nbphoto = 0;
            	chapterObj.nbvideo = 0;
            	chapterObj.nbaudio = 0;
            	chapterObj.nbmediagroup = 0;
            	chapterObj.nbreportage = 0;
            	
            	for (var l = 0; l < json.chapters_json[k].media.length ; l++){
                    // on tourne sur chapters.media
            		var mediaObj = {}; 

            		// switch  case audio/photo/video/mediagroup
                    switch(json.chapters_json[k].media[l].type){
                    case "PHOTO":
                    	chapterObj.nbphoto ++;
                    	mediaObj = utilsFactory.createPhotoObj(json.chapters_json[k].media[l]);
                    	break;
                    case "VIDEO":
                    	chapterObj.nbvideo ++;
                    	mediaObj = utilsFactory.createVideoObj(json.chapters_json[k].media[l]);
                    	break;
                    case "REPORTAGE":
                    	chapterObj.nbreportage ++;
                    	// est-ce qu'on doit créer une fonction pour le reportage ???
                    	// fonctionne en tout cas aussi avec le fonction pour les photos
                    	mediaObj = utilsFactory.createPhotoObj(json.chapters_json[k].media[l]);
                    	break;
                    case "AUDIO":
                    	mediaObj = utilsFactory.createVideoObj(json.chapters_json[k].media[l]);
                    	chapterObj.nbaudio ++;
                    	break;
                    case "MEDIAGROUP":
//                    	console.log('dans chapter, mediagroup',json.chapters_json[k].media[l]);
                    	mediaObj = utilsFactory.createMediagroupObj(json.chapters_json[k].media[l]);
                    	chapterObj.nbmediagroup ++;
                    	break;
                    }
                    mediaObj.type = json.chapters_json[k].media[l].type;
                    chapterObj.medias.push(mediaObj);
            	}
            mediagroupObj.chapters.push(chapterObj);
            }
            }
            }
        return mediagroupObj;
		}

		// renvoie la liste formatée des images téléchargeables {type: ,path: width: ,height: }
		function createPhotoList(media_json)
		{
			var photoList = [];
			var re = /high/i; // la liste des images downloadables n'est que pour la haute définition
			angular.forEach(
					media_json,
					function(value,key,obj){
						if (key.match(re)) {
							photoList.push(
									{type:value.PATH.split('.').slice(-1)[0],
									path:envConstants.urlPhotoCdn +value.PATH,
									height:value.PIXH,
									width:value.PIXL});
						}
					});
			return photoList;
		}
		
		utilsFactory.createScheduleList = function (prog_json)
		{
            var scheduler = [];
            var prog_json = prog_json || [];
            for (var j = 0; j < prog_json.length; j++) {
            	var schedObj = prog_json[j];
            	// on ne met pas dans la grille les programmes warning (prop=8)
            	if (schedObj.prop !=8) {
	            	schedObj.isToday = schedObj.viewdate == moment().format('YYYYMMDD') ;
	            	schedObj.fmdate = moment(schedObj.viewdate,'YYYYMMDD').format('DD/MM/YYYY');
	            	schedObj.title = {'EN':(schedObj.types == 'LIVE' || schedObj.types == 'LIVE / EDIT' || schedObj.types == 'LIVE / RECORDED' || schedObj.types == 'RECORDED' || schedObj.types == 'EDIT' || schedObj.types == 'EDIT / RECORDED' || schedObj.types == 'RETRANSMISSION') ? schedObj.title : schedObj.types + ' ' + schedObj.title};
	            	schedObj.seq = []
	            	prog_json[j].sequence = prog_json[j].sequence || prog_json[j].seq_json ; // ancienne ou nouvelle structure du programme (ancienne = seq_json, nouvelle= sequence)
	            	if ( prog_json[j].sequence &&  prog_json[j].sequence.length >0){
		            	for (var k = 0; k < prog_json[j].sequence.length; k++) {
		            		var videosObj = prog_json[j].sequence[k];
		            		
		            		if (videosObj.media){
		            			// on est dans la nouvelle structure du programme
		            			videosObj.video = (videosObj.media.media_json && videosObj.media.mediaorder_json) ? utilsFactory.createVideoVersionsList(videosObj.media.media_json, videosObj.media.mediaorder_json) : undefined;
		            		}
		            		else {
		            			// on est dans l'ancienne structure du programme
		            			videosObj.video = (videosObj.media_json && videosObj.mediaorder_json) ? utilsFactory.createVideoVersionsList(videosObj.media_json, videosObj.mediaorder_json) : undefined;
		            		}
		            			
		                    videosObj.thumbmini=videosObj.video ? videosObj.video[0].THUMB :'';
		                    videosObj.thumb=videosObj.video ? videosObj.video[0].IMAGE : "";
		//                    videosObj.embededvideo = $location.protocol() + "://"+ $location.host() + ":"+ $location.port() + envConstants.urlEmbededVideo + videosObj.ref; // construction de l'url pour la video principale, not allowed in the ng-src
		
		                    /* en attendant d'avoir des objets traduits en retour */
		                    videosObj.title = {'EN':videosObj.title};
		                    // en prévision d'un update du service : si le service renvoie un objet, on le prend, sinon on a juste le nom de l'institution et donc on doit créer l'objet
		                    videosObj.institution = angular.isObject(videosObj.institution) ? videosObj.institution : {id:videosObj.institution,value:{'EN':videosObj.institution}};
		                    videosObj.location = {id:undefined,value:{'EN':videosObj.location}};
		                    
		                    /* en attendant d'avoir des objets de type personnlities pour les porte-parole */
		                    videosObj.porteparole = videosObj.porteparole ? {id:undefined,preferedterm:videosObj.porteparole,value:[videosObj.porteparole],role:'Spokesperson'} : undefined;
		                    if (videosObj.porteparole && videosObj.porteparole.preferedterm.toLowerCase().match('schinas')){
		                    	videosObj.porteparole.role = 'European Commission Chief Spokesperson';
		                    }
		                    else if (videosObj.porteparole && (videosObj.porteparole.preferedterm.toLowerCase().match('andreeva') || videosObj.porteparole.preferedterm.toLowerCase().match('alexander'))){
		                    	videosObj.porteparole.role = 'Deputy Chief Spokesperson';
		                    }
		                    if(videosObj.url){
		                    	for (var i=0;i<videosObj.url.length;i++){
		                    		var url = videosObj.url[i];
		                    		videosObj.url[i] = {url:url,display:'LINK',title:url,class:''};
		                    		if (url.match('shotlist') || (url.match('europarl.europa.eu') && url.match('SHL'))){
		                    			videosObj.url[i].title = 'Display shotlist or script';
		                    			videosObj.url[i].display = 'SHOTLIST';
		                    			videosObj.url[i].class = 'btBrown';
		                    		}
		                    		else if (url.match('https://multimedia.europarl.europa.eu/') && schedObj.types.match('LIVE')){
		                    			videosObj.url[i].title = 'Play video from Parliament';
		                    			videosObj.url[i].display = 'VIDEO & SHOTLIST';
		                    			videosObj.url[i].class = 'btBlue';
		                    		}
		                    	}
		                    }
		                    
		                    schedObj.seq.push(videosObj);
		            	}
	            	}
	            	var langArray = schedObj.lang_sup.split('|');
	            	for (i=0;i<langArray.length;i++){
	            		var item = langArray[i];
	            		if (item){
	                		var temp = schedObj.lang.replace(item+'|','');
	                		var temp2 = temp.replace(item.split('=')[0],item.split('=')[1]);
	                		schedObj.lang = temp2;
	            		}
	            	}
	            	schedObj.lang = schedObj.lang.split('|').filter(function(item){return item != ''});
	                var decode = prog_json[j].prop ? envConstants.program_type.filter(function(type) {return  type.id == prog_json[j].prop}) : [];
	                schedObj.prop = decode.length ? decode[0] : undefined;
	
	                scheduler.push(schedObj);
            	}
            }
            return scheduler;

		}
		
		utilsFactory.createWarningList = function (prog_json)
		{
            var warning = [];
            var prog_json = prog_json || [];
            for (var j = 0; j < prog_json.length; j++) {
            	var schedObj = prog_json[j];
            	// on ne met pas dans les warning que les programmes warning (prop=8)
            	if (schedObj.prop ==8) {
	            	schedObj.isToday = schedObj.viewdate == moment().format('YYYYMMDD') ;
	            	schedObj.fmdate = moment(schedObj.viewdate,'YYYYMMDD').format('DD/MM/YYYY');
	            	schedObj.title = {'EN':schedObj.title};
	
	                warning.push(schedObj);
            	}
            }
            return warning;

		}


		return utilsFactory;
	}
	;
})();
