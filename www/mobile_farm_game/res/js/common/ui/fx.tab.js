/** 
 * tab选项卡
 * created by mr.x on 16/01/18.
 * @import common/fx.common.js  common/ui/fx.slider.js
 *
 * @tab                    	  object        		(必须)tab触发源					          	默认 null
 * @container                 object        		(必须)外层内容块						        默认 null
 * @index       			  number             	(可选)初始化选中索引		  			  		默认 0
 * @isPreventDefault          boolean             	(可选)是否阻止默认事件							默认 true 
 * @isPropagation             boolean             	(可选)是否阻止冒泡								默认 false 
 * @direction                 string              	(可选)移动方向,水平或垂直        				默认 x轴
 * @callback                  function            	(可选)初始化完成回调
 * @onRelease        	  	  function              (可选)切换回调		
 * @onChange                  function            	(可选)切换成功回调
 * @onPropagation        	  function              (可选)阻止冒泡回调					
 */
;(function(M,window){
	M.ui.define('tab',function(){
		function tab(ops,args){
			this.ops=ops;
			this.creat(this,args);
		};
		tab.prototype={
			constructor:tab,
			creat:function(that,args){
				that.slider=M.ui.slider.init({
					container:that.ops.container,
					index:that.ops.index,
					isPreventDefault:that.ops.isPreventDefault,
					isPropagation:that.ops.isPropagation,
					direction:that.ops.direction,
					spot:false,
					touch:that.ops.touch,
					callback:function(){
						that.exec(this,args);
					},
					onPropagation:function(e){
						M.isFunction(that.ops.onPropagation)&&that.ops.onPropagation.apply(that,[e].concat(args));
					},
					onRelease:function(obj){
						that.ops.tab&&that.ops.tab.removeClass('current').eq(this.ops.index).addClass('current');
						M.isFunction(that.ops.onRelease)&&that.ops.onRelease.apply(that,[this.ops.index].concat(args));	
					},
					onScroll:function(obj){
						that.index!=this.ops.index&&that.set(this,args);
					}
				});
				return this;
			},
			exec:function(self,args){
				this.ops.tab&&this.ops.tab.bind('click',function(){
					!M(this).hasClass('current')&&self.moveTo(M(this).index());		
					return false;
				});	
				M.isFunction(this.ops.callback)&&this.ops.callback.apply(this,args);
			},
			set:function(self,args){
				this.index=self.ops.index;
				M.isFunction(this.ops.onChange)&&this.ops.onChange.apply(this,args);
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				tab:null,
				container:null,
				index:0,
				isPreventDefault:true,
				isPropagation:false,
				direction:'x',
				touch:true,
				callback:function(){},
				onPropagation:function(){},
				onRelease:function(){},
				onChange:function(){}
			},	
			init:function(ops){
				return new tab(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);