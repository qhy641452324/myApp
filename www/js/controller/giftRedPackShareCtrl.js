define(["app","service/giftService", "commonService"],function(app){
	app.register.controller('giftRedPackShareCtrl',GiftRedPackShare);
	GiftRedPackShare.$inject=['$scope',"$stateParams","giftAPI","$ionicModal",'wechatAPI'];
	
	function GiftRedPackShare($scope,$stateParams,giftAPI,$ionicModal,wechatAPI){
	var vm=this;
	var idLuck=$stateParams.result.returnData.idLucky;
	console.log(idLuck);
//	vm.pageReady=false;
	vm.giftShare=giftShare;
	function giftShare(k){
//		wechatAPI.shareLink();
		giftAPI.sendingLuckyPacket(idLuck).then(function(v){
			console.log(v);
		})
	}
	
	//modal
	$ionicModal.fromTemplateUrl('template/giftShare.html', {
	    scope: $scope
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	

//	idOrder=6784;
	var idOrder=$stateParams.result.returnData.idLucky;
//	console.log(idOrder);
	giftAPI.getLuckyDetail(idOrder).then(function(v){
		console.log(v);
		$scope.unfinish_a=v.specialOrderDetail;
	})
		$scope.log=function(){
			vm.surLength=20-vm.myText.length;
		}
	}
	
	
	
	
	
})
