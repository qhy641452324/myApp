define(["app"], function(app) {
	app.register.controller("customerHelpCtrl", CustomerHelpCtrl);
	CustomerHelpCtrl.$inject = ["$scope"]

	function CustomerHelpCtrl($scope) {
		$scope.groups = [{
			"id": 1,
			"name": "1.收到的商品有问题怎么办？",
			"childItems": [{
				"childName": "只要您发现我们的菜不新鲜不实惠，或者不准时，都可以无条件换货或者退货。",
			}]
		}, {
			"id": 2,
			"name": "2.买菜需要运费吗，或者有最低起送价吗",
			"childItems": [{
				"childName": "哪有什么最低起送价，只要您来买就免费送",
			}]
		},{
			"id": 3,
			"name": "3.收菜时间？",
			"childItems": [{
				"childName": "我们的收货时间是由您自己来决定的，精确到分钟不相信您就去试试吧！",
			}]
		},{
			"id": 4,
			"name": "4.退款时间？",
			"childItems": [{
				"childName": "未出货前，取消订单立即退款；出货后，需联系客服要求退款",
			}]
		},{
			"id": 5,
			"name": "5.退款后已经发放的积分是否回收？",
			"childItems": [{
				"childName": "退款后，根据所退金额回收相同金额的积分，可以在积分明细中查看",
			}]
		},{
			"id": 6,
			"name": "6.积分怎么获得？如何使用？",
			"childItems": [{
				"childName": "你可以在APP中的积分会员里查看积分规则",
			}]
		},{
			"id": 7,
			"name": "7.优惠券怎么用？",
			"childItems": [{
				"childName": "添加购买商品至购物车，点击页面下方【购物车】--【结算】--填单页面选择优惠券--【支付】",
			}]
		},{
			"id": 8,
			"name": "8.可不可以开发票？",
			"childItems": [{
				"childName": "1.家元卡部分的发票需要在购买家元卡时申请，不可以在线申请；2.活动经费表示家乐宝赠送的费用，不可申请发票；3.其他线上账户余额支付或充值的部分，可以在线申请发票",
			}]
		},{
			"id": 9,
			"name": "9.送货上门联系不到您怎么办？",
			"childItems": [{
				"childName": "若宝哥在配送期间无法联系到您，宝哥会立即通知客服，让客服继续联系您",
			}]
		},{
			"id":10,
			"name": "10.温馨提示？",
			"childItems": [{
				"childName": "由于生鲜类商品具有新鲜度，易腐性等特点，收货时，请当场验收，如有质量问题可当场拒收，要求退换货；若已经签收，也可联系客服要求退换货",
			}]
		}];

		$scope.toggleGroup = function(group) {
			if($scope.isGroupShown(group)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = group;
			}
			// $ionicScrollDelegate.resize();
		}

		$scope.toggleSubGroup = function(item) {
			if($scope.isSubGroupShown(item)) {
				$scope.shownChild = null;
			} else {
				$scope.shownChild = item;
			}
			// $ionicScrollDelegate.resize();
		}

		$scope.isGroupShown = function(group) {
			return $scope.shownGroup === group;
		}

		$scope.isSubGroupShown = function(item) {
			return $scope.shownChild === item;
		}
	}

});