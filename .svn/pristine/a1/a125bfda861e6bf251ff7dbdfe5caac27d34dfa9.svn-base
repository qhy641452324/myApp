define(["app","service/userService"], function(app) {
	app.register.controller("feedbackRecordCtrl", feedbackRecordCtrl);
	feedbackRecordCtrl.$inject = ["$scope","userAPI"]

	function feedbackRecordCtrl($scope,userAPI) {
		pageInit();
		function pageInit() {
			userAPI.feedbackRecord().then(function(data) {
				console.log(data);
			}, function(error) {

			});
		}
 	}

});