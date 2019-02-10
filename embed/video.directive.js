//directive permettant d'afficher le player
// event emit : avportalVideo.changeChannel, avportalVideo.trackChange
// event internal : videoEnded, ShotlistClick, subTitleClick, changeSubtitle, languageClick, changeTrack
// event listener : avportalVideo.loadInfo, avportalVideo.loadLanguage, avportalVideo.changeLanguage, avportalVideo.play
// event theoplayer : pause, playing, ended => videoEnded, seeked
avservicesApp.directive('avportalVideo', ['$compile','utilsFactory','videosFactory','envConstants','$filter','$location','loggingFactory',
	    function( $compile,utilsFactory,videosFactory,envConstants,$filter,$location,loggingFactory){	

return {
   restrict: "E",
   templateUrl: '/avservices/embed/player.html',
   replace: true,
   transclude:false,  //default
   scope : {
	  	 video : "=",
	  	 cloud : "=?",
	  	 channel : "=?",
	  	 autostart : "=?",
	  	 language : "=?",
	  	 sublanguage : "=?",
	  	 starttime : "=?",
	  	 endtime : "=?",
	  	 showSwitchLive : "=?",
	  	 playlistMode : "=?",   // pour savoir si on doit afficher ou non la playlist
	  	 playlist : "=?",       // la playlist en elle même = array
	  	 pip : "=?",
   }, 
   link: function (scope, element, attrs){
	   var EBS_URL = (scope.cloud) ? envConstants.ebs_url_cloud : envConstants.ebs_url;
	   var EBSPLUS_URL = (scope.cloud) ? envConstants.ebsplus_url_cloud : envConstants.ebsplus_url;
	   var tmpsub;
	   var tmpshotlist = {};  // structure : {shots:[], video:{}}
	   var divLanguagesMenu;
	   var DEFAULTLG = 'or';
       scope.currentTrack = scope.video;
	   scope.channelLanguages = (scope.video) ? undefined : envConstants.languages.filter(function(a){return a.order}).sort(function(a,b){if (a.order < b.order){ return -1 } else {return 1}}) ;
	   var myPip = (! scope.pip) ? 0.1 : scope.pip ;  // si on ne passe pas de pourcentage pip, on le fixe à 10% (0.1)

	   scope.$watch('playlist',function(){
		   if (scope.playlist && scope.playlist.length > 0){
			   	   scope.playlistPlay = (scope.playlistMode) ? scope.playlist.map(function(e){return e.ref}).indexOf(scope.video.ref) : undefined;
//	   console.log('init',scope.playlistPlay,scope.playlistMode,scope.playlist);

		   }
	   })
/*********************************************************************************/
/** definition des event pour loader de manières externes les data pour le LIVE **/
/*********************************************************************************/
	   // pour loader de manière externe des langues (surtout utile pour le LIVE)
	   scope.$on('avportalVideo.loadLanguage',function(event,args){
//		   console.log('set lang',args);
		   
		   clearAllLanguage(divLanguagesMenu);
		   if (angular.isArray(args)){
	            for (var i=0;i <= args.length-1;i++ ){
	            	if (angular.isObject(args[i])){
	            		addLanguage(divLanguagesMenu,args[i].lang.short,args[i].lang.long);
	            	}
	            	else {
	            		addLanguage(divLanguagesMenu,args[i],envConstants.languages.filter(function(lg) {return lg.hreflang.toUpperCase() == args[i].toUpperCase()})[0].label); // à traduire avec enconstant
	            	}
	            }
		   }
		   else if (args){
			   var languages = args.split('|');
	            for (var i=0;i <= languages.length-1;i++ ){
	            	addLanguage(divLanguagesMenu,languages[i],languages[i])
	            }
	            
		   }
		   else {
     		   addAllLanguage(divLanguagesMenu);
            }
	   });
	   // pour loader de manière externe des info pour le panel info (surtout utile pour le LIVE)
	   scope.$on('avportalVideo.loadInfo',function(event,args){
//		   console.log('set info',args);
		   if (args && args.summary)
			   scope.video = {title : args.title,summary : args.summary};
	   });
	   // pour lancer un play depuis un bouton externe. on peut lui passer un channel à lire
	   scope.$on('avportalVideo.play',function(event,args){
//		   console.log('on joue');
		   	if (args && args.channel){
		   		scope.changeChannel(args.channel);
		   	}
		   	else
		   		scope.player.play();
	   });
	   // pas besoin de mettre un listener d'event pour les panel share et embed : on propose toujours les 24 langues
	   
	   // quand on a cliqué sur une langue
	   scope.$on('avportalVideo.changeLanguage',function(event,args){
//		   console.log('avportalVideo.changeLanguage',scope,event,args);
		   if (! scope.channel){
			   // on change la langue pour une VOD
	           var currentTime = scope.player.currentTime;
	           var isPaused = scope.player.paused;
	           DEFAULTLG = args.lg;
		        var correctSource = scope.video.video.filter(function(vid){return vid.LGSHORT == DEFAULTLG.toUpperCase() });
		        if (correctSource.length !=1){
		        	// la langue choisie n'existe pas, on rebascule sur l'int
		        	DEFAULTLG = scope.video.mediaorder.map(function(lg){return Object.keys(lg)[0];})[0]; // la première langue disponible dans mediaorder
		        	correctSource = scope.video.video.filter(function(vid){return vid.LGSHORT.toUpperCase() == DEFAULTLG.toUpperCase() });
		        }
		       document.querySelector('.currentLanguage').innerText= scope.video.mediaorder.filter(function(lg){return Object.keys(lg)[0] == DEFAULTLG.toUpperCase()})[0][DEFAULTLG.toUpperCase()].TEXT;
	           scope.player.source = {
		    			sources : {
	    					type : 'video/mp4',
	    					src  : correctSource[0].HDMP4 || correctSource[0].LR,
	    					
	    			},
	    			poster : scope.video.thumb,
	    			textTracks : tmpsub,  // variables globales à la directive : la liste des sous-titres disponible ne change pas si on change de video
	           };
	//    	   console.log('data loaded',scope.player.readyState);
	           scope.player.currentTime = currentTime;
	           if (!isPaused) {
	        	   scope.player.play();
	           }
	//		   console.log('change lg',event, args);
		   }
		   else {
			   // on change la langue du LIVE
		       document.querySelector('.currentLanguage').innerText= envConstants.languages.filter(function(lg){return lg.hreflang.toUpperCase() == args.lg.toUpperCase()})[0].label;
		    	scope.player.source = {
		    			sources : {
		    					type : 'application/x-mpegurl',
		    					crossOrigin : 'anonymous',
		    					src  : (scope.channel == '1') ? EBS_URL.replace("_or", "_" + args.lg.toLowerCase()) : EBSPLUS_URL.replace("_or", "_" + args.lg.toLowerCase())
		    			},
		    			poster : (scope.channel == '1') ?'/avservices/images/livepanel_ebs.jpg' : '/avservices/images/livepanel_ebsplus.jpg'
		    	} ;

		   }
	   });
	   
/******************************/
/** initialisation du player **/
/******************************/
// le player avec ses options
		    theoplayerContainer = document.querySelector('.theoplayer-container');
		    scope.player = new THEOplayer.Player(theoplayerContainer, {
		        libraryLocation : '/avservices/embed/THEOplayer/',
		        isEmbeddable: true,
		        mutedAutoplay:'all',  // démarrage en mode autoplay, et pour être compliant avec chrome, muted
		        fluid:true,
		        language: 'fr',
		        liveOffset: 0,   // pour ne plus avoir les 30 min de retard par défaut
		        languages:{
		        	'fr':{
		        		"Play":"Lecture",
		        		"Play Video":"Jouer la VOD",
		        		"Pause":"Pause",
		        		"Current Time":"Temps",
		        		"Mute":"Pas de son",
		        		"Fullscreen":"Plein écran"
		        	}
		        },
		        pip : {
		        	visibility : myPip,
		        	position : "top-right",
		        	retainPresentationModeOnSourceChange : false
		        },
		    });
		    scope.player.preload = 'false';
		    if(scope.autostart){
	    	scope.player.autoplay = true;
	    } else {
	    	scope.player.autoplay = false;
	    }

// definition de la source
		    if (! scope.video) {
		    	// pas de video, on veut afficher le LIVE
		    	scope.player.source = {
		    			sources : {
		    					type : 'application/x-mpegurl',
		    					crossOrigin : 'anonymous',
		    					src  : (scope.channel == '1') ? EBS_URL.replace("_or", "_" + DEFAULTLG) : EBSPLUS_URL.replace("_or", "_" + DEFAULTLG)
		    			},
		    			poster : (scope.channel == '1') ?'/avservices/images/livepanel_ebs.jpg' : '/avservices/images/livepanel_ebsplus.jpg'
		    	} ;
		    } else {
		    	// l'objet video est là, on est dans le cas de VOD
		    	tmpsub = [];
		    	scope.video.subtitles.map(function(subtitle,index){
	                var lgShort = Object.keys(subtitle)[0];
	                var lgLabel = envConstants.languages.filter(function(langItem){return langItem.hreflang == lgShort.toLowerCase()})[0].label;
	                
	                tmpsub.push({
    					kind:'subtitles',
    					label:lgLabel,
    					src:envConstants.urlVttCdn + subtitle[lgShort],
    					srclang:lgShort,
    					mode:'disabled',
    					type:'webvtt'
    				});
	    	});
		    	scope.player.source = {
		    			sources : {
		    					type : 'video/mp4',
		    					src  : scope.video.video[0].HDMP4 || scope.video.video[0].LR || ''
		    			},
		    			poster : scope.video.thumb,
		    			// si on veut utiliser le système interne de sous-titres
		    			textTracks : tmpsub, 
		    				// pour mettre les chapitres en place : chapitres = shotlist. 
		    				// Attention texte du shotlist parfois long
//		    				{
//		    					kind:'chapters',
//		    					default:true,
//		    					src:'/avservices/embed/chapters.vtt',
//		    				}
//		    			]
		    	} ;
		    }
		    
            // on ajoute le bouton des channel (seulement si on est en live)
		    if (! scope.video){
			    var ButtonChannel= THEOplayer.videojs.getComponent('Component');
	            var MyButtonChannel = THEOplayer.videojs.extend(ButtonChannel, {
	                constructor : function () {
	                    ButtonChannel.apply(this, arguments);
	                    this.el().id = 'channelbuttonBlue';
	                    this.el().className = 'channelbuttonBlue vjs-control vjs-button';
	                    var currentLanguageSpan = document.createElement('span');
	                    currentLanguageSpan.className = "currentChannel";
	                    currentLanguageSpan.innerText = $filter("displaychannel")(1);
	                    this.el().addEventListener('click', function() {
	                    	scope.$emit('changeChannel',{'channel':1});
	                    });
	                    var tooltip = document.createElement('span');
	                    tooltip.className = "theo-button-tooltip";
	                    tooltip.innerText = $filter("displaychannel")(1) + ' Channel';
	                    this.el().appendChild(tooltip);
	                    this.el().appendChild(currentLanguageSpan);
	
	                }
	            });
	            THEOplayer.videojs.registerComponent('MyButtonChannel', MyButtonChannel);
	            scope.player.ui.getChild('controlBar').addChild('MyButtonChannel', {});

			    var ButtonChannel2= THEOplayer.videojs.getComponent('Component');
	            var MyButtonChannel2 = THEOplayer.videojs.extend(ButtonChannel2, {
	                constructor : function () {
	                    ButtonChannel2.apply(this, arguments);
	                    this.el().id = 'channelbuttonGreen';
	                    this.el().className = 'channelbuttonGreen vjs-control vjs-button';
	                    var currentLanguageSpan = document.createElement('span');
	                    currentLanguageSpan.className = "currentChannel";
	                    currentLanguageSpan.innerText = $filter("displaychannel")(2);
	                    this.el().addEventListener('click', function() {
	                    	scope.$emit('changeChannel',{'channel':2});
	                    });
	                    var tooltip = document.createElement('span');
	                    tooltip.className = "theo-button-tooltip";
	                    tooltip.innerText = $filter("displaychannel")(2) + ' Channel';
	                    this.el().appendChild(tooltip);
	                    this.el().appendChild(currentLanguageSpan);
	
	                }
	            });
	            THEOplayer.videojs.registerComponent('MyButtonChannel2', MyButtonChannel2);
	            scope.player.ui.getChild('controlBar').addChild('MyButtonChannel2', {});

		    }
            // fin bouton pour les channels

            // on ajoute le bouton des next et previous (seulement si on est en vod avec mode playlist activée)
		    if (scope.video && scope.playlistMode){
			    var ButtonpreviousTrack= THEOplayer.videojs.getComponent('Component');
	            var MyButtonpreviousTrack = THEOplayer.videojs.extend(ButtonpreviousTrack, {
	                constructor : function () {
	                    ButtonpreviousTrack.apply(this, arguments);
	                    this.el().id = 'previoustrack';
	                    this.el().className = 'previoustrack vjs-control vjs-button';
	                    var currentLanguageSpan = document.createElement('span');
	                    currentLanguageSpan.className = "fa fa-step-backward";
	                    currentLanguageSpan.innerText = '';
	                    this.el().addEventListener('click', function() {
	                    	scope.$broadcast('previousTrack');
	                    });
	                    var tooltip = document.createElement('span');
	                    tooltip.className = "theo-button-tooltip";
	                    tooltip.innerText = 'previous';
	                    this.el().appendChild(tooltip);
	                    this.el().appendChild(currentLanguageSpan);
	
	                }
	            });
	            THEOplayer.videojs.registerComponent('MyButtonpreviousTrack', MyButtonpreviousTrack);
	            scope.player.ui.getChild('controlBar').addChild('MyButtonpreviousTrack', {});

			    var ButtonnextTrack= THEOplayer.videojs.getComponent('Component');
	            var MyButtonnextTrack = THEOplayer.videojs.extend(ButtonnextTrack, {
	                constructor : function () {
	                	ButtonnextTrack.apply(this, arguments);
	                    this.el().id = 'nextTrackButton';
	                    this.el().className = 'nexttrack vjs-control vjs-button';
	                    var currentLanguageSpan = document.createElement('span');
	                    currentLanguageSpan.className = "fa fa-step-forward";
	                    currentLanguageSpan.innerText = '';
	                    this.el().addEventListener('click', function() {
	                    	scope.$broadcast('nextTrack');
	                    });
	                    var tooltip = document.createElement('span');
	                    tooltip.className = "theo-button-tooltip";
	                    tooltip.innerText = 'next';
	                    this.el().appendChild(tooltip);
	                    this.el().appendChild(currentLanguageSpan);
	
	                }
	            });
	            THEOplayer.videojs.registerComponent('MyButtonnextTrack', MyButtonnextTrack);
	            scope.player.ui.getChild('controlBar').addChild('MyButtonnextTrack', {});

		    }
            // fin bouton pour la playlist

            // on ajoute le bouton des shotlists (seulement si il y a des shotlist)
		    if (scope.video && (scope.video.hasShots || scope.video.ref == 'I-129949'|| scope.video.ref == 'I-160607')){
			    var ButtonShotlist= THEOplayer.videojs.getComponent('Component');
	            var MyButtonShotlist = THEOplayer.videojs.extend(ButtonShotlist, {
	                constructor : function () {
	                    ButtonShotlist.apply(this, arguments);
	                    this.el().id = 'shotlistbutton';
	                    this.el().className = 'shotlistbutton vjs-control vjs-button';
	                    var currentLanguageSpan = document.createElement('span');
	//                    currentLanguageSpan.className = "currentSubtitle";
	//                    currentLanguageSpan.innerText = "Original";
	                    this.el().addEventListener('click', function() {
	                    	scope.$emit('ShotlistClick',{});
	                    });
	                    var tooltip = document.createElement('span');
	                    tooltip.className = "theo-button-tooltip";
	                    tooltip.innerText = "ShotList";   // à traduire
	                    this.el().appendChild(tooltip);
	                    this.el().appendChild(currentLanguageSpan);
	
	                }
	            });
	            THEOplayer.videojs.registerComponent('MyButtonShotlist', MyButtonShotlist);
	            scope.player.ui.getChild('controlBar').addChild('MyButtonShotlist', {});
	            var divShotlistMenu = document.createElement('div');
	            divShotlistMenu.className = "menu hidden";
	            document.querySelector('.shotlistbutton').appendChild(divShotlistMenu);
	
	            // on ajoute les Shotlist pour le vod
	            // on appelle le factory
	            videosFactory.getShotlist({ 'ref': scope.video.ref + '*'}).then(function(shotlist){tmpshotlist = shotlist});
		    }
            // fin bouton pour les shotlists

            // on ajoute le bouton des sous-titres (seulement si il y a des sous-titres
		    if (scope.video && scope.video.subtitles.length){
			    var ButtonSubTitle = THEOplayer.videojs.getComponent('Component');
	            var MyButtonSubTitle = THEOplayer.videojs.extend(ButtonSubTitle, {
	                constructor : function () {
	                    ButtonSubTitle.apply(this, arguments);
	                    this.el().id = 'subtitlebutton';
	                    this.el().className = 'subtitlebutton vjs-control vjs-button';
	                    var currentLanguageSpan = document.createElement('span');
	//                    currentLanguageSpan.className = "currentSubtitle";
	//                    currentLanguageSpan.innerText = "Original";
	                    this.el().addEventListener('click', function() {
	                    	scope.$emit('subTitleClick',{});
	                    });
	                    var tooltip = document.createElement('span');
	                    tooltip.className = "theo-button-tooltip";
	                    tooltip.innerText = "Closed caption";   // à traduire
	                    this.el().appendChild(tooltip);
	                    this.el().appendChild(currentLanguageSpan);
	
	                }
	            });
	            THEOplayer.videojs.registerComponent('MyButtonSubTitle', MyButtonSubTitle);
	            scope.player.ui.getChild('controlBar').addChild('MyButtonSubTitle', {});
	            var divSubtitlesMenu = document.createElement('div');
	            divSubtitlesMenu.className = "menu hidden";
	            document.querySelector('.subtitlebutton').appendChild(divSubtitlesMenu);
	
	            // on ajoute les sous-titres pour le vod
	            scope.video.subtitles.map(function(subtitle,index){
		                var el = document.createElement("div");
		                var lgShort = Object.keys(subtitle)[0];
		                el.innerHTML = envConstants.languages.filter(function(langItem){return langItem.hreflang == lgShort.toLowerCase()})[0].label;
		                el.dataset.lg = lgShort;
		                el.addEventListener('click', function() {
	                    	scope.$emit('changeSubtitle',{'lg':this.dataset.lg});
	                    });
		
		                divSubtitlesMenu.appendChild(el);
		            });
		    }
            // fin bouton pour les sous-titres

            // on ajoute le bouton des langues
		    var Button = THEOplayer.videojs.getComponent('Component');
            var MyButton = THEOplayer.videojs.extend(Button, {
                constructor : function () {
                    Button.apply(this, arguments);
                    this.el().id = 'languagebutton';
                    this.el().className = 'languagebutton vjs-control vjs-button';
                    var currentLanguageSpan = document.createElement('span');
                    currentLanguageSpan.className = "currentLanguage";
                    // on initialise : pour le LIVE avec original, pour la vod avec la première langue de la liste de mediaorder
                    currentLanguageSpan.innerText = scope.channel ? "Original" : scope.video.mediaorder[0][Object.keys(scope.video.mediaorder[0])[0]].TEXT;
                    this.el().addEventListener('click', function() {
                    	scope.$emit('languageClick',{});
                    });
                    var tooltip = document.createElement('span');
                    tooltip.className = "theo-button-tooltip";
                    tooltip.innerText = "Languages";    // à traduire
                    this.el().appendChild(tooltip);
                    this.el().appendChild(currentLanguageSpan);
                }
            });
            THEOplayer.videojs.registerComponent('MyButton', MyButton);
            scope.player.ui.getChild('controlBar').addChild('MyButton', {});
            divLanguagesMenu = document.createElement('div');
            divLanguagesMenu.className = "menu hidden";
            document.querySelector('.languagebutton').appendChild(divLanguagesMenu);

            // on ajoute les langues pour le vod
            if (scope.video && scope.video.languages){
            	scope.$broadcast('avportalVideo.loadLanguage',scope.video.languages);
            }
            else{
            	// on ajoute les langues pour le live
            	// à refaire régulièrement
            }
            // fin bouton pour les langues

            function clearAllLanguage(node){
            	while (node.firstChild) {
            		node.removeChild(node.firstChild);
            	}
            }
            function addAllLanguage(node){
            	var AllLanguage = envConstants.languages.filter(function(a){return a.order}).sort(function(a,b){if (a.order < b.order){ return -1 } else {return 1}})
            	for (var i=0;i<AllLanguage.length;i++){
            		addLanguage(node,AllLanguage[i].hreflang,AllLanguage[i].label);
            	}
            }
            function addLanguage(node,short,displayName){
                var el = document.createElement("div");
                el.innerHTML = displayName;
                el.dataset.lg = short;
                el.addEventListener('click', function() {
                	scope.$emit('avportalVideo.changeLanguage',{'lg':this.dataset.lg});
                });

                node.appendChild(el);
           	
            }
            
	   // envoyer data pour stat sur le completion rate
 	   // ended : currentTime
 	   // playing : currentTime
 	   // pause : currentTime
 	   // seeking ou seeked : currentTime : quand on déplace le curseur du temps courrant
 	   scope.player.addEventListener('pause', function(e) {
 		  loggingFactory.appLogging({	type:'video',
 			  					message:{action:'pause',time:e.currentTime,doc_ref:(scope.video ? scope.video.ref : 'LIVE')}});
// 		    console.log('pause event detected!',e.date,e.currentTime);
 		});
 	   scope.player.addEventListener('playing', function(e) {
 		  loggingFactory.appLogging({	type:'video',
					message:{action:'play',time:e.currentTime,doc_ref:(scope.video ? scope.video.ref : 'LIVE')}});
 		   // envoyer data pour stat sur le completion rate
// 		    console.log('playing event detected!',e.date,e.currentTime);
 		});
 	   scope.player.addEventListener('ended', function(e) {
 		  loggingFactory.appLogging({	type:'video',
					message:{action:'end',time:e.currentTime,doc_ref:(scope.video ? scope.video.ref : 'LIVE')}});
 		   // envoyer data pour stat sur le completion rate
// 		    console.log('ended event detected!',e.date,e.currentTime);
        	scope.$broadcast('nextTrack');
 		});
 	   scope.player.addEventListener('seeked', function(e) {
 		  loggingFactory.appLogging({	type:'video',
					message:{action:'seek',time:e.currentTime,doc_ref:(scope.video ? scope.video.ref : 'LIVE')}});
 		   // envoyer data pour stat sur le completion rate
// 		    console.log('seeked event detected!',e.date,e.currentTime, e.liveOffset);
 		});	   
 	   
 	   // pour les panels de share et d'embed
 	   scope.embedConfig = {'language':'INT', 'width': 852,'height':480, 'tin':{'min':0,'sec':0}, 'tout':{'min':0,'sec':0}};
		   scope.shareConfig = {'language':'INT', 'tin':{'min':0,'sec':0}, 'tout':{'min':0,'sec':0}};
		   scope.showingEmbed = false;
		   scope.showingShare = false;
		   scope.showingInfo = false;
		  
		   
		   scope.$watch('embedConfig', function(){
			   console.log('embedConfig',scope.embedConfig);
			   if(scope.video && scope.video.ref){
				   scope.tinifyEmbed = scope.video.embededvideo+((scope.embedConfig.language) ? '&lg='+scope.embedConfig.language :'' )+ ((scope.embedConfig.tin.min || scope.embedConfig.tin.sec) ? '&tin=' + (60 * scope.embedConfig.tin.min + (scope.embedConfig.tin.sec - 0)) : '')+ ((scope.embedConfig.tout.min || scope.embedConfig.tout.sec) ? '&tout=' + (60 * scope.embedConfig.tout.min + (scope.embedConfig.tout.sec - 0)) : '') + ((scope.embedConfig.autoplay) ? "&autostart="+scope.embedConfig.autoplay : '');
			   } else {
				   scope.tinifyEmbed = $location.protocol() + "://"+ $location.host() + ($location.port() != 80 ? ":"+ $location.port() : '') + envConstants.UrlChannel+((scope.embedConfig.language) ? '&lg='+scope.embedConfig.language :'' )+( '&channel='+ (scope.embedConfig.channel||1) );
			   }
//			   console.log(scope.tinifyEmbed);
			   utilsFactory.tinify(scope.tinifyEmbed)
			   	.then(function(tinyUrl){scope.tinifyEmbed=tinyUrl});
		   }, true);
		   
		   scope.$watch('shareConfig', function(){
			   if (scope.video && scope.video.ref)
				   scope.tinifyShare = scope.video.embededvideo+((scope.shareConfig.language) ? '&lg='+scope.shareConfig.language :'' )+ ((scope.shareConfig.tin.min || scope.shareConfig.tin.sec) ? '&tin=' + (60 * scope.shareConfig.tin.min + (scope.shareConfig.tin.sec - 0)) : '')+ ((scope.shareConfig.tout.min || scope.shareConfig.tout.sec) ? '&tout=' + (60 * scope.shareConfig.tout.min + (scope.shareConfig.tout.sec - 0)) : '') + ((scope.shareConfig.autoplay) ? "&autostart="+scope.shareConfig.autoplay : '');
			   else
				   scope.tinifyShare = $location.protocol() + "://"+ $location.host() +($location.port() != 80 ? ":"+ $location.port() : '') + envConstants.UrlChannel+((scope.shareConfig.language) ? '&lg='+scope.shareConfig.language :'' )+( '&channel='+scope.embedConfig.channel );
				   utilsFactory.tinify(scope.tinifyShare)
				   	.then(function(tinyUrl){scope.tinifyShare=tinyUrl});
		   }, true);
		   
		   scope.clipboardCopy = function(type){
				var copyText = $("#"+type);
				copyText.select();
				document.execCommand("copy");
		   }
		   
		   
		   scope.closeAll = function(){
			   scope.showingEmbed = false;
			   scope.showingShare = false;
			   scope.showingInfo = false;
		   }
		   
		   scope.toggle = function(type){
			   switch(type){
		   		case 'embed' : scope.showingEmbed = true ;
		   					   scope.panelTitle = "EMBED"
					 break;
		   		case 'share' : scope.showingShare = true ;
				   scope.panelTitle = "SHARE"
					 break;
		   		case 'info' : scope.showingInfo = true ;
				   scope.panelTitle = "INFO"
					 break;
			   }
		   }
//		   scope.$on('videoEnded',function(event,args){
//			  // la video a fini, si on est dans une playlist, on doit passer au suivant
//			   if (scope.playlistMode){
//				   scope.$emit('avportalVideo.trackChange',scope.playlist[scope.playlistPlay+1]);
//			   }
//		   });
		   // pour afficher ou cacher le menu des langues
		   scope.$on('languageClick',function(event,args){
			   var classHidden = document.querySelector('.languagebutton .menu').className;
			   if (classHidden == 'menu')
				   document.querySelector('.languagebutton .menu').className='menu hidden';
			   else
				   document.querySelector('.languagebutton .menu').className='menu';
				   });
		   // quand on a cliqué sur un channel
		   scope.$on('changeChannel',function(event,args){
//			   document.querySelector('.currentChannel').innerText = $filter("displaychannel")(args.channel);
			   scope.changeChannel(args.channel);
			   });
		   // pour afficher ou cacher le shotlist
		   scope.$on('ShotlistClick',function(event,args){
				scope.player.addEventListener('timeupdate', function(e){
					var correctShot = tmpshotlist.shots.filter(function(shot){
						return (shot.tcin <= e.currentTime && e.currentTime < shot.tcout );
						});
					document.querySelector('.shotlist-container').innerHTML = $filter('translateDB')(correctShot[0].legend);
				});
				   var classHidden = document.querySelector('.shotlist-container').className;
				   if (classHidden == 'shotlist-container')
					   document.querySelector('.shotlist-container').className='shotlist-container hidden';
				   else
					   document.querySelector('.shotlist-container').className='shotlist-container';
				   });
		   // pour afficher ou cacher le menu des langues
		   scope.$on('subTitleClick',function(event,args){
			   var classHidden = document.querySelector('.subtitlebutton .menu').className;
			   if (classHidden == 'menu')
				   document.querySelector('.subtitlebutton .menu').className='menu hidden';
			   else
				   document.querySelector('.subtitlebutton .menu').className='menu';
				   });
		   // quand on a cliqué sur un sous-titre
		   scope.$on('changeSubtitle',function(event,args){
			   // si le sous-titre demandé existe, on désactive tous et on active le bon
			   if (scope.player.textTracks.filter(function(subItem){return subItem.language == args.lg}).length ==1){
				   scope.player.textTracks.map(function(e){e.mode = "disabled"});
				   scope.player.textTracks.filter(function(subItem){return subItem.language == args.lg})[0].mode = "showing";
			   }
		   });
	   // quand on appuie sur le changement de bouton, on envoie un event pour faire les modif dans la page principale
	   scope.changeChannel = function (channelID){
		   	scope.embedConfig.channel = channelID;
	    	scope.player.source = {
	    			sources : {
	    					type : 'application/x-mpegurl',
	    					crossOrigin : 'anonymous',
	    					src  : (channelID == '1') ? EBS_URL.replace("_or", "_" + DEFAULTLG) : EBSPLUS_URL.replace("_or", "_" + DEFAULTLG)
	    			},
	    			poster : (channelID == '1') ?'/avservices/images/livepanel_ebs.jpg' : '/avservices/images/livepanel_ebsplus.jpg'
	    	} ;
		    scope.player.play();
		   	scope.$emit('avportalVideo.changeChannel',{channel:channelID}); // on transmet l'info à la page appelante
	   }
	   
	   scope.$on('nextTrack',function(event, args){
			scope.$broadcast('changeTrack',{track:scope.playlist[scope.playlistPlay+1],index:scope.playlistPlay+1});
	   })
	   
	   scope.$on('previousTrack',function(event, args){
       	scope.$broadcast('changeTrack',{track:scope.playlist[scope.playlistPlay-1],index:scope.playlistPlay-1});
	   })

	   scope.$on('changeTrack',function(event,args){
//		   console.log(args);
		   if (args.track){
		   // soit on a un index (cas d'une playlist) et on doit être dans le range
		   // soit on n'en a pas et on change de video (cas d'un related)
		   if ((args.index >=0 && args.index <= scope.playlist.length) || !args.index){
			   	// on remet au début de la vidéo, et on joue
			   scope.player.currentTime =0;
		   // si le player est en train de jouer, on l'arréte
	        if (! scope.player.paused) {scope.player.play();}
			   scope.playlistPlay = args.index ? args.index : undefined;
			   scope.currentTrack = args.track;
		   scope.video = args.track;
		   tmpsub = [];
		   	scope.video.subtitles.map(function(subtitle,index){
		           var lgShort = Object.keys(subtitle)[0];
		           var lgLabel = envConstants.languages.filter(function(langItem){return langItem.hreflang == lgShort.toLowerCase()})[0].label;
		           
		           tmpsub.push({
						kind:'subtitles',
						label:lgLabel,
						src:envConstants.urlVttCdn + subtitle[lgShort],
						srclang:lgShort,
						mode:'disabled',
						type:'webvtt'
					});
			});
	        var correctSource = scope.video.video.filter(function(vid){return vid.LGSHORT == DEFAULTLG });
	        if (correctSource.length !=1){
	        	// la langue choisie n'existe pas dans la track choisie, on rebascule vers l'int, on l'affiche (mais on essaie de garder la langue pour les éléments suivants)
	        	correctSource = scope.video.video.filter(function(vid){return vid.LGSHORT.toUpperCase() == 'INT' });
	 	        document.querySelector('.currentLanguage').innerText= envConstants.languages.filter(function(lg){return lg.hreflang.toUpperCase() == 'INT'})[0].label;
	        } else {
	 	        document.querySelector('.currentLanguage').innerText= envConstants.languages.filter(function(lg){return lg.hreflang.toUpperCase() == DEFAULTLG.toUpperCase()})[0].label;
	        }
//	        console.log(correctSource);
		   	scope.player.source = {
		   			sources : {
//		   					type : 'video/mp4',
		   					src  : correctSource[0].HDMP4 || correctSource[0].LR || ''
		   			},
		   			poster : scope.video.thumb,
		   			// si on veut utiliser le système interne de sous-titres
		   			textTracks : tmpsub, 
		   				// pour mettre les chapitres en place : chapitres = shotlist. 
		   				// Attention texte du shotlist parfois long
		//   				{
		//   					kind:'chapters',
		//   					default:true,
		//   					src:'/avservices/embed/chapters.vtt',
		//   				}
		//   			]
		   	} ;
		   	scope.player.autoplay=true;
		   	if(scope.player.paused) {scope.player.play();};
		   	scope.$emit('avportalVideo.trackChange',{track:args.track});
		   }
		   }
   });
	   
	   angular.element(function(){
//		   $(".subtitlebutton .menu").mCustomScrollbar();
	   });
	   
	   // on va sur les bons languages
	   if (scope.language){
		   scope.$emit('avportalVideo.changeLanguage',{'lg':scope.language});
	   }
	   if (scope.sublanguage){
		   scope.$emit('changeSubtitle',{'lg':scope.sublanguage});
	   }

   }
};
}]);
