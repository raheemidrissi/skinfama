avservicesApp.config( ['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider','envConstants','languageProvider',
					  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider,envConstants,languageProvider) { 

    // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================

	
	$stateProvider
	.state('language.statistic', {
		url:'/statistic',
        templateUrl: 'about/statistics.html',
		controller:"statisticCtrl"
    });


}]);
