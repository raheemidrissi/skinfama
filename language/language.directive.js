
avservicesApp.directive('languageOverlay', function(){ 
    return {
      restrict: 'E', // only activate on element attribute
      replace: true,
      templateUrl: "./language/language.overlay.html"
    }
});

