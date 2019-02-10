avservicesApp.controller('MainCtrl', 
		['$state','envConstants','$scope','videosFactory', function ($state,envConstants,$scope,videosFactory) {
console.log('controler Main');
			
			//
//			$scope.videosObj = { 'ref': $location.search()['ref']};
//			
//			$scope.isCloud = $location.search()['cloud'];
//
//			$scope.channel = $location.search()['channel'];
//
//			$scope.autostart = $location.search()['autostart'];
//
//			$scope.tin = $location.search()['tin'];
//
//			$scope.tout = $location.search()['tout'];
//
//			$scope.language = $location.search()['sitelang'] || $location.search()['lg'] || 'or' ;
//
//			$scope.sublg = $location.search()['sublg'];
//			
//            var params = { 'ref': $location.search()['ref']};
//            videosFactory.getVideos(params).then(function(result){
//            	$scope.videosObj = result[0];
//            	$scope.$apply();
//            });
//
}]);
