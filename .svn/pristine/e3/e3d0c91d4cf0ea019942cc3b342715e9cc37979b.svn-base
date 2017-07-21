/** 
 * 手势密码
 * created by mr.x on 15/12/30.
 * @import common/fx.common.js 
 *
 * @type                 	  number        		(必须)验证类型									默认 1 ⇒ 1-首次设置|2-登陆验证|3-修改			
 * @lineWidth                 number        		(必须)连线宽度				          			默认 1px		
 * @lineColor                 string        		(必须)连线颜色				          			默认 rgba(42,184,241,1) 	 			
 * @circleLineWidth           number        		(必须)圆圈边框宽度				          		默认 1px 			
 * @circleLineColor           string        		(必须)圆圈边框颜色				          		默认 rgba(42,184,241,1) 	 			
 * @circleBackgroundColor     string        		(必须)圆圈背景色				          		默认 rgba(255,255,255,1) 			
 * @pointColor                string        		(必须)圆圈内部圆心颜色				          	默认 rgba(42,184,241,1) 	 			
 * @pointRadius               number        		(必须)圆圈内部圆心半径比例				        默认 0.5 			
 * @maxfail                	  number        		(可选)验证失败最大次数				          	默认 5次 								
 * @fail                  	  function            	(可选)验证失败超过最大失败次数回调
 * @success                   function            	(可选)验证成功回调
 */
 
//1.连线颜色，粗细
//2.大圆圈颜色，边框粗细，背景色
//3.小圆圈背景色
//4.title --- 没有设置过 对应 绘制解锁图案 再次绘制解锁图案（对应小圈圈变化） 已经设置过登陆 对应 验证手势密码  修改 请输入原手势密码-->跳首次绘制一模一样
//5.设置验证每天最大失败次数 超过次数需要跳登陆页面重新登陆 
//6.每次验证失败title提示（红色晃动） 并且连线和圈圈（大圈圈和小圈圈变红色）
//7.连线的层级 低于圈圈层级 （美感处理）
//8.细节处理--修改手势密码，初次设置手势密码，登陆验证手势密码
//9.成功回调
 
;(function(M){
	M.ui.define('lock',{
		ops:{
			type:1,
			lineWidth:1,
			lineColor:'rgba(42,184,241,1)',
			circleLineWidth:1,
			circleLineColor:'rgba(42,184,241,1)',
			circleBackgroundColor:'rgba(255,255,255,1)',
			pointColor:'rgba(42,184,241,1)',
			pointRadius:0.5,
			maxfail:5,
			fail:function(){},
			success:function(){}
		},
		init:function(ops){
			M.extend(true,this.ops,ops);
			
			return this;
		},
		creat:function(e){
			
		}
	});
})(window.jQuery||window.Zepto||window.xQuery);