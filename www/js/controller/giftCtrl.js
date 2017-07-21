define(["app"],function(app){
	app.register.controller("giftCtrl",GiftCtrl);
	
	GiftCtrl.$inject=['$state']
	function GiftCtrl($state){
		
		
		
		
		var vm=this;
		vm.page='gift';
		
		
		
	}

});