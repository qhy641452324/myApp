define(["app"], function(app) {
	app.register.controller("cardCouponsCtrl", CardCouponsCtrl);
	CardCouponsCtrl.$inject = ["$scope", "$ionicSlideBoxDelegate"];

	function CardCouponsCtrl($scope, $ionicSlideBoxDelegate) {
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
	}

});