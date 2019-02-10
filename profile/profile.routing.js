avservicesApp.config( ['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider','envConstants','languageProvider',
					  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider,envConstants,languageProvider) { 
	
	$stateProvider

	
	// route pour se loguer sur le site web
	.state("login", {
	    url: "/login?:jwt",
	    params: {
	        jwt: null,
	      },
	    template:'login',
        controller: 'loginCtrl'
	})
		

}]);
