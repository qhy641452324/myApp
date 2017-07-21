define(["app","directive/orderDirective"],function(app){
  app.register.controller("receivingInfoCtrl",ReceivingInfoCtrl);
  ReceivingInfoCtrl.$inject=['$scope','$state','$controller'];
  function ReceivingInfoCtrl($scope,$state,$controller){
    var vm=this;
    var orderRequiredTime;
    $scope.idOrder=$state.params.orderID;
    var orderPublic = $controller('orderPublic', {
      $scope: $scope
    });   
    initData=orderPublic.initData;
    vm.updateAddressOnlyInView=orderPublic.updateAddressOnlyInView;
    vm.submitReceivingInfo=orderPublic.submitReceivingInfo;
    vm.selectAnAddress=orderPublic.selectAnAddress;
    vm.refreshPage=refreshPage;
    refreshPage(true);
    
    function refreshPage(first){
      $scope.pageReady=false;
      initData().then(function(){
        $scope.pageReady=true;
        if(!!!first){
          $scope.$broadcast('scroll.refreshComplete');
        }
      })
    }

  }  
});