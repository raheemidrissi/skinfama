avservicesApp.config( ['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider','envConstants','languageProvider',
					  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider,envConstants,languageProvider) { 

	
	$stateProvider

	// MENU EU History =======================================================
    .state('language.euhistory', {
		url:'/euhistory',
        templateUrl: 'euhistory/euhistory.html' //, controller: 'contactCtrl'
    })
    .state('language.anniversaries', {
        url:'/euhistory/anniversaries',
        templateUrl: 'euhistory/anniversaries.html' //, controller: 'contactCtrl'
    })
    .state('language.map', {
        url:'/euhistory/map',
        templateUrl: 'euhistory/map.html' //, controller: 'contactCtrl'
    })
    .state('language.commissions', {
        url:'/euhistory/commissions',
        templateUrl: 'euhistory/commissions.html' //, controller: 'contactCtrl'
    })
    .state('language.credentials', {
        url:'/euhistory/credentials',
        templateUrl: 'euhistory/credentials.html' //, controller: 'contactCtrl'
    })
    .state('language.councils', {
        url:'/euhistory/councils',
        templateUrl: 'euhistory/councils.html' //, controller: 'contactCtrl'
    })
    .state('language.euhistoryof', {
		url:'/euhistory/:of',
		params:{
			of:''
		},
        templateUrl: 'euhistory/euhistoryof.html' //, controller: 'contactCtrl'
    })
    .state('language.milestones', {
		url:'/euhistory/milestones',
        templateUrl: 'euhistory/milestones.html' //, controller: 'contactCtrl'
    })
    .state('language.calendar', {
		url:'/euhistory/calendar',
        templateUrl: 'euhistory/calendar.html' //, controller: 'contactCtrl'
    })
    .state('language.timeline', {
		url:'/euhistory/timeline',
        templateUrl: 'euhistory/timeline.html' //, controller: 'contactCtrl'
    })


}]);
