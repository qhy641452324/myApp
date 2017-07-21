/** 
 * 放大查看图片
 * created by mr.x on 15/12/17.
 * @import common/fx.common.js common/ui/fx.slider.js
 *
 * @target                 	  object        		(必须)所要放大对象				          			默认 null 								
 * @callback                  function            	(可选)单张图片展示之后回调
 */
;(function(M){
	M.ui.define('zoom',{
		ops:{
			target:null,
			callback:function(){}
		},
		init:function(ops){
			ops=M.extend(true,{},this.ops,ops);
			if(ops.target!=null){
				for(var i=0;i<(ops.length=ops.target.length);i++){
					ops.target.eq(i).unbind('click').bind('click',{index:i,that:this,ops:ops},this.creat);
				};
			};
			return M.extend(true,{},this,{ops:ops});
		},
		creat:function(e){
			var o=e.data.that.renderNode(e.data.ops);
			M(document.body).append(o);	
			M.ui.slider.init({
				container:o.children().children(),	
				index:e.data.index,
				onClick:function(){
					o.addClass('out');
					M.delay(parseInt(parseFloat(o.css('WebkitAnimationDuration')||o.css('animationDuration'))*1000),function(){
						o.remove();	
					});
					return false;	
				},
				onRelease:function(obj){
					e.data.that.exec(obj);
					M.isFunction(e.data.ops.callback)&&e.data.ops.callback.call(obj,this.ops.index);
				}
			});
			return false;
		},
		exec:function(obj){
			var pic=M('img.pic',obj),src=pic.attr('original');
			if(!!src){
				M.ui.loadImage.init({
					pic:src,
					onComplete:function(){
						pic.parent().html(M.renderHTML({
							name:'img',
							proto:{class:'pic',src:this[0]}
						})).addClass('in');
					}
				});
			};
		},
		renderHTML:function(obj){
			return M.renderHTML({
				proto:{class:'mt-zoom-content'},
				html:M.renderHTML({
					name:'img',
					proto:{
						class:'pic',
						original:obj.attr('original-zoom'),
						src:obj.attr('src')
					}
				})+M.renderHTML({
					proto:{class:'mt-zoom-load'},
					html:M.renderHTML({
						name:'img',
						proto:{
							class:'mt-loading-icon mt-rotate-load',
							src:M.getNormalPath('base/load.png')
						}
					})
				})
			});
		},
		renderNode:function(ops){
			for(var i=0,str='';i<ops.length;i++){
				str+=M.renderHTML({
					name:'li',
					proto:{class:'mt-slider-list border-none'},
					html:this.renderHTML(ops.target.eq(i))
				});
			};
			return M(M.creatlabel(),{
				class:'mt-master-container mt-zoom-container in',
				html:M.renderHTML({
					proto:{class:'mt-slider-container height100'},
					html:M.renderHTML({
						proto:{class:'mt-slider-content height100'},
						html:M.renderHTML({
							name:'ul',
							proto:{
								class:'mt-flex mt-flex-x mt-slider-panel mt-slider-ani height10',
								style:{
									width:100*length+'%'
								}
							},
							html:str
						})
					})
				})
			});
		}
	});
})(window.jQuery||window.Zepto||window.xQuery);