avservicesApp.controller('homeCtrl', ['$scope','videosFactory','reportageFactory','mediagroupFactory','focusFactory','scheduleFactory','envConstants','$sce', function($scope,videosFactory,reportageFactory,mediagroupFactory,focusFactory,scheduleFactory,envConstants,$sce) {
	var params ={};
	$scope.nextSchedule = scheduleFactory.calculCurrentNextOnProg(undefined,1);
	$scope.nextScheduleplus = scheduleFactory.calculCurrentNextOnProg(undefined,2);

	// pour les videos clip
	params = {  'pagesize': 3, 'index': 1, 'genrethes': envConstants.categories.filter(function( obj ) {
		  return obj.id == 'Clip';
	})[0].Genrethes};
    videosFactory.getVideos(params).then(function(result){$scope.videosClip=result});

    // pour les videos stockshot
    params = {  'pagesize': 3, 'index': 1, 'genrethes': envConstants.categories.filter(function( obj ) {
		  return obj.id == 'Stockshot';
	})[0].Genrethes};
    videosFactory.getVideos(params).then(function(result){$scope.videosStockshot=result;});

    //pour les photos News
    params = {  'pagesize': 3, 'index': 1, 'genrethes': envConstants.categories.filter(function( obj ) {
		  return obj.id == 'Photonews';
	})[0].Genrethes};
    reportageFactory.getReportage(params).then(function(result){$scope.photosNews=result});
    
    //pour les photos illustrations/creative
    params = {  'pagesize': 3, 'index': 1, 'genrethes': envConstants.categories.filter(function( obj ) {
		  return obj.id == 'Illustration';
	})[0].Genrethes};
    reportageFactory.getReportage(params).then(function(result){$scope.photosIllustration=result});

//    // pour le whoswho
//    params = {  'index' : 1,'pagesize': 35, 'ref':'M-001349'};
//    mediagroupFactory.getMediagroup(params).then(function(result){$scope.whoswhos=result.mediagroups[0].chapters[0].medias;});

    // pour les hightlight
	focusFactory.getTopFocus().then(function(addItems){
		$scope.featuredtop = angular.copy(addItems.mediagroups[0].chapters[0].medias);
	});

	$scope.$watchCollection(function(){return scheduleFactory.getCurrentEbS()},function(newValue,oldValue){
//		console.log('watch ebs',newValue, oldValue);
		if (newValue && (newValue.summary || newValue.warning) && (newValue.summary.length>0 || newValue.warning.length>0))
			$scope.nextSchedule=scheduleFactory.calculCurrentNextOnProg(newValue,$scope.liveChannel);
			if ($scope.nextSchedule && $scope.liveChannel == 1){
				$scope.$broadcast('avportalVideo.loadLanguage',($scope.nextSchedule.onAir.seq.lang == '|' || $scope.nextSchedule.onAir.seq.lang == '') ? $scope.nextSchedule.onAir.prog.lang : $scope.nextSchedule.onAir.seq.lang);
				$scope.$broadcast('avportalVideo.loadInfo',{title:{'EN':$scope.nextSchedule.onAir.seq.titrepanel},summary:$scope.nextSchedule.onAir.seq.title});
			}
		}
	);
	$scope.$watchCollection(function(){return scheduleFactory.getCurrentEbSplus()},function(newValue,oldValue){
//		console.log('watch ebs plus',newValue, oldValue);
		if (newValue && (newValue.summary || newValue.warning) && (newValue.summary.length>0 || newValue.warning.length>0) )
			$scope.nextScheduleplus=scheduleFactory.calculCurrentNextOnProg(newValue,$scope.liveChannel);
		if ($scope.nextScheduleplus && $scope.liveChannel == 2){
			$scope.$broadcast('avportalVideo.loadLanguage',($scope.nextScheduleplus.onAir.seq.lang == '|' || $scope.nextScheduleplus.onAir.seq.lang == '') ? $scope.nextScheduleplus.onAir.prog.lang : $scope.nextScheduleplus.onAir.seq.lang);
			$scope.$broadcast('avportalVideo.loadInfo',{title:{'EN':$scope.nextScheduleplus.onAir.seq.titrepanel},summary:$scope.nextScheduleplus.onAir.seq.title});
		}
	});
//	$scope.$watch($scope.nextSchedule.onAir.seq.lang,$scope.$broadcast('avportalVideo.loadLanguage',nextSchedule.onAir.seq.lang));
//
	$scope.liveChannel = 1;
	$scope.$on('avportalVideo.changeChannel', function(event,channelID){
//		console.log('home chg channel',channelID);
		$scope.liveChannel = channelID.channel;
		$scope.$apply();
		// quand on change de channel, alors on doit envoyer les nouveaux languages et les infos du programme courant
		if ($scope.liveChannel == 1){
			$scope.$broadcast('avportalVideo.loadLanguage',($scope.nextSchedule.onAir.seq.lang == '|' || $scope.nextSchedule.onAir.seq.lang == '') ? $scope.nextSchedule.onAir.prog.lang : $scope.nextSchedule.onAir.seq.lang);
			$scope.$broadcast('avportalVideo.loadInfo',{title:{'EN':$scope.nextSchedule.onAir.seq.titrepanel},summary:$scope.nextSchedule.onAir.seq.title});
		}
		else {
			$scope.$broadcast('avportalVideo.loadLanguage',($scope.nextSchedule.onAir.seq.lang == '|' || $scope.nextSchedule.onAir.seq.lang == '') ? $scope.nextSchedule.onAir.prog.lang : $scope.nextSchedule.onAir.seq.lang);
			$scope.$broadcast('avportalVideo.loadInfo',{title:{'EN':$scope.nextScheduleplus.onAir.seq.titrepanel},summary:$scope.nextScheduleplus.onAir.seq.title});			
		}
		$scope.$apply();
	})
}]);
