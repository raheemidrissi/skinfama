
//directive permettant d'afficher une liste de vignette
//utilisation : <liste-vignette>
avservicesApp.directive('pageVignette', function(){	

return {
   restrict: "E",
   templateUrl: '/avservices/mediagallery/pagevignette.template.html',
   scope : {
   	medias : "=",
   	type : "=",
   	order : "=?",
   	limit : "=?"
   },
   controller: function ($scope){
  	 $scope.order = angular.isDefined($scope.order) ? $scope.order : '';
   }
};
});

//directive permettant d'afficher une liste de vignette
//utilisation : <liste-vignette>
avservicesApp.directive('filterOption', function(){	

return {
restrict: "E",
template: '<button class="ecl-button ecl-button--facet-close ecl-tag__item" type="button" ng-click="removeItem({item:item})">{{displayname}}</button>',
scope : {
	 	removeItem: '&',
	 	item : "=",
	 	displayname : "="
},
link: function (scope, elm, attrs){
//	 $scope.remove = function(item){
//		 $scope.filterlist = $scope.filterlist.filter(function(el) {
//			    return el !== item ;
//		 });
//	 };
}
};
});


