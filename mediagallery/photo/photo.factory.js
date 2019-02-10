
avservicesApp.factory('reportageFactory', function ($http, envConstants) {

    return {
        getReportage: function ( params) {


			var GlobalParams = {'type': 'REPORTAGE', 'hasMedia': 1, 'wt': 'json',
                    'fl' : 'related,primary_key,titles_json,summary_json,shootstartdate,childobjects,media_json,project_json,doc_ref'}

            var reportagePromise = $http({
                method: 'get',
                url: envConstants.urlLuceneServices + 'avsportal',
                params: $.extend(GlobalParams,params),
//                jsonpCallbackParam: 'json.wrf'
                });
            return reportagePromise.then(function onSuccess(response){
                var reportages = [];
                var resultArray = response.data.response.docs;

                for (var j = 0; j < resultArray.length; j++) {

                    var reportagesObj = {};

                    reportagesObj.ref = resultArray[j].primary_key;
                    reportagesObj.type = 'REPORTAGE';
                    reportagesObj.doc_ref = resultArray[j].doc_ref;
                    reportagesObj.title = resultArray[j].titles_json;
                    reportagesObj.project = resultArray[j].project_json;
                    reportagesObj.summary = resultArray[j].summary_json;
                    reportagesObj.nbphotos = resultArray[j].childobjects;
                    reportagesObj.thumb = envConstants.urlPhotoCdn + resultArray[j].media_json.MED.PATH;
                    reportagesObj.thumbmini = envConstants.urlPhotoCdn + resultArray[j].media_json.LOW.PATH;
                    reportagesObj.date = resultArray[j].shootstartdate.substr(6,2) + '/' + resultArray[j].shootstartdate.substr(4,2) + '/' + resultArray[j].shootstartdate.substr(0,4);

                    reportages.push(reportagesObj);

                }

                return reportages;
            });
        }
    };

});


avservicesApp.factory('photosFactory', function ($http, envConstants,utilsFactory) {


    return {
        getReportage: function (params,callbackFN) {

			var GlobalParams = {'type': 'PHOTO','hasMedia':1, 'wt': 'json',
                    'fl' : 'ref,titles_json,summary_json,legend_json,cooperator_json,copyright_json,thesgen_json,location_json,views,media_json,shootstartdate,pers_json,project_json,doc_ref'}

            var MyPromise = $http({
                method: 'get',
                url: envConstants.urlLuceneServices + 'avsportal',
                params: $.extend(GlobalParams,params),
//                jsonpCallbackParam: 'json.wrf'
            });
			return MyPromise.then(function onSuccess(response){
	            var photos = [];
                var resultArray = response.data.response.docs;
                for (var j = 0; j < resultArray.length; j++) {
                    var photosObj = utilsFactory.createPhotoObj(resultArray[j]);
                    photos.push(photosObj);
                }
                return photos;
            });

        }
    };

});


avservicesApp.factory('reportagesPlanningFactory', function ($http, envConstants) {

    return {
        getReportagesPlanning: function (params) {

			var GlobalParams = {'type': 'EVENTPLANNING', 'newsphoto':'Y', 'hasMedia':0, 'wt': 'json',
                    'fl' : 'primary_key,ref,location_json,titles_json,summary_json,shootstartdate,shootenddate,pers_json,genre_json'}

			var MyPromise = $http({
                method: 'get',
                url: envConstants.urlLuceneServices + 'avsportal',
                params:  $.extend(GlobalParams,params),
//                jsonpCallbackParam: 'json.wrf'
                })
            return MyPromise.then(function onSuccess(response){

                var reportages = [];
                var resultArray = response.data.response.docs;

                for (var j = 0; j < resultArray.length; j++) {

                    var reportagesObj = {};

                    reportagesObj.ref = resultArray[j].ref;
                    reportagesObj.title = resultArray[j].titles_json;
                    reportagesObj.summary = resultArray[j].summary_json;
                    reportagesObj.location = resultArray[j].location_json;
                    reportagesObj.genre = resultArray[j].genre_json;
                    reportagesObj.personalities = resultArray[j].pers_json;
                    reportagesObj.datestart = moment(resultArray[j].shootstartdate,'YYYYMMDD HH:mm').format('DD/MM/YYYY HH:mm');
                    reportagesObj.dateend = ( moment(resultArray[j].shootenddate,'YYYYMMDD').format('DD/MM/YYYY') != moment(resultArray[j].shootstartdate,'YYYYMMDD').format('DD/MM/YYYY')) ? moment(resultArray[j].shootenddate,'YYYYMMDD HH:mm').format('DD/MM/YYYY HH:mm') : undefined;

                    reportages.push(reportagesObj);

                }
                return reportages;

            });



        }
    };

});

