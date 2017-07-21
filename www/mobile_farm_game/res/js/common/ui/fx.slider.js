/** 
 * 模块平移切换
 * created by mr.x on 15/12/01.
 * @import common/fx.common.js
 *
 * @auto               		  number      			(可选)自动播放				         				默认 0
 * @loop       				  boolean             	(可选)是否循环  			  						默认 false
 * @bounce        			  boolean             	(可选)是否允许两侧弹性超出,仅当loop为false时有效		默认 true 
 * @isPreventDefault          boolean             	(可选)是否阻止默认事件								默认 true 
 * @isPropagation             boolean             	(可选)是否阻止冒泡									默认 false 
 * @container                 object        		(必须)被包裹容器				          			默认 null
 * @direction                 string              	(可选)移动方向,水平或垂直        					默认 x轴
 * @index                     number              	(可选)初始化模块索引     							默认 0 
 * @mousewheel                boolean              	(可选)是否支持鼠标滑轮事件     						默认 false
 * @touch		              boolean              	(可选)是否支持触控拖拽	     						默认 true
 * @spot		              boolean              	(可选)是否展示小点		     						默认 true
 * @animateName               string              	(可选)移动动画名  									默认 mt-slider-ani   								
 * @callback                  function            	(可选)初始化完成回调
 * @onPropagation             function            	(可选)阻止冒泡回调
 * @onClick              	  function            	(可选)快速点击回调
 * @onMove                    function            	(可选)移动过程回调
 * @onRelease                 function            	(可选)手指释放回调
 * @onScroll                  function            	(可选)移动结束回调
 */
