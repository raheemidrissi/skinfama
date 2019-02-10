avservicesApp.config( ['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider','envConstants','languageProvider',
					  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider,envConstants,languageProvider) { 
	
	$stateProvider
	
    .state('language.photos', {
		url:'/photo',
		views :{
				'': {templateUrl: 'mediagallery/photo/photos.html'
					,controller:'photosCtrl'}
		}
    })
    .state('language.reportage', {
    url: '/reportage/:ref',
    params:{ref:'P-000000'
               },
               resolve: {
                   repDetails: ['$stateParams', 'reportageFactory', function($stateParams, reportageFactory) {
                       var params = { 'ref': $stateParams.ref+'*'};
                       return reportageFactory.getReportage(params);
                   }]
                 },
               views: {
                   '': {
                       templateUrl: 'mediagallery/photo/reportage.html',
                       controller: 'reportageCtrl'
                   },
//                   'relatedVideos@language.reportage': {
//                       templateUrl: 'mediagallery/video/related.videos.partial.html',
//                       controller: function ($scope, videosFactory, repDetails) {
//                           var params = { 'project': repDetails[0].project.id,'pagesize': 10, 'index': 1,'kwexcluded':$scope.excluded};
//                           $scope.photo = {'project':{'id':repDetails[0].project.id}};
//                           videosFactory.getVideos(params).then(function(videoRelated) {
//                               $scope.videosRelated = videoRelated;
//                           });
//                       }
//                   },
//                   'relatedPhotos@language.reportage': {
//                       templateUrl: 'mediagallery/photo/related.photos.partial.html',
//                       controller: function ($scope, reportageFactory, repDetails) {
//                           var params = { 'project': repDetails[0].project.id,  'pagesize': 99, 'index': 1,'kwexcluded':$scope.excluded};
//                           $scope.photo = {'project':{'id':repDetails[0].project.id}};
//                           reportageFactory.getReportage(params).then(function (photoRelated) {
//                               $scope.photosRelated = photoRelated;
//                           });
//                       }
//                   }
               }
    })  
    .state('language.photo', {
		url: '/photo/:ref',
		params:{ref:''
               },
               resolve: {
                   repDetails: ['$transition$', 'photosFactory', function($transition$, photosFactory) {
                       var params = { 'ref': $transition$.params().ref.substring(0, 8)+'*','pagesize': 1000, 'index': 1};
                       return photosFactory.getReportage(params);
                   }]
                 },
               views: {
                   '': {
                       templateUrl: 'mediagallery/photo/photo.html',
                       controller: function($scope,$transition$,repDetails) {
                          $scope.reportage = repDetails;

                          var position = $.map($scope.reportage, function(obj, index) {
                              if(obj.ref == $transition$.params().ref) {
                                  return index;
                              }
                          });
                          if (position.length == 0) position.push(0); // si on donne un index de photo dans le reportage qui n'existe pas, alors on affiche la première photo
                          $scope.photo = repDetails[position[0]];

                          setTimeout(function(){
                              Galleria.loadTheme('js/galleria/themes/twelve/galleria.twelve.js');
                              Galleria.configure({
                                autoplay: false,
                                imageCrop: false,
                                thumbCrop: false
                            	});                              // Initialize Galleria
                              Galleria.run('#galleria', {
                                  show: position[0], //
		                           // extend theme
		                              extend: function() {
		                                  var gallery = this; // "this" is the gallery instance
		
		                                  this.attachKeyboard({
		                                	    left: this.prev, // applies the native prev() function
		                                	    right: this.next,
		                                	    up: function() {
		                                	        // custom up action
		                                	    	event.preventDefault();
		                                	        this.show(0);
		                                	    },
		                                	    down: function(){
		                                	    	event.preventDefault();
		                                	    	this.show(repDetails.length);
		                                	    },
		                                	    13: function() {
		                                	        // enter fullscreen when return (keycode 13) is pressed:
		                                	    	this.toggleFullscreen();
		                                	    },
		                                	    space: function() {
		                                	        // start playing when space is pressed:
		                                	    	event.preventDefault();
		                                	        this.playToggle(3000);
		                                	    },
		                                	    80: function() {
		                                	        // start playing when 'p' (keycode 80) is pressed:
		                                	    	event.preventDefault();
		                                	        this.playToggle(3000);
		                                	    },
		                                	    88: function() {
		                                	        // start playing when 'x' (keycode 88) is pressed:
		                                	    	this.exitFullscreen();
		                                	    }
		                                	});	
		                                  }
                              });
                          }, 10);
                          Galleria.on('image', function(e) {
                         	 $scope.photo = $scope.reportage[e.index];
                         	 $scope.$apply();
                        	});
               		}
                   },
//                   'relatedVideos@language.photo': {
//                       templateUrl: 'mediagallery/video/related.videos.partial.html',
//                       controller: function ($scope, videosFactory, repDetails) {
//                           var params = { 'project': repDetails[0].project.id,'pagesize': 10, 'index': 1,'kwexcluded':$scope.excluded};
//                           videosFactory.getVideos(params).then(function(videoRelated) {
//                               $scope.videosRelated = videoRelated;
//                           });
//                       }
//                   },
//                   'relatedPhotos@language.photo': {
//                       templateUrl: 'mediagallery/photo/related.photos.partial.html',
//                       controller: function ($scope, reportageFactory, repDetails) {
//                           var params = { 'project': repDetails[0].project.id,  'pagesize': 99, 'index': 1,'kwexcluded':$scope.excluded};
//                           reportageFactory.getReportage(params).then(function (photoRelated) {
//                               $scope.photosRelated = photoRelated;
//                           });
//                       }
//                   }
               }
    })
    .state('language.planning', {
		url:'/planning',
        templateUrl: 'mediagallery/photo/planning.html',
        controller: function($scope,reportagesPlanningFactory) {
    		var params = { 'pagesize':30, 'index' : 1};
    	    reportagesPlanningFactory.getReportagesPlanning(params).then(function(result){$scope.reportagesPlanning = result;});
		}
    })
    .state('language.symbolic', {
		url:'/symbolic/:thematic',
		params:{
			thematic:{dynamic: true, value: '', squash: true},
        },
        templateUrl: 'mediagallery/photo/symbolic.html',
        controller: function($scope,mediagroupFactory,lovFactory,$transition$,$state,$filter) {
        	
        	if ($transition$.params().thematic){
        		$scope.search.thematic = $transition$.params().thematic;
        	}
        	else {
        		$scope.search.thematic = 726;
        	}
        	
        	lovFactory.getLov({'type':'THEMATIC'}).then(function(result){$scope.thematics = result;});
        	
        	fnSearch = function(){
        		if ($scope.search.thematic){
	    		var params = { 'pagesize':30, 'index' : 1, 'thematic':$scope.search.thematic};
	    		mediagroupFactory.getMediagroup(params).then(function(result){$scope.results = result;});
        		}
        	};
        	
        	$scope.$watch('search.thematic',function(newVal,oldVal){
        		$state.go('.', {thematic: newVal});
        		fnSearch();
        	});
        	
        	$scope.traduc = function (item){
        		return $filter('translateDB')(item.title);
        	}

        	
    	    this.uiOnParamsChanged = function(newParams) {
    	    	if ("thematic" in newParams)
        			$scope.search.thematic = newParams.thematic;
    	    }
		}
    })


}]);
