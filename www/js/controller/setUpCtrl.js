define(["app", "service/popupService", "commonService", "service/userService"], function(app) {
	app.register.controller("setUpCtrl", SetUpCtrl);
	SetUpCtrl.$inject = ['$scope', 'popupAPI', '$state', 'userAPI']

	function SetUpCtrl($scope, popupAPI, $state, userAPI) {

		$scope.loginOff = function() {
			userAPI.getUserName().then(function(data) {
				var userName=data.append_user.userName;
				var opts = {
					imgUrl: "img/1.png",
					title: "确认退出登录",
					titleContent: "您将退出账号"+userName
				}
				popupAPI.popupconfirm(opts, function() {}, function() {
					offLogin();
				});
			}, function(error) {

			});
		}

		function offLogin() {
			userAPI.loginOff().then(function(data) {
				console.log(data);
				if(data.status == 0) {
					$state.go('login');
				}
			}, function(error) {

			});
		}

	}
});