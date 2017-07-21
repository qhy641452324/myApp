(function(angular) {
  angular.module("platformModule", [])
    .service("platformAPI", PlatformAPI)
    .constant("baseUrl", { //定义服务器
      0: 'http://app.jialebao.me/', //测试带域名的37
      1: 'http://cs.jialebao.me/', //测试 第八个工作日
      2: 'http://baicai.jialebao.me/', //测试 第九个工作日
      888: 'http://192.168.1.37/', //: PATH //37
    }[888])

  PlatformAPI.$inject = ['$state', '$cordovaToast', '$ionicHistory', '$timeout', '$ionicPlatform']

  function PlatformAPI($state, $cordovaToast, $ionicHistory, $timeout, $ionicPlatform) {
    var backButtonPressedOnceToExit = false; //已经点过一次回退键
    var screenData = {
      windowMaxHeight: function() {}, //键盘关闭时屏幕高度
      windowMinHeight: function() {}, //键盘开启时屏幕高度
      keyboardHeight: function() {}, //键盘高度
      ready: false //尺寸是否已全部赋值
    };
    var self = this;
    var keyboardStatus = {
      hadJustHide: function() {}, //初始化为函数，如果获取时也是函数则证明是无效值
      isOpen: function() {},
    };
    return {
      backBtnProcess: BackBtnProcess, //回退键处理逻辑
      disableKeyboard: DisableKeyboard, //关闭ionic键盘
      enableKeyboard: EnableKeyboard, //开启ionic键盘
      getScreenData: getScreenData, //获取屏幕参数
      setScreenData: setScreenData,
      getKeyboardStatus: getKeyboardStatus, //关闭ionic键盘功能时有效，读键盘状态
      setKeyboardStatus: setKeyboardStatus, //关闭ionic键盘功能时有效，写键盘状态
    }

    function BackBtnProcess() {
      var tabStr=['_tab.buy_','_tab.gift_','_tab.basket_','_tab.user_'];
      var backView = $ionicHistory.backView();
      var currentState = $state.current.name;
      if(!angular.isFunction(keyboardStatus.hadJustHide)&&keyboardStatus.hadJustHide) {
        keyboardStatus.hadJustHide = false;//确保键盘刚刚关闭时，不会触发此事件
      } else {
        if(backButtonPressedOnceToExit) {
          window.plugins.appMinimize.minimize();
        } else {
          if(backView && tabStr.indexOf('_'+currentState+'_')>-1){
            $state.go("tab.home");
          } else if(backView && currentState !== "tab.home") {//有历史记录且历史记录不等于home，在使用原生过渡插件下且在登录页采用后退形式进入home，否则直接后退到历史记录
            if(currentState !== "login") {
              $ionicHistory.goBack();
            } else {
              $state.go("tab.home");
            }
          } else {
            if(!backView&& currentState !== "tab.home"){//如果没有历史记录且当前历史记录不为home，返回home
              $state.go("tab.home");           
            }else{
            backButtonPressedOnceToExit = true;//如果在
              try{
              	$cordovaToast.showShortBottom("再按一次退出程序");
              }catch(e){}
              setTimeout(function() {
                backButtonPressedOnceToExit = false;
              }, 2000);              
            }
          }
        }
      }
    }

    function DisableKeyboard() {
      $ionicPlatform.ready(function() {
        if(window.ionic && window.ionic.keyboard) {
          window.ionic.keyboard.disable();
        }
      });
    }

    function EnableKeyboard() {
      $ionicPlatform.ready(function() {
        if(window.ionic && window.ionic.keyboard) {
          window.ionic.keyboard.enable();
        }
      });
    }

    //获取屏幕参数
    function getScreenData() {
      return screenData;
    }
    //设置屏幕参数
    function setScreenData(key, value) {
      if(screenData.hasOwnProperty(key) && angular.isNumber(value)) {
        screenData[key] = parseInt(value);
      }
    }

    function getKeyboardStatus() {
      return keyboardStatus;
    }

    function setKeyboardStatus(key, value) {
      if(keyboardStatus.hasOwnProperty(key)) {
        keyboardStatus[key] = (angular.isDefined(value) ? !!value : keyboardStatus[key]);
      }
    }

  }
})(angular);