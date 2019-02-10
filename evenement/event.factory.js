////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// VIDEO  :  GETVIDEOS with params ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
avservicesApp.factory('eventFactory', function ($http, envConstants,utilsFactory) {

    return {
    	/* return all events */
        getEvents: function () {
			var MyPromise = $http({
	               method: 'GET',
	                url: 'https://ec.europa.eu/avservices/cfc/belugaProject.cfc?method=AllProjects&returnformat=json&maxrecords=2&start_date='+ (new Date()).toISOString().slice(0,10).replace(/-/g,"") + '&end_date=20181231'
			});			
			return MyPromise.then(function onSuccess(response){
				return response.data;
			});
        },
    	/* return upcomings events */
        getUpcomingEvents: function () {
        	var datestart = (new Date()).toISOString().slice(0,10).replace(/-/g,"");
        	var dateend = (new Date()).toISOString().slice(0,10).replace(/-/g,"");

			var MyPromise = $http({
	               method: 'GET',
	                url: 'https://ec.europa.eu/avservices/cfc/belugaProject.cfc?method=AllProjects&returnformat=json&maxrecords=10&start_date='+ datestart + '&end_date=20181231'
			});			
			return MyPromise.then(function onSuccess(response){
				return response.data;
			});
        },
        /* return medias of one event   */
        getMedias: function (eventid) {
			var GlobalParams = {'type': 'VIDEO,REPORTAGE', 'wt': 'json', 'hasMedia':1,
                    'fl' : 'ref,titles_json,duration,media_json,mediaorder_json,hasAudio,hasShots,summary_json,primary_key,genre_json,copyright_json,location_json,thesgen_json,views,productiondate,project_json'}
		   	var MyPromise =  $http({
                method: 'GET',
                url: envConstants.urlLuceneServices + 'avsportal',
                params: $.extend(GlobalParams,{'project':eventid}),
//                jsonpCallbackParam: 'json.wrf'
            });
			return MyPromise.then(function onSuccess(response){
                var MyVideos = {photos:[],videos:[],audios:[]};
                var resultArray = response.data.response.docs;

                for (var j = 0; j < resultArray.length; j++) {

                    var videosObj = {};

                    videosObj.ref = resultArray[j].ref;
                    videosObj.hasShots = resultArray[j].hasShots;
                    videosObj.title = resultArray[j].titles_json;
                    videosObj.project = resultArray[j].project_json;
                    videosObj.date = resultArray[j].productiondate.substr(6,2) + '/' + resultArray[j].productiondate.substr(4,2) + '/' + resultArray[j].productiondate.substr(0,4);
                    
                    if(resultArray[j].hasShots){
                    	if(resultArray[j].hasAudio == 1){
                    		// on est dans le cas d'un audio
                        	videosObj.video = utilsFactory.createVideoVersionsList(resultArray[j].media_json, resultArray[j].mediaorder_json); 
                        	videosObj.thumb=(videosObj.video.length >0 ? videosObj.video[0].THUMB : '');
                        	videosObj.thumbmini=(videosObj.video.length >0 ?videosObj.video[0].IMAGE: '');
                        	videosObj.type='audio';
                            MyVideos.audios.push(videosObj);
                    	}
                        	// on est dans le cas d'une video
	                    	videosObj.video = utilsFactory.createVideoVersionsList(resultArray[j].media_json, resultArray[j].mediaorder_json); 
	                    	videosObj.thumb=(videosObj.video.length >0 ? videosObj.video[0].THUMB : '');
	                    	videosObj.thumbmini=(videosObj.video.length >0 ?videosObj.video[0].IMAGE: '');
	                    	videosObj.type='video';
	                        MyVideos.videos.push(videosObj);
                    }
                    else{
                    	videosObj.ref = resultArray[j].primary_key;
                    	videosObj.thumb = envConstants.urlPhotoCdn + resultArray[j].media_json.MED.PATH;
                    	videosObj.thumbmini = envConstants.urlPhotoCdn + resultArray[j].media_json.LOW.PATH;
                    	videosObj.type='reportage';
                        MyVideos.photos.push(videosObj);
                    }
                }
                return MyVideos;
			});
        },

        /*return one event */
        getEvent: function (params) {


			var GlobalParams = {'type': 'VIDEO,REPORTAGE', 'wt': 'json',
                    'fl' : 'ref,titles_json,duration,media_json,mediaorder_json,hasShots,primary_key,location_json,copyright_json,cooperator_json,pers_json,legend_json,summary_json,genre_json,location_json,thesgen_json,views,shootstartdate,productiondate,project_json,type'}
           
			var MyPromiseTitle = $http({
	               method: 'GET',
	                url: 'https://ec.europa.eu/avservices/cfc/belugaProject.cfc?method=AllProjects&returnformat=json&projectId='+params.project
			});			
		   	var MyPromise =  $http({
                method: 'GET',
                url: envConstants.urlLuceneServices + 'avsportal',
                params: $.extend(GlobalParams,params),
//                jsonpCallbackParam: 'json.wrf'
            });
			return MyPromiseTitle.then(function onSuccess(response){
				var MyEvent = {
						title:{},
						description:{}
				};
				angular.forEach(
						response.data,
						function(value,key,obj){
							MyEvent.title[value.lang]=value.title;
							MyEvent.description[value.lang]=value.description;
						});
				MyPromise.then(function onSuccess(response){
	                var MyVideos = [];
	                var resultArray = response.data.response.docs;
	                MyEvent.nbCount = response.data.response.numFound;
	
	                for (var j = 0; j < resultArray.length; j++) {
	
	                    var itemObj = {};
	                    switch (resultArray[j].type){
	                    case 'REPORTAGE': 
	                    case 'PHOTO': 
	                    	itemObj = utilsFactory.createPhotoObj(resultArray[j]);
	                    	break;
	                    case 'AUDIO': 
	                    case 'VIDEO': 
	                    	itemObj = utilsFactory.createVideoObj(resultArray[j]);
	                    	break;
	                    case "MEDIAGROUP":
	                    	itemObj = utilsFactory.createMediagroupObj(resultArray[j]);
	                    	break;
	                    default: break;
	                    }

	                    MyVideos.push(itemObj);
	                }
	                MyEvent.medias=MyVideos;
				});
				
				return MyEvent;

			});
        }
    };
    
});

