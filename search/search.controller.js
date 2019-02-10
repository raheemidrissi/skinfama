//list of value, appelé ??
avservicesApp.controller('lovCtrl', ['$scope','$transition$', 'lovFactory', function ($scope,$transition$,lovFactory) {
 
    var params = {'type': $transition$.params().type};
    lovFactory.getLov(params).then(function(lovs){$scope.lovs = lovs;});
 
}]);



avservicesApp.controller('searchCtrl', ['$sce','$http','$scope','$transition$','searchFactory','envConstants','lovFactory','$filter','$state','language','$q','$templateCache',function ($sce,$http,$scope,$transition$,searchFactory,envConstants,lovFactory,$filter,$state,language,$q,$templateCache ) {
	$scope.filterList=[];
	var searching = false;
		$scope.nbResultPerPage = 15;
		$scope.listCategories = [];

    	$scope.search = {};
		$scope.search.index = $transition$.params().page || 1;
		$scope.search.sort = $transition$.params().sort || 'score';
		$scope.search.direction = $transition$.params().direction || 'desc';

    	// pour le champ topic, on affiche ce qu'il y a lov themes
    	lovFactory.getLov({'type':'THEMES'})
        .then(function (lov) {
        	$scope.listTopics = lov;
        });
    	// pour le champ videolang, on affiche ce qu'il y a lov videolang
    	lovFactory.getVideoLang({'type':'videolang'})
        .then(function (lov) {
        	$scope.listVideoLang = lov;
        });
    	$scope.traduc = function (item){
    		return $filter('translateDB')(item.title);
    	}
    	// pour le champ catégories, on affiche ce qu'il y a lov themes
//    	lovFactory.getLov({'type':'VIDEOGENRE'})
//        .then((lov)=> {
//        	$scope.listCategories=$scope.listCategories.concat(lov);
//        });
//    	lovFactory.getLov({'type':'PHOTOGENRE'})
//        .then((lov)=> {
//        	$scope.listCategories=$scope.listCategories.concat(lov);
//        });
//    	lovFactory.getLov({'type':'AUDIOGENRE'})
//        .then((lov)=> {
//        	$scope.listCategories=$scope.listCategories.concat(lov);
//        });
		$scope.listCategories = envConstants.categories;
		


		/* on fait l'initialisation des paramètres en promise afin de ne pouvoir lancer dans le then qu'une seule fois la recherche
		 * en attachant les $watch
		 */
		var init = [];
		var promise = $q(function(resolve, reject) {
	    	// initialisation des variables simples de la recherche
			$scope.search.mediatype = $transition$.params().mediatype || '';
			if($transition$.params().datefrom){
				$scope.search.datefrom = moment($transition$.params().datefrom,'YYYYMMDD').format('DD/MM/YYYY');
			}
			else {
				$scope.search.datefrom = '';
			}
			if ($transition$.params().dateto){
				$scope.search.dateto = moment($transition$.params().dateto,'YYYYMMDD').format('DD/MM/YYYY');
			}
			else {
				$scope.search.dateto = '';
			}
			$scope.search.categories = $transition$.params().categories || '';
	    	$scope.search.kwor = $transition$.params().kwor || '';
	    	$scope.search.personalities = ''; 
	    	$scope.search.thesaurus = ''; 
	    	$scope.search.location =  '';
	           	
			resolve('Success!');
			});
		init.push(promise);
    	// initialisation des variables à résoudre de la recherche
    	if ($transition$.params().location){
    		// on résout l'id du location
    		$transition$.params().location.forEach(function(element){init.push(lovFactory.getLov({'type':'LOCATION','id':element}))});
    	}
    	if ($transition$.params().thesaurus){
    		// on met dans filterList
    		$transition$.params().thesaurus.forEach(function(element){init.push(lovFactory.getLov({'type':'GENERIC','id':element}))});
    	}

    	if ($transition$.params().personalities){
    		// on résout l'id du peronality
    		$transition$.params().personalities.forEach(function(element){init.push(lovFactory.getLov({'type':'PERSONALITY','id':element}))});
    	}
    	if ($transition$.params().topic){
    		// on résout l'id du peronality
    		$transition$.params().topic.forEach(function(element){init.push(lovFactory.getLov({'type':'THEMES','id':element}))});
    	}
    	if ($transition$.params().videolang){
    		// on résout l'id du videolang
    		$transition$.params().videolang.forEach(function(element){init.push(lovFactory.getVideoLang({'type':'VIDEOLANG','id':element}))});
    	}
		/* après initialisation complète, on attache les watcher */
			$q.all(init).then(function(data) {
				angular.forEach(data,function(response){
					if(Array.isArray(response) ){
						console.log('add')
						switch(response[0].type){
						case 'LOCATION':AddFilterToList({filter:'location',item:response[0]},true);break;
						case 'THEMES':AddFilterToList({filter:'topic',item:response[0]},true);break;
						case 'PERSONALITY':AddFilterToList({filter:'personalities',item:response[0]},true);break;
						case 'VIDEOLANG':AddFilterToList({filter:'videolang',item:response[0]},true);break;
						case 'GENERIC':
						default:
							AddFilterToList({filter:'thesaurus',item:response[0]},true);break;
						}
					}
				});
			}).then(function() {
				$scope.$watch('nbResultPerPage',function(newValue,oldValue){if (newValue && oldValue){$scope.search.index = 1;}}); // on change le nombre d'item par page, on relance la recherche
				$scope.$watch('search.index',function (newValue,oldValue){console.log('new',newValue,'old',oldValue);if (newValue && oldValue && newValue != oldValue){fnsearch('search.index');}}); // on change de page, on recherche la bonne page
//				$scope.$watchCollection('filterList',function (newValue,oldValue){if (newValue && oldValue && newValue.length != oldValue.length){$scope.search.index=1;fnsearch();}});
		    	$scope.$watchGroup(['search.direction','search.sort'],function(){
		    		fnsearch('$watchGroup');
		    	})
				// dès que les filtres changent, on relance la recherche

				$scope.$watch('search.kwor',function(newValue,oldValue){
					if($scope.search.kwor&& $scope.search.kwor != ''){
						AddFilterToList({filter:'kwor',item:$scope.search.kwor});
						$scope.search.kwor='';
					}
				});
				$scope.$watch('search.datefrom',function(){
					if($scope.search.datefrom != ''){
						AddFilterToList({filter:'datefrom',item:moment($scope.search.datefrom,'DD/MM/YYYY').format('YYYYMMDD'),'displayitem':$scope.search.datefrom});
						$scope.search.datefrom='';
					}
				});
				$scope.$watch('search.dateto',function(){
					if($scope.search.dateto != ''){
						AddFilterToList({filter:'dateto',item:moment($scope.search.dateto,'DD/MM/YYYY').format('YYYYMMDD'),'displayitem':$scope.search.dateto});
						$scope.search.dateto='';
					}
				});
				$scope.$watch('search.mediatype',function(newValue, oldValue, scope){
//					console.log('newValue',newValue,'oldValue',oldValue);
						if(newValue && newValue != '' ){	
							// il faut faire la verification du categorie
							// on récupère la liste des filtres de type catgorie
							var catFiltList = $scope.filterList.filter(function(el) {
							    return (el.filter == 'categories')
				   		 	});
							// pour chacun des filtres, si le mediatype n'est pas celui sélectionné, on le retire
							catFiltList.forEach(function(filt) {
								if (filt.item.mediatype != newValue)
									removeItemFromFilterList(filt);
							});
							AddFilterToList({filter:'mediatype',item:newValue});
//							$scope.search.mediatype = '';
						}
						else {
							// on efface du filtre cleui qui contient mediatype
							$scope.filterList = $scope.filterList.filter(function(el) {
							    return (el.filter != 'mediatype')
					   		 	});
					 		RefreshUrlQueryString('$watch');
						}
				});
				// quand on veux ajouter une catégorie dans le filtre, on sélectionne dans la liste, ça le rajoute dans filterListe avec l'objet de la constante et on vide le champ pour pouvoir en mettre un autre
				$scope.$watch('search.categories',function(){
					if (Array.isArray($scope.search.categories)){
						angular.forEach($scope.search.categories,function(value,key){
							AddFilterToList({filter:'categories',item:$scope.listCategories.filter(function( obj ) {
								  return obj.id == value;
							})[0]
							});
						});
						}
					else if ($scope.search.categories){
						AddFilterToList({filter:'categories',item:$scope.listCategories.filter(function( obj ) {
							  return obj.id == $scope.search.categories;
						})[0]
						});
					}
					$scope.search.categories = '';
				});
				// quand on veux ajouter untopic  dans le filtre, on sélectionne dans la liste, ça le rajoute dans filterListe avec l'objet de la constante et on vide le champ pour pouvoir en mettre un autre
				$scope.$watch('search.topic',function(){
					lovFactory.getLov({'type':'THEMES'})
			        .then(function (lov) {
					if (Array.isArray($scope.search.topic)){
						angular.forEach($scope.search.topic,function(value,key){
							AddFilterToList({filter:'topic',item:$scope.listTopics.filter(function( obj ) {
								  return obj.doc_ref == value;
							})[0]
							});
						});
						}
					else if ($scope.search.topic){
						AddFilterToList({filter:'topic',item:$scope.listTopics.filter(function( obj ) {
							  return obj.doc_ref == $scope.search.topic;
						})[0]
						});
					}
					$scope.search.topic = '';
			        })
				});
				// quand on veux ajouter un lang de video  dans le filtre, on sélectionne dans la liste, ça le rajoute dans filterListe avec l'objet de la constante et on vide le champ pour pouvoir en mettre un autre
				$scope.$watch('search.videolang',function(){
					lovFactory.getVideoLang({'type':'videolang'})
			        .then(function (lov) {
					if (Array.isArray($scope.search.videolang)){
						angular.forEach($scope.search.videolang,function(value,key){
							AddFilterToList({filter:'videolang',item:$scope.listVideolang.filter(function( obj ) {
								  return obj.doc_ref == value;
							})[0]
							});
						});
						}
					else if ($scope.search.videolang){
						AddFilterToList({filter:'videolang',item:$scope.listVideoLang.filter(function( obj ) {
							  return obj.doc_ref == $scope.search.videolang;
						})[0]
						});
					}
					$scope.search.videolang = '';
			        })
				});
				$scope.$watchCollection('filterList',function (newValue,oldValue){if (newValue && oldValue ){$scope.search.index=1;fnsearch('filterList');}});
			});    

		$scope.fnsearch = fnsearch;

		// autocomplete pour le champ personnality
		$scope.autoCompletePersonnnalitiesOptions = {
                minimumChars: 3,
                containerCssClass: '',
                autoHideDropdown: true,
                selectedCssClass: 'active',
                noMatchTemplateEnabled: false,
                dropdownParent:$('#avs-autocomplete-personalities'),  // non compatible avec option suivante
//                positionUsingJQuery: false,                    // non compatible avec option précédente
                data: function (term) {
//                    return $http.get('http://ec.europa.eu/avservices/cfc/personalitiesen.cfm?q='+$scope.search.personalities)
                    return lovFactory.getPersonalities({'value':$scope.search.personalities})
                        .then(function (response) {
                                return response;
                        });
                },
                renderItem: function (item) {
                    return {
                        value: item.doc_ref,
                        label: $sce.trustAsHtml(
                        "<a class='auto-complete'>"      
                        + item.prefered + 
                        "</a>")
                    };
                },
                itemSelected: function (item) {
                    $scope.search.personalities = '';
                    AddFilterToList({filter:'personalities',item:item.item});
                }
            }
		
		// autocomplete pour le champ location
		$scope.autoCompleteLocationOptions = {
                minimumChars: 3,
                containerCssClass: '',
                autoHideDropdown: true,
                selectedCssClass: 'active',
                noMatchTemplateEnabled: false,
                dropdownParent:$('#avs-autocomplete-location'),  // non compatible avec option suivante
//                positionUsingJQuery: false,                    // non compatible avec option précédente
                data: function (term) {
                    return lovFactory.getLov({'type':'LOCATION','value':term})
                        .then(function (lov) {
                                return lov;
                        });
                },
                itemSelected: function (item) {
                    $scope.search.location = '';
                    AddFilterToList({filter:'location',item:item.item});
                },
                renderItem: function (item) {
                    return {
                        value: item.doc_ref,
                        label: $sce.trustAsHtml(
                        "<a class='dropdown-item' role='option'>"      
                        + $filter('translateDB')(item.title) + 
                        "</a>")
                    };
                }
            }

		// autocomplete pour le champ thesaurus
		$scope.autoCompleteThesaurusOptions = {
                minimumChars: 3,
                containerCssClass: '',
                autoHideDropdown: true,
                selectedCssClass: 'active',
                noMatchTemplateEnabled: false,
                dropdownParent:$('#avs-autocomplete-thesaurus'),  // non compatible avec option suivante
//                positionUsingJQuery: false,                    // non compatible avec option précédente
                data: function (term) {
//                    return $http.get('http://ec.europa.eu/avservices/cfc/thesaurus'+language.getUserLanguage().lang+'.cfm?q='+$scope.search.thesaurus)
                    return lovFactory.getLov({'type':'GENERIC','value':$scope.search.thesaurus})
                        .then(function (lov) {
                                return lov;
                        });
                },
                renderItem: function (item) {
                    return {
                        value:item.doc_ref,
                        label: $sce.trustAsHtml(
                        "<a class='auto-complete'>"     // TODO : faire la bonne class css ... pour le moment ça va pas 
                        + $filter('translateDB')(item.title) + 
                        "</a>")
                    };
                },
                itemSelected: function (item) {
                    $scope.search.thesaurus = '';
                    AddFilterToList({filter:'thesaurus',item:item.item});
                }
            }
		

		// fonction passée à la directive d'affichage du filtre pour retirer un élément du filtre
    	$scope.removeItem = removeItemFromFilterList;

    	// fonction pour ajouter un filtre à la liste en évitant les doublons
    	function AddFilterToList(newfilter,NotRefresh){
//    		console.log('on ajoute',newfilter);
    		if (newfilter.filter == 'datefrom' || newfilter.filter == 'dateto'|| newfilter.filter == 'mediatype'|| newfilter.filter == 'kwor'){
    			// pour les dates, on remplace au lieu d'ajouter
    			var listDateFilter = $scope.filterList.filter(function(el) {
	    			return (el.filter == newfilter.filter) ;
	   		 	});
    			if (listDateFilter.length){
    				removeItemFromFilterList (listDateFilter[0],true);
    			}
    			$scope.filterList.push(newfilter);
    		}
    		else {
	    		// on calcule la liste moins l'element qu'on veut ajouter
	    		var cmpFilter = $scope.filterList.filter(function(el) {
	    			if (el.filter != newfilter.filter) return true;
	    			if (newfilter.item.doc_ref) return el.item.doc_ref != newfilter.item.doc_ref;
	    			if (newfilter.item.name.EN) return el.item.name.EN != newfilter.item.name.EN;
	    			if (newfilter.item.name) return el.item.name != newfilter.item.name;
	    			if (newfilter.item.title.EN) return el.item.title.EN != newfilter.item.title.EN;
	    			if (newfilter.item.title) return el.item.title != newfilter.item.title;
	    			return true ;
	   		 	});
	    		// si c'est égale à la liste initiale, alors l'element n'y est pas, on doit l'ajouter
	    		if (cmpFilter.length == $scope.filterList.length){
	    			$scope.filterList.push(newfilter);
	    		}
	    		else {
	    			console.log('elt deja existant dans filtre');
	    		}
    		}
     		if (! NotRefresh) RefreshUrlQueryString('AddFilterToList: '+ newfilter.filter);
    	}
    	
    	function removeItemFromFilterList (item,NotRefresh){
//    		console.log('on retire',item);
   		 $scope.filterList = $scope.filterList.filter(function(el) {
		    return (el != item) ;
   		 	});
 		if (! NotRefresh) RefreshUrlQueryString('removeItemFromFilterList');
    	}
    	

    	function RefreshUrlQueryString(from){
    		console.log('on rafraichit',from,$scope.filterList);
			var paramCategoriesUrl = [];
			angular.forEach($scope.filterList.filter(function(el) {
    			return (el.filter == 'categories') ;
   		 	}), function(value,key){paramCategoriesUrl.push(value.item.id)});

			var paramPersonalitiesUrl = [];
			angular.forEach($scope.filterList.filter(function(el) {
    			return (el.filter == 'personalities') ;
   		 	}), function(value,key){paramPersonalitiesUrl.push(value.item.doc_ref)});

			var paramThesaurusUrl = [];
			angular.forEach($scope.filterList.filter(function(el) {
    			return (el.filter == 'thesaurus') ;
   		 	}), function(value,key){paramThesaurusUrl.push(value.item.doc_ref)});

			var paramLocationUrl = [];
			angular.forEach($scope.filterList.filter(function(el) {
    			return (el.filter == 'location') ;
   		 	}), function(value,key){paramLocationUrl.push(value.item.doc_ref)});

			var paramTopicUrl = [];
			angular.forEach($scope.filterList.filter(function(el) {
    			return (el.filter == 'topic') ;
   		 	}), function(value,key){paramTopicUrl.push(value.item.doc_ref)});

			var paramVideoLangUrl = [];
			angular.forEach($scope.filterList.filter(function(el) {
    			return (el.filter == 'videolang') ;
   		 	}), function(value,key){paramVideoLangUrl.push(value.item.doc_ref)});

			var mediatypelist = $scope.filterList.filter(function(el) {
    			return (el.filter == 'mediatype') ;
   		 	});
			if (mediatypelist.length){
				paramMediaType = mediatypelist[0].item;
			}
			else
				paramMediaType = undefined;

			var kworlist = $scope.filterList.filter(function(el) {
    			return (el.filter == 'kwor') ;
   		 	});
			if (kworlist.length){
				paramKwor = kworlist[0].item;
			}
			else
				paramKwor = undefined;

			var dtfrlist = $scope.filterList.filter(function(el) {
    			return (el.filter == 'datefrom') ;
   		 	});
			if (dtfrlist.length){
				paramDateFrom = dtfrlist[0].item;
			}
			else
				paramDateFrom = undefined;
			var dttolist = $scope.filterList.filter(function(el) {
    			return (el.filter == 'dateto') ;
   		 	});
			if (dttolist.length){
				paramDateTo = dttolist[0].item;	
			}
			else
				paramDateTo = undefined;

			$state.go('.',{
				categories:paramCategoriesUrl,
				personalities:paramPersonalitiesUrl,
				thesaurus:paramThesaurusUrl,
				location:paramLocationUrl,
				topic:paramTopicUrl,
				datefrom:paramDateFrom,
				dateto:paramDateTo,
				videolang:paramVideoLangUrl,
				mediatype:paramMediaType,
				kwgg:paramKwor
				});

    	}
    	
    	// fonction de recherche : on traduit les paramètres pour le factory
		function fnsearch(from){
			var myFilter = angular.copy($scope.filterList);
			console.log('search launch',myFilter,searching,from);
			if (! searching){
				searching = true;
	    		var params = {'locthes':'','genthes':'','persothes':'','genrethes':'','project_theme':'','type':'PHOTO,VIDEO', "pagesize": $scope.nbResultPerPage, "index":($scope.nbResultPerPage*($scope.search.index-1)+1)};
	    		if ($scope.search.sort){
	    			params=$.extend(params,{"sortField":$scope.search.sort});
	    		}
	    		if ($scope.search.direction){
	    			params=$.extend(params,{"sortdir":$scope.search.direction});
	    		}
				angular.forEach(myFilter,function(value,key){
					if (value.filter == 'kwor')
						params.kwgg = value.item;
					if (value.filter =='location')
						params.locthes += value.item.doc_ref + ',';
					if (value.filter =='topic')
						params.project_theme += value.item.doc_ref + ' '; // séparateur : espace au lieu de virgule
					if (value.filter =='videolang'){
						if (params.videoLang)
							params.videoLang += value.item.doc_ref + ',';
						else
							params.videoLang = value.item.doc_ref + ',';
					}
					if (value.filter =='mediatype'){
						switch(value.item){
							case '': 
							case undefined: 
							case 'ALL':	params.type='PHOTO,VIDEO';break;
							case 'PHOTO': params.type='PHOTO';break;
							case 'VIDEO': params.type='VIDEO';break;
							case 'AUDIO': params.type='VIDEO';params.hasAudio=1;break;
						};
					}
					if (value.filter =='datefrom')
						params.datefrom = value.item;
					if (value.filter =='dateto')
						params.dateto = value.item;
					if (value.filter =='personalities')
						params.persothes += value.item.doc_ref +',';
					if (value.filter =='thesaurus')
						params.genthes += value.item.doc_ref +',';
					if (value.filter =='categories'){
						params.genrethes +=  $scope.listCategories.filter(function( obj ) {
							  return obj.Genrethes == value.item.Genrethes;
						})[0].Genrethes + ',';
					}
				})
				if (params.project_theme){
					// pour ce param, il ne faut pas de , à la fin
					params.project_theme = params.project_theme.substr(0,params.project_theme.length-1);
				}
				if (params.videoLang){
					// pour ce param, il ne faut pas de , à la fin
					params.videoLang = params.videoLang.substr(0,params.videoLang.length-1);
				}
				// on lance la recheche dans le factory
	    		searchFactory.searchResult(params).then(function(result){
	    			$scope.results = result.results;
	       			$scope.nbCount = result.nbCount;
	       			searching = false;
	    		});
			}
    	}
// fonction réinit de la recherche
		$scope.reset = function(){
			$scope.filterList=[];
			RefreshUrlQueryString('reset');
		}
		
	// fonction callback quand on change de page pour lancer le refresh avec la bonne page dans l'url
		$scope.changePage = function(page){
			$state.go('.', {page: page});
		}

		$scope.sortBy = function (field){


			var dir;
			if (field != $scope.search.sort){
				//on change de champs de tri, par défaut, la direction est desc
				dir = 'desc';
			}
			else {
				// on toggle le champs de tri déjà sélectionné
				switch ($scope.search.direction){
				case 'asc':dir='desc';break;
				case 'desc':dir='asc';break;
				}
			}
			$state.go('.', {sort: field,direction:dir});
		}
		// pour trapper l'event de changement du params il faut implementer ce callback
	    this.uiOnParamsChanged = function(newParams) {
//	    	console.log(newParams);
	    	if ("kwor" in newParams)
    			$scope.search.kwor = newParams.kwor;
	    	if ("mediatype" in newParams)
    			$scope.search.mediatype = newParams.mediatype;
	    	if ("sort" in newParams)
    			$scope.search.sort = newParams.sort;
	    	if ("direction" in newParams)
    			$scope.search.direction = newParams.direction;
	    	if ("page" in newParams)
	    		$scope.search.index = newParams.page;
	    	else
	    		$scope.search.index = 1;
//	    	if ("datefrom" in newParams)
//	    		$scope.search.datefrom = uibDateParser.parse(newParams.datefrom,'yyyyMMdd');
//	    	if ("dateto" in newParams)
//	    		$scope.search.dateto = uibDateParser.parse(newParams.dateto,'yyyyMMdd');
//			fnsearch();
			$("html, body").animate({ scrollTop: $(".avs-list-results-thumbnails").offset().top }, 500); // on se remet en haut après une recherche (pas de changement de state donc le général ne se lance pas)
	      }
	}]);
