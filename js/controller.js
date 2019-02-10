
//ici on utilise $stateParams car $transition$ ne fonctionne pas à cet endroit (fonctionne partout ailleur) ??????
avservicesApp.controller('MainCtrl', ['$translate','envConstants','$state','language','$scope','AuthService','moment','$http', function ($translate,envConstants,$state,languageProvider,$scope,AuthService,moment,$http) {
	$scope.breadcrumb = [{url:'/',name:'European Commission'},{url:'/commission/news_eu',name:'News'},{url:'/avservices/',name:'AudioVisual Service'}]	
	$scope.state = $state;
	$scope.globalMenuExpanded = false;
	$scope.toggle = function(name){
		$( "#"+name ).attr('aria-expanded','false');
	}

/***********************/
/*  about search form  */
/***********************/
	$scope.search= {};	
	$scope.goSearch= function(){
		if ($state.is('language.videos') || $state.is('language.video')){
			$state.go('language.search',{'kwor':$scope.search.kwor,'mediatype':'VIDEO'});
		}
		else if ($state.is('language.photos') || $state.is('language.photo')){
			$state.go('language.search',{'kwor':$scope.search.kwor,'mediatype':'PHOTO'});
		}
		else if ($state.is('language.audios') || $state.is('language.audio')){
			$state.go('language.search',{'kwor':$scope.search.kwor,'mediatype':'AUDIO'});
		}
		else {
			$state.go('language.search',{'kwor':$scope.search.kwor});
		}
	}
/***********************/
/* about login/logout  */
/***********************/
	$scope.user = AuthService.user;
	$scope.logout = function() {
	    AuthService.logout();
	};	
	$scope.login = function() {
		AuthService.login();
	};
	// try to load credential from localstorage;
	AuthService.loadUserCredentials();

/***************************/
/*  about change language  */
/***************************/
	$scope.languages = envConstants.languages;
	$scope.chgLang = function(lang){
	    angular.element(function(){
    		$( "#ecl-dialog" ).attr('aria-hidden','true');
    		$( "#ecl-overlay-language-list" ).attr('aria-hidden','true');
    		$( "body" ).removeClass('ecl-u-disablescroll');
	    });
	    $state.go('.',{lang:lang});
	}

	// quand la valeur change dans le provider, on met à jour la valeur affichée
	$scope.$watch(function(){
		   return languageProvider.getUserLanguage();
		}, function(newValue, oldValue){
    		$scope.selectedLanguage = languageProvider.getUserLanguage();
		});	
		
	// callback pour le param dynamique
    this.uiOnParamsChanged = function(newParams) {
    	if ("lang" in newParams) {
    		languageProvider.setUserLanguage(newParams.lang);
    		$translate.use(newParams.lang);
    		$scope.selectedLanguage = languageProvider.getUserLanguage();
    		moment.locale(newParams.lang);
    		}
    	};
}]);


avservicesApp.controller('anchorController', function($scope, $anchorScroll, $location) {
     $scope.goToId = function(anchorId) {
      var newHash = anchorId;
      if ($location.hash() !== newHash) {
        $location.hash(anchorId);
      } else {
        $anchorScroll();
      }
     };
    });
