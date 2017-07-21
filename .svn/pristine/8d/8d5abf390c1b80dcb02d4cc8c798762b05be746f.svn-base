define(["app","service/messageCenterService"], function(app) {
	app.register.controller("bibuMessageCtrl", bibuMessageCtrl);
	bibuMessageCtrl.$inject = ["$scope","$state","messageCenterAPI"];

	function bibuMessageCtrl($scope,$state,messageCenterAPI) {
		var idMessageType = $state.params.idMessageType;
			console.log(idMessageType);
			pageInit(idMessageType);//初始化
			function pageInit(idMessageType){
				messageCenterAPI.mallMessageDetail(idMessageType).then(function(data) {
					console.log(data);
				$scope.bibuMessageList=data;
			}, function(error) {

			});
			}
		
	}

});