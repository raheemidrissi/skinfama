avservicesApp.config( ['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider','envConstants','languageProvider',
					  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider,envConstants,languageProvider) { 
	
	$stateProvider
	
// state non appelé pour le moment, c'est le suivant qui est toujours appelé	
    .state('language.audios', {
		url:'/audio',
        templateUrl: 'mediagallery/audio/audios.html', 
        controller: function($scope,audiosFactory,$transition$) {
            var params = {  'ref': $transition$.params().ref,'pagesize': 12, 'index': 1};
            audiosFactory.getAudios(params).then(function(result){$scope.audios = audios;});
		}
    })
    .state('language.audio', {
		url: '/audio/{ref:I-\\d{6}$}',
		templateUrl: 'mediagallery/audio/audio.html',
		controller: function($scope,audiosFactory,$transition$) {
            var params = {  'ref': $transition$.params().ref, 'index': 1};
            audiosFactory.getAudios(params).then(function(result){$scope.audio = audio;});
		}
    })

}]);
