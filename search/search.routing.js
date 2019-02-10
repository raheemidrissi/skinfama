avservicesApp.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider', 'envConstants', 'languageProvider',
    function ($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider, envConstants, languageProvider) {

        $stateProvider
        .state('language.search', {
            url: '/search?:datefrom&:dateto&:topic&:videolang&:personalities&:thesaurus&:kwor&:mediatype&:project&:categories&:page&:location&:sort&:direction',
            params:{
            	page:{dynamic: true},
            	categories:{dynamic: true,array:true},
            	project:{dynamic: true},
            	mediatype:{dynamic: true,array:false},
            	kwor:{dynamic: true},
            	personalities:{dynamic: true,array:true},
            	thesaurus:{dynamic: true,array:true},
            	location:{dynamic: true,array:true},
            	topic:{dynamic: true,array:true},
            	videolang:{dynamic: true,array:true},
            	datefrom:{dynamic: true},
            	dateto:{dynamic: true},
            	sort:{dynamic:true},
            	direction:{dynamic:true}
               },
            templateUrl: 'search/search.html',
            controller: 'searchCtrl'
        })

            //////////////////////////////////////////////////////
            // les pages par liste nommée (stockshot, clip,...) //
            //////////////////////////////////////////////////////
//video
            .state('language.videonews', {
                url: '/search/video/news',
                templateUrl: 'search/search.html',
                controller: function($state) {
        			$state.go('language.search',{'mediatype':'VIDEO','categories':'VideoNews'});
        		}
            })
            .state('language.stockshot', {
                url: '/search/video/stockshot',
                templateUrl: 'search/search.html',
                controller: function($state) {
        			$state.go('language.search',{'mediatype':'VIDEO','categories':'Stockshot'});
        		}
            })
            .state('language.clip', {
                url: '/search/video/clip',
                templateUrl: 'search/search.html',
                controller: function($state) {
        			$state.go('language.search',{'mediatype':'VIDEO','categories':'Clip'});
        		}
            })
//photo
            .state('language.photonews', {
        		url: '/search/photo/news',
        		templateUrl: 'search/search.html',
                controller: function($state) {
        			$state.go('language.search',{'mediatype':'PHOTO','categories':'Photonews'});
        		}
        	})
            .state('language.illustration', {
        		url: '/search/photo/illustration',
        		templateUrl: 'search/search.html',
                controller: function($state) {
        			$state.go('language.search',{'mediatype':'PHOTO','categories':'Illustration'});
        		}
        	})
//audio
        	.state('language.audionews', {
        		url: '/search/audio/news',
        		templateUrl: 'search/search.html',
                controller: function($state) {
        			$state.go('language.search',{'mediatype':'AUDIO','categories':'AudioNews'});
        		}
        	})


}]);
