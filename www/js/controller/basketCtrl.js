define(["app", "service/orderService", "service/goodsService", "directive/goodsDirective", "commonDirective", "directive/orderDirective", "formDirective","commonService","service/userService"], function(app) {
  app.register.controller("basketCtrl", BasketCtrl);

  BasketCtrl.$inject = ['$scope', '$state', 'orderAPI', '$controller', 'goodsAPI', 'popupAPI','wechatAPI','userAPI','$parse']

  function BasketCtrl($scope, $state, orderAPI, $controller, goodsAPI, popupAPI,wechatAPI,userAPI,$parse) {
    var vm = this;
    vm.pageReady = false;
    var goodsPublic = $controller('goodsPublic', {
      $scope: $scope
    });
    var methodOnRoot = $controller('methodOnRoot', {
      $scope: $scope
    });
    var orderPublic = $controller('orderPublic', {
      $scope: $scope
    });
    //    methodOnRoot.drainTheViewEnterQueue([formDataInit],'tab.basket');
    vm.initData = orderPublic.initData;
    vm.updateAddressOnlyInView = orderPublic.updateAddressOnlyInView;
    vm.processSubmitData = orderPublic.processSubmitData;
    vm.selectAnAddress=orderPublic.selectAnAddress;
    vm.bindTotalPrice = bindTotalPrice;
    vm.statements = statements;
    vm.formDataInit=formDataInit;
    vm.consumeScoreCost = 0;
    vm.priceCost = 0;
    vm.wechatCost = 0;
    vm.aliCost = 0;
    var lackingPay, totalCost; //缺少的支付金额，所有应支付金额//
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

    vm.checkItem = checkItem;
    $scope.saveAddrRequest = true;

    formDataInit();
    vm.removeFromFoodList = removeFromFoodList;
    vm.addBasketDirectiveExecutedTimes = 0;
    $scope.totalNumber = 0;
    goodsPublic.getBasketElementByState();

    function formDataInit() {
      vm.pageReady = false;
      $scope.idOrder = sessionStorage.getItem("unfinishOrderId");
      if(!!$scope.idOrder && $scope.idOrder !== "0" && !isNaN($scope.idOrder)) {
        hasUnfinishedOrder();
      } else {
        noneUnfinishedOrder();
      }
      function hasUnfinishedOrder() {
        vm.orderDetail = [];
        vm.initData().then(function(response) {
          $scope.deductionTicket=response.deduction_ticket_config;
          vm.price = payValues.price.value = response.price; //余额
          vm.consumeScore = payValues.consumeScore.value = response.consumeScore; //剩余家元
          $scope.$root.orderId = $scope.idOrder;
          if(!!$scope.deductionTicket){
            userAPI.getDeductionTicket().then(function(response){
              vm.tickets=response;
              fn();
            });
          }else{
            fn();
          }   
          $scope.$broadcast('scroll.refreshComplete');
          function fn(){
            vm.orderDetail = Array.prototype.slice.call(response.orderDetail, 0);
            goodsPublic.countTotalNumerTab(vm.orderDetail);
            vm.pageReady = true;            
          }
        }, function(error) {
          noneUnfinishedOrder();
          $scope.$broadcast('scroll.refreshComplete');
        });
      }

      function noneUnfinishedOrder() {
        vm.pageReady = true;
        $scope.idOrder = false;
      }
      pageWatchers();
    }

    function removeFromFoodList(item) {
      goodsPublic.removeFromFoodList(item, vm.orderDetail, true);
    }

    function pageWatchers() {
      $scope.$watch("totalCost", function() {
        calculateCostView();
      });
    }

    function conPayType() {
      var str = '';
      if(vm.homeMoney || vm.ownMoney || vm.weichatPay || vm.aliPay || vm.dianxinPay) {
        if(vm.homeMoney) {
          str += '3,';
        }
        if(vm.ownMoney) {
          str += '1,';
        }
        if(vm.aliPay || vm.weichatPay){
          str += '2,';  
        }
      } else {
        popupAPI.popupCautionWithoutCallback('请选择支付方式。')
      }
      return str;
    }
    
    function payType(){
      if(vm.weichatPay){
        return 0;
      }else if(vm.aliPay){
        return 2;
      }else{
        return null;
      }
    }
    

    function statements() {
      if($scope.downToCtrlHierarchy.selectedAddressId <= 0) {
        popupAPI.popupCautionWithoutCallback('请选择收菜地址。');
        return ;
      }
      var dateTime = vm.processSubmitData(true, false,true);
      if(!dateTime) return;
      var payTypeStr = conPayType();
      var payTypeNum=payType();
      if(payTypeStr) {
        orderAPI.submitOrder($scope.downToCtrlHierarchy.selectedAddressId, dateTime, null, payTypeStr, payTypeNum, 1, vm.note).then(function(result) {
       /*   if(!!!result.is_direct_pay){
           
          }
         console.log(result);
           return ;*/
          
          popupAPI.popupAlert({
              imgUrl: '../img/1.png',
              title: '结算成功',
              titleContent: '结算成功,您的订单将在 ' + $scope.requiredTimeStr + '送达'
            },  
            function() {
              if(result.unfinish_order&&result.unfinish_order.idOrder&&result.unfinish_order.allMoney){
                storeUnfinishOrderId(result.unfinish_order.idOrder);
              }else{
                storeUnfinishOrderId(0);
              }
              setTimeout(function(){
                $state.go("tab.userOrder"); 
              });              
            });
        });
      }
    }
    
    function storeUnfinishOrderId(idOrder){
      sessionStorage.setItem('unfinishOrderId', idOrder);
      $scope.$root.orderId = idOrder;
      $scope.$root.totalNumberTab=0;
    }
    
    function checkItem() {
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
    
    function tickTextDescription(){  
      var watcher=$scope.$watch("totalCost",function(n){
        if(!n||!!!$scope.deductionTicket){
          return vm.tickTextDescriptionText="暂无可用优惠券";    
        }else{
          if(vm.tickets&&vm.tickets.unused.length){
            var count=0;
            if(n>=50&&n<100){
              for(var i in vm.tickets.unused){
                vm.tickets.unused[i].canUse=true;
              }
              return vm.tickTextDescriptionText=vm.tickets.unused.length+"张可用";
            }else if(n>=100){
              var count=0;
              for(var i in vm.tickets.unused){
                if(vm.tickets.unused[i].deductionTicketUseMoney==100){
                  count++;
                  vm.tickets.unused[i].canUse=true;
                }
                else
                  vm.tickets.unused[i].canUse=false;
              }
              return vm.tickTextDescriptionText=count+"张可用";
            }
          }          
        }
      });
    }

    function calculateCostView() {
      var lackingPayTemp;
      lackingPay = totalCost;
      for(var i in payValues) {
        lackingPayTemp = lackingPay;
        if(!!vm[payValues[i].checkbox] && lackingPay) {
          if(payValues[i].value - lackingPay >= 0) {
            vm[i] = (payValues[i].value - lackingPay);
            lackingPay = 0;
          }else {
            vm[i] = 0;
            lackingPay = (lackingPay - payValues[i].value);
          }
          vm[i + 'Cost'] = payValues[i].value - vm[i];
        } else {
          vm[i] = payValues[i].value;
          vm[i + 'Cost'] = 0;
          lackingPay = lackingPayTemp;
        }
      }
    }
    
    function bindTotalPrice() {
      if(!arguments.callee.first){
        arguments.callee.first=true;
        tickTextDescription();
      }      
      $scope.totalCost = totalCost = goodsPublic.bindTotalPrice(vm.orderDetail, 'unitPrice', 'orderNumber');
      return '\245' + totalCost.toFixed(2);
    }
    /*
     *conPayType：1.余额支付 2.第三方支付 3.家元支付
     *payType:0.微信  2.支付宝 
     * */

  }

});