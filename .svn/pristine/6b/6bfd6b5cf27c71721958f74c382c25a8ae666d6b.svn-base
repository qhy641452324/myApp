define(['app', 'service/exHttpService'], function(app) {
		"use strict";
		app.register.service("rechargePoliteAPI",RechargePoliteAPI);

		RechargePoliteAPI.$inject = ['$q', 'exHttp'];

		function RechargePoliteAPI($q, exHttp) {
			return {
				pageInit: pageInit ,//索要发票初始化
				GoRechargeSure:GoRechargeSure
			}
			function pageInit() {
				var def = $q.defer();
				exHttp.init({
					url: 'rechargeableGift/FreeGiftList',
					method: 'get',
					params: {
						giftType: 1,
						isDisable: 0,
						begin: 0,
						length: 10
					},
					timeout: 120000,
					loading: 'circle',
				}).then(function(response,config) {
					var fromData = response.params.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}
			function GoRechargeSure(idGiftDetail) {
				var def = $q.defer();
				exHttp.init({
					url: 'rechargeableGift/getGiftDetail',
					method: 'get',
					params: {
						idGiftDetail:idGiftDetail,
						isDisable: 0
					},
					timeout: 120000,
					loading: 'circle',
				}).then(function(response) {
					var fromData = response.params.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}
		}
	})
	/*http://www.jialebao.cc*/