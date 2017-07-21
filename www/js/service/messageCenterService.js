define(['app', 'service/exHttpService'], function(app) {
	app.register.service("messageCenterAPI", MessageCenterAPI);

	MessageCenterAPI.$inject = ['$q', 'exHttp'];

	function MessageCenterAPI($q, exHttp) {
		return {
			pageInit: pageInit,//首页内容初始化
			mallMessageDetail:mallMessageDetail//商城消息详情
		}

		function pageInit() {
			var def = $q.defer();
			exHttp.init({
				url: 'message/message_center/getList',
				method: 'get',
				timeout: 120000,
				loading: 'circle',
			}).then(function(response) {
				console.log(response);
				var fromData = response.params.newMessageList;
				def.resolve(fromData);
			});
			return def.promise;
		}
		function mallMessageDetail(idMessageType) {
			var def = $q.defer();
			exHttp.init({
				url: 'message/message_center/getMessageDetail',
				method: 'get',
				params: {
						idMessageType:idMessageType
					},
				timeout: 120000,
				loading: 'circle',
			}).then(function(response) {
				var fromData = response.params.messageDetail;
				def.resolve(fromData);
			});
			return def.promise;
		}
	}
})
/*http://www.jialebao.cc*/