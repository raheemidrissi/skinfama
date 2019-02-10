/*****************************/
/***  EbS (schedule + live ***/
/*****************************/

avservicesApp.controller('ebsLiveCtrl', ['$scope','$transition$','$sce','$state','scheduleFactory','envConstants', function ($scope,$transition$,$sce,$state,scheduleFactory,envConstants) {

	$scope.channel= $transition$.params().channel;
	$scope.autostart= $transition$.params().autostart;
	$scope.mute= $transition$.params().mute || true;
	$scope.cloud= $transition$.params().cloud || 'false';
	$scope.liveDesc = 'toto';
	$scope.UrlChannel = $sce.trustAsResourceUrl(envConstants.UrlChannel + 'channel=' + $scope.channel + '&videolang=en&autostart=true');

	$scope.change = function(){
		$state.go('.',{'channel':($scope.channel==1?2:1)});
	}
	
	$scope.$watchCollection(function(){return scheduleFactory.getCurrentEbS()},function(newValue,oldValue){
		if (newValue && newValue.summary && newValue.summary.length>0)
			$scope.liveDesc=scheduleFactory.calculCurrentNextOnProg(newValue,$scope.channel);
		}
	);
	
	$scope.$on('avportalVideo.changeChannel', function(event,channelID){
		$scope.channel = channelID.channel;
		// quand on change de channel, alors on doit envoyer les nouveaux languages et les infos du programme courant
//		if ($scope.channel == 1){
//			$scope.$broadcast('avportalVideo.loadLanguage',($scope.nextSchedule.onAir.seq.lang == '|' || $scope.nextSchedule.onAir.seq.lang == '') ? $scope.nextSchedule.onAir.prog.lang : $scope.nextSchedule.onAir.seq.lang);
//			$scope.$broadcast('avportalVideo.loadInfo',{title:{'EN':$scope.nextSchedule.onAir.seq.titrepanel},summary:$scope.nextSchedule.onAir.seq.title});
//		}
//		else {
//			$scope.$broadcast('avportalVideo.loadLanguage',($scope.nextSchedule.onAir.seq.lang == '|' || $scope.nextSchedule.onAir.seq.lang == '') ? $scope.nextSchedule.onAir.prog.lang : $scope.nextSchedule.onAir.seq.lang);
//			$scope.$broadcast('avportalVideo.loadInfo',{title:{'EN':$scope.nextScheduleplus.onAir.seq.titrepanel},summary:$scope.nextScheduleplus.onAir.seq.title});			
//		}
		$state.go('.',{channel:$scope.channel});
		$scope.$apply();
	})
	
	
    this.uiOnParamsChanged = function(newParams) {
    	if ("channel" in newParams){
			$scope.channel = newParams.channel;
    	}
    	if ("cloud" in newParams){
			$scope.cloud = newParams.cloud;
    	}
    	if ("autostart" in newParams){
			$scope.autostart = newParams.autostart;
    	}
    	$scope.UrlChannel = $sce.trustAsResourceUrl(envConstants.UrlChannel + "channel=" + $scope.channel+'&videolang='+$scope.selectedLanguage+'&autostart=true');
      }


}]);

