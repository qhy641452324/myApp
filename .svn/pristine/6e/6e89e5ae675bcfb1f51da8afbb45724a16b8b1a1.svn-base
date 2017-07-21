define(['app', 'routerConfig'], function(app) {
  app.config(function($controllerProvider, $compileProvider, $filterProvider, $provide) {
      app.register = {
        //得到$controllerProvider的引用
        controller: $controllerProvider.register,
        //同样的，这里也可以保存directive／filter／service的引用
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        service: $provide.service,
        factory: $provide.factory,
        decorator: $provide.decorator,
      };
    })
    .config(['$ionicConfigProvider', function($ionicConfigProvider) {
      if(ionic.Platform.isAndroid()) {
        $ionicConfigProvider.scrolling.jsScrolling(true);
        $ionicConfigProvider.views.transition('android');
      }else{
        $ionicConfigProvider.views.transition('ios');
      }
      $ionicConfigProvider.views.maxCache(3);
      //	    $ionicConfigProvider.views.swipeBackEnabled(false);
      $ionicConfigProvider.navBar.alignTitle('center');
      $ionicConfigProvider.platform.ios.tabs.position('bottom');
      $ionicConfigProvider.platform.android.tabs.position('bottom');
    }]).config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.withCredentials = true;
    }])
/*   if(ionic.Platform.isAndroid()){
      app.config(function($ionicNativeTransitionsProvider) {
          $ionicNativeTransitionsProvider.enable(true);
          $ionicNativeTransitionsProvider.setDefaultOptions({
          "duration"          : 200,
          "androiddelay"      : -1, // Longer delay better for older androids
          "triggerTransitionEvent": '$ionicView.enter', 
          });
      });      
    }*/
    
  app.run(['$rootScope', '$log', '$http', function($rootScope, $log, $http) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      //  console.log(toState);
    });
    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
      $log.error('The request state was not found: ' + unfoundState);
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      $log.error('An error occurred while changing states: ' + error);

      $log.debug('event', event);
      $log.debug('toState', toState);
      $log.debug('toParams', toParams);
      $log.debug('fromState', fromState);
      $log.debug('fromParams', fromParams);
    });
  }]);

})