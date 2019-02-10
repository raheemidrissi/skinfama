//
//avservicesApp.controller('mediagroupCtrl', ['$scope','$transition$', 'mediagroupFactory', function ($scope,$transition$,mediagroupFactory) {
//    var params = { 'ref': $transition$.params().ref, 'type':'MEDIAGROUP','focus':'N', 'index' : 1, 'pagesize' : 99  };
//    $scope.photos=[];
//
//    mediagroupFactory.getMediagroup(params).then(
//
//		function(MediaGroup){
//			
//			
//			// GALLERY GRID JUSTIFIED
//            setTimeout(function(){
//				$("#mygallery").justifiedGallery({
//				    rowHeight : 200,
//				    lastRow : 'nojustify',
//				    margins : 3
//				}); }, 
//			10);
//
//			$scope.MediaGroup = MediaGroup.mediagroups[0]; // on ne demande qu'un mediagroup
//			$scope.Chapters = (MediaGroup.mediagroups && MediaGroup.mediagroups.length) ? MediaGroup.mediagroups[0].chapters: undefined; 
//
////			setTimeout(function(){
////				ECL.dialogs({
////					dialogWindowId: 'ecl-carousel',
////					dialogOverlayId: 'ecl-carousel__overlay',
////				});
////				ECL.carousels(); }, 
////			10);
//
//        });	
//	}]
//);
//
//