avservicesApp.controller('ebsCtrl', ['$sce','$scope','$transition$','scheduleFactory','$state','envConstants', function ($sce,$scope,$transition$,scheduleFactory,$state,envConstants) {

	var fnSearch = function(){
		scheduleFactory.getChannel($scope.search).then(function(result){$scope.channelDetails = getCurrentData(result);})
	};

	var unregister; // le $watch va renvoyer la fonction a appeler pour se désinscrire. on la stockera dans cette variable

	// changement de date 
	// si on doit lancer une recherche avancée : on aura le flag search
	$scope.change = function(item){
		if (!item.search){
			// on change pour un autre date
			for(i=0;i<$scope.days.length;i++){
				$scope.days[i].selected = false;
			}
			item.selected = true;
			$state.go('.',{'datefrom':item.url});
		}
		else{
			// on a cliqué sur une date trop loin (ou sur le bouton recherche plus loin), on va donc sur la recherche avancée
			$state.go('language.search',{'mediatype':'VIDEO','categories':'VideoNews'})
		}
			angular.element(function(){
			  $('.owl-carousel').trigger('to.owl.carousel', [7+StartDay+item.i, 100]);
		});
	}
	
	function getCurrentData(result) {
		if ($scope.search.date != moment().format('YYYYMMDD')){
//			console.log('static');
			return function(){return result};
		}
		else if ($scope.search.channel == 1){
//			console.log('dynamic 1');
			return scheduleFactory.getCurrentEbS;
		}
		else {
//			console.log('dynamic 2');
			return scheduleFactory.getCurrentEbSplus;
		}
	}
	
	$scope.listInstitution = envConstants.institution; 

	$scope.reset = function() {	
		// initialisation de la recherche     		
	    $scope.search = {channel : $transition$.params().channel, date:$transition$.params().datefrom, daterss:moment($transition$.params().datefrom,'YYYYMMDD').format('MM/DD/YYYY'), institution:$transition$.params().institution||''};
	    // channel (mandatory, not null, default 1 | date (datefrom) | institution
		
		$scope.showIframe = false;
		$scope.toggleIframe = function (showhide){
			$scope.$broadcast('avportalVideo.play',{channel:$scope.search.channel});
		}

		fnSearch();
	}
	$scope.reset();
	$scope.filterOn = moment().format('YYYYMMDD') == $scope.search.date;

// filtre sur les prog finis
	$scope.PassedProg = function(prog){
		if ($scope.filterOn){
			var startTime = moment(prog.hour,'HH:mm:ss');
			var currentDuration = moment.duration(prog.duration) || undefined;
			var endTime   = startTime.add(currentDuration);
//			console.log('start',startTime,'duration',currentDuration,'end',endTime);
	
			//TODO: affiner le business : synchro avec scheduler pour savoir si on maintient la règle business sur la duration a null
			if (! moment.isDuration(currentDuration)  || prog.seq.length == 0 ){
//				console.log('pas de durée');
				return true;   // on n'a pas de durée, on est en plein live, on montre le programme
			}
			else {
				// est-ce que la dernière sequence à un durée et un starttime ? 
//				console.log(prog.seq);
				if (prog.seq[prog.seq.length-1].duration && prog.seq[prog.seq.length-1].hour){
					if (moment.max(moment(),moment(prog.hour,'HH:mm:ss').add(moment.duration(prog.duration))).format('YYYYMMDD HH:mm:ss') == moment().format('YYYYMMDD HH:mm:ss')){
						//					console.log('avant');
						return false; // l'heure du programme est avant l'heure courante (plus petite), on masque
					}
					else
						return true;
				}
				else{
//					console.log('après');
					return true;
				}
			}
		}
		else
			return true;
	}
	
	var currentDate = moment();
	var StartDay 	= currentDate.isoWeekday();
	var firstDay 	= currentDate.clone().add(-6-StartDay, 'days');
	var lastDay 	= currentDate.clone().add(14-StartDay, 'days');
	var paramDay 	= moment($transition$.params().datefrom,"YYYYMMDD");
	var weekStart 	= currentDate.clone().startOf('isoWeek');
	$scope.days 	= [];
	$scope.initDay 	= 0;

	// on montre la semaine courante et la semaine d'après
	// on ajoute le lien vers la recherche avancée
	$scope.days.push({'display':'go to search',i:-6-StartDay-1,'url':'','selected':false,'search':true})
	for (var i = -6-StartDay; i <= (14-StartDay); i++) {
		var nextDay = currentDate.clone().add(i, 'days');
		$scope.days.push(
				  {'display':nextDay.calendar(),i:i,
						  'url':nextDay.format("YYYYMMDD"),
						  'selected':nextDay.format("YYYYMMDD")==moment($transition$.params().datefrom,"YYYYMMDD").format("YYYYMMDD")});
		if (nextDay.format("YYYYMMDD")==moment($transition$.params().datefrom,"YYYYMMDD").format("YYYYMMDD"))
			$scope.initDay = i;
		}
	// on ajoute le lien vers la recherche avancée
	$scope.days.push({'display':'go to search',i:14-StartDay+1,'url':'','selected':false,'search':true})
	
	// si la date est trop tard, on redirige vers TODAY
	if (moment.min(lastDay,paramDay) == lastDay){
//		console.log('trop tard');
		$scope.change($scope.days[0]);
	}
	//si la date est trop tot, on redirige vers la recherche
	if (moment.min(firstDay, paramDay) == paramDay){
//		console.log('trop tot');
		//$state.go('language.search',{'mediatype':'VIDEO','categories':'VideoNews','sort':'date','direction':'asc','datefrom':$transition$.params().datefrom});
	}
	


	// on va rechercher le programme à une heure donnée et on va dessus
	$scope.goto = function(hour){
		var currProg = scheduleFactory.getCurrentProg($scope.channelDetails,hour);
		console.log('currProg',currProg);
		$("html, body").animate({ scrollTop: $('.avs-panel-heading[rel="'+currProg.hour+'"]').offset().top }, 500); 
	}

        	
	 // on relance la recherche si on entre une institution       	
   	$scope.$watch('search.institution',function(newValue, oldValue){
   		//console.log('newValue',newValue,'oldValue',oldValue);
   		if(newValue != undefined){
			$state.go('.',{'institution':newValue});
   		}
   	})
 // on relance la recherche si on entre une institution       	
   	$scope.$watch('search.channel',function(newValue, oldValue){
   		//console.log('newValue',newValue,'oldValue',oldValue);
   		if(newValue != undefined){
   			$scope.$broadcast('changeChannel',{'channel':newValue});
			$state.go('.',{'channel':newValue});
   		}
   	})
// on relance la recherche si on filtre par un terme
   	$scope.$watch('search.kwor',function(newValue, oldValue){
   		if(newValue != undefined){
   			fnSearch();
   		}	
   	})
// dynamic parameter in location bar
    this.uiOnParamsChanged = function(newParams) {
    	if ("institution" in newParams)
   			$scope.search.institution = newParams.institution;
    	if ("datefrom" in newParams)
   			$scope.search.date = newParams.datefrom;
    	if ("channel" in newParams)
   			$scope.search.channel = newParams.channel;
    	$scope.filterOn = moment().format('YYYYMMDD') == $scope.search.date;
    	fnSearch();
      }

// on fait tourner le carousel sur le jour qu'on a passé en paramètre
   	angular.element(function(){
   		$('.owl-carousel').trigger('to.owl.carousel', [6+StartDay+1, 100]);
	});
}]);

