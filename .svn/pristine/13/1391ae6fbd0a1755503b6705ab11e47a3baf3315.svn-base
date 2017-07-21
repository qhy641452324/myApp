define(['app'], function(app) {
  app.controller("mainCtrl", MainCtrl);
  app.controller("methodOnRoot", MethodOnRoot);

  MainCtrl.$inject = ['$rootScope', '$scope', '$state','$http','baseUrl','$ionicHistory'];

  function MainCtrl($rootScope, $scope, $state,$http,baseUrl,$ionicHistory) {
    var vm = this;
    $rootScope.totalNumberTab = 0;
    vm.rootData = {};
    vm.clearHistory=clearHistory;
    loginOnBoot();
    forbiddenWalkThroughExceptHome();
    
    function forbiddenWalkThroughExceptHome(){
      if($state.current.name!="tab.home"){
        $rootScope.walkThrough = true;
        $rootScope.startUp = true;
        localStorage.setItem("walkThrough", true);
        sessionStorage.setItem("startUp",true);
      }
      $rootScope.startUp=sessionStorage.getItem("startUp");
      $rootScope.walkThrough=localStorage.getItem("walkThrough");
    }
    
    
    
    function loginOnBoot() {
      var phone = JSON.parse(localStorage.getItem("phoneUser"));
      var password = JSON.parse(localStorage.getItem("passwordUser"));
      if(phone && password) {
        $http({
          method:'post',
          url: baseUrl + "app/login",
          params:{
            mobilePhone: phone,
            enterCode: password,      
          }
        }).then(function(response) {}, function(error) {});
      }
    }
    
    function clearHistory(){
    //  $ionicHistory.removeBackView();
      $ionicHistory.clearHistory();
      
      
    }
  }

  /*建议在contrller、directive中使用，使用时注入$contoller，存放全局性的控制器方法，避免在service中注入scope*/
  MethodOnRoot.$inject = ['$rootScope', '$scope', '$state', '$q'];

  function MethodOnRoot($rootScope, $scope, $state, $q) {
    var vm = this;
    vm.drainTheViewEnterQueue = drainTheViewEnterQueue;

    /*
     @viewEnterQueue,数组形式的函数序列，函数需要是函数变量
     @stateId，当前的$state名称,确保只在当前路由有效
     * */
    function drainTheViewEnterQueue(viewEnterQueue, stateId) {
      var def = $q.defer();
      if(angular.isDefined(viewEnterQueue) && angular.isArray(viewEnterQueue)) {
        $rootScope.$on('$ionicView.enter', function(event, view) {
          if(view.stateId == stateId) {
            try {
              angular.forEach(viewEnterQueue, function(a, i, arr) {
                a();
              });
            } catch(e) {
              def.reject(e);
            }
            def.resolve("success");
          }
        });
      } else {
        def.reject("undefined");
      }
      return def.promise;
    }
  }

})