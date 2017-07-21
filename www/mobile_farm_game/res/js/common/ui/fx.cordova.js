/** 
 * cordova接口
 * created by mr.x on 16/01/24.
 * @import common/fx.common.js  				
 */
;(function(M,window){
	M.ui.define('cordova',{
		cordova:window.PhoneGap||window.Cordova||window.cordova,
		/**
		 * 打开新页面
		 * @url							string			页面地址							默认null
		 * @navigationBar									
		 * --''enabled''				number			是否显示							默认1		0-不显示  1-显示   默认1
		 * --@content							
		 * ----''background''			string			标题栏背景色						默认白色						
		 * ----''type''					number			标题栏文字和图标颜色类型				默认1		0-黑色  1-白色  默认0
		 * ----@leftButton														
		 * ------''enabled''			number			是否出现							默认1		0-不出现  1-出现	默认1
		 * ------''type''				number			标题栏图标类型						默认1		1-返回图标  2-home图标  3-登陆图标  4-消息图标  5-分享图标  6-刷新图标
		 * ----@rightButton														
		 * ------''enabled''			number			是否出现							默认0		0-不出现  1-出现	默认1
		 * ------''type''				number			标题栏图标类型						默认2		1-返回图标  2-home图标  3-登陆图标  4-消息图标  5-分享图标  6-刷新图标
		 * ------''callback''			string			图标点击之后回调方法名				默认null
		 * ----@title															
		 * ------''type''				number			是否是动态文字						默认0		0-展示下面text  1-特定文字用户名  2-特定文字***  等等
		 * ------''text''				string			文字								默认null
		 * ------@list					array											默认[]
		 * --------''name''				string			列表文字	
		 * --------''uid''				string			列表文字对应id	
		 * --------''callback''			string			列表文字点击之后回调							
		 * @navigationMenu				object			导航菜单栏
		 * --''enabled''				number			是否显示							默认0		0-不出现  1-出现	默认0
		 * @animateDirection			number			过渡动画方向						默认1		0-无动画 1-右向左 2-下向上 3-左向右 4-上向下
		 */
		createWebPage:function(params,success,fail){
			params=M.extend(true,{
				url:null,
				navigationBar:{
					enabled:1,
					content:{
						background:"rgba(255,255,255,1)",
						type:1,
						leftButton:{
							enabled:1,
							type:1	
						},
						rightButton:{
							enabled:0,
							type:2,
							callback:null		
						},
						title:{
							type:0,
							text:null,
							list:[]	
						}	
					}	
				},
				navigationMenu:{
					enabled:0
				},
				animateDirection:1	  	 
			},params);
		   	this.cordova.exec(success||null,fail||null,'OYWebNewPage','createWebPage',[M.JsonToString(params)]);
		},
		/**
		 * 检测网络连接
		 * @success
		 * =====  0  	没有网络
		 * =====  1		有网络
		 */
		checkNetwork:function(success,fail){
			this.cordova.exec(success||null,fail||null,'OYWebCheckNetwork','checkNetwork',['']);	
		},
		closeWebPage:function(success,fail){//关闭页面
			this.cordova.exec(success||null,fail||null,'OYWebClosePage','closeWebPage',['']);	
		},
		switchHandPass:function(success,fail){//手势密码开关
			this.cordova.exec(success||null,fail||null,'OYWebSwitchHandPass','switchHandPass',['']);	
		},
		/**
		 * 修改手势密码
		 * @success
		 * =====  0  	关闭
		 * =====  1		打开
		 */
		changeHandPass:function(success,fail){
			this.cordova.exec(success||null,fail||null,'OYWebChangeHandPass','changeHandPass',['']);
		},
		checkWebUpdata:function(success,fail){//检查更新
			this.cordova.exec(success||null,fail||null,'OYWebCheckWebApp','checkWebApp',['']);	
		},
		clearWebCache:function(success,fail){//清除缓存
			this.cordova.exec(success||null,fail||null,'OYWebClearWebApp','clearWebApp',['']);	
		},
		/**
		 * 分享
		 * @imgUrl					string			分享图标图片地址				默认null
		 * @title					string			分享标题						默认null
		 * @content					string			分享内容						默认null
		 * @url						string			分享链接地址					默认null
		 * @success
		 * ''分享好友''
		 * =====  0  	分享成功
		 * =====  -4	已取消
		 * ''分享朋友圈''
		 * =====  0  	分享成功
		 * =====  -1	分享失败,普通错误类型
		 * =====  -2 	已取消
		 * =====  -3 	发送失败
		 * =====  -4  	授权失败
		 * =====  -5  	微信不支持
		 */
		shareWebInfo:function(params,success,fail){
			params=M.extend(true,{
				imgUrl:null,
				title:null,
				content:null,
				url:null 
			},params);
			this.cordova.exec(success||null,fail||null,'OYWebShareWebApp','shareWebApp',[M.JsonToString(params)]);	
		},
		showWaitingView:function(params,success,fail){//等待框
		   
		},
		showLoadingView:function(params,success,fail){//加载阻塞框
		   
		},
		dismiss:function(){//关闭
		   
		},
		showFlashInfo:function(msg){//消息框
		   
		},
		showAlertView:function(params,success,fail){//警告框
		   
		},
		sendMessage:function(params,success,fail){//发送请求
		   
		},
		closeWebApp:function(params,success,fail){//关闭WebApp
		   
		},
		setBarStatus:function(shownavigationbar,showtoolbar){//设置导航栏、工具栏
		   
		},
		getUserInfo:function(success,fail){//获取用户信息
		   
		},
		setNavigationBarRightButton:function(title){//设置标题栏右边按钮
		   
		},
		setNavigationBarTitle:function(title){//设置标题
		   
		},
		login:function(params,success,fail){//登陆
		   
		},
		forceLogin:function(params,success,fail){//强制用户登录
		   
		},
		register:function(params,success,fail){//注册
			
		},
		pay:function(params,success,fail){//支付
		   
		},
		webCallNative:function(params,success,fail){//调用电话
		   
		},
		webShowMap:function(params,success,fail){//调用地图
		   
		},
		calendar:function(params,success,fail){//调用本地日期控件
			
		},
		camera:function(params,success,fail){//调用摄像头
			
		},
		capture:function(params,success,fail){//获取本地媒体文件
			
		},
		compass:function(params,success,fail){//获取设备移动的方向
			
		},
		connection:function(params,success,fail){//网络信息
			
		},
		contacts:function(params,success,fail){//联系人
			
		},
		device:function(params,success,fail){//获取设备信息
			
		},
		file:function(params,success,fail){//调用本地文件
			
		},
		geolocation:function(params,success,fail){//地理位置
			
		},
		media:function(params,success,fail){//录制和播放音频
			
		},
		storage:function(params,success,fail){//设备本地存储
			
		},
		notification:function(params,success,fail){//设备视觉、声音和触觉反馈
			
		},
		track:function(cordova){//埋点
			return {
				logEvent:function(params){//记录用户操作信息
					cordova.exec(null,null,'OYWebAnalysis','logEvent',[M.JsonToString(params)]);
				},
				logPageBegin:function(pageName){//记录用户进入页面信息
					cordova.exec(null,null,'OYWebAnalysis','logPageBegin',[M.JsonToString({name:pageName})]);
				},
				logPageEnd:function(pageName){//记录用户离开页面信息
					cordova.exec(null,null,'OYWebAnalysis','logPageEnd',[M.JsonToString({name:pageName})]);
				}
			};
		}(this.cordova)	
	});
})(window.jQuery||window.Zepto||window.xQuery,window);