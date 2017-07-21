define(["app","service/freshDynamicService"], function(app) {
	app.register.controller("freshDynamicCtrl", freshDynamicCtrl);
	freshDynamicCtrl.$inject = ["$scope", "freshDynamicAPI","$state"];

	function freshDynamicCtrl($scope, freshDynamicAPI,$state) {
		var vm = this;
		pageInit();
		//页面初始化
		function pageInit() {
			freshDynamicAPI.pageInit().then(function(data) {
				console.log(data);
				$scope.freshDynamicList=data.freshDynamicList;
				
			}, function(error) {

			});
		}
		
		$scope.getFreshDynamicDetail = function(idDynamic) {
			$state.go('tab.freshDynamicDetail', {
				idDynamic: idDynamic
			});
		}
	}

});