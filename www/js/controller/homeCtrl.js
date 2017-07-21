define(["app", "service/homeService", "commonDirective", "service/exHttpService", "directive/goodsDirective", "commonService"], function(app) {
  adaptSlideByScreenSize(); //根据屏幕尺寸提供轮播初始化数据
  app.register.controller("homeCtrl", HomeCtrl);
  HomeCtrl.$inject = ['$scope', '$state', /*'$cordovaBarcodeScanner',*/ 'homeAPI', '$ionicSlideBoxDelegate', 'exHttp', '$ionicPopup', '$rootScope', 'wechatAPI','$controller'];

  function HomeCtrl($scope, $state, /*$cordovaBarcodeScanner,*/ homeAPI, $ionicSlideBoxDelegate, exHttp, $ionicPopup, $rootScope, wechatAPI,$controller) {
    var vm = this;
    vm.BarcodeScanner = BarcodeScanner; //二维码
    var goodsPublic=$controller('goodsPublic',{$scope:$scope,$state:$state});
    vm.signToday = signToday;
    vm.addBasketDirectiveExecutedTimes=0;
    vm.refresh=refresh;
    vm.goHref=goHref;
    var goodsPublic=$controller('goodsPublic',{$scope:$scope,$state:$state});
    pageDateInit(); //广告轮播

    /*菜单栏数据*/
    vm.menuRow1 = [{title: '比布优选',code: '#icon-bibuyouxuan',goState: 'tab.bibuSelection',}, {title: '拼团',code: '#icon-pintuan',goState: 'tab.groupIndex',}, {title: '每日签到',code: '#icon-meiriqiandao',tapAction: 'home.signToday()',}, 
    {title: '会员商城',code: '#icon-jifenhuiyuan',goState: 'tab.IntegralShop',}, {title: '比布农场',code: '#icon-wodeqiaquan',tapAction: 'home.goHref()',}];
    vm.menuRow2 = [{title: '充值福利',code: '#icon-chongzhifuli',goState: 'tab.rechargePolite'}, {title: '企业福利',code: '#icon-daiding',goState: 'tab.welfare',}, {
      title: '分享有礼',code: '#icon-fenxiangyouli',goState: 'tab.share',}, {title: '生鲜动态',code: '#icon-shengxiandongtai',goState: 'tab.freshDynamic',},{title: '敬请期待',code: '#icon-jingqingqidai',goState: ''}];

    vm.sliderOptions = {
      slidesPerView: slidesPerView,
      freeMode: true,
      paginationClickable: true,
      showPager: false,
      spaceBetween: 10,
    }

    function BarcodeScanner() {
    	cordova.plugins.barcodeScanner.scan(function(){
    		
    	})
    /*  document.addEventListener("deviceready", function() {
        $cordovaBarcodeScanner
          .scan()
          .then(function(barcodeData) {
            // Success! Barcode data is here
          }, function(error) {
            // An error occurred
          });
      }, false);*/
     
    }

    function pageDateInit() {
      goodsPublic.getBasketElementByState();
      homeAPI.upDateLeftTimeOfGrab().then(function(result){
        vm.timeMill=result.times;
      });
      homeAPI.pageForm().then(function(data) {
        data = data.params;
        vm.ads = data.advert_news_list;
        vm.sectionsData=data.returnData;
        goodsPublic.countTotalNumerTab(data.unfinish_order_detail);
        $ionicSlideBoxDelegate.update();
      }).finally(function(){
        splashScreenAndWalkThrough();
      });
    }
    
    function refresh(){
      homeAPI.upDateLeftTimeOfGrab().then(function(result){
        vm.timeMill=result.times;
      });
      homeAPI.pageForm().then(function(data) {
        data = data.params;
        vm.ads = data.advert_news_list;
        vm.sectionsData=data.returnData;
        goodsPublic.countTotalNumerTab(data.unfinish_order_detail);
        $ionicSlideBoxDelegate.update();
      }).finally(function(){
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    

    //处理闪屏和启动页，首页完成请求后关闭闪屏，判断是否是第一次启动，是的话显示引导页，否则显示启动页
    function splashScreenAndWalkThrough() {
      setTimeout(function() {
        try {
          navigator.splashscreen.hide();
        } catch(e) {}
      }, 1000);
      if(!$rootScope.walkThrough) {
        setTimeout(function() {
          $rootScope.walkThrough = true;
          $rootScope.startUp = true;
          localStorage.setItem("walkThrough", true);
          sessionStorage.setItem("startUp",true);
        }, 15000);
      } else {
        setTimeout(function() {
          $rootScope.walkThrough = true;
          $rootScope.startUp = true;
          localStorage.setItem("walkThrough", true);
          sessionStorage.setItem("startUp",true);
        }, 3000);
      }
    }

    function signToday() {
      $ionicPopup.alert({
        template: '<img src="/img/1.png"/><p class="title">签到成功,已签到10天</p>\
          <p class="second-title titleContent">恭喜您，获得5积分</p>\
          <button class="button button-assertive" ng-click="::$buttonTapped(buttons[0], $event)">分享再得10积分</button> \
          <p class="titleContent responsive-h4">天天签到,积分叠加赠送</p>',
        buttons: [{
          onTap: function() {
            wechatAPI.shareLink();
          }
        }],
        cssClass: 'signToday',
      })
    }
    
    
    function goHref(){
      location.href="mobile_farm_game/game_enter.html";
    }
  }

  function adaptSlideByScreenSize() {
    var width = ionic.viewWidth;
    if(width < 410) {
      slidesPerView = 2.5;
    } else if(width < 490) {
      slidesPerView = 3;
    } else if(width < 570) {
      slidesPerView = 3.5;
    } else if(width < 650) {
      slidesPerView = 4;
    } else {
      slidesPerView = 4.5;
    }
  }

});