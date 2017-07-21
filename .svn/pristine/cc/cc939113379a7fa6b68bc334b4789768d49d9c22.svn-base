define(['app', 'commonService', 'service/redefinedIONService','service/platformService','service/popupService'], function(app) {
	app.register.factory("exHttp", ExHttp);
	ExHttp.$inject = ['$http','$cacheFactory','$q', 'baseUrl', '$ionicLoading', '$ionicPopup', 'publicToast', '$ionicdefinedLoading', 'storage', '$state','popupAPI'];

	function ExHttp($http,$cacheFactory,$q, baseUrl, $ionicLoading, $ionicPopup, publicToast, $ionicdefinedLoading, storage, $state,popupAPI) {
		var defaults = {
				params: null,
				data: null,
				url: null,
				type: 'post',
				dataType: 'json',
				method: 'post',
				timeout: 120000, 
				beforeSend: function() {},//发请求前所执行的函数
				loading: "default",     //加载图类型，default为无加载图，circle为转圈，loading为带加载中文字的样式
				loginTimeOut: true,     //登录超时判断，默认判断登录超时
				cache:false
			},
			self = this;
		return {
			init: init
		}

		function init(ops) {
			ops = angular.extend({}, defaults, ops);			
			var args = [].slice.call(arguments, 1);
			var def = $q.defer();
			var wait = waiting(ops.loading);
			wait.creat();
			angular.isFunction(ops.beforeSend) && ops.beforeSend.apply(self, args);
			$http({
				url: baseUrl + ops.url,
				method: ops.method,
				params: ops.params,
				data: ops.data,
				timeout: ops.timeout,
				cache:ops.cache
			}).success(function(data, header, config, status) {
				wait.dismiss();
				if(!data.status) {
					def.resolve(data);
				} else {
					handleErrorCode(data,ops.loginTimeOut);
					def.reject(data);
				}
			}).error(function(error,header, config, status){
			  wait.dismiss();
				publicToast.show("服务器响应失败。");
			});
			return def.promise;
		}

		function handleErrorCode(data,loginTimeOut) {
			var status = data.status;
			switch(status) {
				case 1101:
					if(loginTimeOut){
						var phone = storage.get("phoneUser");
						var password = storage.get("passwordUser");
						if(phone && password) {
              login(phone,password);
						} else {
              popupAPI.popupAlert(
                {imgUrl:'../img/caution-icon.png',title:'温馨提示',titleContent:'您的登录已过期，请重新登录。'},
                function(){
                  $state.go("login");
                }
              );						   
						}						
					}
					break;
				default:
				  var msg='未知错误';
				  if(data.params&&data.params.error_msg){
				    msg=data.params.error_msg;
				  }else if(data.msg){
				    msg=data.msg;
				  }
					publicToast.show(msg);
					break;
			}
		}
    
    function login(phone,password){
        var def = $q.defer();
        $http({
          method:"post",
          url: baseUrl + 'app/login',
          params:{
            mobilePhone: phone,
            enterCode:password
          }
        }).then(function(response) {
          if(response.data.status == 0) {
            storage.set("phoneUser", phone);
            storage.set("passwordUser", password);
            $state.go("tab.home");
            def.resolve();
          } else {
            def.reject(response.data.params.error_msg);
          }
        }, function(error) {
          def.reject(error);
        });
        return def.promise;      
    }
    
    
		function waiting(type) {
			var dismiss, creat;
			switch(type) {
				case 'loading':
					dismiss = function() {
						$ionicLoading.hide();
					}
					creat = function() {
						$ionicLoading.show({
							template: '加载中...'
						});
					}
					break;
			/*	case 'circle':
					creat = function() {
						$ionicdefinedLoading.show({
							template: '<img class="loading-img-circle transition-opacity-1s" src="img/loading.gif">',
							showBackdrop: false,
						});
					}
					dismiss = function() {
						$ionicdefinedLoading.hide();
					}
					break;*/
				default:
					dismiss = function() {}
					creat = function() {}
					break;
			}
			return {
				dismiss: dismiss,
				creat: creat
			}
		}
	}
});