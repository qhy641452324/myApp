define(["app"],function(app){
	app.register.controller("groupBeforePayCtrl",GiftCtrl);
	
	GiftCtrl.$inject=['$state']
	function GiftCtrl($state){
		
		
		
		
		var vm=this;
		vm.page='gift';
		
		
		
	}

});