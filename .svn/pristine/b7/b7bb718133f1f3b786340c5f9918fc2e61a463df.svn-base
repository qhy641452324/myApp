define(["app", "service/jiaYuanBalanceService", "service/exHttpService", "commonService"], function(app) {
	app.register.controller("jiaYuanBalanceCtrl", jiaYuanBalanceCtrl);
	jiaYuanBalanceCtrl.$inject = ["$scope", "jiaYuanBalanceAPI", "exHttp"];

	function jiaYuanBalanceCtrl($scope, jiaYuanBalanceAPI, exHttp) {
		jiaYuanBalanceInit();
		//页面初始化
		function jiaYuanBalanceInit() {
			jiaYuanBalanceAPI.pageInit().then(function(data) {
				console.log(data);
				var consumeScoreList=data.consume_score_list;
				var consumeScore=data.consumeScore;
				$scope.consumeScore=consumeScore;
				var arr=[];
				for(var i = 0; i < consumeScoreList.length; i++) {
					var typeScore = consumeScoreList[i].typeScore;
					var insertTimeStrFarm=consumeScoreList[i].insertTimeStrFarm;
					var consumeScore=consumeScoreList[i].consumeScore;
					var typeName = "";
					switch(typeScore) {
						case 0:
							typeName = "充值";
							break;
						case 1:
							typeName = "消费";
							break;
						case 2:
							typeName = "未收割";
							break;
					}
					arr.push({itemLeftTop:typeName,itemLeftBottom:insertTimeStrFarm,itemRight:consumeScore});
					$scope.array=arr;
				}
				

			}, function(error) {

			});
		}
	}

});