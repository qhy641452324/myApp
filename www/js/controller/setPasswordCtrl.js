define(["app", "service/accountSecurityService"], function(app) {
	app.register.controller("setPasswordCtrl", SetPasswordCtrl);
	SetPasswordCtrl.$inject = ["$scope", "$state", "accountSecurityAPI"]

	function SetPasswordCtrl($scope, $state, accountSecurityAPI) {
		var vm = this;
         $scope.SetPassword=function(){
         	var phoneNumber = $state.params.phoneNumber;
         	if(vm.password ==undefined) {
				publicToast.show("请输入密码");
				return;
			}
			if(vm.passwordAgain ==undefined) {
				publicToast.show("请再次输入密码");
				return;
			}
			if(vm.password != vm.passwordAgain) {
				publicToast.show("两次输入密码不一致。");
				return;
			}
			accountSecurityAPI.appRegister(phoneNumber, vm.password, vm.passwordAgain, 0).then(function(result) {
				publicToast.show("注册完成。");
			});
         }
	}

});