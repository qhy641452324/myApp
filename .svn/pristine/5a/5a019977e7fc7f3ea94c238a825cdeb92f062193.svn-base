define(['app', 'service/exHttpService', 'commonService'], function(app) {
  "use strict";
  app.register.service("thirdPartyPayService", ThirdPartyPayService);

  ThirdPartyPayService.$inject = ['$q', 'exHttp', 'commonMethod',];

  function ThirdPartyPayService($q, exHttp, commonMethod,publicToast) {
    return {
      alipay: aliPay, //获取推荐礼包
      wechatPay:wechatPay,//添加商品
    }
  function aliPay(payInfo) {
  	
                 var def = $q.defer();
				// 第一步：订单在服务端签名生成订单信息，具体请参考官网进行签名处理

				// 第二步：调用支付插件            
				cordova.plugins.alipay.payment(payInfo, function success(e) {
//					alert(e.resultStatus);
					def.resolve(e);
				}, function error(e) {
					def.reject(e);
				});

				//e.resultStatus  状态代码  e.result  本次操作返回的结果数据 e.memo 提示信息
				//e.resultStatus  9000  订单支付成功 ;8000 正在处理中  调用function success
				//e.resultStatus  4000  订单支付失败 ;6001  用户中途取消 ;6002 网络连接出错  调用function error
				//当e.resultStatus为9000时，请去服务端验证支付结果
				/**
				 * 同步返回的结果必须放置到服务端进行验证（验证的规则请看https://doc.open.alipay.com/doc2/
				 * detail.htm?spm=0.0.0.0.xdvAU6&treeId=59&articleId=103665&
				 * docType=1) 建议商户依赖异步通知
				 */
				return def.promise;

		}

		function wechatPay(data) {
			
  			  var def = $q.defer();
				//				var params = {
				//					partnerid: '10000100', // merchant id
				//					prepayid: 'wx201411101639507cbf6ffd8b0779950874', // prepay id
				//					noncestr: '1add1a30ac87aa2db72f57a2375d8fec', // nonce
				//					timestamp: '1439531364', // timestamp
				//					sign: '0CB01533B8C1EF103065174F50BCA001', // signed string
				//				};
				var params = {
					partnerid: data.partnerid, // merchant id
					prepayid: data.prepayid, // prepay id
					noncestr: data.noncestr, // nonce
					timestamp: data.timestamp, // timestamp
					sign: data.sign, // signed string
				};
				Wechat.sendPaymentRequest(params, function() {
					def.resolve();
					alert("Success");
				}, function(reason) {
					def.reject(reason);
					alert("Failed: " + reason);
				});
				
				return def.promise;

		}
    
    
    
  }
})