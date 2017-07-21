define(['app', 'service/exHttpService'], function(app) {
	app.register.service("homeAPI", HomeAPI);

	HomeAPI.$inject = ['$q', 'exHttp'];

	function HomeAPI($q, exHttp) {
		return {
			pageForm: pageForm,//首页内容初始化
			upDateLeftTimeOfGrab:upDateLeftTimeOfGrab//更新每日疯抢剩余时间
		}

		function pageForm() {
			var def = $q.defer();
			exHttp.init({
				url: 'section/app_home_index',
				method: 'post',
				timeout: 120000,
				loading: 'circle',
				cache:true,
				loginTimeOut: false,
			}).then(function(response) {
				var fromData = response;
				def.resolve(fromData);
			});
			return def.promise;
		}
		
		function upDateLeftTimeOfGrab(){
      var def = $q.defer();
      exHttp.init({
        url: 'system/getTime',
        method: 'post',
        cache:false,
        loginTimeOut: false,
      }).then(function(response) {
        var fromData = response.params;
        def.resolve(fromData);
      });
      return def.promise;		  
		}
		
	}
})
/*http://www.jialebao.cc*/