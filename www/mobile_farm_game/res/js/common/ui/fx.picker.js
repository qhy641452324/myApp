/** 
 * 选择控件渲染器
 * created by mr.x on 16/01/09.
 * @import common/fx.common.js
 *
 * @status               	  boolean      			(必须)状态				         				默认 null
 * --@column				  array
 * --''index''     	  		  number      			(可选)选中索引										默认 0  
 * --''html''     	  		  string      			(可选)列表内容										默认 null    				  
 * --@separate			  	  object
 * --''width''     	  		  number      			(可选)列表分割线边框宽度								默认 1  
 * --''style''     	  		  string      			(可选)列表分割线边框形态								默认 'solid'  
 * --''color''     	  		  string      			(可选)列表分割线边框颜色								默认 'rgba(0,0,0,.08)'    				  
 * @freeFill        		  number             	(可选)单个列表填充空白数量,status为true生效			默认 2 
 * @context             	  object             	(可选)上下文this指向								默认 null 
 * @isCloseButton             boolean        		(可选)是否展示关闭按钮				          		默认 true
 * @title                 	  string              	(可选)标题			        					默认 null
 * @animateName               string              	(可选)移动动画名  									默认 mt-slider-ani   								
 * @callback                  function            	(可选)初始化完成回调
 * @select              	  function            	(可选)选中回调
 * @scroll              	  function            	(可选)选中缓冲完成回调
 * @reload                    function            	(可选)重新加载回调
 * @sure                 	  function            	(可选)确定回调
 * @cancel                    function            	(可选)取消回调
 */
