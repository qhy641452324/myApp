define(["app", "service/popupService", "commonService"], function(app) {
	app.register.controller("MyBalanceCtrl", MyBalanceCtrl);
	MyBalanceCtrl.$inject = ['$scope', 'popupAPI', '$state'];

	function MyBalanceCtrl($scope, popupAPI, $state) {
		$scope.JiayuanRecharge = function() {
			var opts = {
				imgUrl: "img/1.png",
				title: "请输入密码",
				titleContent: "每张充值卡仅能使用一次！",
				inputPlaceholder: ""
			}
			popupAPI.popupShow(opts, function() {}, function() {

			});
		}
		$scope.cooperationRecharge = function() {
			var opts = {
				imgUrl: "img/1.png",
				title: "请输入密码",
				titleContent: "每张充值卡仅能使用一次！",
				inputPlaceholder: ""
			}
			popupAPI.popupShow(opts, function() {}, function() {

			});
		}
	}

});