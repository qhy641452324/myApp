define(["app","service/userService"], function(app) {
	app.register.controller("myAccountCtrl", myAccountCtrl);
	myAccountCtrl.$inject = ["$scope", "userAPI"];

	function myAccountCtrl($scope, userAPI) {
		pageInit();
		function pageInit() {
			userAPI.myAccount().then(function(data) {
				var totalNum=0;
				$scope.myBalance=data;
				totalNum=parseFloat(data.leftMoney+data.consumeScore+data.telecomScoreMoney).toFixed(2);
				$scope.totalNum=totalNum;
			}, function(error) {

			});
		}
	}

});