define(["app", "commonService", "service/exHttpService", "service/userQrCodeService", "service/modalService"], function(app) {
	app.register.controller("userQrCodeCtrl", userQrCodeCtrl);
	userQrCodeCtrl.$inject = ['$scope', 'exHttp', 'userQrCode', 'baseUrl', 'modalAPI',"$state"]

	function userQrCodeCtrl($scope, exHttp, userQrCode, baseUrl, modalAPI,$state) {
		var vm = this;
//		modalAPI.initModal($scope, "pages/clickShare.html");
		var idAppendUser = $state.params.idAppendUser;
		var idUser = $state.params.idUser;
		getInit(idAppendUser,idUser); //初始化页面
		function getInit(idAppendUser,idUser) {
			userQrCode.pageInit(idAppendUser,idUser).then(function(data) {
				var appendUser = data.append_user;
				$scope.weichatImgUrl = appendUser.weichatImgUrl;
				$scope.userName = appendUser.userName;
				var idUser = appendUser.idUser;
				var idAppendUser = appendUser.idAppendUser;
				var QrCodeUrl = baseUrl + "../mgr_qr/encode1?str=http://www.jialebao.cc/mobile_web_app/share.html?idUser=" + idUser + "%26place_code=6858_0002%26id_append_user=" + idAppendUser + "";
				$scope.userQrCodeImgUrl = QrCodeUrl;
			}, function(error) {});
		}
		
	}

});