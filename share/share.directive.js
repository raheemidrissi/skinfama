avservicesApp.directive('shareNetwork', ['$location','utilsFactory','$compile', function(location,utilsFactory,$compile){

 return {
     restrict: "EA",        
     replace: true,
     transclude:true,
     templateUrl: './share/share.template.html',
     scope :{
    	 size : '='
     },
     link: function(scope, elem, attrs){
//    	 var tinyUrl = utilsFactory.tinify(location.absUrl()).then(function(tiny){scope.socialshareUrl = tinyUrl;});
    	 var tinyUrl = location.absUrl();
//    	 scope.socialshareUrl = tinyUrl;
//    	 scope.socialshareUrl = 'http://toto.com';
     }
 };
}]);