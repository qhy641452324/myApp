define(["app", "service/rechargePoliteService"], function(app) {
	app.register.controller("rechargeConfirmationCtrl", rechargeConfirmationCtrl);
	rechargeConfirmationCtrl.$inject = ["$scope", "rechargePoliteAPI", "$state"];

	function rechargeConfirmationCtrl($scope, rechargePoliteAPI, $state) {
		var idGiftDetail = $state.params.idGiftDetail;
		var vm = this;
		pageInit(idGiftDetail);
		//页面初始化

		function pageInit(idGiftDetail) {
			rechargePoliteAPI.GoRechargeSure(idGiftDetail).then(function(data) {
				console.log(data);
				var giftName = data.giftName;
				var giftNumber = giftName + ".00";
				$scope.giftName = giftName;
				$scope.giftNumber = giftNumber;
				var arr = [];
				var specialCommodity = data.giftDetailList[0].specialCommodity;
				var specialCommodityName = specialCommodity.specialCommodityName;
				var specialCommodityImage = specialCommodity.specialCommodityImage;
				var specialCommodityPrice = "";
				specialCommodity.specialCommodityName.replace(/\d+/g, function() {
					specialCommodityPrice = arguments[0];
				});
				arr.push({
					specialCommodityName: specialCommodityName,
					specialCommodityImage: specialCommodityImage,
					specialCommodityPrice: specialCommodityPrice,
				});
				$scope.specialCommodityList = arr;
			}, function(error) {

			});
		}
	}

});