avservicesApp.config( ['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider','envConstants','languageProvider',
					  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider,envConstants,languageProvider) { 
	
	$stateProvider
	
	// MENU Event ======================================
	.state('language.events', {
		url: '/events',
		templateUrl:'evenement/events.html',
		controller:function($scope,eventFactory) {
//            eventFactory.getEvents().then(function(result){
//            	$scope.events = result;
//            	angular.forEach(result, function(value, key) {
//					eventFactory.getMedias(value.id).then(function(media){value.audios=media.audios;value.photos=media.photos;value.videos=media.videos});
//				});
//            	});
            eventFactory.getUpcomingEvents().then(function(result){
            	$scope.upcomingevents = result;
        	});
		}
	})

	.state('language.event', {
		url: '/event/:ref',
		templateUrl:'evenement/event.html',
		controller:function($scope,$transition$,eventFactory) {
			$scope.nbResultPerPage = 35;
			
            var params = {  'index' : 1,'pagesize': $scope.nbResultPerPage,'project': $transition$.params().ref};
            eventFactory.getEvent(params).then(function(result){$scope.event = result});
            $scope.index = 1;
            $scope.changePage = function(pageNumber){
            	var params = {  'index' : (pageNumber-1) * $scope.nbResultPerPage + 1,'pagesize': $scope.nbResultPerPage,'project': $transition$.params().ref};
                eventFactory.getEvent(params).then(function(result){$scope.event = result});
            }
		}
	})


}]);
