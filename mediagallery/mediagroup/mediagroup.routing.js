avservicesApp.config( ['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider','envConstants','languageProvider',
					  function($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider,envConstants,languageProvider) { 
	
	$stateProvider
	
    
    .state('language.mediagroup', {
		url:'/album/:ref',
		params: {
			ref: '',
		},
		resolve:{
       		mediagroupDetails: ['$transition$', 'mediagroupFactory', function($transition$, mediagroupFactory) {
				var params = { 'ref': $transition$.params().ref, 'type':'MEDIAGROUP','focus':'N', 'index' : 1, 'pagesize' : 99  };
               return mediagroupFactory.getMediagroup(params);
           }]
         },
         templateProvider: function(mediagroupDetails,$http,$templateCache){
        	//console.log('resolve',mediagroupDetails);
        	var template = 'mediagallery/mediagroup/mediagroup.html';
        	// si 1 seul chapter et que ce chapter ne contient que des photos, alors on prends le template des photos 
        	if (mediagroupDetails.mediagroups && mediagroupDetails.mediagroups.length && mediagroupDetails.mediagroups[0].chapters.length == 1 &&
        			mediagroupDetails.mediagroups[0].chapters[0].nbphoto && 
        			! mediagroupDetails.mediagroups[0].chapters[0].nbaudio && 
        			! mediagroupDetails.mediagroups[0].chapters[0].nbmediagroup && 
        			! mediagroupDetails.mediagroups[0].chapters[0].nbreportage && 
        			! mediagroupDetails.mediagroups[0].chapters[0].nbvideo)
        		 template = 'mediagallery/mediagroup/mediagroupphoto.html';
        	// sinon comme d'hab
        	return $http.get(template, {cache: $templateCache }).then(function(response){return response.data;});
        	}, 
        controller: function($scope,mediagroupDetails){

			$scope.MediaGroup = mediagroupDetails.mediagroups[0]; // on ne demande qu'un mediagroup
//			$scope.Chapters = (mediagroupDetails.mediagroups && mediagroupDetails.mediagroups.length) ? mediagroupDetails.mediagroups[0].chapters: undefined; 

        }
    })

    .state('language.diplomatic', {
		url:'/diplomatic',
		resolve:{
       		mediagroupDetails: ['$transition$', 'mediagroupFactory', function($transition$, mediagroupFactory) {
				var params = { 'ref':'M-002088', 'type':'MEDIAGROUP','focus':'N', 'index' : 1, 'pagesize' : 99  };
               return mediagroupFactory.getMediagroup(params);
           }]
         },
         templateUrl: 'mediagallery/mediagroup/diplomatic.html', 
         controller: function($scope,mediagroupDetails,language){
             
            $scope.ShowLetter = function(letter){
            	if (letter) {
            		$scope.Chapters =  mediagroupDetails.mediagroups[0].chapters[0].medias.filter(function(media){return media.title[language.getUserLanguage().lang.toUpperCase()].substr(0,1) == letter;});
            	}
            	else {
            		$scope.Chapters =  mediagroupDetails.mediagroups[0].chapters[0].medias;
            	}
            };
            $scope.orderByString = 'title.'+language.getUserLanguage().lang.toUpperCase();
            
 			$scope.MediaGroup = mediagroupDetails.mediagroups[0]; // on ne demande qu'un mediagroup
 			$scope.Chapters = mediagroupDetails.mediagroups[0].chapters[0].medias; 

         }
    })

    .state('language.council', {
		url:'/EuropeanCouncils',
		resolve:{
       		mediagroupDetails: ['$transition$', 'mediagroupFactory', function($transition$, mediagroupFactory) {
				var params = { 'ref':'M-002095', 'type':'MEDIAGROUP','focus':'N', 'index' : 1, 'pagesize' : 99  };
               return mediagroupFactory.getMediagroup(params);
           }]
         },
         templateUrl: 'mediagallery/mediagroup/council.html', 
         controller: function($scope,mediagroupDetails,language){
             
            $scope.ShowPeriod = function(first,last){
            	if (first || last) {
            		var completeLast = last ? moment(last+'0101','YYYYMMDD') : moment(last,'YYYYMMDD');
            		var completeFirst = first ? moment(first+'0101','YYYYMMDD') : moment(first,'YYYYMMDD');
            		$scope.Chapters =  mediagroupDetails.mediagroups[0].chapters[0].medias.filter(function(media){
                		var EventDate = moment(media.start_date,'DD/MM/YYYY');
                		if (completeLast.isValid() && completeFirst.isValid()){
                			// on a une date de début et une date de fin
                			return moment.max(EventDate,completeLast) == completeLast && moment.max(EventDate,completeFirst) == EventDate;
                		}
                		else if (completeLast.isValid()){
                			// on a juste une date de fin
                			return moment.max(EventDate,completeLast) == completeLast;
                		}
                		else {
                			// on a juste une date de début
                			return moment.max(EventDate,completeFirst) == EventDate;
                		}
            		});
            	}
            	else {
            		// on renvoie tout car on n'a pas de filtre
            		$scope.Chapters =  mediagroupDetails.mediagroups[0].chapters[0].medias;
            	}
            };
            $scope.orderByDate = function(media){
            	var date = new Date(media.start_date);
                return date;
            };  
            
 			$scope.MediaGroup = mediagroupDetails.mediagroups[0]; // on ne demande qu'un mediagroup
 			$scope.Chapters = mediagroupDetails.mediagroups[0].chapters[0].medias; 

         }
    })

    .state('language.former', {
		url:'/FormerCommission',
		resolve:{
       		mediagroupDetails: ['$transition$', 'mediagroupFactory', function($transition$, mediagroupFactory) {
				var params = { 'ref':'M-002094', 'type':'MEDIAGROUP','focus':'N', 'index' : 1, 'pagesize' : 99  };
               return mediagroupFactory.getMediagroup(params);
           }]
         },
         templateUrl: 'mediagallery/mediagroup/former.html', 
         controller: function($scope,mediagroupDetails,language){

             $scope.orderByDate = function(media){
            	var date = new Date(media.start_date);
                return date;
            };  
            
 			$scope.MediaGroup = mediagroupDetails.mediagroups[0]; // on ne demande qu'un mediagroup
 			$scope.Chapters = mediagroupDetails.mediagroups[0].chapters[0].medias; 

         }
    })

    .state('language.mediagroupphoto',{
    	url:'/album/:mgid/:ref',
    	params:{mgid:'',ref:''},
    	resolve:{},
    	controller: function($scope,mediagroupFactory,$transition$){
            var params = { 'ref':$transition$.params().mgid, 'type':'MEDIAGROUP', 'focus':'N', 'index' : 1, 'pagesize' : 99 };

            mediagroupFactory.getMediagroup(params).then(
            	function(result){
            		$scope.mediagroup = result.mediagroups[0];
             		$scope.reportage = result.mediagroups[0].chapters[0].medias;
             		// on calcule la position de l'image dans le tableau
             		var position=0;
             		$scope.reportage.some(function(obj, i) {
             			  return obj.ref === $transition$.params().ref ? index = i : false;
             			});
             		// on initialise le galeria
                    setTimeout(function(){
                        Galleria.loadTheme('js/galleria/themes/twelve/galleria.twelve.js');
                        Galleria.configure({
                            autoplay: false,
                            imageCrop: false,
                            thumbCrop: false
                      	});                              // Initialize Galleria
                        Galleria.run('#galleria', {
                            show: index, //
	                           // extend theme
	                              extend: function() {
	                                  var gallery = this; // "this" is the gallery instance
	
	                                  this.attachKeyboard({
	                                	    left: this.prev, // applies the native prev() function
	                                	    right: this.next,
	                                	    up: function() {
	                                	        // custom up action
	                                	    	event.preventDefault();
	                                	        this.show(0);
	                                	    },
	                                	    down: function(){
	                                	    	event.preventDefault();
	                                	    	this.show(repDetails.length);
	                                	    },
	                                	    13: function() {
	                                	        // enter fullscreen when return (keycode 13) is pressed:
	                                	    	this.toggleFullscreen();
	                                	    },
	                                	    space: function() {
	                                	        // start playing when space is pressed:
	                                	    	event.preventDefault();
	                                	        this.playToggle(3000);
	                                	    },
	                                	    80: function() {
	                                	        // start playing when 'p' (keycode 80) is pressed:
	                                	    	event.preventDefault();
	                                	        this.playToggle(3000);
	                                	    },
	                                	    88: function() {
	                                	        // start playing when 'x' (keycode 88) is pressed:
	                                	    	this.exitFullscreen();
	                                	    }
	                                	});	
	                                  }
                        });
                    }, 10);
                    Galleria.on('image', function(e) {
                   	 $scope.photo = $scope.reportage[e.index];
                   	 $scope.$apply();
                  	});
            });
    	},
        templateUrl: 'mediagallery/mediagroup/photo.html',
    })

	.state('language.whoswhos',{
		url:'/whoswho',
        templateUrl: 'mediagallery/mediagroup/mediagroup.html', 
        controller: function($scope,mediagroupFactory) {
            var params = { 'ref':'M-001149', 'type':'MEDIAGROUP', 'focus':'N', 'index' : 1, 'pagesize' : 99 };

            mediagroupFactory.getMediagroup(params).then(
            	function(result){
             		$scope.MediaGroup = result.mediagroups[0];
            });
		}
	})

	.state('language.anniversary',{
		url:'/upcominganniversary/:type?',
    	params:{type:''},
        templateUrl: 'mediagallery/mediagroup/anniversary.html', 
        controller: function($scope,mediagroupFactory,$transition$) {
            var params = { 'ref':'M-002097', 'type':'MEDIAGROUP', 'focus':'N'};
            
            mediagroupFactory.getMediagroup(params).then(
            	function(result){
            		// on veut le calendar par mois
            		if ($transition$.params().type && $transition$.params().type == 'month'){
	                    var calendar = [];
	                    // on fabrique la liste avec les mois de l'année
	                    for (var i=0;i<12;i++){
	                    	var thisMonth = {month:{id:i,display:moment().month(i).format('MMMM')},anniversary:[]};
	                    	for (var j =0;j<result.mediagroups[0].chapters[0].medias.length;j++){
	//                    		console.log('month',i,moment(result.mediagroups[0].chapters[0].medias[j].start_date).format("YYYYMMDD"),moment(result.mediagroups[0].chapters[0].medias[j].start_date).month());
	                    		if (moment(result.mediagroups[0].chapters[0].medias[j].start_date, "YYYYMMDD").month() == i){
	                    			thisMonth.anniversary.push(result.mediagroups[0].chapters[0].medias[j]);
	                    		}
	                    	}
	                    	calendar.push(thisMonth);
	                    }
            		}
            		else {
	                    var calendar = [];

                    	for (var j =0;j<result.mediagroups[0].chapters[0].medias.length;j++){
                    		var thisYear = moment(result.mediagroups[0].chapters[0].medias[j].start_date, "DD/MM/YYYY").year();
                    		
                    		// si l'année est déjà présente dans le calendrier
                    		if ( calendar.filter(function(year){return year.month.id==thisYear;}).length > 0){
                    			calendar.filter(function(year){return year.month.id==thisYear;})[0].anniversary.push(result.mediagroups[0].chapters[0].medias[j]);
                    		}
                    		else {
                    			calendar.push({month:{id:thisYear,display:thisYear},anniversary:[result.mediagroups[0].chapters[0].medias[j]]});
                    		}
                    	}
            		}
             		$scope.MediaGroup = result.mediagroups[0];
             		$scope.MediaGroup.calendar = calendar;
            });
		}
	})

	.state('language.commission',{
		url:'/commission',
		//list-2col.template.html
        templateUrl: 'mediagallery/mediagroup/list-2col.template.html', 
        controller: function($scope,mediagroupFactory) {
            var params = {  'index' : 1,'pagesize': 35,'ref':'M-001865', 'parent.fl':'*'};
            mediagroupFactory.getMediagroup(params).then(
            	function(result){
             		$scope.MediaGroup = result.mediagroups[0];
            });
		}
	})

}]);