;(function(M,window){
	M.ui.define('slider',function(){
		function init(ops){
			this.ops=ops;
			this.creat();
		};
		init.prototype={
			constructor:init,
			reset:function(){
				M.extend(true,this.ops,{
					distance:{'x':this.ops.container.width(),'y':this.ops.container.height()}[this.ops.direction]
				});
				this.set(this.ops.offset=this.ops.loop?0:-this.ops.index*this.ops.distance);
			},
			creat:function(){
				var content=this.ops.container.children().eq(0),
					list=content.children(),
					speed=parseInt(parseFloat(content.css('WebkitTransitionDuration')||content.css('transitionDuration'))*1000);
				M.extend(true,this.ops,{
					content:content,
					list:list,
					length:list.length,
					speed:0,
					index:Math.max(0,Math.min(list.length-1,this.ops.index))
				});
				content.removeClass(this.ops.animateName).css({x:'width',y:'height'}[this.ops.direction],this.ops.length*100+'%');
				this.reset();
				this.ops.isPropagation&&list.stopPropagation(this.event[0]);
				if(this.ops.spot){
					this.ops.container.after(M(M.creatlabel(),{
						class:'mt-slider-icon '+this.ops.direction,
						html:new Array(this.ops.length+1).join(M.renderHTML({
							name:'span',
							proto:{class:'mt-slider-spot'}
						}))
					})).next().children().bind('click',function(e){
						e.stopPropagation();
						!/current/.test(e.target.className)&&this.moveTo(M(e.target).index());
					}.bind(this));
				};
				M.isFunction(this.ops.callback)&&this.ops.callback.call(this);
				this.move(1,this.ops.index,function(){
					this.ops.speed=speed;
					this.ops.touch&&this.on(); 
					M(window).bind('resize',function(e){
						this.reset();	
					}.bind(this));
					if(this.ops.mousewheel&&this.ops.length>1){
						window.addEventListener('DOMMouseScroll',function(e){
							this.wheel(e);
						}.bind(this),false);  
						window.onmousewheel=document.onmousewheel=function(e){
							this.wheel(e);
						}.bind(this);
					};
				});
			},
			wheel:function(e){
				e.preventDefault(); 
				e=window.event||e;
				var delta;
				e.wheelDelta&&(delta=e.wheelDelta/120);
				e.detail&&(delta=-e.detail/3);
				if(this.ops.content.attr('wheel')==undefined){
					this.ops.content.attr('wheel','true');
					switch(delta){
						case  1 : this.prev(); break ;
						case -1 : this.next(); break ;
						default : break ;
					};
				};
				return false;	
			},
			auto:function(){
				M.isNumeric(this.ops.auto)&&this.ops.auto>0&&this.ops.length>1&&(this.ops.timer=setInterval(function(){
					this.next(true);
				}.bind(this),this.ops.auto));
			},
			clear:function(){
				this.ops.timer!=undefined&&(this.ops.timer=clearInterval(this.ops.timer));
				return this;
			},
			event:function(){
				return M.browser.touch?['touchstart','touchmove','touchend']:['mousedown','mousemove','mouseup'];	
			}(),
			handle:function(e){
				switch(e.type){
					case e.data.context.event[0] : e.data.context.start(e); break ;	
					case e.data.context.event[1] : e.data.context.drag(e); break ;	
					case e.data.context.event[2] : e.data.context.end(e); break ;	
					default : break ;	
				};
			},
			on:function(type){
				this.ops.content.bind(type||this.event[0],{context:this},this.handle);
			},
			off:function(type){
				this.ops.content.unbind(type||this.event[0],{context:this},this.handle);
			},
			start:function(e){
				(this.ops.isPreventDefault||this.ops.swipe)&&e.preventDefault(); 
				if(!this.ops.content.hasClass(this.ops.animateName)){
					this.clear();
					if(this.ops.loop&&this.ops.length>1&&!this.ops.clone){
						this.ops.content.css({x:'width',y:'height'}[this.ops.direction],(this.ops.length+1)*100+'%');
						(this.ops.clone=this.ops.content.children().eq(this.ops.length-1).clone()).prependTo(this.ops.content);
						this.set(this.ops.offset=-this.ops.distance);
					};	
					var touch=M.browser.touch?e.originalEvent.touches[0]:e;
					this.ops.startPos={x:touch.pageX,y:touch.pageY,time:e.timeStamp};  
					this.on(this.event[1]);
					this.on(this.event[2]);
				};
			},
			drag:function(e){
				(this.ops.isPreventDefault||this.ops.swipe)&&(e.preventDefault(),M.isFunction(this.ops.onPropagation)&&this.ops.onPropagation.call(this,e));
				if(M.browser.touch&&e.originalEvent.touches.length>1||e.originalEvent.scale&&e.originalEvent.scale!==1) return;
				var touch=M.browser.touch?e.originalEvent.touches[0]:e;
				try{  
					this.ops.durationPos={x:touch.pageX-this.ops.startPos.x,y:touch.pageY-this.ops.startPos.y,time:e.timeStamp};  
					if(this.ops.isPreventDefault){
						this.translate(this.ops.onMove);
					}else{
						if(this.ops.scroll) return;
						if(this.ops.swipe){
							this.translate(this.ops.onMove);
						}else{
							if(Math.abs(this.ops.durationPos[this.ops.direction])>=Math.abs(this.ops.durationPos[String.fromCharCode(120,121).replace(this.ops.direction,'')])){
								this.ops.swipe=true;
								this.translate(this.ops.onMove);
							}else{
								this.ops.scroll=true;	
							};
						};
					};
				}catch(e){}; 
			},
			end:function(e){
				if(this.ops.startPos){
					if(!this.ops.scroll&&e.timeStamp-this.ops.startPos.time>50&&this.ops.durationPos){
						var m=this.ops.durationPos[this.ops.direction];
						if(this.ops.length==1&&(this.ops.loop||(!this.ops.loop&&this.ops.bounce))){
							this.ops.content.addClass(this.ops.animateName);
							this.set(0,this.delay);
						}else{
							if(m>=50){
								!this.ops.loop&&!this.ops.bounce&&this.ops.index==0?this.delay(null,0):this.prev();
							}else if(m<=-50){
								!this.ops.loop&&!this.ops.bounce&&this.ops.index==this.ops.length-1?this.delay(null,0):this.next();
							}else if(m==0){
								this.loop();
								this.auto();
							}else{
								this.ops.content.addClass(this.ops.animateName);
								this.set((this.offset=this.ops.loop?this.ops.clone?-this.ops.distance:0:-this.ops.index*this.ops.distance),function(){
									this.delay(this.loop);	
								});
							};
						};
					}else{
						this.loop();
						this.auto();
						M.isFunction(this.ops.onClick)&&this.ops.onClick.call(this,this.ops.loop?this.ops.content.children().eq(0):this.ops.list.eq(this.ops.index));
					}; 
				};	
				this.ops.startPos&&delete this.ops.startPos;
				this.ops.durationPos&&delete this.ops.durationPos;
				this.ops.scroll&&delete this.ops.scroll;
				this.ops.swipe&&delete this.ops.swipe;
				this.off(this.event[1]);
				this.off(this.event[2]);
			},
			loop:function(fn){
				if(this.ops.clone){
					this.ops.offset=0;
					this.set(0);
					this.ops.content.css({x:'width',y:'height'}[this.ops.direction],this.ops.length*100+'%');
					this.ops.clone.remove();
					delete this.ops.clone;
					M.isFunction(fn)&&fn.call(this);
				};	
			},
			prev:function(auto){
				if(!this.ops.content.hasClass(this.ops.animateName)&&this.ops.length>1){
					this.ops.index--;
					auto||this.ops.loop?(this.ops.index==-1)&&(this.ops.index=this.ops.length-1):this.ops.index=Math.max(this.ops.index,0);
					this.move(-1,1);
				};
			},
			next:function(auto){
				if(!this.ops.content.hasClass(this.ops.animateName)&&this.ops.length>1){
					this.ops.index++;
					auto||this.ops.loop?(this.ops.index==this.ops.length)&&(this.ops.index=0):this.ops.index=Math.min(this.ops.index,this.ops.length-1)
					this.move(1,1);
				};
			},
			moveTo:function(i){
				if(!this.ops.content.hasClass(this.ops.animateName)&&this.ops.length>1&&M.isNumeric(i)){
					this.move(i-this.ops.index>0?1:-1,Math.abs(i-this.ops.index),this.ops.index=Math.max(0,Math.min(this.ops.length-1,i)));
				};
			},
			move:function(direction,number,fn){
				this.clear();
				if(this.ops.loop){
					if(direction==1){
						this.ops.content.addClass(this.ops.animateName);
						this.ops.offset=-(this.ops.clone?2:number)*this.ops.distance;
						this.set(null,this.ops.onRelease,this.ops.list.eq(number));
						this.change();
						this.delay(function(){
							this.loop();
							this.ops.list.slice(0,number).appendTo(this.ops.content);
							this.ops.list=this.ops.content.children();
							this.set(0);
							this.ops.offset=0;
							this.ops.onScroll.call(this,this.ops.list.eq(0));
							M.isFunction(fn)&&fn.call(this);
						});
					}else if(direction==-1){
						if(!this.ops.clone){
							this.ops.list.slice(this.ops.length-number,this.ops.length).prependTo(this.ops.content);
							this.ops.list=this.ops.content.children();
							this.set(-number*this.ops.distance);
						};
						M.delay(1,function(){
							this.ops.content.addClass(this.ops.animateName);
							this.set(this.ops.offset=0,this.ops.onRelease,this.ops.list.eq(this.ops.clone?this.ops.length-1:0));
							this.change();
							this.delay(function(){
								this.loop(function(){
									this.ops.list.slice(this.ops.length-number,this.ops.length).prependTo(this.ops.content);
									this.ops.list=this.ops.content.children();	
								});
								this.ops.onScroll.call(this,this.ops.list.eq(0));
								M.isFunction(fn)&&fn.call(this);
							});
						},this);
					};
				}else{
					this.ops.content.addClass(this.ops.animateName);
					this.ops.offset=-this.ops.index*this.ops.distance;
					this.set(null,this.ops.onRelease,this.ops.list.eq(this.ops.index));
					this.change();
					this.delay(this.ops.onScroll,null,this.ops.list.eq(this.ops.index));
					M.isFunction(fn)&&fn.call(this);
				};
			},
			translate:function(fn){
				var dis=this.ops.offset+(this.ops.durationPos?this.ops.durationPos[this.ops.direction]:0);
				!this.ops.bounce&&!this.ops.loop&&(dis=Math.min(0,Math.max(dis,-(this.ops.length-1)*this.ops.distance)));
				this.set(dis,fn,Math.abs(this.ops.durationPos[this.ops.direction]));
			},
			set:function(value,fn){
				var name='translate3d';
				value=M.isNumeric(value)?value:this.ops.offset;
				this.ops.content.css({
					x:{WebkitTransform:name+'('+value+'px,0,0)',MozTransform:name+'('+value+'px,0,0)',transform:name+'('+value+'px,0,0)'},
					y:{WebkitTransform:name+'(0,'+value+'px,0)',MozTransform:name+'(0,'+value+'px,0)',transform:name+'(0,'+value+'px,0)'}
				}[this.ops.direction]);
				M.isFunction(fn)&&fn.apply(this,[].slice.call(arguments,2));
			},
			delay:function(fn,speed){
				M.delay(speed||this.ops.speed,function(args){
					this.ops.content.removeClass(this.ops.animateName).removeAttr('wheel');
					this.auto();
					M.isFunction(fn)&&fn.apply(this,args);
				},this,[].slice.call(arguments,2));	
			},
			change:function(){
				this.ops.spot&&M('.mt-slider-spot',this.ops.container.next()).removeClass('current').eq(this.ops.index).addClass('current');	
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				auto:0,
				loop:false,
				bounce:true,
				isPreventDefault:true,
				isPropagation:false,
				container:null,
				direction:'x',
				index:0,
				animateName:'mt-slider-ani',
				mousewheel:false,
				touch:true,
				spot:true,
				callback:function(){},
				onPropagation:function(){},
				onClick:function(){},
				onMove:function(){},
				onRelease:function(){},
				onScroll:function(){}
			},	
			init:function(ops){
				return new init(M.extend(true,{},this.defaults,ops));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);