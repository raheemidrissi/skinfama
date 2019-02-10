//directive permettant d'afficher le player pour un chapter de mediagroup
// utilisation : <player title="" medias="" summary="" pos="">
avservicesApp.directive('player', function(){	

    return {
        restrict: "E",
        templateUrl: 'mediagallery/mediagroup/player.template.html',
        scope : {
        	pos : "=",
        	medias : "="
        },
        controller: function ($scope){
        	$scope.pos = parseInt($scope.pos);
           	 
           	 //function to display previous media
           	 $scope.previous = function(pos){
           		 var iPosmoins = parseInt(pos)-1;
           		 if(iPosmoins >= 0)
           			 goto(iPosmoins);
//           		 else
//           			 goto(0);
           	 }
           	 
           	 // function to display next media
           	 $scope.next = function(pos){
           		 var iPosplus = parseInt(pos)+1;
           		 if (iPosplus < $scope.medias.length)
           			 goto(iPosplus);
//           		 else
//           			 goto(medias.length)
           	 }
           	 
           	 //function to display first media of the array
           	 $scope.first = function(pos){
           		 goto(0);
           	 }
           	 
           	 //function to display last medias of the array
           	 $scope.last = function(pos){
           		 goto($scope.medias.length-1)
           	 }
           	 
           	 // internal function to display a special position of the array
           	 function goto(pos){
           		 $scope.pos = pos;
           	 }
        }
    };
});

