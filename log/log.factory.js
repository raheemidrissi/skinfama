(function() {
	'use strict';
	angular.module('avservicesApp').factory('loggingFactory', loggingFactory);

	loggingFactory.$inject = ['$window','envConstants'];
	
	// pour le log des videos :
	// si 

	function loggingFactory($window,envConstants) {

		var loggingFactory = {};

        var LOCAL_UUID_KEY = 'EC_Avservices_uuid';

		var uuid = getUuid();
		
        function uuidv4() {
      	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      	    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      	    return v.toString(16);
      	  });
      	}

        loggingFactory.getUuid = getUuid;
        
        function getUuid(){
        	if (window.localStorage.getItem(LOCAL_UUID_KEY)){
        		var decode = window.localStorage.getItem(LOCAL_UUID_KEY);
        		return decode;
        	}
       		else {
       			var uuid = uuidv4();
                window.localStorage.setItem(LOCAL_UUID_KEY, uuid);
        		return uuid;
       		}
        }
        
		loggingFactory.appLogging = function appLogging(data) {
			var log = {
	                type: "POST",
	                url: envConstants.errorServer,
	                contentType: "application/json",
	                data: angular.toJson({
	                    url: $window.location.href,
	    				timestamp:moment().format("X"),
	                    userAgent: $window.navigator.userAgent,
	                    userLang: $window.navigator.language,
	    				user : {},
	    				uuid : uuid,
	                    type: data.type,
	                    message: data.message
	                })
			};
			$.ajax(log);
        }
		loggingFactory.brutLog = function appLogging(data) {
			var log = {
	                type: "POST",
	                url: envConstants.errorServer,
	                contentType: "application/json",
	                data: angular.toJson({
	                    url: $window.location.href,
	    				timestamp:moment().format("X"),
	                    userAgent: $window.navigator.userAgent,
	                    userLang: $window.navigator.language,
	    				user : {},
	    				uuid : uuid,
	                    type: data.type,
	                    message: data.message
	                })
			};
			$.ajax(log);
		}

		return loggingFactory;
	}
	;
})();
