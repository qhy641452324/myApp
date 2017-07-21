define(["app", "service/goodsService","directive/goodsDirective","commonDirective","service/popupService", "commonService"], function(app) {
	app.register.controller("integralShopCtrl",IntegralShopCtrl);
	
	IntegralShopCtrl.$inject = ['$scope','$state', 'goodsAPI','popupAPI','$ionicSlideBoxDelegate','$controller']

	function IntegralShopCtrl($scope,$state, goodsAPI,popupAPI,$ionicSlideBoxDelegate,$controller) {
		$scope.peo={
			imgUrl:"img/jiayuan.png",
			changeJiayuan:[
				{
					count:100,
					jiayuan:5
				},{
					count:300,
					jiayuan:10
				}
			],
			changeKaquan:[
				{
					count:100,
					jiayuan:5
				},{
					count:300,
					jiayuan:10
				}
			]
		}
		$scope.exchange=function(k){
			var optsAlert={
				imgUrl:'img/caution-icon.png',
				title:'确认兑换？',
				titleContent:"兑换完毕，"+k+"家元将充值到您的家元账户"
			}
			var optShow={
				imgUrl:'img/1.png',
				title:"交易完成",
				titleContent:'家元账户明细中可查看'
			}
			popupAPI.popupconfirm(optsAlert,function(){
				
			},function(){
				popupAPI.popupAlert(optShow,function(){})
			});
		}
	}
});