define(["app", "service/myProfitService", "service/exHttpService", "commonService"], function(app) {
	app.register.controller("myProfitCtrl", myProfitCtrl);
	myProfitCtrl.$inject = ["$scope", "myProfitAPI", "exHttp"];

	function myProfitCtrl($scope, myProfitAPI, exHttp) {
		MyProfitInit();
		//页面初始化
		function MyProfitInit() {
			myProfitAPI.pageInit().then(function(data) {
				console.log(data);
				var userInfo=data.userInfo;
				var consumeScore=data.consumeScore;
				$scope.consumeScore=consumeScore;
				var arr=[];
				for(var i = 0; i < userInfo.length; i++) {
					var contactUser = userInfo[i].contactUser;
					var userRemark=userInfo[i].userRemark;
					if(contactUser==""||contactUser==undefined){
						contactUser="--"
					}
					arr.push({contactUser:contactUser,userRemark:userRemark});
					$scope.userInfoList=arr;
				}			

			}, function(error) {

			});
		}
	}

});