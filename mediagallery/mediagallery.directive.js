
//directive permettant d'afficher une vignette de liste
// utilisation : <vignette-detail>
avservicesApp.directive('vignetteDetail', function(){	

    return {
        restrict: "E",        
        replace: true,
        templateUrl: '/avservices/mediagallery/vignettedetail.template.html',
        scope : {
        	media : "=",
        	type : "=",
        	testorder : "@"
        },
        controller: function ($scope){
       	 $scope.testorder = angular.isDefined($scope.testorder) ? $scope.testorder : '';
        }
    };
});


//directive permettant d'afficher une vignette de liste
//utilisation : <list-detail>
avservicesApp.directive('listDetail', function(){	

  return {
      restrict: "E",   
      replace: true,
      templateUrl: '/avservices/mediagallery/listdetail.template.html',
      scope : {
      	media : "=",
      	type : "=",
      	testorder : "@"
      },
      controller: function ($scope){
     	 $scope.testorder = angular.isDefined($scope.testorder) ? $scope.testorder : '';
      }
  };
});


//directive permettant d'afficher une liste de vignette
//utilisation : <liste-vignette>
avservicesApp.directive('listeVignette', function(){	

return {
   restrict: "E",    
   replace: true,   
   templateUrl: '/avservices/mediagallery/listevignette.template.html',
   scope : {
   	medias : "=",
   	maxvignette : "=?",
   	type : "=",
   	testorder : "@"
   },
   controller: function ($scope){
	  	 $scope.testorder = angular.isDefined($scope.testorder) ? $scope.testorder : '';
	  	 $scope.maxvignette = angular.isDefined($scope.maxvignette) ? $scope.maxvignette : 3;
   }
};
});


