avservicesApp.config( ['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider','envConstants','languageProvider',
					  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider,envConstants,languageProvider) { 
	
	$stateProvider

	// MENU EBS ==============================================
    .state('language.ebs', {
		url:'/ebs/:channel/:datefrom/:institution',
		params: {
			channel: {value:"1",dynamic:true},
			datefrom:  {value:moment().format('YYYYMMDD'),dynamic:true},
			institution:{value:'',dynamic:true,squash:true}
			},
        templateUrl: 'ebs/ebs.html',
        controller: 'ebsCtrl'
    })
    .state('language.ebsBoth', {
		url:'/ebs/both/:datefrom',
		params: {
			datefrom:  {value:moment().format('YYYYMMDD'),dynamic:true,squash:false},
			},
        templateUrl: 'ebs/ebsboth.html',
        controller:  'ebsbothCtrl'
    })
    .state('language.ebsLatest', {
		url:'/ebs/latest',
        templateUrl: 'ebs/ebsLatest.html'
		//, controller: 'scheduleCtrl'
    })
    .state('language.ebsTechnicalInfo', {
		url:'/ebs/technicalinfo',
        templateUrl: 'ebs/ebsTechnicalInfo.html'
    })
    .state('language.ebsAbout', {
		url:'/ebs/about',
        templateUrl: 'ebs/ebsAbout.html'
    })
    .state('language.ebsLive', {
		url:'/ebs/live/:channel?:autostart&:cloud',
		params: {
			channel: {value:"1",dynamic:true},
			autostart: {value:undefined,dynamic:false},
			cloud: {value:undefined,dynamic:false},
			},
        templateUrl: 'ebs/ebsLive.template.html',
        controller:'ebsLiveCtrl'
    })


}]);
