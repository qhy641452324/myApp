define(["app"], function(app) {
	app.register.controller("onlineRechargeCtrl", onlineRechargeCtrl);
	onlineRechargeCtrl.$inject = ["$scope", "$ionicSlideBoxDelegate"];

	function onlineRechargeCtrl($scope, $ionicSlideBoxDelegate) {

		$scope.slideIndex = 0;

		// Called each time the slide changes
		$scope.slideChanged = function(index) {
			$scope.slideIndex = index;
			console.log("slide Change");

			if($scope.slideIndex == 0) {
				console.log("slide 1");
			} else if($scope.slideIndex == 1) {
				console.log("slide 2");
			} else if($scope.slideIndex == 2) {
				console.log("slide 3");
			}

		};

		$scope.activeSlide = function(index) {
			$ionicSlideBoxDelegate.slide(index);
		};
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
	};
});