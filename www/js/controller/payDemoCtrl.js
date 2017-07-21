define(["app", 'service/exHttpService','service/thirdPartyPayService'], function(app) {
	app.register.controller("payDemoCtrl", PayDemoCtrl);

	PayDemoCtrl.$inject = ['$scope', '$state', 'exHttp','thirdPartyPayService']

	function PayDemoCtrl($scope, $state, exHttp,thirdPartyPayService) {
		var vm = this;
		vm.aliPay = aliPay;
		vm.wechatPay = wechatPay;

		function aliPay() {
			exHttp.init({
				url: 'app_ali_pay',
				method: 'get',
				params: {
					isTest:true,
					total_fee: 0.01
				},
			}).then(function(response) {
				var payInfo=response.returnData.param
				thirdPartyPayService.alipay(payInfo).then(function(e){
					alert(e.resultStatus);
				},function(e){
					alert(e.resultStatus);
				})
			}, function(error) {

			});


		}

		function wechatPay() {
			exHttp.init({
				url: 'weichat_pay/app_api_pay',
				method: 'get',
				params: {
					idGiftDetail: 1,
					total_fee: 1
				},
			}).then(function(response) {
				var data = response.returnData;
				thirdPartyPayService.wechatPay(data).then(function(){
					alert("alipay success");
				},function(failReason){
					alert(failReason);
				})
			}, function(error) {

			});


		}

	}

});