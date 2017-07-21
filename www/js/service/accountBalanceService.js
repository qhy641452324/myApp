define(['app', 'service/exHttpService'], function(app) {
	app.register.service("accountBalanceAPI", accountBalanceAPI);

	accountBalanceAPI.$inject = ['$q', 'exHttp'];

	function accountBalanceAPI($q, exHttp) {
		return {
			getPieCharts: getPieCharts,//首页内容初始化
		}

		function getPieCharts() {
			var def = $q.defer();
			exHttp.init({
				url: 'user_order/consumption_by_month?search_month=04&&search_year=2017',
				method: 'get',
				timeout: 120000,
				loading: 'circle',
				loginTimeOut: false,
			}).then(function(response) {
				var fromData = response.returnData;
				def.resolve(fromData);
			});
			return def.promise;
		}
	}
})
/*http://www.jialebao.cc*/