define(["app", "service/giftService", "controller/basketCtrl", "commonDirective"], function(app) {
	app.register.controller("giftPayCtrl", GiftPayCtrl);

	GiftPayCtrl.$inject = ['$scope', 'giftAPI', '$state','popupAPI']

	function GiftPayCtrl($scope, giftAPI, $state,popupAPI) {
		var vm = this;
		vm.pageReady = false;

		$scope.giftType = sessionStorage.getItem('giftType');
		console.log($scope.giftType);

		vm.consumeScoreCost = 0;
		vm.priceCost = 0;
		vm.weiChatCost = 0;
		vm.aliPayCost = 0;
		var lackingPay, totalCost; //缺少的支付金额，所有应支付金额,微信支付宝支付上限

		var payValues = {
			consumeScore: {
				checkbox: 'homeMoney',
				value: 0
			},
			price: {
				checkbox: 'ownMoney',
				value: 0
			},
			wechat: {
	        checkbox: 'weichatPay',
	        value: 999999999999
	      },
	      ali: {
	        checkbox: 'aliPay',
	        value: 999999999999
	      }            
		};

		function conPayType() {
			var str = '';
			if(vm.homeMoney || vm.ownMoney || vm.weichatPay || vm.aliPay || vm.dianxinPay) {
				if(vm.homeMoney) {
					str += '3,';
				}
				if(vm.ownMoney) {
					str += '1,';
				}
			} else {
				popupAPI.popupCautionWithoutCallback('请选择支付方式。')
			}
			return str;
		}

		$scope.resultCount = 0;
		$scope.resultMoney = 0;
		$scope.giftCount = 1;
		var recommend = giftAPI.getRecommend;
		recommend().then(function(value) {
			$scope.recommendList = value.food_info_list;
			if(!!value.unfinish_order){
				$scope.unfinish_b = value.unfinish_order.specialOrderDetailList;
			}
			

			$scope.unfinish_b.forEach(function(v) {
				$scope.resultCount += v.orderNumber;
				totalCost = $scope.resultMoney += v.orderNumber * v.standardRetailPrice;
			})

			$scope.recommendList.forEach(function(v) {
				v.number = 0; //初始化数量 
				if($scope.unfinish_b.length >= 0) {
					for(var i = 0; i < $scope.unfinish_b.length; i++) {
						if(v.idCommodity == $scope.unfinish_b[i].idCommodity) {
							v.number = $scope.unfinish_b[i].orderNumber;
						}
					}
				}
			})
		});
		//获取订单
		//leftMoney  账户余额
		//user_score 家元余额
		//差额
		$scope.differ = 0;
		$scope.specialOrder;
		giftAPI.getSpecialOrder().then(function(v) {
			vm.price = payValues.price.value = v.returnData.leftMoney; //余额
			vm.consumeScore = payValues.consumeScore.value = v.returnData.user_score; //剩余家元
			$scope.specialOrder = v.returnData;
			console.log(v.returnData);

		});

		$scope.checkItem = function() {
			var args = Array.prototype.slice.call(arguments, 0);
			var itemChecked = arguments[0];
			args.shift();
			if(vm[itemChecked]) {
				for(var i in args) {
					vm[args[i]] = false;
				}
			}
			calculateCostView();
		}

		function calculateCostView() {
			lackingPay = totalCost;
			for(var i in payValues) {
				lackingPayTemp = lackingPay
				if(vm[payValues[i].checkbox] && lackingPay) {
					if(payValues[i].value - lackingPay >= 0) {
						vm[i] = (payValues[i].value - lackingPay);
						lackingPay = 0;
					} else {
						vm[i] = 0;
						lackingPay = (lackingPay - payValues[i].value);
					}
					vm[i + 'Cost'] = payValues[i].value - vm[i];
				} else {
					vm[i] = payValues[i].value;
					vm[i + 'Cost'] = 0;
					lackingPay = totalCost;
				}
			}
			//  	
		}
		//支付方式
		function conPayType() {
			var str = '';
			if(vm.homeMoney || vm.ownMoney || vm.weichatPay || vm.aliPay || vm.dianxinPay) {
				if(vm.homeMoney) {
					str += '3,';
				}
				if(vm.ownMoney) {
					str += '1,';
				}
			} else {
				popupAPI.popupCautionWithoutCallback('请选择支付方式。')
			}
			return str;
		}

		//结算
		$scope.payAll = function() {
			var id = $scope.specialOrder.tb_special_order_record.idOrder;
			var type = sessionStorage.getItem('giftType');
			var count = type == 2 ? $scope.resultCount : $scope.giftCount;
			var payTypeStr = conPayType(); //支付方式
			var channelType = 2;
			if(payTypeStr) {
				giftAPI.subSpecialOrder(id, type, payTypeStr, channelType, count).then(function(response) {
					$state.go("tab.GiftRedPackShare",{result:response});
				});
			}

		}

	}

});