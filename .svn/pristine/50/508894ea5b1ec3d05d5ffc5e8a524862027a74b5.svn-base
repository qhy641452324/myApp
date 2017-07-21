define(['app', 'service/exHttpService'], function(app) {
	app.register.service("myProfitAPI", MyProfitAPI);

	MyProfitAPI.$inject = ['$q', 'exHttp'];

	function MyProfitAPI($q, exHttp) {
		return {
			pageInit: pageInit,//首页内容初始化
		}

		function pageInit() {
			var def = $q.defer();
			exHttp.init({
				url: 'user_order/getAllDirectScoreByUser?begin=0&&length=20',
				method: 'get',
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