define(["app", "service/rechargePoliteService"], function(app) {
	app.register.controller("rechargePoliteCtrl", rechargePoliteCtrl);
	rechargePoliteCtrl.$inject = ["$scope", "rechargePoliteAPI", "$state"];

	function rechargePoliteCtrl($scope, rechargePoliteAPI, $state) {
		var vm = this;
		pageInit();
		//页面初始化
		function pageInit() {
			rechargePoliteAPI.pageInit().then(function(data) {
				console.log(data);
				$scope.giftList=data;
				return ;
			}, function(error) {

			});
		}

		$scope.rechargeConfirmation = function(idGiftDetail) {
			$state.go('tab.rechargeConfirmation', {
				idGiftDetail: idGiftDetail
			});
		}
	}

});