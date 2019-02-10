//http://ec.europa.eu/avservices/cfc/personalitiesen.cfm?q=barroso&_=1510746137374

avservicesApp.factory('searchFactory', ['$http','envConstants','utilsFactory','$sce',function ($http, envConstants,utilsFactory,$sce) {

    return {
        searchResult: function (params) {

			var GlobalParams = {'hasMedia':1, 'wt': 'json',
                    'fl' : 'ref,genre,doc_ref,type,titles_json,legend_json,duration,shootstartdate,media_json,mediaorder_json,summary_json,productiondate'}
			
		   	var MyPromise =  $http({
                method: 'get',
                url:  $sce.getTrustedResourceUrl(envConstants.urlLuceneServices + 'avsportal'),
                params: $.extend(GlobalParams,params),
//                jsonpCallbackParam: 'json.wrf'
            });
			return MyPromise.then(function onSuccess(response){
                var MyResults = {results:[],nbCount:0};

                if (response.data.response){
                	// si la requète n'a pas planté : attention au 25/10 si on passe deux genres, cela ne fonctionne pas
                	MyResults.nbCount = response.data.response.numFound;
                    var resultArray = response.data.response.docs;
	                for (var j = 0; j < resultArray.length; j++) {
	
	                    var resultObj = {};
		                if (resultArray[j].type == 'VIDEO') {
		                	// attention, le format retourné n'est pas le même que pour une video, donc on ne peut pas utiliser utilsFactory.createVideoObj
		                	for (var properties in resultArray[j].summary_json){
		                		resultArray[j].summary_json[properties] = resultArray[j].summary_json[properties].replace('During today\'s EC midday press briefing, this topic has been touched on:<br>','');
		                	}
		                    resultObj.title = (resultArray[j].genre == 63 || resultArray[j].genre == 64 || resultArray[j].genre == 67) ? resultArray[j].summary_json : resultArray[j].titles_json;
	                        resultObj.ref = resultArray[j].ref;
	                        resultObj.genre = resultArray[j].genre;
	                    	resultObj.video = utilsFactory.createVideoVersionsList(resultArray[j].media_json, resultArray[j].mediaorder_json); 
	                    	resultObj.thumb=resultObj.video[0].IMAGE;
	                    	resultObj.thumbmini=resultObj.video[0].THUMB;
	                        resultObj.date = resultArray[j].productiondate.substr(6,2) + '/' + resultArray[j].productiondate.substr(4,2) + '/' + resultArray[j].productiondate.substr(0,4);
	                        resultObj.duration = resultArray[j].duration;
	                        resultObj.type = 'VIDEO';
	                    }
	                    else if (resultArray[j].type == 'PHOTO' || resultArray[j].type == 'REPORTAGE') {
		                	// attention, le format retourné n'est pas le même que pour une video, donc on ne peut pas utiliser utilsFactory.createPhotoObj
		                    resultObj.title = resultArray[j].summary_json;
	                    	resultObj.ref = resultArray[j].ref;   // ref = numero de la photo, doc_ref contient le numero de reportage
	                        resultObj.genre = resultArray[j].genre;
	                    	resultObj.thumb = envConstants.urlPhotoCdn + resultArray[j].media_json.MED.PATH;
	                    	resultObj.thumbmini = envConstants.urlPhotoCdn + resultArray[j].media_json.LOW.PATH;
	                    	resultObj.date = resultArray[j].shootstartdate.substr(6,2) + '/' + resultArray[j].shootstartdate.substr(4,2) + '/' + resultArray[j].shootstartdate.substr(0,4);
	                        resultObj.duration = '';
	                        resultObj.type = resultArray[j].type; // pour le state.go qui est reportage, n'a pas de lien avec l'objet en lui-même
	                    }
	                    MyResults.results.push(resultObj);
	
	                }
                }
                return MyResults;
            });
        }
    };
    
}]);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////LOV  :  THEMES   GENERIC  LOCATION  COMMISSION  GENRE_VIDEO  GENRE_PHOTO ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function() {
'use strict';
angular.module('avservicesApp').factory('lovFactory',lovFactory);
lovFactory.$inject =['$http', 'envConstants','$q'];

