avservicesApp
		.factory(
				'focusFactory',
				[
						"$http",
						"envConstants",
						"utilsFactory",
						"mediagroupFactory",
						function($http, envConstants, utilsFactory,mediagroupFactory) {

							return {
								getTopFocus : function (){
									return mediagroupFactory.getMediagroup({ref:envConstants.featuredtop});
								},
									
								getFocusList : function(params) {
									params.focus = 'Y';
									return mediagroupFactory.getMediagroup(params);
								},
								getFocusById : function(params) {
									params.focus = 'Y';
									return mediagroupFactory.getMediagroup(params);
								}
							};
						} ]);
