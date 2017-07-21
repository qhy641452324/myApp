define(["app"], function(app) {
	app.register.controller("eleJiaYuanCtrl", eleJiaYuanCtrl);
	eleJiaYuanCtrl.$inject = ["$scope"]

	function eleJiaYuanCtrl($scope) {
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
 	}

});