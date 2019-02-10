// directive permettant d'afficher les boutons de social sharing
avservicesApp.directive('share', function(){	

    return {
        restrict: "E",
        templateUrl: '/avservices/home/share.html'
    };
});



//directive permettant d'afficher les boutons de social sharing
avservicesApp.directive('downloadVideo', ['authManager',function(authManager){	
    return {
        restrict: "E",
        replace:true,
        transclude: true,
        templateUrl: './mediagallery/video/download.template.html',
        scope : {
    	 	videoList: '=videos'
    },
    link: function (scope, elm, attrs){
    	scope.isAuthenticated = false;
    	scope.$watch(authManager.isAuthenticated,function(){scope.isAuthenticated = authManager.isAuthenticated();});
    	
    	
    	scope.download = {HDMP4:[],LR:[],MP3:[],VTT:[]};
    	scope.download.HDMP4 = scope.videoList.filter(function(el) {
		    return (el.HDMP4 != undefined)
		 	});

    	scope.download.LR =  scope.videoList.filter(function(el) {
		    return (el.LR != undefined)
		 	});

    	scope.download.MP3 =  scope.videoList.filter(function(el) {
		    return (el.MP3 != undefined)
		 	});

    	scope.download.VTT =  scope.videoList.filter(function(el) {
		    return (el.VTT != undefined)
		 	});

	    angular.element(function(){
	    	ECL.initExpandables('.ecl-expandable__button');
	    });

    }
    };
}]);

