/** 
 * 数值变换过程
 * created by mr.x on 16/01/20.
 * @import common/fx.common.js 
 *
 * @target                    object        		(必须)tab触发源					          	默认 null
 * @from                      number        		(必须)开始值						        	默认 0
 * @to       			  	  number             	(可选)结束值		  			  				默认 0
 * @speed         			  number             	(可选)变换速度	,单位毫秒							默认 700 
 * @refreshInterval           number             	(可选)更新间隔	,单位毫秒							默认 10 
 * @decimals           		  number             	(可选)保留小数点多少位							默认 2 
 * @callback                  function            	(可选)完成回调
 */
;(function(M,window){
	M.ui.define('count',function(){
		function init(ops){
			this.ops=ops;
			this.creat();
		};
		init.prototype={
			constructor:init,
			creat:function(){
				if(this.ops.to>0){
					this.loops=Math.ceil(this.ops.speed/this.ops.refreshInterval);
					this.increment=(this.ops.to-this.ops.from)/this.loops;
					this.value=this.ops.from;
					this.loopCount=0;
					this.time=setInterval(function(){
						this.resolve();	
					}.bind(this),this.ops.refreshInterval);
				};
				return this;
			},
			resolve:function(){
				this.value+=this.increment;
				this.loopCount++;
				this.render();
				if(this.loopCount>=this.loops){
					clearInterval(this.time);
					delete this.value,this.loopCount,this.increment,this.loops;
					M.isFunction(this.ops.callback)&&this.ops.callback.call(this);		
				};
			},
			render:function(){
				this.ops.target.innerHTML=M.setNumberPoint(this.value,this.ops.decimals);	
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				target:null,
				from:0,
				to:0,
				speed:700,
				refreshInterval:10,
				decimals:2,
				callback:function(){}
			},	
			init:function(ops,context){
				return new init(M.extend(true,{},this.defaults,ops));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);