//directive permettant d'afficher le player pour un chapter de mediagroup
// utilisation : <photo photoObj="">
avservicesApp.directive('photo', function(){	

    return {
        restrict: "E",
        templateUrl: '/avservices/mediagallery/photo/photo.template.html',
        scope : {
        	photoObj : "=photo",
        },
        link: function (scope, element, attrs){
        	// rien de special pour la photo
        }
    };
});


// directive permettant d'afficher les boutons de social sharing
avservicesApp.directive('share', function(){    

    return {
        restrict: "E",
        templateUrl: '/avservices/home/share.html'
    };
});


avservicesApp.directive('carouselOverlay', function(){ 
	//initialisation : 
	// ....
	
	// Definition object
	return {
		restrict: 'E', // only activate on element attribute
		replace: true,
		transclude:false,
 		scope: {
 			items : "=",
 		},
 		templateUrl: "./mediagallery/photo/carousel.overlay.html",
 		link: {
 		      // Pre-link function
 		      pre: function (scope, element, attrs)
 		      {
 		        // ...
 		      },
 		      // Post-link function
 		      post: function(scope,element, attributes){
 		      }
 		}
	}
});


avservicesApp.directive('galleryOpenCarousel', function(){ 
	//initialisation : 
	// ....
	
	// Definition object
	return {
		restrict: 'E', // only activate on element attribute
		replace: true,
		transclude:true,
 		scope: {
 			items : "=",
 			mediatype : "=?",
 			mgid : "=?"
 		},
 		templateUrl: "./mediagallery/photo/galery.carousel.html",
 		link: {
 		      // Pre-link function
 		      pre: function (scope, element, attrs)
 		      {
 		        // ...
 		      },
 		      // Post-link function
 		      post: function(scope,element, attributes){
	 		      }
 		      
 		}
	}
});

//directive permettant d'afficher les boutons de social sharing
avservicesApp.directive('downloadPhoto', ['authManager',function(authManager){	

    return {
        restrict: "E",
        replace:true,
        transclude: false,
        templateUrl: './mediagallery/photo/download.template.html',
        scope : {
    	 	photoList: '=photos'
    },
    link: function (scope, elm, attrs){
    	scope.download = (scope.photoList) ? scope.photoList.image: '';
    	scope.isAuthenticated = false;
    	scope.$watch(authManager.isAuthenticated,function(){scope.isAuthenticated = authManager.isAuthenticated();});
//    	scope.download = {HDMP4:[],LR:[],MP3:[],VTT:[]};
//    	scope.download.HDMP4 = scope.videoList.filter(function(el) {
//		    return (el.HDMP4 != undefined)
//		 	});
//
//    	scope.download.LR =  scope.videoList.filter(function(el) {
//		    return (el.LR != undefined)
//		 	});
//
//    	scope.download.MP3 =  scope.videoList.filter(function(el) {
//		    return (el.MP3 != undefined)
//		 	});
//
//    	scope.download.VTT =  scope.videoList.filter(function(el) {
//		    return (el.VTT != undefined)
//		 	});

    }
    };
}]);

(function() {
    "use strict";

    angular.module('avservicesApp').directive('ngLaunchMasonry', function($timeout) {
        return function(scope, element, attrs) {

            if (scope.$last){
              setTimeout(function(){
				$("#mygallery").justifiedGallery({
				    rowHeight : 200,
				    lastRow : 'nojustify',
				    margins : 3
				}); 
                });
            }
        };
    })
})();
