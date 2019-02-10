angular.module("avservicesApp").config(["$provide", function ($provide) {

    $provide.decorator('$log',['$delegate','loggingFactory', function ($delegate,loggingFactory){
        return {
            log: function(message) {
            	loggingFactory.appLogging({type:"log",message:message});
                return $delegate.log(message);
            },
            info: function(message) {
            	loggingFactory.appLogging({type:"info",message:message});
                return $delegate.info(message);
            },
            warn: function(message) {
            	loggingFactory.appLogging({type:"warn",message:message});
                return $delegate.warn(message);
            },
            error: function(message) {
                if (message.stack) {
                    message = (message.message && message.stack.indexOf(message.message) === -1)
                      ? 'Error: ' + message.message + '\n' + message.stack
                      : message.stack;
                } else if (message.sourceURL) {
                  message = message.message + '\n' + message.sourceURL + ':' + message.line;
                }
                loggingFactory.appLogging({type:"error",message:message});
                return $delegate.error(message);
            },
            debug: function(message) {
            	// loggingFactory.appLogging({type:"debug",message:message}); on n'envoie pas au serveur pour les messages de debug
                return $delegate.debug(message);
            }
        };
    }]);
}]);