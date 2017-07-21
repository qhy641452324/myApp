/** 
 * 单个选择控件[银行选择|性别选择|自定义选择],支持ajax获取数据
 * created by mr.x on 16/01/10.
 * @import common/fx.common.js  common/ui/fx.picker.js
 *
 * @target                    object        		(必须)触发源					          		默认 null
 * @index       			  number             	(可选)选中索引		  			  				默认 0
 * @type       			  	  string             	(可选)选择类型(bank|sex|null)		  			默认 null  
 * @url       			  	  string             	(可选)ajax请求地址							  	默认 null  
 * @param       			  object             	(可选)ajax传参		  						默认 null  
 * @data       			  	  object             	(可选)选择列表内容数据							默认 null ⇒	{name:'',value:''}  
 * @isCloseButton             boolean        		(可选)是否展示关闭按钮				          	默认 true
 * @add            			  boolean        		(可选)是否赋值				          			默认 true
 * @title                 	  string              	(可选)标题			        				默认 null
 * @sure                 	  function            	(可选)确定回调
 * @cancel                    function            	(可选)取消回调
 */
;(function(M,window){
	M.ui.define('select',function(){
		function init(ops){
			this.ops=ops;
			this.creat();
		};
		init.prototype={
			constructor:init,
			creat:function(){
				this.ops.target&&this.ops.target.bind('click',{context:this},this.bindEvent);
				return this;
			},
			bindEvent:function(e){
				var target=M(this),that=e.data.context,name=target.attr('for');
				!!name&&(that.valueElement=M('input[name='+name+']'));
				that.targetElement=target;
				if(that.picker){
					that.picker.show();
					that.picker.inner&&that.picker.ops.column[0].index!==that.ops.index+that.picker.ops.freeFill?that.picker.indexTo(that.ops.index):that.picker.high(that.picker.ops.column[0]);
				}else{
					that.exec();
				};
				return false;
			},
			get:function(fn){
				this[this.ops.type]?this[this.ops.type](fn):M.isArray(this.ops.data)?fn.call(this,true,2):M.isString(this.ops.url)?this.request(fn):fn.call(this,false);
			},
			bank:function(fn){
				M.API.getSupportBank(this,function(data){
					if(data.length){
						this.ops.data=data;
						fn.call(this,true,1);
					}else{
						fn.call(this,false);
					};
				},function(msg){
					fn.call(this,false);
				});
			},
			sex:function(fn){
				this.ops.data=[{name:'男',value:'1'},{name:'女',value:'0'}];
				fn.call(this,true,2);
			},
			request:function(fn){
				M.ui.ajax.init({
					data:this.ops.param,
					url:this.ops.url,
					isload:false,
					success:function(data){
						if(data.length){
							this.ops.data=data;
							fn.call(this,true,2);
						}else{
							fn.call(this,false);
						};
					},
					error:function(msg){
						fn.call(this,false);
					}
				},this);
			},
			exec:function(){
				this.picker=M.ui.picker.init({
					separate:{
						width:0
					},
					title:this.ops.title,
					isCloseButton:this.ops.isCloseButton,
					callback:function(that){
						that.resolve(this);
					},
					reload:function(that){
						that.resolve(this);
					},
					sure:function(that){
						that.ops.index=this.ops.column[0].index-this.ops.freeFill;
						that.ops.add&&that.targetElement.html(that.ops.data[that.ops.index].name).addClass('black');
						that.valueElement&&that.valueElement.val(that.ops.data[that.ops.index].value);
						M.isFunction(that.ops.sure)&&that.ops.sure.apply(that,[that.ops.data[that.ops.index].name,that.ops.data[that.ops.index].value]);
					},
					cancel:function(that){
						M.isFunction(that.ops.cancel)&&that.ops.cancel.call(that);
					}
				},this);
			},
			resolve:function(self){
				this.get(function(status,type,data){
					data=this.ops.data;
					if(status){
						switch(type){
							case  1 : 
								for(var i=0,arr=[];i<data.length;i++){
									arr.push('bank/bank_ico_'+data[i].value+'_s.png');
								};
								M.ui.loadImage.init({
									pic:arr,
									onComplete:function(that){
										that.fresh(self,that.renderHTML(data,type));
									}
								},this);
								break ;
							case  2 : this.fresh(self,this.renderHTML(data)); break ;
							default : break ;
						};
					}else{
						self.refresh(false,[this]);
					};
				});
			},
			fresh:function(self,html){
				self.ops.column=[
					{index:this.ops.index,html:html}
				];
				self.refresh(true,[this]);	
			},
			renderHTML:function(data,type){
				for(var i=0,str='';i<data.length;i++){
					str+=M.renderHTML({
						proto:{
							class:'mt-select-picker'
						},
						html:(type?M.renderHTML({
							name:'img',
							proto:{
								src:M.getNormalPath('bank/bank_ico_'+data[i].value+'_s.png'),
								class:'middle icon'
							}
						}):'')+data[i].name
					});
				};
				return str;
			},
			destroy:function(){
				delete this;	
			}	
		};
		return {
			defaults:{
				target:null,
				type:null,
				data:null,
				url:null,
				param:null,
				title:null,
				isCloseButton:true,
				index:0,
				add:true,
				sure:function(){},
				cancel:function(){}
			},	
			init:function(ops){
				return new init(M.extend(true,{},this.defaults,ops));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);