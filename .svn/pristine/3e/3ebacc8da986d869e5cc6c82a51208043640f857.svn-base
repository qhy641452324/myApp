define(["app", "service/messageCenterService"], function(app) {
	app.register.controller("mallMessageCtrl", mallMessageCtrl);
	mallMessageCtrl.$inject = ["$scope","$state","messageCenterAPI"];

	function mallMessageCtrl($scope,$state,messageCenterAPI) {
			var idMessageType = $state.params.idMessageType;
			console.log(idMessageType);
			pageInit(idMessageType);//初始化
			function pageInit(idMessageType){
				messageCenterAPI.mallMessageDetail(idMessageType).then(function(data) {
					console.log(data);
				$scope.mallMessageList=data;
			}, function(error) {

			});
			}
//			function goState(state){
//				window.location.href=state;
//			}
	}

});