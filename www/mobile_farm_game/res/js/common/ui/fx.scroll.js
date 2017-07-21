/** 
 * 滚动触摸
 * created by mr.x on 15/12/29.
 * @import common/fx.common.js
 *
 * @scrollbar        		               								
 * ''enabled''   			  boolean      			(可选)是否显示滚动块								默认 true 
 * --@style 				  object       
 * --''marginPrev''     	  number      			(可选)滚动块上/左边距								默认 2px 
 * --''marginNext''    		  number      			(可选)滚动块下/右边距								默认 true 
 * --''size''    			  number|string     	(可选)滚动块宽/高									默认 0.15rem	
 * --''backgroundColor''      string		     	(可选)滚动块背景色									默认 rgba(0,0,0,.3)	
 * @isPreventDefault          boolean             	(可选)是否阻止默认事件								默认 true 
 * @isPull        	  		  boolean             	(可选)是否展示刷新									默认 false 
 * @bounce        			  boolean             	(可选)是否允许两侧弹性超出,仅当isPull为false生效		默认 true 
 * @enabled        			  boolean             	(可选)是否显示滚动条								默认 true 
 * @container                 object        		(必须)被包裹容器				          			默认 null
 * @direction                 string              	(可选)移动方向,水平或垂直        					默认 y轴
 * @mousewheel                boolean              	(可选)是否支持鼠标滑轮事件     						默认 false
 * @mouseWheelSpeed           number              	(可选)鼠标滑轮转动速度,mousewheel为true生效     		默认 200px
 * @offset		              number              	(可选)初始化内容块位置     							默认 0px
 * @snapStatus                boolean              	(可选)自动分割容器状态		     					默认 false
 * @snapIndex                 number              	(可选)默认定位分割容器索引		     				默认 0
 * @animateName               string              	(可选)移动动画名  									默认 mt-scroll-ani   								
 * @callback                  function            	(可选)初始化完成回调
 * @onMove                    function            	(可选)移动过程回调
 * @onRelease                 function            	(可选)手指释放回调
 * @onRefresh                 function            	(可选)刷新回调,仅当isPull为true生效
 * @onScroll                  function            	(可选)缓冲移动结束回调
 */
