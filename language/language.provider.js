
(function() {
	'use strict';
	
	angular.module('avservicesApp').provider('language', LanguageProvider);

	function LanguageProvider(envConstants) {
		this.$get = LanguageInitializer;
		
		function LanguageInitializer() {
			return {
				userLanguage : envConstants.languages.filter(function(el) {return (el.isActive == true)})[0],
				setUserLanguage: function(lang) {
//					console.log(lang);
					this.userLanguage = envConstants.languages.filter(function(el) {return (el.lang == lang)})[0];
//					console.log(this.userLanguage);
				},
				getUserLanguage: function() {
					return this.userLanguage;
				}
			}; 
		};
	}
	
	LanguageProvider.$inject = ['envConstants'];
})();