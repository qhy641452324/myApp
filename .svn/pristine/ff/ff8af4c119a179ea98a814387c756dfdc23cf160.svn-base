define(["app", "commonService", 'service/exHttpService'], function(app) {
  app.register.controller("shareCtrl", ShareCtrl);

  ShareCtrl.$inject = ['$state', 'wechatAPI', 'exHttp', '$http']

  function ShareCtrl($state, wechatAPI, exHttp, $http) {
    var vm = this;
    vm.share = share;

    function share() {
      shareWechat();
    }

    function shareWechat() {
      wechatAPI.shareLink();
    }

  }

});