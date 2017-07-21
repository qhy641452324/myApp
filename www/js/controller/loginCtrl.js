define(["app", "formDirective", "decorator","commonService","service/accountService",'service/platformService'], function(app) {
	app.register.controller("loginCtrl", LoginCtrl);
	LoginCtrl.$inject = ['$scope','$state', 'accountAPI','platformAPI','publicToast','$ionicHistory']
	
	function LoginCtrl($scope,$state, accountAPI,platformAPI,publicToast,$ionicHistory) {
		platformAPI.disableKeyboard(); //为避免冲突，禁止ionic控制键盘
		var vm = this;
		vm.shownPsw = false;
		vm.loginFn=LoginFn;
		vm.loginWechat=loginWechat;
		
		function LoginFn(valid){
			if(valid) {
				accountAPI.login(vm.phone, vm.password).then(
					function(result) {
						$ionicHistory.goBack();
					},
					function(error) {
						publicToast.show(error);
					});
			} else {
				publicToast.show("请输入正确的账户名或密码");
			}			
		}
		
		function loginWechat(){
		  accountAPI.wechatLogin().then(function(result){
		    console.log(result);
		  });
		}
	}
});
