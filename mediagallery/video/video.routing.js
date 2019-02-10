avservicesApp.config(['$stateProvider', 'languageProvider',
    function ($stateProvider) {

        $stateProvider

            /////////////////////////////////////////////////////////
            // la page détail video                                //
            /////////////////////////////////////////////////////////
            /* dans le resolve on va chercher les détails de la vidéo, puis dans chaque vue,
               on doit aller chercher par la factory les différents related photo et video 
               en lui passant le project id qu'on a eu dans le detail
               */
            .state('language.video', {
                url: '/video/{ref:I-\\d{6}$}?:cloud&:autostart&:tin&:tout&:lg&:sublg',
                params:{
                	'cloud':undefined,
                	'autostart':undefined,
                	'tin':undefined,
                	'tout':undefined,
                	'lg':undefined,
                	'sublg':undefined,
                	'ref':{dynamic: true,array:false}
                },
                resolve: {
                  videoDetails: ['$transition$', 'videosFactory', function($transition$, videosFactory) {
                      var params = { 'ref': $transition$.params().ref};
                      return videosFactory.getVideos(params);
                  }]
                },
                views: {
                    '': {
                        templateUrl: './mediagallery/video/video.html',
                        controller: function($scope,$transition$, videoDetails, language,$filter,videosFactory,$state){

                        	$scope.playlist= [];
              			console.log(videoDetails[0].related.VIDEO.numFound,'VIDEO DETAIL');
                        	if (videoDetails.length == 0){
                        		$scope.errMsg = 'Error - reference not found';
                        	}
                        	else if (videoDetails.length == 1)
                        		$scope.video = videoDetails[0];
                        	else
                        		$scope.errMsg = 'ref : multiple found';

                			$scope.isCloud = $transition$.params().cloud;
                			$scope.autostart = $transition$.params().autostart;
                			$scope.tin = $transition$.params().tin;
                			$scope.tout = $transition$.params().tout;
                			// si on passe une langue, on regarde si elle existe dans mediaorder,
                			// sinon, on regarde si la langue du site existe 
                			// sinon, on prends la première de mediaorder
                			$scope.lang = ($transition$.params().lg) ? $transition$.params().lg : language.getUserLanguage().lang;
                			$scope.sublg = $transition$.params().sublg;

                			   // ce qu'il faut pour les playlist et le upnext
                			   // on ne le met que pour les press briefing (genrethes : 64)
                			   if ($scope.video && $scope.video.genre && ([64,67,63].filter(function(id){return $scope.video.genre.id == id}).length )){
                				   var currentIndex;
                		           var params = { 'project': $scope.video.project.id,'pagesize': 100, 'index': 1, 'sortfield':'shootstartdate','sortdir':'desc'};
                		           videosFactory.getVideos(params).then(function(videoRelated) {
                		               $scope.playlist = videoRelated;
                		           });

                			   }
                			   
                			   $scope.$on('avportalVideo.trackChange', function(event, args){
                				  // le player video a changé de video dans sa playlist : on doit mettre à jour l'url et les info à droite 
                				   // mais aussi les related ?
            					   $state.go('language.video',{ref:args.track.ref});
            					   $scope.video = args.track;
                			   });
                				// pour trapper l'event de changement du params il faut implementer ce callback
                			    this.uiOnParamsChanged = function(newParams) {
                				    if ("ref" in newParams){
                	                      var params = { 'ref': newParams.ref};
                	                      videosFactory.getVideos(params).then(function(result){
                	                    	  $scope.video = result[0];
                	                    	  $scope.$broadcast('changeTrack',{track:$scope.video});
                	                    	  });
                	                      	
                				    }
                			    }

//
                        }
                    },
//                    'relatedVideos@language.video': {
//                        templateUrl: './mediagallery/video/related.videos.partial.html',
//                        controller: function ($scope, videosFactory, videoDetails) {
//                        	if (videoDetails.length){
//	                            var params = { 'project': videoDetails[0].project.id,'pagesize': 100, 'index': 1,'kwexcluded':$scope.excluded};
//	                            videosFactory.getVideos(params).then(function(videoRelated) {
//	                                $scope.videosRelated = videoRelated;
//	                            });
//                        	}
//                        }
//                    },
//                    'relatedPhotos@language.video': {
//                        templateUrl: './mediagallery/photo/related.photos.partial.html',
//                        controller: function ($scope, reportageFactory, videoDetails) {
//                        	if (videoDetails.length){
//	                            var params = { 'project': videoDetails[0].project.id,  'pagesize': 99, 'index': 1,'kwexcluded':$scope.excluded};
//	                            reportageFactory.getReportage(params).then(function (photoRelated) {
//	                                $scope.photosRelated = photoRelated;
//	                            });
//                        	}
//                        }
//                    }
                }
            })
        /////////////////////////////////
        // les pages par type (avec s) //
        /////////////////////////////////
        /* la 'home' des videos */
            .state('language.videos', {
                url: '/video',
                views: {
                    '': {templateUrl: './mediagallery/video/videos.html'
                    	,controller:'videosCtrl'}
                    }
            })

            

        ///////////////////////////////////////
        // affichage du shotlist d'une video //
        ///////////////////////////////////////       
        .state('language.shotlist', {
			url:'/shotlist/:ref',
			params: {
				ref: ''
			},
            templateUrl: 'mediagallery/video/shotlist.html', 
            controller: 'shotlistCtrl'
        })

    }]);
