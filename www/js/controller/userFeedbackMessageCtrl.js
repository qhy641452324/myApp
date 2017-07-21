define(["app","service/messageCenterService"], function(app) {
	app.register.controller("userFeedbackMessageCtrl", UserFeedbackMessageCtrl);
	UserFeedbackMessageCtrl.$inject = ["$scope","$state","messageCenterAPI"];

	function UserFeedbackMessageCtrl($scope,$state,messageCenterAPI) {
			var idMessageType = $state.params.idMessageType;
			console.log(idMessageType);
			pageInit(idMessageType);//初始化
			function pageInit(idMessageType){
				messageCenterAPI.mallMessageDetail(idMessageType).then(function(data) {
					console.log(data);
				$scope.userFeedbackMessageList=data;
			}, function(error) {

			});
			}
	}

});