function lovFactory($http, envConstants,$q) {

return {
	/* service Beluga qui prend 3 paramètres : type, pagesize et id (autre param ? un index, vu qu'il y a un pagesize)
	 * type disponible : GENERIC,PERSONALITY,LOCATION,THEMES,THEMATIC,COUNTRY,VIDEOGENRE,PHOTOGENRE,AUDIOGENRE
	 */
	getLov : function(params) {
		var GlobalParams = {'wt': 'json', "index":1,"pagesize":100,
	         'fl' : 'doc_ref,type,titles_json,shortcut,prefered'}

		var lovs = [];
		var MyPromise = $http({
			method : 'get',
			url : envConstants.urlLuceneServices + 'thesaurus',
			params : $.extend(GlobalParams,params),
//			jsonpCallbackParam: 'json.wrf'
		});
		return MyPromise.then(function onSuccess(response) {

			var resultArray = response.data.response.docs;

			for (var j = 0; j < resultArray.length; j++) {
				var lovObj = {};
				lovObj.doc_ref = resultArray[j].doc_ref;
				lovObj.title = resultArray[j].titles_json;
				lovObj.type = resultArray[j].type;
				lovObj.shortcut = resultArray[j].shortcut;
				lovObj.prefered = resultArray[j].prefered;
				lovs.push(lovObj);
			}
			return lovs;
		});

	},
	/* ne peut pas utilisé celui ci dessus car les champs retournés ne sont pas les mêmes
	 */
	getPersonalities : function(params) {
		var GlobalParams = {'wt': 'json', "index":1,"pagesize":100,'type':'PERSONALITY',
		         'fl' : 'doc_ref,type,titles_json,titles,shortcut,prefered'}
	
		var lovs = [];
		var MyPromise = $http({
			method : 'get',
			url : envConstants.urlLuceneServices + 'thesaurus',
			params : $.extend(GlobalParams,params),
//			jsonpCallbackParam: 'json.wrf'
		});
		return MyPromise.then(function onSuccess(response) {
	
			var resultArray = response.data.response.docs;
	
			for (var j = 0; j < resultArray.length; j++) {
				var lovObj = {};
				lovObj.doc_ref = resultArray[j].doc_ref;
				lovObj.title = resultArray[j].titles_json;
				lovObj.type = resultArray[j].type;
				lovObj.shortcut = resultArray[j].shortcut;
				lovObj.prefered = resultArray[j].prefered;
				lovObj.titles = resultArray[j].titles;
				lovs.push(lovObj);
			}
			return lovs;
		});
	},
	/* ne peut pas utilisé car service non encore développé
	 */
	getVideoLang : function(params) {
		var GlobalParams = {'wt': 'json', "index":1,"pagesize":100,'type':'VIDEOLANG',
		         'fl' : 'doc_ref,type,titles_json,titles'}
	
		var lovs = [];
		var MyPromise = $q(function(resolve, reject) {
			resolve('success');   // juste pour créer un promise, comme pour http
		});
		return MyPromise.then(function onSuccess(response) {
	
			var resultArray = envConstants.languages.filter(function(a){return a.order}).sort(function(a,b){if (a.order < b.order){ return -1 } else {return 1}});
			
			for (var j = 0; j < resultArray.length; j++) {
				var lovObj = {};
				lovObj.doc_ref = resultArray[j].hreflang.toUpperCase();
				lovObj.title = resultArray[j].label;
				lovObj.type = 'VIDEOLANG';
				if (params.id) {
					// si on a passé un id pour filtrer
					if (lovObj.doc_ref == params.id.toUpperCase())
						lovs.push(lovObj);
				}
				else
					lovs.push(lovObj);
			}
			return lovs;
		});
	}

};
};
})();


