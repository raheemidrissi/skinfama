// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////authentication :
// ////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function () {
    'use strict';

    angular
        .module('avservicesApp')
        .factory('AuthService', Service);

    function Service($http,$location,API_ENDPOINT,jwtHelper,authManager,language,$state) {
        var service = {};
        var LOCAL_TOKEN_KEY = 'EC_Avservices_token';
        var LOCAL_PROFILE_KEY = 'EC_Avservices_profile';

        service.login = login;
        service.logout= logout;
        service.user = getUser;
        service.storeUserCredentials = storeUserCredentials;
        service.loadUserCredentials = loadUserCredentials;

        return service;
        

        function getUser(){
        	if (authManager.isAuthenticated()){
        		var decode = jwtHelper.decodeToken(window.localStorage.getItem(LOCAL_TOKEN_KEY));
        		return decode;
        	}
       		else
        		return null;
        }
        
        
        function loadUserCredentials() {
            var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            if (token) {
			  // et on set le header d'authentification
              useCredentials(token);
            }
          }
        
          function storeUserCredentials(token) {
        	  console.log(jwtHelper.getTokenExpirationDate(token));
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            useCredentials(token);
          }
         
          function useCredentials(token) {
        	authManager.authenticate();
            // Set the token as header for your requests!
            $http.defaults.headers.common.Authorization = token;
          }
         
          function destroyUserCredentials() {
        	authManager.unauthenticate();
            $http.defaults.headers.common.Authorization = undefined;
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
          }
         
         
          function login() {
        	  $location.url(API_ENDPOINT.url + '/authenticate');
          };
          
         
          function logout() {
            destroyUserCredentials();
          };
         
    }
})();
