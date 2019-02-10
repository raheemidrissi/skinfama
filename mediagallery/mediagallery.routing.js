avservicesApp.config( ['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider','envConstants','languageProvider',
					  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider,envConstants,languageProvider) { 
	
	$stateProvider
	
	// MENU MEDIAGALLERY ======================================
	.state('language.mediagallery', {
		url: '/mediagallery',
		templateUrl:'mediagallery/mediagallery.html'
	})

}]);
