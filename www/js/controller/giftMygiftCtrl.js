define(["app","service/giftService","commonDirective"],function(app){
	app.register.controller("giftMygiftCtrl",GiftCtrl);
	
	GiftCtrl.$inject=['$scope','giftAPI','$ionicModal']
	function GiftCtrl($scope,giftAPI,$ionicModal){
		
		
		
		var vm=this;
		vm.page='gift';
		giftAPI.getLuckListReceive().then(function(v){
			$scope.getLuckListReceive=v.returnData;
			var receive=$scope.getLuckListReceive.luckyReceives;
			var senders=$scope.getLuckListReceive.luckySenders;
//			console.log($scope.getLuckListReceive);
			
			$scope.count=senders.length;
			$scope.userName=$scope.getLuckListReceive.appendUser.userName;
			$scope.allYears=[{
				"value":"2013"
			},{
				"value":"2014"
			},{
				"value":"2015"
			},{
				"value":"2016"
			},{
				"value":"2017"
			}];
			for(var i=0;i<receive.length;i++){//压入使用时间
				senders[i].receiveTimeStr=receive[i].receiveTimeStr;
			}
		});
		
		
		giftAPI.getLuckListSend().then(function(v){
			console.log(v);
			$scope.getLuckListSend=v.returnData.luckyList;
			console.log($scope.getLuckListSend.length);
			console.log(v.returnData);
		})
		
	}

});