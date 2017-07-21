define(["app", "service/goodsService", "directive/giftDirective", "commonDirective", "service/giftService", "service/popupService"], function(app) {
	app.register.controller("giftSelectGoodsCtrl", GiftCtrl);

	GiftCtrl.$inject = ['$scope', '$state', '$stateParams', 'goodsAPI', '$ionicScrollDelegate', '$controller', '$rootScope', '$cacheFactory', '$q', 'giftAPI', 'popupAPI']

	function GiftCtrl($scope, $state, $stateParams, goodsAPI, $ionicScrollDelegate, $controller, $rootScope, $cacheFactory, $q, giftAPI, popupAPI) {
		$scope.type = $stateParams.giftType || 0;
		$scope.session_storage = window.sessionStorage;
		$scope.session_storage.setItem('giftType', $scope.type);
		$scope.titleType = $scope.type == 2 ? "拼手气" : '普通';
		//		console.log($scope.type);
		var vm = this;
		$scope.resultCount = 0; //初始化总数
		$scope.resultMoney = 0; //初始化金额
		//		vm.page='giftSelectGoods';
		
		var recommend = giftAPI.getRecommend;
		recommend().then(function(value) {
			$scope.recommendList = value.food_info_list;
			$scope.unfinish_a = value.unfinish_order.specialOrderDetailList;
			if($scope.unfinish_a.length==0){
					$scope.isKong=true;
				}else{
					$scope.isKong=false;
				}
			$scope.unfinish_a.forEach(function(v) {
				$scope.resultCount += v.orderNumber;
				$scope.resultMoney += v.orderNumber * v.standardRetailPrice;
			})

			$scope.recommendList.forEach(function(v) {
				v.number = 0; //初始化数量 
				if($scope.unfinish_a.length >= 0) {
					for(var i = 0; i < $scope.unfinish_a.length; i++) {
						if(v.idCommodity == $scope.unfinish_a[i].idCommodity) {
							v.number = $scope.unfinish_a[i].orderNumber;
						}
					}
				}
			})
		});
		//获取未完成订单方法
		function unfinishOrderCount(v) {
			v.then(function(v) {
				$scope.unfinish_a = v.returnData.tb_special_order_record.specialOrderDetailList;
				if($scope.unfinish_a.length==0){
					$scope.isKong=true;
				}else{
					$scope.isKong=false;
				}
				$scope.resultCount=0;
				$scope.resultMoney=0;
				$scope.unfinish_a.forEach(function(v) {
				$scope.resultCount += v.orderNumber;
				$scope.resultMoney += v.orderNumber * v.standardRetailPrice;
			})
			})
		};
		//增加数量及金额
		$scope.addFoodToOrder = function(id, k) {
			if(k.number!=0 && !k.number) {
				k.number = k.orderNumber;
			}
			k.number++;
			var unfinish = giftAPI.addFood(id, k.number, 0)
			
			unfinishOrderCount(unfinish);
			ohayou(k);
			$scope.session_storage.setItem('k.number', k.number);
		}
		//减少数量及金额
		$scope.jfFoodToOrder = function(id, k) {
			if(k.number==0){
				return;
			}
			if(!k.number) {
				k.number = k.orderNumber;
			}
			if(k.number == 1) {
				var optsAlert = {
					imgUrl: 'img/caution-icon.png',
					title: '将从购物车确认删除？',
					titleContent: "确认后移除"
				}
				var optShow = {
					imgUrl: 'img/1.png',
					title: "已删除",
					titleContent: '继续选购吧'
				}
				popupAPI.popupconfirm(optsAlert, function() {

				}, function() {
					popupAPI.popupAlert(optShow, function() {
						k.number--;
						var unfinish = giftAPI.addFood(id, k.number, 0);
						console.log("执行删除");
						unfinishOrderCount(unfinish);
						onijiang(k);
						$scope.session_storage.setItem('k.number', k.number);
					})
				});
			}else{
				k.number--;
				var unfinish = giftAPI.addFood(id, k.number, 0);
				unfinishOrderCount(unfinish);
				onijiang(k);
				$scope.session_storage.setItem('k.number', k.number);
			}
		}

		//自选商品添加至购物车方法
		$scope.knumber = 0;
		$scope.knumber = 1;
		$scope.addfood = function(id, k) {
			if($scope.session_storage.getItem("id") != id) {
				$scope.knumber = 1;
			}
			$scope.session_storage.setItem("id", id);
			var unfinish = giftAPI.addFood(id, 1, 1);
			unfinishOrderCount(unfinish);
			
			$scope.session_storage.setItem('k.number', $scope.knumbers);
		}

		$scope.isActive = false;
		$scope.isShow = function() {
			$scope.isActive = $scope.isActive === false ? true : false;
		}

		function ohayou(k){
			console.log(k);
			$scope.recommendList.forEach(function(v){
				if(k==v) return;
				if(k.idCommodity==v.idCommodity){
					console.log(v);
					v.number=++k.orderNumber;
				}
			})
		}
		function onijiang(k){
			$scope.recommendList.forEach(function(v){
				if(k==v) return;
				if(k.idCommodity==v.idCommodity){
					console.log(v);
					v.number=--k.orderNumber;
				}
			})
		}






		var http = $cacheFactory.get('$http');
		var goodsPublic = $controller('goodsPublic', {
			$scope: $scope,
			$state: $state
		});
		var staticGroup = [ /*{commodityNavigationName:'促销'},{commodityNavigationName:'新品'}*/ ];
		vm.goodsLoad = goodsLoad; //根据类型加载菜品
		vm.promotionType = promotionType; //促销新品
		vm.refresh = refresh; //上拉刷新  
		pageInit();

		function pageInit() {
			vm.addBasketDirectiveExecutedTimes = 0;
			goodsPublic.getBasketElementByState();
			vm.page = 0;
			vm.hasToTheEnd = false;
			vm.initReady = false;
			$scope.pageReady = false;
			$scope.totalNumber = 0;
			vm.goodsList = [];
			goodsAPI.pageForm().then(function(result) {
				vm.menuData = result.food_type_list;
				Array.prototype.unshift.apply(vm.menuData, staticGroup);
				goodsPublic.countTotalNumerTab(result.unfinish_order_detail);
				vm.selectedGroup = vm.menuData[0];
				groupGoodsLoad().then(function() {
					vm.shownGroup = null;
					vm.initReady = true;
					$scope.pageReady = true;
				})
			});
		}

		function refresh() {
			http.removePattern(/load_big_cls_and_first_sub_cls/); //移除缓存
			http.removePattern(/load_sub_cls/);
			vm.hasToTheEnd = false;
			vm.page = 0;
			vm.goodsList = [];
			goodsLoad();
		}

		function goodsLoad() {
			if(!vm.selectedItem)
				groupGoodsLoad();
			else
				itemGoodsLoad();
		}

		function promotionType(food) {
			return goodsPublic.foodPromotionImage(food);
		}

		function groupGoodsLoad() {
			var def = $q.defer();
			if(!vm.hasToTheEnd) {
				goodsAPI.goodsAType(vm.selectedGroup.idCommodityNavigation, null, vm.page, 20, "default")
					.then(function(result) {
						vm.page += 20;
						vm.hasToTheEnd = result.goodsHasToEnd;
						vm.goodsList.push.apply(vm.goodsList, result.food_subtype_list);
						//						console.log(result.food_subtype_list);
						//						console.log($scope.buy)
						def.resolve();
					}).finally(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.$broadcast('scroll.refreshComplete');
					});
			}
			return def.promise;
		}

		function itemGoodsLoad() {
			if(!vm.hasToTheEnd) {
				goodsAPI.goodsAType(vm.selectedGroup.idCommodityNavigation, vm.selectedItem.idCommodityNavigation, vm.page, 20, "default")
					.then(function(result) {
						vm.page += 20;
						vm.hasToTheEnd = result.goodsHasToEnd;
						vm.goodsList.push.apply(vm.goodsList, result.food_subtype_list);
					}).finally(function() {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.$broadcast('scroll.refreshComplete');
					});
			}
		}
	}

});