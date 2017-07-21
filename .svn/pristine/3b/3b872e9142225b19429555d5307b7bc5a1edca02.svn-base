define(["app","service/messageCenterService"], function(app) {
	app.register.controller("giftMessageCtrl", giftMessageCtrl);
	giftMessageCtrl.$inject = ["$scope","$state","messageCenterAPI"];

	function giftMessageCtrl($scope,$state,messageCenterAPI) {
		var idMessageType = $state.params.idMessageType;
			console.log(idMessageType);
			pageInit(idMessageType);//初始化
			function pageInit(idMessageType){
				messageCenterAPI.mallMessageDetail(idMessageType).then(function(data) {
					console.log(data);
				$scope.giftMessageList=data;
			}, function(error) {

			});
			}
	}

});