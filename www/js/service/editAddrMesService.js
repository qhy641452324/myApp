define(['app', 'service/exHttpService', 'service/addressToolService'], function(app) {
	app.register.service("editAddrMesAPI", editAddrMesAPI);

	editAddrMesAPI.$inject = ['$q', 'exHttp'];

	function editAddrMesAPI($q, exHttp) {
		return {
			sumitMes: sumitMes, //首页内容初始化
		}

		function sumitMes(deliveryData, addDesc, phoneUser, receiveName,adCountry,adCity) {
			var vm = this;
			var def = $q.defer();
			var lng = deliveryData.point.lng; //输入地点经度
			var lat = deliveryData.point.lat; //输入地点纬度
			var idDelivery = deliveryData.id_delivery;
			var idSite = deliveryData.idSite;
			var idCenter = deliveryData.idCenter;
			var params = {
				adCountry: adCity,
				adProvince:adCountry,
				adCity: adCountry,
				idSite: idSite,
				addDesc: addDesc,
				phoneUser: phoneUser,
				receiveName: receiveName,
				defaultState: 0,
				idDeliveryCell: idDelivery,
				userLongitude: lng,
				userLatitude: lat,
			};
			exHttp.init({
				url: 'user_mgr/add_update_user_addr?idUserAddrMgr=-1',
				method: 'get',
				params: params,
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