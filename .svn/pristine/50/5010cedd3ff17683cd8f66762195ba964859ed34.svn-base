define(["app","service/popupService"], function(app) {
	app.register.controller("editPasswordCtrl", EditPasswordCtrl);
	EditPasswordCtrl.$inject = ["$scope","popupAPI","$state"]

	function EditPasswordCtrl($scope,popupAPI,$state) {
		
		$scope.editPassword = function() {
			  	 var opts={
					imgUrl:"img/1.png",
					title:"修改登录密码",
					titleContent:"将给手机182****5624发送验证码"
			  	 }
			  	 popupAPI.popupconfirm(opts,function(){
			  	 },function(){
			  	 	 $state.go('login');
			  	 });
			}
	}
});