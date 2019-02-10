/**
 * Déclaration de l'application routeApp
 */
var avservicesApp = angular.module('avservicesApp', [
    // Dépendances du "module"
    'ui.router','pascalprecht.translate','ngSanitize' ,'autoCompleteModule','angularUtils.directives.dirPagination','angular-jwt','ngMessages','ngCookies','ngAria','avservices.socialshare','angularMoment','ngScrollTo'
]);

avservicesApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'http://defiris.ec.streamcloud.be/**',
      'http://ec.europa.eu/**',
      'http://webanalytics.ec.europa.eu/**',
//      'http://remote-office.novacomm-europa.eu/**',
      'http://combelgd.cc.cec.eu.int:1061/**',
      'http://34.247.126.19:8888/**',
      'http://vertx.cc.cec.eu.int:3000/**',
      'http://webgate.ec.europa.eu/**',
	  'http://ott.ec.streamcloud.be/**',
      'https://defiris.ec.streamcloud.be/**',
      'https://ec.europa.eu/**',
	  'https://dev.ec.europa.eu/**',
	  'https://dev.ec.europa.eu:8443/**',
	  'https://webanalytics.ec.europa.eu/**',
	  'https://vertx.cc.cec.eu.int:3000/**',
	  'https://webgate.ec.europa.eu/**',
	  'https://ott.ec.streamcloud.be/**',
	  'https://www.gstatic.com/**',
	  'http://windhouse.net1.cec.eu.int:8080/**',
	  'http://nbzac1j6ve.execute-api.eu-west-1.amazonaws.com/**',
	  'https://nbzac1j6ve.execute-api.eu-west-1.amazonaws.com/**',
	  'http://b6golj1og8.execute-api.eu-west-1.amazonaws.com/**',
	  'https://b6golj1og8.execute-api.eu-west-1.amazonaws.com/**',
  ]);
});




/******************************************/
/**** option de config pour pagination ****/
/******************************************/
avservicesApp.config(function(paginationTemplateProvider) {
	paginationTemplateProvider.setPath('partials/avsPagination.tpl.html');
})

/***********************************************/
/**** option de config pour JWT interceptor ****/
/***********************************************/
.constant('AUTH_EVENTS', {
	  notAuthenticated: 'auth-not-authenticated'
	})
.constant('API_ENDPOINT', {
	  url: 'https://dev.ec.europa.eu:8443/api'
	})
.config(function Config($httpProvider, jwtOptionsProvider,API_ENDPOINT) {
    // Please note we're annotating the function so that the $injector works when the file is minified
	// voir pour plus d'info et possibilité : https://github.com/auth0/angular-jwt
    jwtOptionsProvider.config({
        authPrefix: 'JWT ',
    	tokenGetter: ['options', function(options) {
            return window.localStorage.getItem('EC_Avservices_token');
        }],
      whiteListedDomains: ['ec.europa.eu', 'dev.ec.europa.eu','combelgd.cc.cec.eu.int'],
      unauthenticatedRedirectPath: API_ENDPOINT.url+'/authenticate',
      unauthenticatedRedirector: ['$state', function($state) {
          $state.go('language.login');
        }]
    });

    $httpProvider.interceptors.push('jwtInterceptor');
  });


// pour avoir la trace sur les transitions des states
//angular.module("avservicesApp").run($trace => $trace.enable());
// les fonctions sur toutes l'application
angular.module("avservicesApp").run(function ($transitions,authManager,AuthService,loggingFactory) {
	// https://ui-router.github.io/ng1/docs/latest/interfaces/transition.hookmatchcriteria.html
    authManager.checkAuthOnRefresh();
    authManager.redirectWhenUnauthenticated();
    
//	$rootScope.$on('tokenHasExpired', function() {
//		  alert('Your session has expired!');
//		});
	$transitions.onSuccess ( {},function(trans){
		var log = {
				type:"url",
				message:{
					from : {url: trans.from().url,stateName:trans.from().name},		
					to : {url: trans.to().url,stateName:trans.to().name,params:trans.params()},
				}
		};
		loggingFactory.appLogging(log);
	    angular.element(function(){
	    	ECL.initExpandables('.ecl-expandable__button');
			// a faire si on n'est pas dans la page search
			if (trans.to().name != 'language.search' && trans.to().name != 'language.featuredall')
				$("html, body").animate({ scrollTop: 0 }, 200);	
	        ECL.navigationInpages(); 
	    	ECL.dialogs({dialogOverlayId: 'ecl-overlay-language-list',triggerElementsSelector: '#ecl-lang-select-sites__overlay'});
		     
	        $( ".ecl-language-list__button" ).click(function(e) {
	
	          $( ".ecl-lang-select-sites__label" ).html(e.target.innerText);
	          $( ".ecl-lang-select-sites__code-text" ).html(e.target.lang);
        });
      });
  });
       
  }
);
