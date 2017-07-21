define(['app', 'service/redefinedIONService'], function(app) {
  (function(app) {
    app.register.service("validator", Validator);
    app.register.service("commonMethod", CommonMethod);
    app.register.factory('storage', storage);
    app.register.factory('publicToast', PublicToast); //公共模块toast
    app.register.factory("wechatAPI", WechatAPI);
    app.register.service("Loading", Loading);

    function CommonMethod() {
      return {
        server: server,
        getRandom: getRandom,
        getUrlPare: getUrlPare, //获取url中对应参数
        stripScript: stripScript, // js脚本中过滤特殊字符
        check_is_weichat: check_is_weichat, //是否是微信
        check_is_andriod: check_is_andriod, //是否是安卓
        check_is_ios: check_is_ios, //是否是ios
        getRandomBetween: getRandomBetween, //获取x和y区间内的随机数
        check_platform: check_platform, //系统检测
        getFormatDay: getFormatDay //时间格式转换
      }

      function server() { //服务器环境
        return {
          0: 'http://www.jialebao.cc/', //生产
          1: 'http://cs.jialebao.me/', //测试
          888: 'http://192.168.1.57:8080/jialebao/' //本地
        }[888]
      }

      function getRandom(n) {
        var charactors = "1234567890";
        var value = '',
          i;
        for(j = 1; j <= n; j++) {
          i = parseInt(10 * Math.random());
          value = value + charactors.charAt(i);
        }
        return value;
      }
      //获取url中对应参数
      function getUrlPare(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) return unescape(r[2]);
        return null;
      }
      /**
       * js脚本中过滤特殊字符：
       * */
      function stripScript(s) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        var rs = "";
        for(var i = 0; i < s.length; i++) {
          rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;

      }
      /**
       *判断手机系统是android还是ios
       * @param id
       * @return
       */
      function check_is_weichat() {
        var is_weichat = false;
        if(/MicroMessenger/i.test(navigator.userAgent)) {
          is_weichat = true;
        }
        return is_weichat;
      }

      function check_is_andriod() {
        var is_andriod = false;
        if(/android/i.test(navigator.userAgent)) {
          is_andriod = true;
        }
      }

      function check_is_ios() {
        var is_ios = false;
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          is_ios = true;
        }
      }
      /**
       *生成从x到y的随机数
       * @param id
       * @return
       */
      function getRandomBetween(x, y) {
        var r = Math.round(Math.random() * (y - x)) + x;
        return r;

      }
      /**
       *检测当前系统平台
       * @param id
       * @return
       */
      function check_platform() {
        if(/android/i.test(navigator.userAgent)) {
          return "android"; //这是Android平台下浏览器
        }
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          return "ios"; //这是iOS平台下浏览器
        }
        if(/Linux/i.test(navigator.userAgent)) {
          return "linux"; //这是Linux平台下浏览器
        }
        if(/MicroMessenger/i.test(navigator.userAgent)) {
          return "weichat"; //这是微信平台下浏览器
        }
      }

      function getFormatDay(dateMill, stringify) {
        if(!!dateMill) {
          var date = new Date(dateMill);
          var dateObj = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            day: date.getDay(),
            h: date.getHours(),
            m: date.getMinutes(),
            s: date.getSeconds(),
            dayCH: getDayCH(date)
          };
          if(stringify) {
            dateObj.month = dateObj.month < 10 ? ('0' + dateObj.month) : ('' + dateObj.month);
            dateObj.date = dateObj.date < 10 ? ('0' + dateObj.date) : ('' + dateObj.date);
            dateObj.h = dateObj.h < 10 ? ('0' + dateObj.h) : ('' + dateObj.h);
            dateObj.m = dateObj.m < 10 ? ('0' + dateObj.m) : ('' + dateObj.m);
          }
          return dateObj;
        } else {
          return null;
        }
      }

      function getDayCH(date) {
        switch(date.getDay()) {
          case 0:
            return '星期日';
            break;
          case 1:
            return '星期一';
            break;
          case 2:
            return '星期二';
            break;
          case 3:
            return '星期三';
            break;
          case 4:
            return '星期四';
            break;
          case 5:
            return '星期五';
            break;
          case 6:
            return '星期六';
            break;
          default:
            break;
        };
      }
    }

    function Validator() {
      return {
        checkMobile: checkMobile, //验证手机号
        checkCapcha: checkCapcha, //验证验证码
        checkPassword: checkPassword, //验证密码
      }
      /**
       *校验手机号，以1开头
       * @param id
       * @return
       */
      function checkMobile(str) {
        var re = /^1\d{10}$/;
        var ste = /^0\d{10}$/;
        if(re.test(str) && str.length == 11 || ste.test(str) && str.length == 11) {
          return true;
        } else {
          return false;
        }
      }

      function checkCapcha(str) {
        var pattern = /^\d{4}$/;
        if(pattern.test(str)) {
          return true;
        } else {
          return false;
        }
      }

      function checkPassword(str) {
        var pattern = /^(\w){1,20}$/;;
        if(pattern.test(str)) {
          return true;
        } else {
          return false;
        }
      }
    }

    PublicToast.$inject = ['$ionicLoading'];

    function PublicToast($ionicLoading) {
      return {
        show: show
      }

      function show(text) {
        try {
          window.plugins.toast.showWithOptions({
            message: text,
            duration: "1000",
            position: "center",
            styling: {
              opacity: 0.6,
              backgroundColor: '#000000',
              textColor: '#FFFFFF',
              textSize: 15,
              cornerRadius: 9,
              horizontalPadding: 20,
              verticalPadding: 20
            }
          });
        } catch(e) {
          $ionicLoading.show({
            template: text,
            noBackdrop: true,
            duration: 1000
          });
        }
      }
    }

    function storage() {
      var storage = window.localStorage;
      var json = window.JSON;
      return {
        set: set,
        get: get,
        clear: clear,
        remove: remove
      };

      function set(key, value) {
        storage.setItem(key, json.stringify(value));
      }

      function get(key) {
        var value = json.parse(storage.getItem(key));
        if(null != value) {
          return value;
        }
        return undefined;
      }

      function clear() {
        storage.clear();
      }

      function remove(key) {
        storage.removeItem(key);
      }
    }

    WechatAPI.$inject = ['baseUrl', '$q','publicToast']

    function WechatAPI(baseUrl, $q,publicToast) {
      return {
        isInstalled: isInstalled,
        shareLink: shareLink,
        auth: auth,
      }

      function isInstalled() {
        var def = $q.defer();
        try {
          Wechat.isInstalled(function(installed) {
            def.resolve(installed);
          }, function(reason) {
            publicToast.show("您的手机未安装微信。");
            def.reject(reason);
          });
        } catch(e) {
          publicToast.show("您的手机未安装微信。");
        }
        return def.promise;
      }

      function shareLink(opts) {
				
        var defautOpts = {
          title: "家乐宝商城",
          description: "家乐宝商城",
          thumb: "https://mmbiz.qlogo.cn/mmbiz_png/psZaFZyqw05aWBwAEqvYgR6yBBqiciaO1ejrSGp5n5VibiclAHT7xqLL5QyXk5t5IemjBlxnC6hTCH2ZqWHP0syLBw/0?wx_fmt=png",
          link: baseUrl + "/#/tab/home",
          scene:(function(){ try {return Wechat.Scene.SESSION;}catch(e){return 1}}()),
          callback: function() {}
        };
        opts = angular.extend({}, defautOpts, opts);
        isInstalled().then(function() {
          try {
            Wechat.share({
              message: {
                title: opts.title,
                description: opts.description,
                thumb: opts.thumb,
                media: {
                  type: Wechat.Type.WEBPAGE,
                  webpageUrl: opts.link
                }
              },
              scene:opts.scene  // share to Timeline
            }, function(result) {
              opts.callback();
            }, function(reason) {
              publicToast.show("分享失败，错误原因：" + reason);
            });
          } catch(e) {}
        });
      }

      function auth() {
        var def=$q.defer();
        var scope = "snsapi_userinfo",
          state = "_" + (+new Date());
        Wechat.auth(scope, state, function(response) {
          console.log(response);
         
          def.resolve(response);
        }, function(reason) {
          alert("Failed: " + reason);
        });
        return def.promise;
      }

    }

    function Loading($ionicdefinedLoading, $timeout) {
      return {
        show: show,
        hode: hide,
        toggle: toggle,
      }

      function show() {
        $ionicdefinedLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner>',
          showBackdrop: false,
        });
      }

      function hide() {
        $ionicdefinedLoading.hide();
      }

      function toggle() {
        show();
        $timeout(function() {
          hide();
        }, 3000);
      }
    }
  })(app)
})