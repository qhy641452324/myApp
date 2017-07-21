/** 
 * 原生分享
 * created by mr.x on 16/02/24.
 * @import common/fx.common.js  common/ui/fx.cordova.js
 *
 * @imgUrl						string				(必须)分享图标图片地址				默认null
 * @title						string				(必须)分享标题						默认null
 * @content						string				(必须)分享内容						默认null
 * @url							string				(必须)分享链接地址					默认null
 * @success                	    function        	(可选)分享成功回调
 * @error                       function        	(可选)分享失败回调
 */
;(function(M){
	M.ui.define('share',{
		ops:{
			timeline:{
				imgUrl:null,
				title:'送礼包啦，新手注册立得30元，还有8%高收益专享！',
				content:'我在欧冶金融旗下财富管理平台投资啦，年化收益5%起，央企信誉，AAA担保，本息有保障。',
				url:null,
			},
			friends:{
				imgUrl:null,
				title:'今天多赚一点儿，分你30元理财礼包，注册还有更多惊喜哦！',
				content:'我在欧冶金融旗下财富管理平台投资啦，央企信誉，AAA担保，收益有保障。领上我的礼包快去注册迎惊喜吧。',
				url:null,
			},
			success:function(){},
			error:function(){}
		},
		init:function(ops){
			M.extend(true,this.ops,ops);
			M.API.getShareUrl(2,this,function(url){
				this.ops.timeline.url=url;
				M('.ui-share-wxfriends').bind('click',{type:3,ops:this.ops.timeline,context:this},this.shareContainer);//分享微信好友
				M('.ui-share-qqfriends').bind('click',{type:1,ops:this.ops.timeline,context:this},this.shareContainer);//分享QQ好友
			});	
			M.API.getShareUrl(3,this,function(url){
				this.ops.friends.url=url;
				M('.ui-share-wxtimeline').bind('click',{type:4,ops:this.ops.friends,context:this},this.shareContainer);//分享微信朋友圈
				M('.ui-share-qzone').bind('click',{type:2,ops:this.ops.friends,context:this},this.shareContainer);//分享QQ空间	
			});	
		},
		shareContainer:function(e){//分享
			if(M.browser.isInstalledApp){
				M.ui.ajax.init({
					data:{SERVERID:'2000120',CONSTANTS_KEY:'OuyeelMobileUrl'},
					url:M.getNormalPath('getShareUrl_1.json',4),
					success:function(url){
						e.data.ops.imgUrl=url+{1:M.getNormalPath('8.png'),2:M.getNormalPath('redpacket.png')}[e.data.type==1||e.data.type==3?1:2];
						M.ui.cordova.shareWebInfo({
							imgUrl:url+{1:M.getNormalPath('8.png'),2:M.getNormalPath('redpacket.png')}[e.data.type==1||e.data.type==3?1:2],
							title:e.data.ops.title,
							content:e.data.ops.content,
							url:e.data.ops.url 	
						},function(type){
							if(type==0){
								M.ui.waiting.creat({
									status:true,
									text:'分享成功',
									time:500,
									callback:function(){
										M.isFunction(e.data.context.success)&&e.data.context.success();	
									}
								});
							}else{
								M.ui.waiting.creat({
									status:false,
									text:{
										'-1':'分享失败,普通错误类型',
										'-2':'已取消',
										'-3':'发送失败',
										'-4':{1:'已取消',2:'授权失败'}[e.data.type==1||e.data.type==3?1:2],
										'-5':'微信不支持',
									}[type],
									time:500,
									callback:function(){
										M.isFunction(e.data.context.error)&&e.data.context.error();	
									}
								});
							};
						},function(){
							M.ui.waiting.creat({
								status:false,
								text:'调用失败',
								time:500,
								callback:function(){
									M.isFunction(e.data.context.error)&&e.data.context.error();	
								}
							});
						});
					},
					error:function(msg){
						M.ui.waiting.creat({status:false,text:msg,time:500});	
					}
				});
			}else{
				window.location=M.server+(M.browser.isIOS?'http://itunes.apple.com/cn/app/id995966598':'http://lc.ouyeelf.com/oycfmobile/download/ouyeelf.apk');
			};
			return false;
		}
	});
})(window.jQuery||window.Zepto||window.xQuery);