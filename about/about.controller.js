// 
avservicesApp.controller('statisticCtrl', ['$scope','statisticFactory', function ($scope,statisticFactory) {
 
	// https://webanalytics.ec.europa.eu/index.php?module=CoreHome&action=index&idSite=27&period=week&date=today#?module=Dashboard&action=embeddedIndex&idSite=27&period=week&date=today&idDashboard=1
	//https://webanalytics.ec.europa.eu/?module=API&method=API.getBulkRequest&format=json&urls[0]=method%3dVisitsSummary.get%26idSite%3d3%26date%3d2012-03-06%26period%3dday&urls[1]=method%3dVisitorInterest.getNumberOfVisitsPerVisitDuration%26idSite%3d3%26date%3d2012-03-06%26period%3dday
    var params = {'method':'API.getBulkRequest',
	                 'urls[0]':"idSite%3d27%26period%3dweek%26date%3dlast2%26segment%3dpageUrl%3D%40http%253A%252F%252Fec.europa.eu%252Favservices%252Febs%252Fliveold.cfm%26method%3dVisitsSummary.get",   // statistiques sur la page web old player EBS
					 'urls[1]':"idSite%3d27%26period%3dweek%26date%3dlast2%26segment%3dpageUrl%3D%40http%253A%252F%252Fec.europa.eu%252Favservices%252Febs%252Fliveold.cfm%3Fpage%3D2%26sitelang%3Den%26method%3dVisitsSummary.get", // statistiques sur la page web old player EBS+
					 'urls[2]':"idSite%3d27%26period%3dmonth%26date%3dtoday%26filter_limit%3D5%26flat%3D1%26method%3dActions.getPageUrls",			// top 5 globale
					 'urls[3]':"idSite%3d27%26period%3dmonth%26date%3dtoday%26filter_limit%3D5%26flat%3D1%26method%3dReferrers.getAll",				// Referrer top5
					 'urls[4]':"idSite%3d27%26period%3dmonth%26date%3dtoday%26filter_limit%3D5%26flat%3D1%26method%3dActions.getOutlinks",				// Outbound ? top5
					 'urls[5]':"idSite%3d27%26period%3dmonth%26date%3dtoday%26segment%3dpageUrl%3D%40http%253A%252F%252Fec.europa.eu%252Favservices%252Fvideo%252Fplayer.cfm%26filter_limit%3D10%26flat%3D1%26method%3dVisitorInterest.getNumberOfVisitsPerVisitDuration"	// nombre de visite par duration sur http://ec.europa.eu/video/player.cfm
		             ,'urls[6]':"idSite%3d27%26period%3dmonth%26date%3d2017-09-01%26segment%3dpageUrl%3D%40I1436100%26method%3dVisitsSummary.get",   // statistiques video 143100
					};
//    $scope.params = {'idSite': 27, 'period': 'day', 'date': 'today','segment':'pageUrl%3D%40http%253A%252F%252Fec.europa.eu%252Favservices%252Febs%252Fliveold.cfm','method':'VisitsSummary.get'};
    statisticFactory.getStatistics(params).then(function(stat){$scope.stats = stat;});             
 
}]);

