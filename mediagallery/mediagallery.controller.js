
//controller pour aller chercher les video related à un projet
avservicesApp.controller('videosCtrlRelated', ['$scope', 'videosFactory', function ($scope,videosFactory) {
    var params = { 'project': $scope.project,'pagesize': 99, 'index': 1,'kwexcluded':$scope.excluded};
    videosFactory.getVideos(params, function (videoRelated){ $scope.videosRelated = videoRelated});
}]);


// controller pour aller chercher les photos related à un projet
avservicesApp.controller('photosCtrlRelated', ['$scope', 'reportageFactory', function ($scope,reportageFactory) {
    var params = { 'project': $scope.project,  'pagesize': 99, 'index': 1,'kwexcluded':$scope.excluded};
    reportageFactory.getReportage(params,function (photoRelated){$scope.photosRelated = photoRelated});
}]);