;(function(M,window){
	M.ui.define('scroll',function(){
		function init(ops){
			this.ops=ops;
			this.creat();
		};
		init.prototype={
			constructor:init,
			setScrollMinDistance:function(value){
				this.minScrollDistance=value||0;
			},
			setScrollBarMinDistance:function(value){
				this.ops.scrollbar.enabled&&(this.minScrollBarDistance=value||0);
			},
			creat:function(){
				var content=this.ops.container.children().eq(0),
					speed=parseInt(parseFloat(content.css('WebkitTransitionDuration')||content.css('transitionDuration'))*1000);
				M.extend(true,this.ops,{
					content:content,
					speed:speed,
					box:content.children()
				});
				this.setScrollMinDistance();
				this.setScrollBarMinDistance();
				this.ops.container.addClass(this.ops.direction);
				content.removeClass(this.ops.animateName);
				this.refresh(true);
				this.on(); 
				M(window).bind('resize',function(e){
					this.refresh();	
				}.bind(this));
				if(this.ops.mousewheel){
					window.addEventListener('DOMMouseScroll',function(e){
						this.wheel(e);
					}.bind(this),false);  
					window.onmousewheel=document.onmousewheel=function(e){
						this.wheel(e);
					}.bind(this);
				};
				M.isFunction(this.ops.callback)&&this.ops.callback.call(this);
			},
			refresh:function(type){
				this.outerDistance={x:this.ops.container.width(),y:this.ops.container.height()}[this.ops.direction];
				this.innerDistance={x:this.ops.content.outerWidth(true),y:this.ops.content.outerHeight(true)}[this.ops.direction];
				this.ops.box.css({x:'min-width',y:'min-height'}[this.ops.direction],this.outerDistance);
				this.maxScrollDistance=Math.max(0,this.innerDistance-this.outerDistance);
				this.ops.offset=Math.max(this.minScrollDistance,Math.min(this.ops.offset,this.maxScrollDistance));
				if(this.maxScrollDistance==0){
					this.ops.bar&&(this.ops.bar.remove(),delete this.ops.bar,delete this.scrollBarSize,delete this.maxScrollBarDistance,delete this.minScrollBarDistance);
				}else{
					if(this.ops.scrollbar.enabled){
						!this.ops.bar&&(this.ops.bar=M(M.creatlabel(),{
							class:'mt-scroll-bar out',
							css:{
								x:{backgroundColor:this.ops.scrollbar.style.backgroundColor,left:this.ops.scrollbar.style.marginPrev,bottom:this.ops.scrollbar.style.marginNext,height:this.ops.scrollbar.style.size},
								y:{backgroundColor:this.ops.scrollbar.style.backgroundColor,top:this.ops.scrollbar.style.marginPrev,right:this.ops.scrollbar.style.marginNext,width:this.ops.scrollbar.style.size}	
							}[this.ops.direction]	
						}).appendTo(this.ops.container));
						this.setScrollBarMinDistance();
						this.scrollBarSize=parseInt(this.outerDistance*(this.outerDistance-this.minScrollBarDistance-this.ops.scrollbar.style.marginPrev-this.ops.scrollbar.style.marginNext)/this.innerDistance);
						this.maxScrollBarDistance=this.outerDistance-this.minScrollBarDistance-this.ops.scrollbar.style.marginPrev-this.ops.scrollbar.style.marginNext-this.scrollBarSize;
						this.setBarSize(null,this.ops.scrollbar.style.marginPrev);
					};	
				};
				if(this.ops.isPull){
					!this.ops.pullUp&&(this.ops.pullUp=M(M.creatlabel(),{
						class:'mt-scroll-pull up mt-flex mt-flex-center',
						html:this.renderInitPull(this.renderTextPull('up'))
					}).prependTo(this.ops.content));
					!this.ops.pullDown&&(this.ops.pullDown=M(M.creatlabel(),{
						class:'mt-scroll-pull down mt-flex mt-flex-center',
						html:this.renderTextPull('down')
					}).appendTo(this.ops.content));
					this.pullSize=this.ops.pullUp[{x:'width',y:'height'}[this.ops.direction]]();
				};
				if(this.ops.snapStatus){
					var list=this.ops.box.children(),length=list.length;
					this.snapDistance=this.innerDistance/length;
					this.snapList=[];
					for(var i=0;i<length;i++){
						this.snapList.push(list.eq(i).position().top);
					};
					this.snapList.push(this.snapDistance*length);
					this.ops.offset=Math.max(this.minScrollDistance,Math.min(this.ops.snapIndex*this.snapDistance,this.maxScrollDistance));
				};
				if(this.ops.isPull&&!!!type&&this.ops.offset!=0&&this.ops.offset==this.maxScrollDistance){
					this.ops.content.addClass(this.ops.animateName);	
					this.delay();	
				};	
				this.setContent();
				this.setBar();
			},
			clear:function(){
				this.ops.isPull=false;
				this.pullSize&&delete this.pullSize;
				this.ops.pullUp&&(this.ops.pullUp.remove(),delete this.ops.pullUp);	
				this.ops.pullDown&&(this.ops.pullDown.remove(),delete this.ops.pullDown);	
			},
			empty:function(){
				this.clear();
				this.ops.bar&&(this.ops.bar.remove(),delete this.ops.bar,delete this.scrollBarSize,delete this.maxScrollBarDistance,delete this.minScrollBarDistance);
				this.ops.content.addClass(this.ops.animateName);
				this.ops.box.html('');
				this.setContent(0);
				return this;
			},
			renderInitPull:function(text,ico,name){
				return M.renderHTML({
					name:'span',
					html:/*M.renderHTML({
						name:'i',
						proto:{class:'fa middle'.concat(name?String.fromCharCode(32).concat(name):'')},
						html:ico||'&#xe63c;'
					})+*/M.renderHTML({
						name:'em',
						proto:{class:'middle text-shadow'},
						html:text
					})
				});	
			},
			renderTextPull:function(type){
				return {
					/*up:({x:'右',y:'下'}[this.ops.direction])+'拉刷新',
					down:({x:'左',y:'上'}[this.ops.direction])+'拉显示更多'*/
					up:'',
					down:''
				}[type];
			},
			renderFlipUpPull:function(){
				var pull=this.ops.pullUp.children().children();
				pull.eq(0).addClass('flip');
				pull.eq(1).html('');	
			},
			renderFlipUpFixPull:function(){
				var pull=this.ops.pullUp.children().children();
				pull.eq(0).removeClass('flip');
				pull.eq(1).html(this.renderTextPull('up'));
			},
			renderFlipDownPull:function(){
				this.ops.pullDown.html(M.renderHTML({name:'span',proto:{class:'text-shadow'},html:''}));	
			},
			renderFlipDownFixPull:function(){
				this.ops.pullDown.html(M.renderHTML({name:'span',proto:{class:'text-shadow'},html:this.renderTextPull('down')}));		
			},
			/*renderLoadPull:function(type){
				({up:this.ops.pullUp,down:this.ops.pullDown}[type]).html(M.renderHTML({
					name:'span',
					html:M.renderHTML({
						name:'img',
						proto:{class:'mt-rotate-load middle',src:M.getNormalPath('base/load.png')}
					})+M.renderHTML({
						name:'em',
						proto:{class:'middle text-shadow'},
						html:'加载中...'
						html:''
					})
				}));
			},*/
			renderLoadPull:function(type){
				({up:this.ops.pullUp,down:this.ops.pullDown}[type]).html(M.renderHTML({
					name:'span',
					html:M.renderHTML({
						name:'img',
						proto:{class:'mt-rotate-load middle',src:M.getNormalPath('base/load.png')}
					})
				}))
			},
			renderResultPull:function(type,status,text){
				status={
						0:{icon:'&#xe633',text:text||''},
						1:{icon:'&#xe634',text:text||''}
					/*0:{icon:'&#xe633',text:text||'加载失败'},
					1:{icon:'&#xe634',text:text||'加载成功'}*/
						
				}[M.isBoolean(status)?Number(status):1];
				({up:this.ops.pullUp,down:this.ops.pullDown}[type||'up']).html(this.renderInitPull(status.text,status.icon,'status'));
			},
			event:function(){
				return M.browser.touch?['touchstart','touchmove','touchend']:['mousedown','mousemove','mouseup','mouseover'];	
			}(),
			wheel:function(e){
				e.preventDefault(); 
				e=window.event||e;
				var delta;
				e.wheelDelta&&(delta=e.wheelDelta/120);
				e.detail&&(delta=-e.detail/3);
				if(!this.ops.content.hasClass(this.ops.animateName)){
					this.ops.bar&&(this.setBarTransform(),this.ops.bar.addClass('in'));
					switch(delta){
						case -1 : this.next(); break ;
						case  1 : this.prev(); break ;
						default : break ;
					};
				};
				return false;	
			},
			on:function(type,obj){
				(obj||this.ops.content).bind(type||this.event[0],{context:this},this.handle);
			},
			handle:function(e){
				switch(e.type){
					case e.data.context.event[0] : e.data.context.start(e); break ;	
					case e.data.context.event[1] : e.data.context.drag(e); break ;	
					case e.data.context.event[2] : e.data.context.end(e); break ;	
					case e.data.context.event[3] : e.data.context.over(e); break ;	
					default : break ;	
				};
			},
			off:function(type,obj){
				(obj||this.ops.content).unbind(type||this.event[0],{context:this},this.handle);
			},
			start:function(e){
				this.ops.isPreventDefault&&e.preventDefault(); 
				if(!this.ops.content.hasClass(this.ops.animateName)){
					var touch=M.browser.touch?e.originalEvent.touches[0]:e;
					this.ops.startPos={x:touch.pageX,y:touch.pageY,time:e.timeStamp};  
					this.on(this.event[1]);
					this.on(this.event[2]);
					!M.browser.touch&&this.on(this.event[3],M(document.body));
				};
			},
			drag:function(e){
				this.ops.isPreventDefault&&e.preventDefault(); 
				if(M.browser.touch&&e.originalEvent.touches.length>1||e.originalEvent.scale&&e.originalEvent.scale!==1) return;
				var touch=M.browser.touch?e.originalEvent.touches[0]:e;
				try{  
					this.ops.durationPos={x:touch.pageX-this.ops.startPos.x,y:touch.pageY-this.ops.startPos.y,time:e.timeStamp};  
					if(Math.abs(this.ops.durationPos[this.ops.direction])>=Math.abs(this.ops.durationPos[String.fromCharCode(120,121).replace(this.ops.direction,'')])){
						this.move(this.ops.onMove);
					};
				}catch(e){}; 
			},
			over:function(e){
				var left=this.ops.container.offset().left,
					top=this.ops.container.offset().top,
					width=this.ops.container.width(),
					height=this.ops.container.height();	
				if(e.pageX<left||e.pageX>left+width||e.pageY<top||e.pageY>top+height){
					this.off(this.event[3],M(document.body));
					this.end(e);
				};
			},
			move:function(fn){
				this.ops.bar&&(this.setBarTransform(0),this.ops.bar.addClass('in'));
				var distance=this.ops.durationPos[this.ops.direction],dis=distance-this.ops.offset;
				!this.ops.isPull&&!this.ops.bounce&&(dis=Math.min(0,Math.max(dis,-this.maxScrollDistance)));
				if(dis<-this.maxScrollDistance){
					this.setBarSize(Math.max(5,this.scrollBarSize-Math.abs(distance)),null,this.ops.scrollbar.style.marginNext);
					this.setBar(0);
					this.pullSize&&(dis<-this.maxScrollDistance-this.pullSize?(this.ops.pullDown&&this.renderFlipDownPull()):(this.ops.pullDown&&this.renderFlipDownFixPull()));
				}else if(dis>0){
					this.setBarSize(Math.max(5,this.scrollBarSize-Math.abs(distance)),this.ops.scrollbar.style.marginPrev);
					this.setBar(0);
					this.pullSize&&(dis>this.pullSize?(this.ops.pullUp&&this.renderFlipUpPull()):(this.ops.pullUp&&this.renderFlipUpFixPull()));
				}else{
					this.setBarSize(null,this.ops.scrollbar.style.marginPrev);
					this.setBar(Math.abs(dis));
					this.ops.snapStatus&&this.getSnapOffset(Math.abs(dis));
				};
				this.setContent(dis,fn,Math.abs(this.ops.durationPos[this.ops.direction]));
			},
			end:function(e){
				if(this.ops.startPos){
					var durationTime=e.timeStamp-this.ops.startPos.time;
					if(durationTime>100&&this.ops.durationPos){
						var distance=this.ops.durationPos[this.ops.direction],dis=distance-this.ops.offset;
						this.release(distance,function(){
							this.setBarTransform();
							this.ops.content.addClass(this.ops.animateName);
							if(dis<-this.maxScrollDistance){
								this.endDown(dis,'down');
							}else if(dis>0){
								this.endUp(dis,'up');
							}else{
								this.translate(durationTime,distance,dis);
							};
							M.isFunction(this.ops.onRelease)&&this.ops.onRelease.call(this,this.ops.offset);
						});
					}else{
						this.release(0);
					};
				};
				this.ops.startPos&&delete this.ops.startPos;
				this.ops.durationPos&&delete this.ops.durationPos;
				this.off(this.event[1]);
				this.off(this.event[2]);
			},
			release:function(distance,fn){
				if(distance==0){
					this.setBarTransform();
					this.delay(null,1);
				}else{
					fn.call(this);
				};	
			},
			endUp:function(dis,type){
				if(this.pullSize){
					if(dis>this.pullSize){
						this.ops.pullUp&&this.renderLoadPull(type);
						this.setBarSize(this.scrollBarSize-this.pullSize,this.ops.scrollbar.style.marginPrev);	
						this.ops.offset=-this.pullSize;
						this.setContent();
						this.disabled();
						M.isFunction(this.ops.onRefresh)&&this.ops.onRefresh.call(this,type);
					}else{
						this.upReset(false,this.setContent);
					};
				}else{
					this.upReset(false,this.setContent);
				};
				this.delay(this.ops.onScroll,this.ops.isPull||(!this.ops.isPull&&this.ops.bounce)?null:1);
			},
			translate:function(time,distance,dis){
				if(time<=300){
					dis=distance<0?this.ops.offset+parseInt(Math.max(this.outerDistance*0.8,Math.abs(distance*2))):this.ops.offset-parseInt(Math.max(distance*2,this.outerDistance*0.8));
					dis=Math.max(this.minScrollDistance,Math.min(this.maxScrollDistance,dis));
					this.ops.offset=this.ops.snapStatus?this.getSnapOffset(dis):dis;
					this.setContent();
					this.setBarSize(null,this.ops.scrollbar.style.marginPrev);
					this.setBar();
					this.delay(this.ops.onScroll);
				}else{
					if(this.ops.snapStatus){
						this.ops.offset=this.getSnapOffset(Math.abs(dis));
						this.setContent();
						this.setBar();
						this.delay(this.ops.onScroll);
					}else{
						this.ops.offset=Math.abs(dis);
						this.delay(this.ops.onScroll,1);
					};
				};	
			},
			getSnapOffset:function(dis){
				for(var i=0;i<this.snapList.length;i++){
					if(dis==this.snapList[i]){
						this.ops.snapIndex=i;
						return dis;
					}else if(dis>this.snapList[i]&&dis<this.snapList[i+1]){
						if(this.snapList[i+1]-dis<=dis-this.snapList[i]){
							this.ops.snapIndex=i+1;
							dis=this.snapList[i+1];
						}else{
							this.ops.snapIndex=i;
							dis=this.snapList[i];
						};
						return Math.max(this.minScrollDistance,Math.min(this.maxScrollDistance,dis));
					};
				};
			},
			endDown:function(dis,type){
				if(this.pullSize){
					if(dis<-this.maxScrollDistance-this.pullSize){
						this.ops.pullDown&&this.renderLoadPull(type);
						this.setBarSize(this.scrollBarSize-this.pullSize,null,this.ops.scrollbar.style.marginNext);	
						this.ops.offset=this.maxScrollDistance+this.pullSize;
						this.setContent();
						this.disabled();
						M.isFunction(this.ops.onRefresh)&&this.ops.onRefresh.call(this,type);
					}else{
						this.downReset(false,this.setContent);
					};
				}else{
					this.downReset(false,this.setContent);
				};
				this.delay(this.ops.onScroll,this.ops.isPull||(!this.ops.isPull&&this.ops.bounce)?null:1);
			},
			disabled:function(){
				!this.ops.master&&(this.ops.master=M(M.creatlabel(),{
					css:{
						position:'absolute',
						left:0,
						top:0,
						right:0,
						bottom:0,
						zIndex:M.now()	
					}	
				})).appendTo(document.body);
			},
			reset:function(type,state,status,text,fn){
				this.ops.content.addClass(this.ops.animateName);
				this.setBarTransform();
				M.isBoolean(status)&&this.renderResultPull(type,status,text);
				M.delay(M.isBoolean(status)?this.ops.speed:1,function(){
					this[type+'Reset'](status,state,function(){
						this.delay(function(){
							switch(type){
								case 'up' : this.ops.pullUp&&this.ops.pullUp.html(this.renderInitPull(this.renderTextPull('up'))); break ;	
								case 'down' : this.ops.pullDown&&this.renderFlipDownFixPull(); break ;	
								default : break ;	
							};
							this.ops.master&&(this.ops.master.remove(),delete this.ops.master);
							M.isFunction(fn)&&fn.call(this,this.ops.offset);
							M.isFunction(this.ops.onScroll)&&this.ops.onScroll.call(this,this.ops.offset);
						},null);
					});
				},this);
			},
			upReset:function(status,state,fn){
				!M.isBoolean(status)&&this.ops.pullUp&&this.ops.pullUp.html(this.renderInitPull(this.renderTextPull('up')));
				this.setBarSize(null,this.ops.scrollbar.style.marginPrev);	
				state&&(this.ops.offset=this.minScrollDistance,this.setContent());
				M.isFunction(fn)&&fn.call(this);
			},
			downReset:function(status,state,fn){
				!M.isBoolean(status)&&this.ops.pullDown&&this.renderFlipDownFixPull();
				this.setBarSize(null,null,this.ops.scrollbar.style.marginNext);	
				state&&(this.ops.offset=this.maxScrollDistance,this.setContent());
				M.isFunction(fn)&&fn.call(this);
			},
			scrollToTop:function(){
				this.scrollTo(this.minScrollDistance);
			},
			scrollToBottom:function(){
				this.scrollTo(this.maxScrollDistance);
			},
			prev:function(){
				this.scrollTo(Math.max(this.minScrollDistance,this.ops.offset-(this.ops.snapStatus?this.snapDistance:this.ops.mouseWheelSpeed)));
			},
			next:function(){
				this.scrollTo(Math.min(this.maxScrollDistance,this.ops.offset+(this.ops.snapStatus?this.snapDistance:this.ops.mouseWheelSpeed)));
			},
			scrollTo:function(offset,status){
				if(M.isNumeric(offset)&&!this.ops.content.hasClass(this.ops.animateName)){
					status=M.isBoolean(status)?status:true;
					status&&this.ops.content.addClass(this.ops.animateName);
					this.ops.offset=Math.max(this.minScrollDistance,Math.min(Math.abs(offset),this.maxScrollDistance));
					this.ops.snapStatus&&this.getSnapOffset(this.ops.offset);
					this.setContent();
					this.setBarSize(null,this.ops.scrollbar.style.marginPrev);
					this.setBar();
					M.isFunction(this.ops.onRelease)&&this.ops.onRelease.call(this,this.ops.offset);
					this.delay(this.ops.onScroll,status?null:1);
				};
			},
			setContent:function(value,fn,distance){
				this.set(this.ops.content,M.isNumeric(value)?value:-this.ops.offset,fn,distance);
			},
			setBar:function(value,fn){
				this.ops.bar&&this.set(this.ops.bar,Math.min(this.maxScrollBarDistance,Math.max(this.minScrollBarDistance,parseInt((M.isNumeric(value)?Math.abs(value):this.ops.offset)*this.maxScrollBarDistance/this.maxScrollDistance))),fn);
			},
			setBarSize:function(value,a,b){
				this.ops.bar&&this.ops.bar.css({
					x:{width:value||this.scrollBarSize,left:M.isNumeric(a)?a:'auto',right:M.isNumeric(b)?b:'auto'},
					y:{height:value||this.scrollBarSize,top:M.isNumeric(a)?a:'auto',bottom:M.isNumeric(b)?b:'auto'}
				}[this.ops.direction]);
			},
			setBarTransform:function(speed){
				this.ops.bar&&(speed=M.isNumeric(speed)?speed:this.ops.speed*0.001,this.ops.bar.css({webkitTransition:'all '+speed+'s linear',mozTransition:'all '+speed+'s linear',transition:'all '+speed+'s linear'}));
			},
			set:function(obj,value,fn){
				var name='translate3d';
				obj.css({
					x:{WebkitTransform:name+'('+value+'px,0,0)',MozTransform:name+'('+value+'px,0,0)',transform:name+'('+value+'px,0,0)'},
					y:{WebkitTransform:name+'(0,'+value+'px,0)',MozTransform:name+'(0,'+value+'px,0)',transform:name+'(0,'+value+'px,0)'}
				}[this.ops.direction]);	
				M.isFunction(fn)&&fn.apply(this,[].slice.call(arguments,3));
			},
			delay:function(fn,speed){
				M.delay(speed||this.ops.speed,function(args){
					this.ops.content.removeClass(this.ops.animateName);
					this.ops.bar&&this.ops.bar.removeClass(this.ops.animateName).removeClass('in');
					M.isFunction(fn)&&fn.apply(this,[this.ops.offset].concat(args));
				},this,[].slice.call(arguments,2));	
			},
			destory:function(){
				delete this;	
			}
		};
		return {
			defaults:{
				scrollbar:{
					enabled:true,
					style:{
						marginPrev:2,
						marginNext:2,
						size:'0.15rem',
						backgroundColor:'rgba(255,0,0,0.5)'
					}	
				},
				isPreventDefault:true,
				bounce:true,
				container:null,
				direction:'y',
				mousewheel:false,
				mouseWheelSpeed:200,
				offset:0,
				snapStatus:false,
				snapIndex:0,
				animateName:'mt-scroll-ani',
				isPull:false,
				callback:function(){},
				onMove:function(){},
				onRefresh:function(){},
				onRelease:function(){},
				onScroll:function(){}
			},
			init:function(ops){
				return new init(M.extend(true,{},this.defaults,ops));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);