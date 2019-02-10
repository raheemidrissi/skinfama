avservicesApp.factory('staticFactory', function ($http, envConstants,mediagroupFactory) {
	return {
		getStatic: function (source) {
			var sources = {'about':'M-002185','assistance':'M-001925','aboutebs':'M-002089','copyright':'M-002093','contact':'M-002091','faq':'M-002092'};
			var params = {ref:sources[source]};
			return mediagroupFactory.getMediagroup(params).then(function(response){return response.mediagroups[0]});
		}
	}
});
