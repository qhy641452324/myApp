;(function($){
	$.extend({
		weichatTools:{
			wxConfig:function(needApi){
				 var pageUrl=window.location.href; //必传参数
				 $.ajax({
						url:'../weichat_JSAPI/wx_jsapi_config',
						type : 'post',
						data:{
							pageUrl:pageUrl,
						},
						dataType:"json",
						success:function(data){
							if(data.status==0){
								wx.config({
								    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								    appId: data.returnData.appId, // 必填，公众号的唯一标识
								    timestamp:data.returnData.timeStamp , // 必填，生成签名的时间戳
								    nonceStr:data.returnData.nonceStr, // 必填，生成签名的随机串
								    signature: data.returnData.signature,// 必填，签名
								    jsApiList:needApi // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
								});
							}else{
								alert(data.msg);
							}
						}
						
				});
			},
			share:{
				init:function(type){
					var that=this;
					if(!!check_is_weichat()){
						var needApi= ['onMenuShareTimeline','onMenuShareAppMessage','hideMenuItems'];
						$.weichatTools.wxConfig(needApi);
					 	wx.ready(function(){
					 		that.hideMenuItems();//隐藏掉分享到QQ和QQ空间按钮
							switch (type) {
							case 'farm':
								that.shareFarm();
								break;

							default:
								break;
							}
							
						});
				    }
					function check_is_weichat(){
						var is_weichat= false;
						if(/MicroMessenger/i.test(navigator.userAgent)){
							is_weichat=true;
						}
						return is_weichat;
					}
				},
				shareCommon:function(share_title,link,imgUrl){
					this.wxShareTimeline(share_title,link,imgUrl);
					this.wxShareAppMessage(share_title,share_message,link,imgUrl);
				},
				shareFarm:function(){
					var share_title="家乐宝-比布农场";
					var share_message="加入比布农场，和好友一起分享快乐";
					var link="http://www.jialebao.cc/weichat/activity/ac150915/empty_jump.html?reward_type=g_4_u";
					var imgUrl="http://www.jialebao.cc/food_img/farmbg.jpg";
					this.wxShareTimeline(share_title,link,imgUrl);
					this.wxShareAppMessage(share_title,share_message,link,imgUrl);
					
				},
				wxShareTimeline:function(title,link,imgUrl){   //分享到朋友圈
					wx.onMenuShareTimeline({
					    title: title, // 分享标题
					    link: link, // 分享链接
					    imgUrl: imgUrl, // 分享图标
					    success: function () {
					    	
					    },
					    cancel: function () { 
					        // 用户取消分享后执行的回调函数
					    }
					});
				},
				wxShareAppMessage:function(title,share_message,link,imgUrl){   //分享到朋友
					wx.onMenuShareAppMessage({
					    title: title, // 分享标题
					    desc: share_message, // 分享描述
					    link: link, // 分享链接
					    imgUrl: imgUrl, // 分享图标
					    type: '', // 分享类型,music、video或link，不填默认为link
					    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					    success: function () {},
					    cancel: function () { 
					     // 用户取消分享后执行的回调函数
					    }
					});
				},
				hideMenuItems:function(){
					wx.hideMenuItems({
					    menuList: ["menuItem:share:QZone","menuItem:share:qq"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
					});
				},
			}
		}
	})
})(window.jQuery||window.Zepto||window.xQuery);