;(function(M,window){
	M.ui.define('picker',function(){
		function init(ops,args){
			this.ops=ops;
			this.creat(args);
		};
		init.prototype={
			constructor:init,
			creat:function(args){
				this.ops.content=M(M.creatlabel(),{
					class:'mt-select-content'
				}).prepend(this.renderTitle(args)).append(this.renderMain(args));
				this.ops.container=M(M.creatlabel(),{
					id:'mt-select-'+M.now(),
					class:'mt-master-container mt-select-container hide',
					click:function(){
						this.close(this.ops.cancel,args);
						return false;	
					}.bind(this)
				}).append(this.ops.content);
				this.ops.content.stopPropagation('click');
				this.show();
				M(document.body).append(this.ops.container);
				this.ops.speed=parseInt(parseFloat(this.ops.container.css('WebkitAnimationDuration')||this.ops.container.css('animationDuration'))*1000);
				M.isFunction(this.ops.callback)&&this.ops.callback.apply(this.ops.context||this,args);
				return this;
			},
			renderTitle:function(args){
				var self=this,
					title=M(M.creatlabel(),{
						class:'mt-select-head',
						html:M.isString(this.ops.title)&&M.renderHTML({
							proto:{class:'mt-select-title'},
							html:this.ops.title
						})
					});
				title.append(M(M.creatlabel('a'),{
					class:'blue btn sure',
					html:M.renderHTML({
						name:'i',
						proto:{class:'fa'},
						html:'&#xe63a;'
					}),
					click:function(){
						self.close(self.ops.sure,args);
						return false;
					}
				}));
				this.ops.isCloseButton&&title.prepend(M(M.creatlabel('a'),{
					class:'black btn close',
					html:M.renderHTML({
						name:'i',
						proto:{class:'fa'},
						html:'&#xe61f;'
					}),
					click:function(){
						self.close(self.ops.cancel,args);
						return false;
					}
				}));
				return title;
			},
			renderMain:function(args){
				this.ops.box=M(M.creatlabel(),{
					class:'mt-select-main mt-flex mt-flex-x mt-flex-center',
					html:this.renderload()
				});
				this.refresh(this.ops.status,args);
				return M(M.creatlabel(),{
					class:'mt-select-body',
					html:M.renderHTML({
						proto:{class:'mt-select-shadow up'}
					})+M.renderHTML({
						proto:{class:'mt-select-shadow down'}
					})
				}).append(this.ops.box);
			},
			renderEmpty:function(){
				return new Array(this.ops.freeFill+1).join(M.renderHTML({
					proto:{class:'mt-select-picker disabled'}	
				}));
			},
			renderload:function(){
				return M.renderHTML({
					name:'img',
					proto:{
						class:'mt-loading-icon mt-rotate-load',
						src:M.getNormalPath('base/load.png')
					}
				});
			},
			renderNull:function(){
				return '没有数据'+M.renderHTML({
					name:'span',
					proto:{class:'blue'},
					html:'点击重新加载'
				});
			},
			renderBody:function(i){
				return M.renderHTML({
					proto:{class:'mt-select-box mt-scroll-container'},
					html:M.renderHTML({
						proto:{class:'mt-scroll-main '+this.ops.animateName},
						html:M.renderHTML({
							proto:{class:'mt-scroll-body'},
							html:this.ops.column[i].html?this.renderEmpty()+this.ops.column[i].html+this.renderEmpty():''
						})
					})
				});
			},
			refresh:function(status,args){
				if(M.isBoolean(status)){
					this.ops.status=status;
					if(status){
						this.ops.box.unbind('click').html(function(that){
							for(var i=0,str=M.renderHTML({proto:{class:'mt-select-highlight'}});i<that.ops.column.length;i++){
								str+=M.renderHTML({
									proto:{
										class:'mt-select-inner mt-flex-inner',
										style:i==0?'':{
											borderLeftWidth:that.ops.separate.width+'px',
											borderLeftStyle:that.ops.separate.style,
											borderLeftColor:that.ops.separate.color
										}
									}
								});
							};
							return str;
						}(this));
						this.inner=[];
						var list=this.ops.box.children().slice(1).not('.mt-select-separate');
						for(var i=0;i<this.ops.column.length;i++){
							this.add(i,this,args,list.eq(i));
						};
					}else{
						this.ops.box.html(this.renderNull()).bind('click',function(){
							this.ops.box.html(this.renderload());
							M.isFunction(this.ops.reload)&&this.ops.reload.apply(this.ops.context||this,args);
						}.bind(this));	
					};
				};
			},
			add:function(i,context,args,list){
				list=list||this.ops.box.children().slice(1).not('.mt-select-separate').eq(i);
				if(this.ops.column[i].html==null){
					list.html('');
					this.inner[i]&&this.inner.splice(i,1);
					delete this.ops.column[i].box,this.ops.column[i].warp;
				}else{
					list.html(this.renderBody(i));	
					this.inner[i]=M.ui.scroll.init({
						scrollbar:{
							enabled:false	
						},
						isPreventDefault:false,
						container:list.children(),
						snapStatus:true,
						snapIndex:this.ops.column[i].index,
						type:i,
						callback:function(){
							var that=this,type=this.ops.type;
							context.ops.column[this.ops.type].warp=list;	
							context.ops.column[this.ops.type].box=this.ops.box;	
							this.ops.box.children().click(function(){
								if(!!!context.master&&!/(current)|(disabled)/.test(this.className)){
									M.delay(10,function(){
										context.master=true;
										that.ops.snapIndex=this.index();
										context.indexTo(that.ops.snapIndex-context.ops.freeFill,type);
										that.delay(that.ops.onDelete);
									},M(this));
									return false;
								};
							});
							this.ops.onMove.call(this);
						},
						onMove:function(){
							var index=this.ops.snapIndex+context.ops.freeFill;
							if(context.ops.column[this.ops.type].index!==index){
								context.ops.column[this.ops.type].index=index;
								context.high(context.ops.column[this.ops.type]);
							};
						},
						onRelease:function(){
							this.ops.onMove.call(this);
							M.isFunction(context.ops.select)&&context.ops.select.apply(context.ops.context||context,[this.ops.type].concat(args));
						},
						onScroll:function(){
							M.isFunction(context.ops.scroll)&&context.ops.scroll.apply(context.ops.context||context,[this.ops.type].concat(args));	
						},
						onDelete:function(){
							context.master&&delete context.master;	
						}
					});
				};
			},
			high:function(column){
				column.box.children().removeClass('current').eq(column.index).addClass('current');		
			},
			prev:function(type){
				this.inner[type||0].prev();
			},
			next:function(type){
				this.inner[type||0].next();
			},
			indexTo:function(index,type){
				if(M.isNumeric(index)){
					type=this.inner[type||0];
					type.scrollTo(type.snapDistance*index);
				};
			},
			show:function(){
				this.ops.container.show().addClass('in');
			},
			close:function(fn,args){
				M.isFunction(fn)&&fn.apply(this.ops.context||this,args);
				this.ops.container.addClass('out');
				M.delay(this.ops.speed,function(){
					this.ops.container.removeClass('out').removeClass('in').hide();
				},this);	
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				status:null,
				column:[
					{index:0,html:null}
				],
				freeFill:2,
				separate:{
					width:1,
					style:'solid',
					color:'rgba(0,0,0,.08)'	
				},
				context:null,
				isCloseButton:true,
				title:null,
				animateName:'mt-scroll-ani',
				callback:function(){},
				reload:function(){},
				select:function(){},
				scroll:function(){},
				sure:function(){},
				cancel:function(){}
			},	
			init:function(ops){
				return new init(M.extend(true,{},this.defaults,ops),[].slice.call(arguments,1));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);