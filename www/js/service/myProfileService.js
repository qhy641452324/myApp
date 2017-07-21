define(['app', 'service/exHttpService'], function(app) {
	app.register.service("myProfileAPI", MyProfileAPI);

	MyProfileAPI.$inject = ['$q', 'exHttp'];

	function MyProfileAPI($q, exHttp) {
		return {
			pageInit: pageInit,//首页内容初始化
		}

		function pageInit() {
			var def = $q.defer();
			exHttp.init({
				url: '/getUserDetail', 
				method: 'get',
				timeout: 120000,
				loading: 'circle',
			}).then(function(response) {
				var fromData = response;
				def.resolve(fromData);
			});
			return def.promise;
		}
	}
})
/*http://www.jialebao.cc*/