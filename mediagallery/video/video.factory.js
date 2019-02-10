////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// VIDEO  :  GETVIDEOS with params ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
avservicesApp.factory('videosFactory', ['$http', 'envConstants','utilsFactory','$sce',function ($http, envConstants,utilsFactory,$sce) {

    return {
        getVideos: function (params) {


			var GlobalParams = {'type': 'VIDEO','hasMedia':1, 'wt': 'json'}
           
		   	var MyPromise =  $http({
                method: 'get',
                url: $sce.getTrustedResourceUrl(envConstants.urlLuceneServices + 'avsportal'),
                params: $.extend(GlobalParams,params),
//                jsonpCallbackParam: 'json.wrf'
            });
			return MyPromise.then(function onSuccess(response){
                var MyVideos = [];
                var resultArray = response.data.response.docs;

                for (var j = 0; j < resultArray.length; j++) {

                    var videosObj = utilsFactory.createVideoObj(resultArray[j]);
                    MyVideos.push(videosObj);
                }
                return MyVideos;
            }, function onError(response){console.log('error',response);});
        },
    	getVideo: function ( params) {
		},
        getShotlist: function (params) {
            var GlobalParams = { 'type': 'VIDEOSHOT', 'pagesize': '500','wt': 'json'}

            var MyPromise = $http({
                method: 'get',
                url: $sce.getTrustedResourceUrl(envConstants.urlLuceneServices + 'avsportal'),
                params: $.extend(GlobalParams,params),
//                jsonpCallbackParam: 'json.wrf'
            });
            return MyPromise.then(function onSuccess(response){
                var shotlist = {};
                shotlist.shots = [];
                shotlist.video = {ref:undefined};
                var resultArray = response.data.response.docs;

                // que faire en cas de ref qui renvoie rien
                
                // on recrée les data de la video (pas de retour de la part de lucéne du numéro I)
                shotlist.video.ref = (resultArray[0].ref) ? resultArray[0].ref.substr(0,8) : undefined;
                shotlist.video.video = utilsFactory.createVideoVersionsList(resultArray[0].media_json, resultArray[0].mediaorder_json);
                shotlist.video.duration = (resultArray[0].duration) ? resultArray[0].duration : 0;
                shotlist.video.title =  (resultArray[0].titlesshot_json) ? resultArray[0].titlesshot_json : undefined;
                if(resultArray[0].summaryshot_json) {
                    shotlist.video.summary =  resultArray[0].summaryshot_json;
                }
				if(resultArray[0].location_json) {
                    shotlist.video.location = resultArray[0].location_json[0];
                }
				if(resultArray[0].genre_json) {
                    shotlist.video.genre = resultArray[0].genre_json;
                }
				if(resultArray[0].copyright_json) {
                    shotlist.video.copyright =  resultArray[0].copyright_json;
                }
                shotlist.video.date = moment(resultArray[0].productiondate,'YYYYMMDDHHmm').format('DD/MM/YYYY');

                // formattage du tableau de shotlist
                for (var j = 0; j < resultArray.length; j++) {
                    var shotlistObj = {};
                    shotlistObj.legend = resultArray[j].legend_json;
                    shotlistObj.duration = resultArray[j].shotduration;
					shotlistObj.chapter = resultArray[j].chapter;
                    shotlistObj.tcin = resultArray[j].timecodeIn;
                    shotlistObj.tcout = resultArray[j].timecodeIn + parseFloat(resultArray[j].shotduration);
                    shotlist.shots.push(shotlistObj);

                }
                return shotlist;
            });
        }
    };
 
}]);


avservicesApp.factory('videosPlanningFactory', function (eventFactory) {

    return {
        getReportagesPlanning: function () {

            return eventFactory.getEvents();



        }
    };

});

