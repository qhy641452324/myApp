define(["app", "service/goodsService","directive/goodsDirective","commonDirective"], function(app) {
	app.register.controller("buyCtrl", buyCtrl);

	buyCtrl.$inject = ['$scope','$state', 'goodsAPI','$ionicScrollDelegate','$controller','$rootScope','$cacheFactory','$q']

	function buyCtrl($scope,$state, goodsAPI,$ionicScrollDelegate,$controller,$rootScope,$cacheFactory,$q) {
		var vm = this;
		var http=$cacheFactory.get('$http');
		var goodsPublic=$controller('goodsPublic',{$scope:$scope,$state:$state});
    var staticGroup=[/*{commodityNavigationName:'促销'},{commodityNavigationName:'新品'}*/];
    vm.goodsLoad=goodsLoad; //根据类型加载菜品
    vm.promotionType=promotionType;//促销新品
    vm.refresh=refresh; //上拉刷新  
		pageInit();
		function pageInit() {
      vm.addBasketDirectiveExecutedTimes=0;
      goodsPublic.getBasketElementByState();
      vm.page=0;
      vm.hasToTheEnd=false;
      vm.initReady=false;
      $scope.pageReady=false;
      $scope.totalNumber=0;
      vm.goodsList=[];
			goodsAPI.pageForm().then(function(result) {
				vm.menuData = result.food_type_list;
				Array.prototype.unshift.apply(vm.menuData,staticGroup);
				goodsPublic.countTotalNumerTab(result.unfinish_order_detail);
				vm.selectedGroup=vm.menuData[0];
				groupGoodsLoad().then(function(){
          vm.shownGroup=null;
          vm.initReady=true;
          $scope.pageReady=true;				  
				})
			});
		}
		
		function refresh(){
      http.removePattern(/load_big_cls_and_first_sub_cls/);//移除缓存
      http.removePattern(/load_sub_cls/);
      vm.hasToTheEnd=false;
      vm.page=0;
      vm.goodsList=[];
      goodsLoad();
		}
		
		function goodsLoad(){
			if(!vm.selectedItem)
				groupGoodsLoad();
			else
				itemGoodsLoad();
		}
		
		function promotionType(food){
		  return goodsPublic.foodPromotionImage(food); 
		}
		
		function groupGoodsLoad(){
		  var def=$q.defer();
			if(!vm.hasToTheEnd){
				goodsAPI.goodsAType(vm.selectedGroup.idCommodityNavigation,null,vm.page,20,"default")
				.then(function(result){
					vm.page+=20;
					vm.hasToTheEnd=result.goodsHasToEnd;
					vm.goodsList.push.apply(vm.goodsList,result.food_subtype_list);
					def.resolve();
				}).finally(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.refreshComplete');
        });				
			}
			return def.promise;
		}
		
		function itemGoodsLoad(){
			if(!vm.hasToTheEnd){
				goodsAPI.goodsAType(vm.selectedGroup.idCommodityNavigation,vm.selectedItem.idCommodityNavigation,vm.page,20,"default")
				.then(function(result){
					vm.page+=20;
					vm.hasToTheEnd=result.goodsHasToEnd;
					vm.goodsList.push.apply(vm.goodsList,result.food_subtype_list);
				}).finally(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.refreshComplete');
        });				
			}			
		}
		
		
	}

});