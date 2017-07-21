define(["app", "service/goodsService","commonDirective","directive/goodsDirective"], function(app) {
  app.register.controller("bibuSelectionCtrl", bibuSelectionCtrl);
  bibuSelectionCtrl.$inject = ['$scope', 'goodsAPI', '$q','$ionicScrollDelegate','$cacheFactory'];
  function bibuSelectionCtrl($scope, goodsAPI, $q,$ionicScrollDelegate,$cacheFactory) {
    var vm = this;
    var events;
    var http=$cacheFactory.get('$http');    
    vm.hasToTheEnd = false;
    vm.pageStart=0;
    vm.goodsLoad=goodsLoad;
    vm.hasToTheEnd=false;
    vm.slideIndex=0;
    vm.refresh=refresh;
    
    pageDataInit();
    
    function goodsType() {
      var def = $q.defer();
      goodsAPI.loadChildCls().then(function(result) {
        def.resolve(result.food_child_type_list);
      });
      return def.promise;
    }

    function pageDataInit(){
      $scope.pageReady=false;
      goodsType().then(function(result){
        var typeMenu=result;
        goodsAPI.loadSubClsNew(vm.pageStart,20,typeMenu[0].idCommodityCategory)
        .then(function(result){
          vm.menus=typeMenu;
          vm.foods={};
          for(var i=0;i<typeMenu.length;i++){
            vm.foods[i]=[];
          }
          vm.hasToTheEnd=result.hasToTheEnd;
          vm.foods[0]=result.foods;
          vm.pageStart+=20;
          pageListernerInit();
          $scope.pageReady=true;
        });
      });
    }
    
    function pageListernerInit(){
      events=$scope.events;
      events.on('slideChange', function(data) {
        vm.slideIndex=data.index;
        $ionicScrollDelegate.$getByHandle('eachFoodContent'+vm.slideIndex).scrollTop();
        vm.foods[data.index]=[];
        vm.pageStart=0;
        vm.hasToTheEnd=false;
        goodsLoad();
      });      
    }

    function goodsLoad() {
      if(!vm.hasToTheEnd){
        goodsAPI.loadSubClsNew(vm.pageStart, 20,vm.menus[vm.slideIndex].idCommodityCategory)
          .then(function(result) {
            Array.prototype.push.apply(vm.foods[vm.slideIndex],result.foods);
            vm.hasToTheEnd = result.hasToTheEnd;
            vm.pageStart+=20;
          }).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
          });         
      }
    }
    
    function refresh(){
      vm.pageStart=0;
      vm.hasToTheEnd=false
      vm.foods[vm.slideIndex]=[];
      http.removePattern(/load_sub_cls_new/);
      goodsLoad();
    }

  }

});