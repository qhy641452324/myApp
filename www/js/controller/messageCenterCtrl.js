define(["app", "service/messageCenterService"], function(app) {
	app.register.controller("messageCenterCtrl", messageCenterCtrl);
	messageCenterCtrl.$inject = ["$scope", "messageCenterAPI","$state"];

	function messageCenterCtrl($scope, messageCenterAPI,$state) {
		var vm = this;
		messageCenterInit();
		//页面初始化
		function messageCenterInit() {
			messageCenterAPI.pageInit().then(function(data) {
				console.log(data);
				$scope.messageList = data;
			}, function(error) {

			});
		}
		$scope.MessageType = function(state) {
			var MessageTypeStr;
			switch(state) {
				case 1:
					MessageTypeStr = "商城消息";
					break;
				case 6:
					MessageTypeStr = "礼包消息";
					break;
				case 7:
					MessageTypeStr = "比布农场消息";
					break;
				case 8:
					MessageTypeStr = "用户反馈消息";
					break;
				case 9:
					MessageTypeStr = "拼团消息";
					break;
				default:
					break;
			}
			return MessageTypeStr;
		}
		$scope.MessageImg = function(state) {
			var MessageImgUrl;
			switch(state) {
				case 1:
					MessageImgUrl = "img/shangcheng.png";
					break;
				case 6:
					MessageImgUrl = "img/libao.png";
					break;
				case 7:
					MessageImgUrl = "img/bibu.png";
					break;
				case 8:
					MessageImgUrl = "img/fankui.png";
					break;
				case 9:
					MessageImgUrl = "img/pintuanblue.png";
					break;
				default:
					break;
			}
			return MessageImgUrl;
		}
		$scope.goState = function(state) {
			var goState;
			switch(state) {
				case 1:
					$state.go('tab.mallMessage', {
						idMessageType: 1
					});
					break;
				case 6:
					$state.go('tab.giftMessage', {
						idMessageType: 6
					});
					break;
				case 7:
					$state.go('tab.bibuMessage', {
						idMessageType: 7
					});
					break;
				case 8:
					$state.go('tab.userFeedbackMessage', {
						idMessageType: 8
					});
					break;
				case 9:
					$state.go('tab.fightGroupsMessage', {
						idMessageType: 9
					});
					break;
				default:
					break;
			}
			return goState;
		}
		$scope.isunRead=function(idMessafeStatus){
			var isunRead=true;
			if(idMessafeStatus==0){
				isunRead=false;
				return isunRead;
			}
			if(idMessafeStatus==1){
				isunRead=true;
				return isunRead;
			}
		}
	}
});