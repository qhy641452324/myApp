define(['app','service/exHttpService','service/modalService'], function(app) {
	app.register.service("addressManagementAPI", AddressManagementAPI);

	AddressManagementAPI.$inject = ['$q', 'exHttp'];

	function AddressManagementAPI($q, exHttp) {
		return {
			pageInit: pageInit,//首页内容初始化
			deleteAdd:deleteAdd,//删除地址
			isdefault:isdefault
		}

		function pageInit() {
			var def = $q.defer();
			exHttp.init({
				url: 'login/show_user_info?idAppendUser=1',
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
		function deleteAdd(idUserAddrMgr){
			var def = $q.defer();
			exHttp.init({
				url: 'user_mgr/delete_mgr_address',
				method: 'get',
				params:{
					id_user_addr_str:idUserAddrMgr
				},
				timeout: 120000,
				loading: 'circle',
				loginTimeOut: false,
			}).then(function(response) {
				var fromData = response;
				def.resolve(fromData);
			});
			return def.promise;
		}
		function isdefault(idUserAddrMgr,addDesc){
			var def = $q.defer();
			exHttp.init({
				url: 'user_mgr/add_update_user_addr',
				method: 'get',
				params:{
					idUserAddrMgr:idUserAddrMgr,
					defaultState:0,
					addDesc:addDesc,
					flag:1
				},
				timeout: 120000,
				loading: 'circle',
				loginTimeOut: false,
			}).then(function(response) {
				var fromData = response;
				def.resolve(fromData);
			});
			return def.promise;
		}
	}
})
/*http://www.jialebao.cc*/