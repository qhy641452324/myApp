define(['asyncLoader'], function(asyncLoader) {
/*  if(ionic.Platform.isAndroid()){
    var app = angular.module("myModule", ['ionic', 'ui.router', 'ngCordova', 'globalDirective', 'appDecorator','highcharts-ng','ionic-native-transitions','ngAnimate']);
  }else{*/
    var app = angular.module("myModule", ['ionic', 'ui.router', 'ngCordova', 'globalDirective', 'appDecorator','highcharts-ng','ngAnimate']);
 // }

  app.run(function($rootScope, $stateParams, $state, $ionicPlatform, platformAPI, $ionicLoading, $timeout) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      //TODO:返回按钮控制
      $ionicPlatform.registerBackButtonAction(function(e) {
        e.preventDefault();
        platformAPI.backBtnProcess();
        return false;
      }, 120);
      
    });
  });
  asyncLoader.configure(app);
  return app;
});