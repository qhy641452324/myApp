define(["app","service/groupService"],function(app){
	app.register.controller("groupIndexCtrl",GiftCtrl);
	
	GiftCtrl.$inject=['$scope','$state','groupAPI']
	function GiftCtrl($scope,$state,groupAPI){
		var vm=this;
		vm.items=[1];
		var panel={
			begin:0,
			length:100,
		}
		groupAPI.getGroupList(panel).then(function(v){
			vm.groupList=v.fightGroupList;
			console.log(vm.groupList)
		})
		
		
		groupAPI.getMyGroupList(panel).then(function(v){
//			vm.myGroupList=v.
		})
		
		$scope.goWaiting=function(){
			$state.go('tab.groupWaiting');
		}
		
		$scope.getGroup=function(id){
			$state.go('tab.groupDetail',{idFightGroup:id})
		}
	}

});