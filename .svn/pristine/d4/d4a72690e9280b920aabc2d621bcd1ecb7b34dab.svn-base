define(['app', "commonService", 'service/exHttpService'], function(app) {
		app.register.service("userQrCode", UserQrCode);

		UserQrCode.$inject = ['$q', 'exHttp', '$cacheFactory'];

		function UserQrCode($q, exHttp, $cacheFactory) {
			return {
				pageInit: pageInit, //首页内容初始化
			}

			function pageInit(idAppendUser,idUser) {
				var def = $q.defer();
				exHttp.init({
					url: 'login/get_user_info_and_append_user?idAppendUser='+idAppendUser+'&idUser='+idUser,
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