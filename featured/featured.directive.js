//directive permettant d'afficher une vignette de liste
//utilisation : <list-view>

avservicesApp.directive('listView', function(){ 

  return {
      restrict: "E",
      templateUrl: '/avservices/featured/listview.template.html',
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


avservicesApp.directive('featuredTop', function(){ 

  return {
      restrict: "E",
      templateUrl: '/avservices/featured/featuredTop.template.html',
      scope : {
        featured : "=?",
        more : "=?"
      },
      controller: function ($scope){
        $scope.more = angular.isDefined($scope.more) ? $scope.more : true;
      }
  };

});