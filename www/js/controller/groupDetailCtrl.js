define(["app","service/groupService","directive/goodsDirective"],function(app){
	app.register.controller("groupDetailCtrl",GiftCtrl);
	
	GiftCtrl.$inject=['$scope','$state','groupAPI','$stateParams']
	function GiftCtrl($scope,$state,groupAPI,$stateParams){
 
		var vm=this;
		vm.page='gift';
		var panel={
			begin:0,
			length:100,
		}
		
//		vm.id=$stateParams.idFightGroup;
		vm.id=25;
		console.log(vm.id)
		groupAPI.getGroupAndOrgs(vm.id,panel).then(function(v){
			console.log(v);
			vm.imgList=v.fightGroupImageList;
			vm.groupCommodity=v.fightGroup;
		})
		
	}

});