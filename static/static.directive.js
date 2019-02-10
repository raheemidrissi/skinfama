//directive permettant d'afficher et mettre les ancres sur les inpage navigation
//utilisation : <inpage-navigation chapter="M-000000">
avservicesApp.directive('inpageNavigation', function(){	

return {
   restrict: "E",
   templateUrl: './static/inpage.navigation.template.html',
   scope : {
  	 chapter : "=",
   },
   link: function (scope, element, attrs){
   }
};
});
