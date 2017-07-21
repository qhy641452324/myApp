define(["app", "service/freshDynamicService"], function(app) {
	app.register.controller("freshDynamicDetailCtrl", freshDynamicDetailCtrl);
	freshDynamicDetailCtrl.$inject = ["$scope", "freshDynamicAPI", "$state"];

	function freshDynamicDetailCtrl($scope, freshDynamicAPI, $state) {
		var vm = this;
		var idDynamic = $state.params.idDynamic;
		pageInit(idDynamic);
		//页面初始化
		function pageInit(idDynamic) {
			freshDynamicAPI.getFreshDynamicDetail(idDynamic).then(function(data) {
				console.log(data);
				$scope.freshDynamicDetail=data.freshDynamic;
			}, function(error) {

			});
		}
	}

});