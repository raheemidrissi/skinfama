/**
 * Configuration du module principal : routeApp
 */
avservicesApp.config( ['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider','envConstants','languageProvider','$urlMatcherFactoryProvider',
					  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider,envConstants,languageProvider,$urlMatcherFactoryProvider) { 
        
        // use the HTML5 History API
        $locationProvider.html5Mode(true);

        // Securité contre les attaques XSS
        $translateProvider.useSanitizeValueStrategy('escapeParameters');
        $translateProvider
//        .translations('en', translationsEN)
//        .translations('fr', translationsFR)
        .fallbackLanguage(['en', 'fr'])
		.registerAvailableLanguageKeys(['en','fr', 'de'], {
			'en_*': 'en',
			'fr_*': 'fr',
		    'de_*': 'de'
		  })
		.useLocalStorage()
        .preferredLanguage('en');
        // Système de routage
		var lang='en';
//		var token = window.localStorage.getItem('EC_Avservices');

//        if (token) {
//        	var userProfile = jwtHelper.decodeToken(token);
//        	lang = userProfile.lang.site[0] || 'en';
//        }
//		console.log(lang);
//		language.setUserLanguage(lang);
		$urlRouterProvider.otherwise('/'+ lang +'/');

		// pour accepter dans le même state avec ou sans / de fin (trailing slash)
		$urlMatcherFactoryProvider.strictMode(false)
		

// le routing est découpé chacun dans son répertoire par fonctionnalité, ici on n'a que le routage de la home et des choses transversales
// fonctionnalité : about, ebs, euhistory, featured, mediagallery/video, mediagallery/audio, mediagallery/photo, mediagallery/mediagroup		
		$stateProvider
		// route racine qui permet d'avoir partout le langage dans l'url + la gestion du langage initialisé
		.state('language',{
			abstract:true,
			url:'/:lang',
			params:{
				lang:{dynamic:true}
			},
			resolve:{
                data: ['$stateParams','$translate','language', 'AuthService','$location', function ($stateParams,$translate,language, AuthService,$location) {
                	var lang = 'en';
//                    AuthService.loadUserCredentials();
//                    var user = AuthService.user();
////                    console.log(user);
//                    if (user && user.lang && user.lang.site){
//                    	lang = user.lang.site[0];
////                    	console.log('language changed');
//                    }
//                	 priorité à la langue passé en paramètre
//            		console.log($stateParams,lang);
                	if ($stateParams && $stateParams.lang){
                		lang = $stateParams.lang;
                	}
            		language.setUserLanguage(lang);
//            		console.log($stateParams,lang);
            		$translate.use(lang);
//            		var oldPath = $location.path();
////            		console.log(oldPath);
//            		var newPath = oldPath.replace(/\/(.*)\//,"/"+lang+"/");
////            		console.log(newPath);
//            		$location.replace().path(newPath);
                }]
            },
			controller:'MainCtrl',
			template: '<ui-view/>'
		})
        // HOME AND NESTED VIEWS ========================================
        .state('language.home', {
            url: '/',
			views :{ // vue permettant d'afficher ce qui a été resolvé ci-dessus
					'': {templateUrl: 'home/home.html',
						controller:'homeCtrl'
						},
					'whoswhophoto@language.home': {
						templateUrl: 'mediagallery/mediagroup/whoswhoList.html',
						controller:function($scope,mediagroupFactory) {
		                    var params = {  'index' : 1,'pagesize': 35};
		                    mediagroupFactory.getWhosWho(params).then(function(result){$scope.whoswho = result});
						}
					}
					
			}
        })
		// ??    ========================================
		.state('language.copyright', {
	        url: '/copyright',
	        templateUrl: 'static/static.template.html',
	        controller : function($scope,staticFactory){
	        	staticFactory.getStatic('copyright').then(function(data){$scope.mediagroup= data;});
	        }
    	})
        .state('language.mission', {
	        url: '/mission',
	        templateUrl: 'partials/mission.html'    
    	})
        .state('language.activities', {
	        url: '/activities',
	        templateUrl: 'partials/activities.html'    
    	})
        .state('language.whatsebs', {
	        url: '/whatsebs',
	        templateUrl: 'partials/whatsebs.html'    
		})
		
		.state('language.aboutebs', {
	        url: '/aboutebs',
	        templateUrl: 'static/static.template.html',
	        controller : function($scope,staticFactory){
	        	staticFactory.getStatic('aboutebs').then(function(data){$scope.mediagroup= data;});
	        }
	    })
		.state('language.about', {
	        url: '/about',
	        templateUrl: 'static/static.template.html',
	        controller : function($scope,staticFactory){
	        	staticFactory.getStatic('about').then(function(data){$scope.mediagroup= data;});
	        }
		})
		
		
        .state('language.assistance', {
	        url: '/assistance',
	        templateUrl: 'static/static.template.html',
	        controller : function($scope,staticFactory){
	        	staticFactory.getStatic('assistance').then(function(data){$scope.mediagroup= data;});
	        }
    	})
 

		.state('language.contact', {
	        url: '/contact',
	        templateUrl: 'static/static.template.html',
	        controller : function($scope,staticFactory){
	        	staticFactory.getStatic('contact').then(function(data){$scope.mediagroup= data;});
	        }  
		})
		
		
    	.state('language.faq', {
	        url: '/faq',
	        templateUrl: 'static/static.template.html',
	        controller : function($scope,staticFactory){
	        	staticFactory.getStatic('faq').then(function(data){$scope.mediagroup= data;});
	        }  
		})

    	.state('language.format_software', {
	        url: '/format_software',
	        templateUrl: 'partials/format_software.html'    
    	})
    	.state('language.useful_links', {
	        url: '/useful_links',
	        templateUrl: 'partials/useful_links.html'    
    	})


        .state('language.lov', {
			url:'/lov/:type/:id/',
			params: {
				id: ''
			},
            templateUrl: 'partials/lov.html' //, controller: 'lovCtrl'
        })
		// MENU SEARCH ET MYACCOUNT =============================================
        .state('language.myaccount/', {
			url:'/myaccount',
            templateUrl: 'partials/myaccount.html' //, controller: 'contactCtrl'
        }) 
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });
        $translateProvider
        .fallbackLanguage('en')
        .preferredLanguage('en');


    }]);

    
    // tentative d'avoir le debuger pour ui-router (n'a pas l'air de fonctionner)
avservicesApp.run(function($rootScope) {
  $rootScope.$on("$stateChange", console.log.bind(console));
});