avservicesApp.controller('ebsbothCtrl', ['$scope','$transition$','scheduleFactory','$state', '$location', '$anchorScroll', function ($scope,$transition$,scheduleFactory,$state, $location, $anchorScroll) {
	$scope.search = {channel : undefined, date:$transition$.params().datefrom};
	$scope.channel = [{},{}];

	var currentDate = moment();
	var StartDay = currentDate.isoWeekday();
	var firstDay = currentDate.clone().add(-6-StartDay, 'days');
	var lastDay = currentDate.clone().add(14-StartDay, 'days');
	var paramDay = moment($transition$.params().datefrom,"YYYYMMDD");
	var weekStart = currentDate.clone().startOf('isoWeek');
	$scope.days = [];
	$scope.initDay = 0;

	// on montre la semaine courante et la semaine d'après
	// on ajoute le lien vers la recherche avancée
	$scope.days.push({'display':'go to search',i:-6-StartDay-1,'url':'','selected':false,'search':true})
	for (var i = -6-StartDay; i <= (14-StartDay); i++) {
		var nextDay = currentDate.clone().add(i, 'days');
		$scope.days.push(
				  {'display':nextDay.calendar(),i:i,
						  'url':nextDay.format("YYYYMMDD"),
						  'selected':nextDay.format("YYYYMMDD")==moment($transition$.params().datefrom,"YYYYMMDD").format("YYYYMMDD")});
		if (nextDay.format("YYYYMMDD")==moment($transition$.params().datefrom,"YYYYMMDD").format("YYYYMMDD"))
			$scope.initDay = i;
		}
	// on ajoute le lien vers la recherche avancée
	$scope.days.push({'display':'go to search',i:14-StartDay+1,'url':'','selected':false,'search':true})

	
	$scope.scrollTo = function(id) {
	    var old = $location.hash();
	    $location.hash(id);
	    $anchorScroll();
	    //reset to old to keep any additional routing logic from kicking in
	    $location.hash(old);
	};
	// on va rechercher le programme à une heure donnée et on va dessus
	$scope.goto = function(hour){
		var currProg = scheduleFactory.getCurrentProg($scope.channelDetails,hour);
		//console.log('currProg',currProg);
		$("html, body").animate({ scrollTop: $('.avs-panel-heading[rel="'+currProg.hour+'"]').offset().top }, 500); 
	}
	
	function getCurrentData(result,channel) {
		if ($scope.search.date != moment().format('YYYYMMDD')){
//			console.log('static');
			return function(){return result};
		}
		else if (channel == 1){
//			console.log('dynamic 1');
			return scheduleFactory.getCurrentEbS;
		}
		else {
//			console.log('dynamic 2');
			return scheduleFactory.getCurrentEbSplus;
		}
	}
	
	$scope.channel[0].filterOn = moment().format('YYYYMMDD') == $scope.search.date;
	$scope.channel[1].filterOn = moment().format('YYYYMMDD') == $scope.search.date;

	// filtre sur les prog finis
		$scope.PassedProg = function(channel){
			return function(prog){
			if ($scope.channel[channel].filterOn){
				var startTime = moment(prog.hour,'HH:mm:ss');
				var currentDuration = moment.duration(prog.duration) || undefined;
				var endTime   = startTime.add(currentDuration);
//				console.log('start',startTime,'duration',currentDuration,'end',endTime);
		
				//TODO: affiner le business : synchro avec scheduler pour savoir si on maintient la règle business sur la duration a null
				if (! moment.isDuration(currentDuration)){
//					console.log('pas de durée');
					return true;   // on n'a pas de durée, on est en plein live, on montre le programme
				}
				else {
					// TODO: il faut ajouter la règle avec si la durée est au delà de maintenant ou pas
					if (moment.max(moment(),moment(prog.hour,'HH:mm:ss').add(moment.duration(prog.duration))).format('YYYYMMDD HH:mm:ss') == moment().format('YYYYMMDD HH:mm:ss')){
//						console.log('avant');
						return false; // l'heure du programme est avant l'heure courante (plus petite), on masque
					}
					else{
//						console.log('après');
						return true;
					}
				}
			}
			else
				return true;
		};
		}

	// changement de date 
	$scope.change = function(item){
		if (!item.search){
			for(i=0;i<$scope.days.length;i++){
				$scope.days[i].selected = false;
			}
			item.selected = true;
			$state.go('.',{'datefrom':item.url});
		}
		else {
			$state.go('language.search',{'mediatype':'VIDEO','categories':'VideoNews'});
		}

			
		angular.element(function(){
			  $('.owl-carousel').trigger('to.owl.carousel', [7+StartDay+item.i, 100]);
		});

	}










        	
        	
    var fnSearch = function(){
		scheduleFactory.getChannel({channel : 1, date:$scope.search.date}).then(function(result){$scope.channel[0].prog = getCurrentData(result,1);$scope.channel[0].channel = 0;})
		scheduleFactory.getChannel({channel : 2, date:$scope.search.date}).then(function(result){$scope.channel[1].prog = getCurrentData(result,2);$scope.channel[1].channel = 1;})
		};
		
	    this.uiOnParamsChanged = function(newParams) {
	    	//console.log('newParams',newParams);
	    	if ("datefrom" in newParams){
    			$scope.search.date = newParams.datefrom;
    			fnSearch();
	    	}
	    	$scope.channel[0].filterOn = moment().format('YYYYMMDD') == $scope.search.date;
	    	$scope.channel[1].filterOn = moment().format('YYYYMMDD') == $scope.search.date;
	      }

// initialisation de la recherche     		
		fnSearch();
		// on fait tourner le carousel sur le jour qu'on a passé en paramètre
	   	angular.element(function(){
	   		$('.owl-carousel').trigger('to.owl.carousel', [6+StartDay+1, 100]);
		});

}]);
