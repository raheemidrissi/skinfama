avservicesApp.config( [ '$translateProvider', '$locationProvider','envConstants','languageProvider',
					  function( $translateProvider, $locationProvider,envConstants,languageProvider) { 
        
        // use the HTML5 History API
        $locationProvider.html5Mode(true);

        // Securité contre les attaques XSS
        $translateProvider.useSanitizeValueStrategy('escapeParameters');
        $translateProvider
        .fallbackLanguage(['en', 'fr'])
		.registerAvailableLanguageKeys(['en','fr', 'de'], {
			'en_*': 'en',
			'fr_*': 'fr',
		    'de_*': 'de'
		  })
		.useLocalStorage()
        .preferredLanguage('en');
        // Système de routage
		var lang='en';

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });
        $translateProvider
        .fallbackLanguage('en')
        .preferredLanguage('en');

         }]);

