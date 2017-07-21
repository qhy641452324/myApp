define(["app", "service/orderService","directive/orderDirective"], function(app) {
  app.register.controller("userOrderDetailCtrl", UserOrderDetailCtrl);
  UserOrderDetailCtrl.$inject = ['$scope', '$state', 'orderAPI','$controller'];

  function UserOrderDetailCtrl($scope, $state, orderAPI,$controller) {
    var vm = this;
    var orderPublic = $controller('orderPublic', {
      $scope: $scope
    });
    vm.changeOrder=orderPublic.changeOrder;
    vm.cancelOrder=orderPublic.cancelOrder;    
    vm.idOrder = $state.params.orderID;
    vm.virtualOrder={idOrder:vm.idOrder};
    vm.shipState = $state.params.shipState;
    vm.editReceivingInfo = editReceivingInfo;
    vm.initPage=initPage;
    initPage(true);

    function initPage(first) {
      $scope.pageReady=false;
      orderAPI.getOrderdetails(vm.idOrder,true).then(function(result) {
        vm.orderDetail = result.orderDetail;
        vm.orderRecord = result.order_record;
        vm.orderRecord.afterOrMor=result.after_or_mor;
        vm.timeList = result.time_list;
        vm.orderTypeCH = result.orderTypeCH;
        vm.allData = result;
        vm.orderTimeCH = result.orderTimeCH;
        vm.requireTimeCH = result.requireTimeCH;
        /*现金券
        var strTest='{"deductionTicketUseMoney":0,"deductionTicketMoney":10,"deductionPresentedMoney":0,"idDeductionTicketFlow":2080938,"idDeductionTicketConfig":15,"idUserSend":-100,"idUserReceive":23076,"sendTime":"May 13, 2017 2:24:08 PM","receiveTime":"May 13, 2017 2:24:08 PM","idOrder":977050,"isStore":0}';
        vm.deduction_ticket_config=JSON.parse(strTest);
        console.log(vm.deduction_ticket_config);*/
        if(!!!first){
          $scope.$broadcast('scroll.refreshComplete');
        }
        $scope.pageReady=true;
      });
    }

    function editReceivingInfo() {
      $state.go("tab.receivingInfo", {
        orderID: vm.idOrder,
      });
    }
  }
});