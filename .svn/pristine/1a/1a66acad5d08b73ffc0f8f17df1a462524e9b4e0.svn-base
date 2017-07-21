define(['app', 'service/exHttpService'], function(app) {
	app.register.service("jiaYuanBalanceAPI", JiaYuanBalanceAPI);

	JiaYuanBalanceAPI.$inject = ['$q', 'exHttp'];

	function JiaYuanBalanceAPI($q, exHttp) {
		return {
			pageInit: pageInit,//首页内容初始化
		}

		function pageInit() {
			var def = $q.defer();
			exHttp.init({
				url: 'user_order/get_userScorelist_by_id?begin=0&&length=30',
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