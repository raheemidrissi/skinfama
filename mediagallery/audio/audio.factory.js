////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// VIDEO  :  GETVIDEOS with params ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
avservicesApp.factory('audiosFactory',["$http", "envConstants", "utilsFactory", function ($http, envConstants,utilsFactory) {

    return {
        getAudios: function (params, callbackFN) {

			var GlobalParams = {'type': 'VIDEO','hasMedia': 1, 'hasAudio': 1, 'wt': 'json', 
                    'fl' : 'ref,titles_json,duration,media_json,mediaorder_json,summary_json,genre_json,copyright_json,location_json,thesgen_json,views,productiondate'}
           
            var MyPromise = $http({
                method: 'get',
                url: envConstants.urlLuceneServices + 'avsportal',
                params: $.extend(GlobalParams,params),
//                jsonpCallbackParam: 'json.wrf'
            });
			return MyPromise.then(function onSuccess (response){
	            var audios = [];

                var resultArray = response.data.response.docs;

                for (var j = 0; j < resultArray.length; j++) {

                    var audiosObj = {};

                    audiosObj.ref = resultArray[j].ref;
                    audiosObj.type = 'AUDIO';
                    audiosObj.title = resultArray[j].titles_json;
                    audiosObj.duration = resultArray[j].duration;
                    audiosObj.video = utilsFactory.createVideoVersionsList(resultArray[j].media_json, resultArray[j].mediaorder_json);
                    audiosObj.thumb=audiosObj.video[0].THUMB;
                    audiosObj.thumbmini=audiosObj.video[0].IMAGE;
                    audiosObj.summary = '';
                    if(resultArray[j].summary_json) {
                        audiosObj.summary =  resultArray[j].summary_json;
                    }
                    audiosObj.cooperator = utilsFactory.getCooperator(resultArray[j], audiosObj.video[0].LGSHORT.toUpperCase());
                    audiosObj.genre =  resultArray[j].genre_json;
                    audiosObj.copyright =  resultArray[j].copyright_json;
                    audiosObj.location = resultArray[j].location_json;
                    audiosObj.thesaurus = resultArray[j].thesgen_json;
                    audiosObj.views = resultArray[j].views;
                    audiosObj.date = resultArray[j].productiondate.substr(6,2) + '/' + resultArray[j].productiondate.substr(4,2) + '/' + resultArray[j].productiondate.substr(0,4);

                    audios.push(audiosObj);

                }
            return audios;

            });
        }
    };
    
}]);

