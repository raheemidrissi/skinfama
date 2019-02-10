avservicesApp.config( ['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider','envConstants','languageProvider',
					  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider,envConstants,languageProvider) { 

	
	$stateProvider

    // MENU FEATURED ========================================
    .state('language.featuredall', {
		url:'/topnews?:keywords&:datefrom&:dateto&:page',
		params :{
			keywords:{dynamic: true,type:"string"},
			page:{dynamic: true,value: "1"},
			datefrom:{dynamic: true, type:"string"},
			dateto:{dynamic: true, type:"string"}
		},
        templateUrl: 'featured/featuredall.html',
		controller:'focusSliderCtrl'
    })
    // featured detail (construit avec une vue principal et des vues attachées pour les related)
    .state('language.featured', {
		url:'/topnews/:ref',
		params: {
			ref: ""
			},
            views: {
                '': {
                    templateUrl: 'featured/featured.html',
                    controller: function ($scope,$transition$,focusFactory) {
        			    var params = {'ref':$transition$.params().ref}; // les autres paramètres sont globaux et donc dans le factory
        			    return focusFactory.getFocusById(params).then(function(result){$scope.focusDetails = result.mediagroups[0];})
            			
            		}
                }
            }
    })


}]);
