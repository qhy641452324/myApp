define(["app", "service/userService"], function(app) {
	app.register.controller("userCtrl", UserCtrl);
	UserCtrl.$inject = ['$state', '$scope', 'userAPI']

	function UserCtrl($state, $scope, userAPI) {
		$scope.clickAddress = function() {
			userAPI.pageInit().then(function(data) {
				var user_add_list=data.user_add_list;
			   if(user_add_list==0){
			   	$state.go('tab.notAddress');
			   }else{
			   	$state.go('tab.addressManagement');
			   }
			}, function(error) {})
		}
	}
});