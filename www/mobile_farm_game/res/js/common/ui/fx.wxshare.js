/** 
 * 微信分享
 * created by mr.x on 15/11/22.
 * @import core/jweixin-1.0.0.js
 *
 * **对象info**
 * ''debug''   			boolean      	(可选)是否开启调试模式		    	默认false
 * ''appId''      		string      	(必填)公众号的唯一标识				默认null
 * ''timestamp''    	number      	(必填)生成签名的时间戳				默认null
 * ''nonceStr''    		string     		(必填)生成签名的随机串  			默认null	
 * ''signature''    	string     		(必填)签名 						默认null	
 * ''jsApiList''    	array     		(必填)必填，需要使用的JS接口列表		
 *
 * **对象shareText**
 * ''title''   			boolean      	(必填)分享标题		    			默认null
 * ''desc''      		string      	(必填)分享描述						默认null
 * ''href''    			string      	(必填)分享链接						默认null
 * ''imgUrl''    		string     		(可选)分享图标  					默认null	
 * ''type''    			string     		(可选)分享类型 					默认link   ⇒ music|video|link	
 * ''dataUrl''    		string     		(可选)分享数据链接					默认为空，如果type是music|video，则要提供数
 * ''success''    		function     	(可选)用户确认分享后执行的回调函数	
 * ''cancel''    		function     	(可选)用户取消分享后执行的回调函数
 */
;(function(M){
	M.ui.define('wxshare',[M.getNormalPath('core/jweixin-1.0.0.js',2)],function(wx){
		return {
			ops:{
				info:{
					debug:false, 
					appId:null, 
					timestamp:null, 
					nonceStr:null, 
					signature:null,
					jsApiList:['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo']
				},
				shareText:{
					title:null, 
					desc:null, 
					href:null, 
					imgUrl:null, 
					type:'link', 
					dataUrl:'', 
					success:function(){}, 
					cancel:function(){} 
				}
			},
			init:function(ops,callback){
				M.extend(true,this.ops,ops);
				wx.config({
					debug:this.ops.info.debug,
					appId:this.ops.info.appId, 
					timestamp:this.ops.info.timestamp, 
					nonceStr:this.ops.info.nonceStr, 
					signature:this.ops.info.signature,
					jsApiList:this.ops.info.jsApiList 
				});
				wx.ready(function(){
					wx.checkJsApi({
						jsApiList:this.ops.info.jsApiList,
						success:function(res){
							this.onBridgeReady();
							M.isFunction(callback)&&callback.call(this);
						}.bind(this)
					});
				}.bind(this));
				wx.error(function(res){
					console.log(res.errMsg);
				});	
				return this;
			},
			onBridgeReady:function(){
				this.onMenuShareTimeline();
				this.onMenuShareAppMessage();
				this.onMenuShareAppMessage();
				this.onMenuShareQQ();
			},
			onMenuShareTimeline:function(param){//分享到朋友圈
				param=param||this.ops.shareText;
				wx.onMenuShareTimeline({
					title:param.desc, 
					link:param.href, 
					imgUrl:param.imgUrl, 
					success:function(){ 
						param.success();
					},
					cancel:function(){ 
						param.cancel();
					}
				});	
			},
			onMenuShareAppMessage:function(param){//分享给朋友
				param=param||this.ops.shareText;
				wx.onMenuShareAppMessage({
					title:param.title, 
					desc:param.desc,
					link:param.href, 
					imgUrl:param.imgUrl, 
					type:param.imgUrl, 
					dataUrl:param.dataUrl, 
					success:function(){ 
						param.success();
					},
					cancel:function(){ 
						param.cancel();
					}
				});	
			},
			onMenuShareQQ:function(param){//分享到QQ
				param=param||this.ops.shareText;
				wx.onMenuShareQQ({
					title:param.title, 
					desc:param.desc, 
					link:param.href, 
					imgUrl:param.imgUrl, 
					success:function(){ 
						param.success();
					},
					cancel:function(){ 
						param.cancel();
					}
				});	
			},
			onMenuShareWeibo:function(param){//分享到腾讯微博
				param=param||this.ops.shareText;
				wx.onMenuShareWeibo({
					title:param.title,
					desc:param.desc, 
					link:param.href, 
					imgUrl:param.imgUrl, 
					success:function(){ 
						param.success();
					},
					cancel:function(){ 
						param.cancel();
					}
				});	
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery); 