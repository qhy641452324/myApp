define(["app","service/exHttpService", "commonService"], function(app) {
	app.register.controller("alipayCtrl", alipayCtrl);
	alipayCtrl.$inject = ["$scope", "exHttp"]

	function alipayCtrl($scope, exHttp) {
		$scope.itemsTop = [{
			id: 1,
			num: "100元"
		}, {
			id: 2,
			num: "200元"
		}, {
			id: 3,
			num: "500元"
		}, {
			id: 4,
			num: "1000元"
		}, {
			id: 5,
			num: "2000元"
		}, {
			id: 6,
			num: "5000元"
		}];
		$scope.sumitAlipayPay = function() {
//			alipayAPI.alipayPay().then(function(data) {
//				console.log(data);
//			}, function(error) {
//
//			});

		}

	}

});