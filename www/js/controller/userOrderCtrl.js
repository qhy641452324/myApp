define(["app", "service/orderService","directive/orderDirective"], function(app) {
  app.register.controller("userOrderCtrl", UserOrderCtrl);
  UserOrderCtrl.$inject = ['$scope', 'orderAPI', '$state','$controller'];

  function UserOrderCtrl($scope, orderAPI, $state,$controller) {
    var vm = this;
    var orderPublic = $controller('orderPublic', {
      $scope: $scope
    });    
    Init();
    function Init(){
      vm.changeOrder=orderPublic.changeOrder;
      vm.cancelOrder=orderPublic.cancelOrder;
      vm.begin = 0;
      vm.hasToTheEnd = false;
      vm.menus = [{
        title: '未完成'
      }, {
        title: '已完成'
      }, {
        title: '已取消'
      }];
      vm.orders = {
        0: {},
        1: {},
        2: {}
      };
      vm.orderLists = {
        0: [],
        1: [],
        2: []
      };      
      
      for(var i in vm.orders){
        vm.orders[i].hasToTheEnd=false;
        vm.orders[i].begin=0;
        vm.orders[i].hasRefresh=false;
      }
      vm.shipState = shipState;
      vm.orderDetail = orderDetail;
      vm.orderData = orderData;
      vm.doRefresh = doRefresh;
      orderData(true,0);
    }

    function doRefresh(ind) {
      vm.orders[ind].hasToTheEnd=false;
      vm.orders[ind].begin=0;
      vm.orders[ind].hasRefresh=false;
      vm.orderLists[ind]=[];
      orderData(true,ind);
    }

    function orderData(cache,ind) {
      if(!angular.isDefined(ind)) return ;
      var cache = cache;
      var sortType;
      if(vm.orders[ind].hasRefresh) {
        cache = false;
      }
      switch (ind){
      	case 0:
      	  sortType={shipState:2};   
      		break;
        case 1:
          sortType={shipState:4};  
          break;
        case 2:
          sortType={isOnline:1};  
          break;          
      }
      if(!vm.orders[ind].hasToTheEnd) {
        orderAPI.getUserOrderList(vm.begin, cache,sortType).then(function(result) {
          if(!pageListernerInit.hasInit){
            pageListernerInit();
            pageListernerInit.hasInit=true;            
          }
          vm.orderLists[ind]=vm.orderLists[ind].concat(result.orders);
          vm.orders[ind].begin += 20;
          vm.orders[ind].hasToTheEnd = result.hasToTheEnd;
          if(vm.orders[ind].hasToTheEnd) {
            vm.orders[ind].hasRefresh = false;
          }
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }
    }

    function pageListernerInit(){
      var events=$scope.events;
      events.on('slideChange', function(data) {
    //    $ionicScrollDelegate.$getByHandle('eachOrderContent'+vm.slideIndex).scrollTop();
        vm.orderLists[data.index]=[];
        vm.orders[data.index].hasToTheEnd=false;
        vm.orders[data.index].begin=0;
        vm.orders[data.index].hasRefresh=false;        
        orderData(true,data.index);
      });      
    }

    function shipState(state) {
      var orderState;
      switch(state) {
        case 0:
          orderState = "已出货";
          break;
        case 1:
          orderState = "未出货";
          break;
        case 2:
          orderState = "未完成";
          break;
        case 3:
          orderState = "配货中";
          break;
        case 4:
          orderState = "已确认";
          break;
        case 11:
          orderState = "修改中";
          break;
        case 12:
          orderState = "支付中";
          break;
        default:
          break;
      }
      return orderState;
    }

    function orderDetail(e, order) {
      e.stopPropagation();
      e.preventDefault();
      $state.go('tab.userOrderDetail', {
        shipState: order.shipState,
        orderID: order.idOrder
      });

    }


  }
});