define(['app',"service/giftService"],function(app){
	
	app.register.controller('giftDetailsCtrl',GiftDetails);
	GiftDetails.$inject=["$scope","$stateParams","giftAPI"];
	
	function GiftDetails($scope,$stateParams,giftAPI){
		$scope.idLucky=$stateParams.idLucky;
//		$scope.idLucky;
		console.log($scope.idLucky);
		
		giftAPI.getLuckyDetail($scope.idLucky).then(function(v){
			console.log(v);
		})
		
		
	}
})