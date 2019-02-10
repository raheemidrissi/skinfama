// directive permettant d'afficher soit le bouton de download, soit le bouton de login
avservicesApp.directive('fileDownload', function($compile,AuthService){	

	var linkTemplate = '<a class="ecl-link ecl-link--standalone" href="{{ fileurl }}" download>Download <span class="ecl-icon ecl-icon--download"></span></a>';
    var btnLoginTemplate = '<button class="ecl-button ecl-button--default ecl-button--block">please Login</button>';

    var getTemplate = function(){
//        if (AuthService.isAuthenticated())
        	return linkTemplate;
//        else
//        	return btnLoginTemplate;
    }; 

    var linker = function(scope, element, attrs){
    	element.html(getTemplate()).show();
        $compile(element.contents())(scope);
    };

    return {
        restrict: "E",
        replace: true,
        link: linker,
        scope: {
            fileurl: '@fileurl',
            linktext: '@linktext'     
        }
    };
});

avservicesApp.directive('badgeDate', function(){	
    return {
        restrict: "E",
        templateUrl: "/avservices/js/badgedate.template.html",
        scope: {
        	datereportage: '=datereportage',
        },
        controller: function ($scope){
//        	console.log($scope.datereportage);
        	var momentdate = moment($scope.datereportage,'DD/MM/YYYY HH:mm');
        	if (momentdate.isValid())
        		$scope.momentdate = {'nameday':momentdate.format('ddd'),'day':momentdate.format('DD'),'namemonth':momentdate.format('MMM')};
        	else{
        		momentdate = moment($scope.datereportage,'YYYYMMDD');
        		$scope.momentdate = {'nameday':momentdate.format('ddd'),'day':momentdate.format('DD'),'namemonth':momentdate.format('MMM')};
        	}
          }
    };
});

avservicesApp.directive('badgeDateCanceled', function(){	
    return {
        restrict: "E",
        templateUrl: "/avservices/js/badgedatecanceled.template.html",
        scope: {
        	datereportage: '=datereportage',
        },
        controller: function ($scope){
//        	console.log($scope.datereportage);
        	var momentdate = moment($scope.datereportage,'DD/MM/YYYY HH:mm');
        	if (momentdate.isValid())
        		$scope.momentdate = {'nameday':momentdate.format('ddd'),'day':momentdate.format('DD'),'namemonth':momentdate.format('MMM')};
        	else{
        		momentdate = moment($scope.datereportage,'YYYYMMDD');
        		$scope.momentdate = {'nameday':momentdate.format('ddd'),'day':momentdate.format('DD'),'namemonth':momentdate.format('MMM')};
        	}
          }
    };
});



avservicesApp.directive('matchField', function(){ 
    return {
      restrict: 'A', // only activate on element attribute
      require: 'ngModel', // get a hold of NgModelController
      link: function(scope, elem, attrs, ngModel) {
        if (!ngModel) return; // do nothing if no ng-model

        // watch own value and re-validate on change
        scope.$watch(attrs.ngModel, function() {
          validate();
        });

        // observe the other value and re-validate on change
        attrs.$observe('matchField', function(val) {
          validate();
        });

        var validate = function() {
          // values
          var val1 = ngModel.$viewValue;
          var val2 = attrs.matchField;

          // set validity
          ngModel.$setValidity('matchField', val1 === val2);
        };
      }
    }
});


avservicesApp.directive("owlCarousel", function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        link: function(scope) {
            scope.initCarousel = function(element) {
//                console.log('initCarousel');

                // provide any default options you want
                var defaultOptions = {
    			        loop: false,
    			        center: true,
    			        margin: 10,
    			        nav: true,
    			        dots: false,
    			        navText: ["<i class='ecl-icon ecl-icon--left'></i>", "<i class='ecl-icon ecl-icon--right'></i>"],
    			        autoWidth: false,
    			        autoHeight: false,
    			        URLhashListener:false,
    			        responsiveClass:false,
    			        responsive: {
    			            0: {
    			                items: 1
    			            },
    			            600: {
    			                items: 3
    			            },
    			            1000: {
    			                items: 6
    			            }
    			        }
    			    };
//                var customOptions = scope.$eval($(element).attr('data-options'));
//                // combine the two options objects
//                for (var key in customOptions) {
//                    defaultOptions[key] = customOptions[key];
//                }
                // init carousel
                var curOwl = $(element).data('owlCarousel');
                if (!angular.isDefined(curOwl)) {
                    $(element).owlCarousel(defaultOptions);
                }
                scope.cnt++;
            };
        }
    };
}).directive('owlCarouselItem', [
    function() {
        return {
            restrict: 'A',
            replace: true,
            transclude: false,
            link: function(scope, element) {
                // wait for the last item in the ng-repeat then call init
                if (scope.$last) {
//                    console.log('lst element');
                    scope.initCarousel(element.parent());
                }
            }
        };
    }
]);
