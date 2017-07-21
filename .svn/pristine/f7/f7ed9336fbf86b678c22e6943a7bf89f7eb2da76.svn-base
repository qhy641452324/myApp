define(['app', "commonService", 'service/platformService', 'service/exHttpService'], function(app) {
  (function(app) {
    app.register.service("accountAPI", AccountAPI);

    AccountAPI.$inject = ['$http', '$q', 'baseUrl', 'storage', '$state', 'wechatAPI', 'exHttp'];

    function AccountAPI($http, $q, baseUrl, storage, $state, wechatAPI, exHttp) {
      return {
        login: login, //登录
        wechatLogin: wechatLogin, //微信登录
        sendMessage: sendMessage, //注册获取验证码
        checkMessage:checkMessage, //提交验证码
        appRegister:appRegister //设置密码
      }

      function login(phone, password) {
        var def = $q.defer();
        exHttp.init({
          url: 'app/login',
          params: {
            mobilePhone: phone,
            enterCode: password
          },
          loading: 'circle',
          loginTimeOut: false,
        }).then(function(response) {
          storage.set("phoneUser", phone);
          storage.set("passwordUser", password);
          $state.go("tab.home");
          def.resolve(response);
        });
        return def.promise;
      }

      function wechatLogin() {
        var def = $q.defer();
        wechatAPI.auth().then(function(result) {
          var token = result.code;
          exHttp.init({
            url: 'weichat_enter_4_jialebao',
            params: {
              code: token,
              app_app: "wx"
            },
            loading: 'circle',
            loginTimeOut: false,
          }).then(function(response) {
            def.resolve(response);
          });
        });
        return def.promise;
      }

      function sendMessage(phoneUser) {
        var def = $q.defer();
        exHttp.init({
          url: "app/sendMessage",
          params: {
            phoneUser: phoneUser
          },
          loading: 'circle',
          loginTimeOut: false,
        }).then(function(response) {
          def.resolve(response);
        });
        return def.promise;
      }

      function checkMessage(phoneUser, keyWord) {
        var def = $q.defer();
        exHttp.init({
          url: "app/checkMessage",
          params: {
            phoneUser: phoneUser,
            keyWord: keyWord
          },
          loading: 'circle',
          loginTimeOut: false,
        }).then(function(response) {
          def.resolve(response);
        });        
        return def.promise;
      }
      
      function appRegister(phoneUser,enterCode,password,type){
        var def = $q.defer();
        exHttp.init({
          url: "app/register",
          params: {
            phoneUser: phoneUser,
            enterCode: enterCode,
            password:password,
            type:type
          },
          loading: 'circle',
          loginTimeOut: true,
        }).then(function(response) {
          def.resolve(response);
        });        
        return def.promise;        
      }
    }
  })(app)
})
/*http://www.jialebao.cc*/