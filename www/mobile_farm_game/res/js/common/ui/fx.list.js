/** 
 * 上拉/下拉/左拉/右拉数据加载
 * created by mr.x on 16/01/23.
 * @import common/fx.common.js  common/ui/fx.scroll.js
 *
 * @start	       			number             	(必须)当前开始索引								默认 0 
 * @number	       			number             	(必须)一页加载多少条数据							默认 10 
 * @url	       				string             	(必须)请求路径									默认 null 
 * @data	       			object             	(必须)请求参数									默认 null 
 * @text	       			object             	(可选)请求数据为空时提示文字						默认 null 
 * @box	       				object             	(必须)内容块									默认 null 
 * @isPreventDefault	    boolean             (可选)内容块是否阻止默认事件						默认 true 
 * @isPull       	     	boolean             (可选)内容块是否展示刷新							默认 false 
 * @direction               string              (可选)内容块移动方向,水平或垂直        			默认 y轴
 * @move                 	function            (可选)内容块移动过程回调
 * @release              	function            (可选)内容块手指释放回调
 * @scroll              	function            (可选)内容块手指释放缓冲完成回调
 * @callback                function            (可选)内容块刷新成功回调
 */
;(function(M,window){
	M.ui.define('list',function(){
		function init(ops,args){
			this.ops=ops;
			this.creat(args);
		};
		init.prototype={
			constructor:init,
			creat:function(args){
				this.getInfo(args,true);
				return this;
			},
			getInfo:function(args,status,type,fn){
				var that=this;
				M.ui.ajax.init({
					url:this.ops.url,
					data:M.extend({begin:status||type=='up'?0:this.ops.start+this.ops.number,length:this.ops.number},this.ops.data),
					isload:false,
					success:function(data){
						var _data=data.farm_frontpage||data;
						console.log(_data);
						if(status){
							if(_data.length){
								this.renderError&&this.renderError.remove(this.renderError,null,function(){
									delete this.renderError;	
								});
								this.ops.start=Math.min(this.ops.number,_data.length);
								this.resolve(this,args,this.ops.callback,data,'normal');
							}else{
								this.ops.callback.apply(this,[data,'normal'].concat(args));	
								M.ui.confirm.creat({
									text:this.ops.text,
									button:['确定']
								});	
							};
						}else{
							M.delay(300,function(){
								if(_data.length){
									if(type=='up'){
										this.ops.start=Math.min(this.ops.number,_data.length);
									}else{
										this.ops.start+=Math.min(this.ops.number,_data.length);	
									};
									this.scroll.reset(type,false,true);
									this.scroll.refresh();
									M.isFunction(fn)&&fn.apply(this,[data,type].concat(args));
								}else{
//									this.scroll.reset(type,true,true,'已经全部加载完啦');
									this.scroll.reset(type,true,true,'');
									this.scroll.refresh();
									
								};
							},this);
						};
					},
					error:function(msg){
						status?M.ui.confirm.creat({
							text:msg,
							button:['确定'],
							sure:function(){
								document.getElementById('list').innerHTML='';		
							}
						}):this.scroll.reset(type,false,msg);
					}
				},this);	
			},
			/*error:function(args,text,status){
				if(this.renderError){
					this.renderError.change(this.ops.box,text);
				}else{
					this.renderError=M.ui.error.init({
						text:text,
						warp:this.ops.box,
						button:{
							enabled:false
						},
						callback:function(){
							this.getInfo(args,status);	
						}	
					},this);
				};
			},*/
			resolve:function(self,args,fn,data,type){
				this.scroll=M.ui.scroll.init({		
					isPreventDefault:this.ops.isPreventDefault,
					container:this.ops.box,
					direction:this.ops.direction,
					isPull:this.ops.isPull,
					scrollbar:{
						enabled:this.ops.enabled	
					},
					mousewheel:true,
					callback:function(){
						M.isFunction(fn)&&fn.apply(self,[data,type].concat(args));	
					},
					onMove:function(distance){
						M.isFunction(self.ops.move)&&self.ops.move.apply(self,[distance].concat(args));	
					},
					onRefresh:function(direction){
						self.getInfo(args,false,direction,fn,direction);	
					},
					onRelease:function(offset){
						M.isFunction(self.ops.release)&&self.ops.release.apply(self,[offset].concat(args));	
					},
					onScroll:function(offset){
						M.isFunction(self.ops.scroll)&&self.ops.scroll.apply(self,[offset].concat(args));	
					}
				});
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				start:0,
				number:10,
				url:null,
				data:null,
				text:null,
				box:null,
				enabled:true,
				isPull:true,
				isPreventDefault:false,
				direction:'y',
				callback:function(){},
				move:function(){},
				release:function(){},
				scroll:function(){}
			},	
			init:function(ops){
				return new init(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);