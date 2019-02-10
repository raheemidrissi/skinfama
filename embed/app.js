/**
 * Déclaration de l'application routeApp
 */
var avservicesApp = angular.module('avservicesApp', [
    // Dépendances du "module"
	'pascalprecht.translate','ngSanitize','angular-jwt','ngCookies'
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
      'https://defiris.ec.streamcloud.be/**',
      'https://ec.europa.eu/**',
	  'https://dev.ec.europa.eu/**',
	  'https://dev.ec.europa.eu:8443/**',
	  'https://webanalytics.ec.europa.eu/**',
	  'https://vertx.cc.cec.eu.int:3000/**',
	  'https://webgate.ec.europa.eu/**',
	  'http://nbzac1j6ve.execute-api.eu-west-1.amazonaws.com/**',
	  'https://nbzac1j6ve.execute-api.eu-west-1.amazonaws.com/**',
	  'http://b6golj1og8.execute-api.eu-west-1.amazonaws.com/**',
	  'https://b6golj1og8.execute-api.eu-west-1.amazonaws.com/**',
  ]);
});


// les fonctions sur toutes l'application
//angular.module("avservicesApp").run(function ($transitions,$rootScope,authManager,AuthService,$log) {
//	console.log('toujours');
//
//// à réécrire sans le ui-routing
//	$transitions.onSuccess ( {},function(trans){
//		var log = {
//				type:"log",
//				timestamp:moment().format("YYYYMMDD HH:mm:ss"),
//				user : (AuthService.isAuthenticated ? AuthService.user() : {}),
//				from : {url: trans.from().url,stateName:trans.from().name},		
//				to : {url: trans.to().url,stateName:trans.to().name,params:trans.params()},		
//		}
////		console.log(log);
//		$log.brutLog(log);
//      });
//  }
//);

avservicesApp.controller('MainCtrl', ['$scope','$location','envConstants','videosFactory', function ($scope,$location,envConstants,videosFactory) {
	console.log('main',$location.search());
	var params = {ref : $location.search().ref}
	videosFactory.getVideos(params).then(function(result){
		$scope.videosObj=result[0];
	});
}]);


