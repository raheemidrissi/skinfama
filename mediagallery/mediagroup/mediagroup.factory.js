(function() {
	'use strict';
	angular.module('avservicesApp').factory('mediagroupFactory', mediagroupFactory);

	mediagroupFactory.$inject = ['$http','utilsFactory','envConstants'];
	

	function mediagroupFactory($http,utilsFactory,envConstants) {

		var mediagroupFactory = {};

		mediagroupFactory.getMediagroup = function (params) {
			var GlobalParams = { 'wt': 'json', 'type':'MEDIAGROUP',
                    'parent.fl' : '*'} //ref,media_json,titles_json,description_json,chapters_json,themes_json
			if(params.ref){
				// quand on cherche une reference précise, on doit demander de voir les sous-query
				// et donc on veut les field du parent
//				GlobalParams.subquerymedia = true;
				GlobalParams['parent.fl'] = '*';
			}
			else{
				// sinon nous sommes à la recherche de liste de mediagroup, 
				// pour des raisons de performance, il ne faut pas demander la recherche dans subquery
//				GlobalParams.subquerymedia = false;
				GlobalParams['fl'] = '*';
			}
            var MyPromise = $http({
                method: 'get',
                url: envConstants.urlLuceneServices + 'avsportal',
                params: $.extend(GlobalParams,params),
//                jsonpCallbackParam: 'json.wrf'
            });
            return MyPromise.then(function onSuccess(response){
                var resultArray = response.data.response.docs;

        		var mediagroup = [];
                for (var j = 0; j < resultArray.length; j++) {
                    var mediagroupObj = utilsFactory.createMediagroupObj(resultArray[j]);
                    mediagroup.push(mediagroupObj);
                }

                return {numFound:response.data.response.numFound,mediagroups:mediagroup};

            });
        }
		
		mediagroupFactory.getWhosWho = function (params) {
			var GlobalParams = { 'type':'MEDIAGROUP', 'thematic': 52,'wt': 'json', 
                    'parent.fl' : '*'}

            var MyPromise = $http({
                method: 'get',
                url: envConstants.urlLuceneServices + 'avsportal',
                params: $.extend(GlobalParams,params),
//                jsonpCallbackParam: 'json.wrf'
            });
			return MyPromise.then(function onSuccess(response){
	            var mediagroup = [];
                var resultArray = response.data.response.docs;
                for (var j = 0; j < resultArray.length; j++) {

                    var photosObj = resultArray[j];

                    photosObj.thumb = 'http:' + envConstants.urlPhotoCdn + resultArray[j].configuration_json.path;
                    photosObj.thumbmini = 'http:' + envConstants.urlPhotoCdn + resultArray[j].configuration_json.path;
                    photosObj.ref = resultArray[j].doc_ref;
                    photosObj.date = '';
                    photosObj.title = resultArray[j].titles_json;

                    mediagroup.push(photosObj);

                }

				return {numFound:response.data.response.numFound,mediagroups:mediagroup};
            });
        }

		return mediagroupFactory;
	}
	;
})();

