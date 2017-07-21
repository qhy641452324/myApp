define(['app', 'service/exHttpService'], function(app) {
		"use strict";
		app.register.service("freshDynamicAPI",FreshDynamicAPI);

		FreshDynamicAPI.$inject = ['$q', 'exHttp'];

		function FreshDynamicAPI($q, exHttp) {
			return {
				pageInit: pageInit ,//生鲜动态列表初始化
				getFreshDynamicDetail:getFreshDynamicDetail//生鲜动态详情
			}
			function pageInit() {
				var def = $q.defer();
				exHttp.init({
					url: 'freshDynamic/getFreshDynamicList',
					method: 'get',
					params: {
						begin: 0,
						length:20
					},
					timeout: 120000,
					loading: 'circle',
					loginTimeOut: false,
				}).then(function(response) {
					var fromData = response.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}
			function getFreshDynamicDetail(idDynamic) {
				var def = $q.defer();
				exHttp.init({
					url: 'freshDynamic/getFreshDynamicDetail',
					method: 'get',
					params: {
						idDynamic: idDynamic
					},
					timeout: 120000,
					loading: 'circle',
				}).then(function(response) {
					var fromData = response.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}
		}
	})
	/*http://www.jialebao.cc*/