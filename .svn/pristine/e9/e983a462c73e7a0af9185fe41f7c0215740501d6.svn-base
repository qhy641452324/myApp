(function(window) {
  require.config({
    baseUrl: 'js/',
    paths: {
      jquery: 'base/jquery-2.2.3.min',
      fxCommon: 'base/fx.common',
      app: "app",
      mainConfig: 'mainConfig',
      mainCtrl: 'mainCtrl',
      asyncLoader: 'base/angular-async-loader.min',
      simplePicker:'base/simple-picker',
      ionicNativeTransitions:'base/ionic-native-transitions',
      Storage: 'service/storage',
      addressService: "service/addressService",
      commonService: "service/commonService",
      commonDirective: "directive/commonDirective",
      formDirective: "directive/formDirective",

      decorator: "decorator/decorator",
    },
    shim: {
      app: {
        deps: ['service/platformService', '../js/decorator/globalDecorator', 'directive/globalDirective','ionicNativeTransitions']
      },
    },
  });
  require(['app', 'mainConfig', 'mainCtrl'], function() {
    angular.bootstrap(document, ['myModule']);
    ionic.viewWidth=document.getElementsByTagName("ion-nav-view")[0].offsetWidth;
  });
})(window)