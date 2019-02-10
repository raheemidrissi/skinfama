avservicesApp.controller('photosCtrl', ['$scope','reportageFactory','mediagroupFactory','envConstants','reportagesPlanningFactory', function($scope,reportageFactory,mediagroupFactory,envConstants,reportagesPlanningFactory) {
	var params ={};
	
	params = { 'pagesize':2, 'index' : 1};
    reportagesPlanningFactory.getReportagesPlanning(params).then(function(result){$scope.reportagesPlanning = result;});
	
    //pour les photos News
    params = {  'pagesize': 3, 'index': 1, 'genrethes': envConstants.categories.filter(function( obj ) {
		  return obj.id == 'Photonews';
	})[0].Genrethes};
    reportageFactory.getReportage(params).then(function(result){$scope.photosNews=result});
    
    //pour les photos illustrations/creative
    params = {  'pagesize': 3, 'index': 1, 'genrethes': envConstants.categories.filter(function( obj ) {
		  return obj.id == 'Illustration';
	})[0].Genrethes};
    reportageFactory.getReportage(params).then(function(result){$scope.photosIllustration=result});

    // pour le whoswho
    params = {'ref':'M-002087'};
    mediagroupFactory.getMediagroup(params).then(function(result){
    	// travail plutot sale. fait par Régis, est-ce qu'on fait un truc plus dynamique ?
    	console.log(result);
    	$scope.whoswhos= [];
        $scope.whoswhos.push( result.mediagroups[0].chapters[0].medias[1]);
        $scope.whoswhos.push( result.mediagroups[0].chapters[0].medias[2]);
        $scope.whoswhos.push( result.mediagroups[0].chapters[0].medias[3]);
    });
}]);


avservicesApp.controller('reportageCtrl', ['$scope','$state','$transition$', 'photosFactory', function ($scope,$state,$transition$,photosFactory) {
    var params = {'newsphoto':'Y' ,'pagesize':99, 'index' : 1,'ref':$transition$.params().ref+'*'};
    $scope.reportages=[];
//    if ($transition$.params().index && $transition$.params().index != ''){
//      $scope.index = $transition$.params().index;
//    }
//    else
//      $scope.index = 1;
    
    $scope.previous = function(){
        $scope.go('.',{index:$scope.index - 1});
    }

    $scope.next = function(){
        $scope.go('.',{index:$scope.index + 1});
    }

    photosFactory.getReportage(
            params).then(
            function(repList){
                $scope.reportages = repList;
                }
            );

//    // pour trapper l'event de changement du params il faut implementer ce callback
//    this.uiOnParamsChanged = function(newParams) {
//      if (newParams.index){
//          $scope.photo = $scope.reportages[newParams.index-1];
//          $scope.index=newParams.index;
//      }
//      }
    
    }]);

avservicesApp.controller('photoplayerCtrl', ['$scope','$state','$transition$', 'photosFactory', function ($scope,$state,$transition$,photosFactory) {
    var params = {'newsphoto':'Y' ,'pagesize':99, 'index' : 1,'ref':$transition$.params().ref+'*'};
    $scope.reportages=[];
    
    photosFactory.getReportage(
            params).then(
            function(repList){
                $scope.reportages = repList;
                }
            );

//    // pour trapper l'event de changement du params il faut implementer ce callback
//    this.uiOnParamsChanged = function(newParams) {
//      if (newParams.index){
//          $scope.photo = $scope.reportages[newParams.index-1];
//          $scope.index=newParams.index;
//      }
//      }
    
    }]);
