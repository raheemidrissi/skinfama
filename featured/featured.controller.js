/*******************************/
/*** Focus *********************/
/*******************************/

avservicesApp.controller('focusSliderCtrl', ['$scope','focusFactory','envConstants','$transition$','$state', function ($scope,focusFactory,envConstants,$transition$,$state) {

	$scope.search= {keywords:'',published_before:'',published_after:''};
	// récuparation de ce qu'il y a dans l'url
	$scope.search = {};
	$scope.search.index = $transition$.params().page;
	$scope.search.keywords = $transition$.params().keywords || '';
//	$scope.search.published_before = uibDateParser.parse($transition$.params().datefrom,'yyyyMMdd') || '';
	if($transition$.params().datefrom)
		$scope.search.published_before = moment($transition$.params().datefrom,'YYYYMMDD').format('DD/MM/YYYY');
//	$scope.search.published_after = uibDateParser.parse($transition$.params().dateto,'yyyyMMdd') || '';
	if($transition$.params().dateto)
		$scope.search.published_after = moment($transition$.params().dateto,'YYYYMMDD').format('DD/MM/YYYY');

	var params = {'pagesize':10, 'index' : 1}; // les autres paramètres sont globaux et donc dans le factory
    $scope.pagesize = 10;

	// first execution de la recherche
	$scope.totalFocus = 0;
	
	// fonction qui sert pour le chargement lors du changement de page (pagination)
	$scope.loadPage = function(pagenum){
//		console.log(pagenum);
		var index = (params.pagesize * (pagenum - 1)) + params.index ;
//		console.log(index);
		
		focusFactory.getFocusList({pagesize:params.pagesize,index:index}).then(function(addItems){
			$scope.focusList = addItems.mediagroups; 
		});
		$state.go('.', {page: pagenum});
	}
	
	$scope.reset = fnReset;
	
	function fnReset(){
		$scope.search.keywords = '';
		$scope.search.published_before = '';
		$scope.search.published_after = '';
		params = {'pagesize':10, 'index' : 1};
		internalSearch(1);
	}
	
	$scope.searchFn = internalSearch;
	// on remplace par un mediagroup fixe
	focusFactory.getTopFocus().then(function(addItems){
		$scope.featuredtop = angular.copy(addItems.mediagroups[0].chapters[0].medias);
	});
	internalSearch();
	
	function internalSearch(page){
		var searchParams = $.extend( params,{'index' : 1,'kwgg':$scope.search.keywords,'start_date':'','end_date':''});
		if (page) {
			searchParams.index = params.pagesize * (page - 1) + params.index ;
			searchParams.page = page;
		}
		else {
			searchParams.index = 1;
			searchParams.page = 1;
		}
		if ($scope.search.published_before){
			searchParams.start_date = moment($scope.search.published_before,'DD/MM/YYYY').format('YYYYMMDD');
		}
		if ($scope.search.published_after){
			searchParams.end_date = moment($scope.search.published_after,'DD/MM/YYYY').format('YYYYMMDD');
		}
		focusFactory.getFocusList( searchParams).then(
			function(focusList){
				$scope.focusList = focusList.mediagroups;
				$scope.totalFocus=focusList.numFound - params.index;
			}); // on remplace la liste des reponse avec ce que nous renvoie lucene
		
		console.log(searchParams);
		$state.go('.', {keywords: searchParams.kwgg,page:searchParams.page,datefrom:searchParams.start_date,dateto: searchParams.end_date});
		
	}
 

    this.uiOnParamsChanged = function(newParams) {
//    	console.log(newParams);
    	if ("keywords" in newParams)
    		$scope.search.keywords = newParams.keywords;
    	if ("datefrom" in newParams && newParams.datefrom)
    		$scope.search.published_before = moment(newParams.datefrom,'YYYYMMDD').format('DD/MM/YYYY');
    	if ("dateto" in newParams && newParams.dateto )
    		$scope.search.published_after = moment(newParams.dateto,'YYYYMMDD').format('DD/MM/YYYY');
    	if ("page" in newParams)
    		$scope.search.index = newParams.page;
    	
//    	internalSearch(newParams.page);
        var aTag = $("a[name='featured']");
        $('html,body').animate({scrollTop: aTag.offset().top},750);
    }
    
}]);
