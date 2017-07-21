define(["app", "service/popupService", "commonService"], function(app) {
	app.register.controller("MyIntegralCtrl", MyIntegralCtrl);
	MyIntegralCtrl.$inject = ['$scope', 'popupAPI', '$state'];

	function MyIntegralCtrl($scope, popupAPI, $state) {
		$scope.AboutIntegral=function(){
			
			}
//		$scope.tabs = [{"text": "全部明细"},{"text": "收入明细"},{"text": "支出明细"}];
			

		
		}

});