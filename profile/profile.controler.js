angular.module('avservicesApp')
.controller('loginCtrl', function(AuthService, $state, $transition$) {
	var token = $transition$.params().jwt;
	if (token)
		AuthService.storeUserCredentials(token);
	$state.go('language.home',{lang:'en'});
})

