//directive permettant d'afficher une vignette de liste
// utilisation : <vignette-detail>
avservicesApp.directive('seqEbs', function(){	

    return {
        restrict: "E",        
        replace: true,     
        transclude: false,
        templateUrl: '/avservices/ebs/seq.template.html',
        scope : {
        	seq : "=",
          showthumb :"="
        },
        controller: function ($scope){
        }
    };
});

//directive permettant d'afficher une vignette de liste
//utilisation : <vignette-detail>
avservicesApp.directive('progEbs', function(){	

return {
   restrict: "E",        
   replace: true,
   transclude: false,
   templateUrl: '/avservices/ebs/prog.template.html',
   scope : {
	   	prog : "=",
	   	valueInstitution : "=",
	   	valueKeyword : "=",
      showthumb :"="
   },
   controller: function ($scope){
	   $scope.filterInstitution = function (item){
		   if ($scope.valueInstitution)
			   return item.institution.id == $scope.valueInstitution;
		   else
			   return true;
	   }
	   $scope.filterKeyword = function (item){
		   if ($scope.valueKeyword){
			   var re = new RegExp("(" + $scope.valueKeyword + ")", "i");
			   return item.title.EN.match(re) ;
		   }
		   else
			   return true;
	   }
   }
};
});

//directive permettant d'afficher une vignette de liste
//utilisation : <vignette-detail>
avservicesApp.directive('noticeEbs', function(){	

return {
   restrict: "E",        
   replace: true,
   transclude: false,
   templateUrl: '/avservices/ebs/notice.template.html',
   scope : {
   	prog : "="
   },
   controller: function ($scope){
   }
};
});

