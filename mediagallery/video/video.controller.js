avservicesApp.controller('videosCtrl', ['$scope','videosPlanningFactory','videosFactory','envConstants', function($scope,videosPlanningFactory,videosFactory,envConstants) {
	var params ={};
	
	params = { 'pagesize':2, 'index' : 1};
    videosPlanningFactory.getReportagesPlanning().then(function(result){
    	$scope.reportagesPlanning = result;
    	console.log(result);
    });
	
	// pour les videos clip
	params = {  'pagesize': 3, 'index': 1, 'genrethes': envConstants.categories.filter(function( obj ) {
		  return obj.id == 'Clip';
	})[0].Genrethes};
    videosFactory.getVideos(params).then(function(result){$scope.videosClip=result});

    // pour les videos stockshot
    params = {  'pagesize': 3, 'index': 1, 'genrethes': envConstants.categories.filter(function( obj ) {
		  return obj.id == 'Stockshot';
	})[0].Genrethes};
    videosFactory.getVideos(params).then(function(result){$scope.videosStockshot=result});

    // pour les videos news
    params = {  'pagesize': 3, 'index': 1, 'genrethes':envConstants.categories.filter(function( obj ) {
		  return obj.id == 'VideoNews';
	})[0].Genrethes};
    videosFactory.getVideos(params).then(function(result){$scope.videosNewsvideos=result});


}]);


///////////////// controller shotlist ///////////////
avservicesApp.controller('shotlistCtrl', ['$scope','$transition$','videosFactory', function ($scope,$transition$,videosFactory) {

    var params = { 'ref': $transition$.params().ref + '*'}
    videosFactory.getShotlist(params).then(function(shotlist){$scope.shotlist = shotlist});

}]);

