/** 
 * 省市县选择控件
 * created by mr.x on 16/01/10.
 * @import common/fx.common.js  common/ui/fx.picker.js
 *
 * @target                    object        		(必须)触发源					          			默认 null
 * @index       			  number             	(可选)选中索引		  			  					默认 [0,0,0]
 * @separator       		  string             	(可选)分隔符 			  							默认 ,
 * @isCloseButton             boolean        		(可选)是否展示关闭按钮				          		默认 true
 * @title                 	  string              	(可选)标题			        					默认 '请选择城市'
 * @sure                 	  function            	(可选)确定回调
 * @cancel                    function            	(可选)取消回调
 */
;(function(M,window){
	M.ui.define('city',function(){
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
					if(that.picker.inner){
						for(var i=0;i<that.picker.inner.length;i++){
							that.picker.inner[i]&&that.picker.ops.column[i].index!==that.ops.index[i]+that.picker.ops.freeFill?that.picker.indexTo(that.ops.index[i],i):that.picker.high(that.picker.ops.column[i]);
						};
					};
				}else{
					that.exec();
				};
				return false;
			},
			get:function(fn){
				M.API.getCityData(this,function(data){
					this.data=data;
					fn.call(this,true);
				},function(msg){
					fn.call(this,false);
				});
			},
			exec:function(){
				this.picker=M.ui.picker.init({
					title:'请选择城市',
					title:this.ops.title,
					isCloseButton:this.ops.isCloseButton,
					callback:function(that){
						that.resolve(this);
					},
					reload:function(that){
						that.resolve(this);
					},
					select:function(type,that){
						switch(type){
							case  0 : that.disable(0,this); break ;	
							case  1 : that.disable(1,this); break ;	
							default : break ;	
						};	
					},
					sure:function(that){
						for(var i=0,result;i<this.inner.length;i++){
							that.ops.index[i]=this.ops.column[i].index-this.ops.freeFill;
						};
						result=that.set(0,[],[],that.data);
						that.targetElement.html(result.name.join(that.ops.separator)).addClass('black');
						that.valueElement&&that.valueElement.val(result.value.join(','));
						M.isFunction(that.ops.sure)&&that.ops.sure.call(that);
					},
					cancel:function(that){
						M.isFunction(that.ops.cancel)&&that.ops.cancel.call(that);
					}
				},this);
			},
			disable:function(type,self){
				var name={
					0 : {top:'cityFirst',bottom:'cityLast',callback:this.changeCity},
					1 : {top:'areaFirst',bottom:'areaLast',callback:this.changeArea}	
				}[type];
				if(self.inner[type].ops.snapIndex===0){
					if(!!!this[name.top]){
						name.callback.call(this,self);
						type==0&&this.changeArea.call(this,self);
						this[name.top]=true;
						this[name.bottom]&&delete this[name.bottom];
					};
				}else if(self.inner[type].ops.snapIndex===self.inner[type].snapList.length-2*(self.ops.freeFill+1)){
					if(!!!this[name.bottom]){
						name.callback.call(this,self);
						type==0&&this.changeArea.call(this,self);
						this[name.bottom]=true;
						this[name.top]&&delete this[name.top];
					};
				}else{
					name.callback.call(this,self);
					type==0&&this.changeArea.call(this,self);
					this[name.top]&&delete this[name.top];
					this[name.bottom]&&delete this[name.bottom];
				};
			},
			changeCity:function(self){
				var index=self.ops.column[0].index-self.ops.freeFill,
					data=this.data[self.ops.column[0].index-self.ops.freeFill].l;
				self.ops.column[1].index=0;
				self.ops.column[1].html=this.renderHTML(data);
				self.add(1,self,[this]);
			},
			changeArea:function(self){
				var index=self.ops.column[1].index-self.ops.freeFill,
					data=this.data[self.ops.column[0].index-self.ops.freeFill].l[index].l;
				self.ops.column[2].index=0;
				self.ops.column[2].html=(M.isArray(data)&&data.length>0)?this.renderHTML(data):null;
				self.add(2,self,[this]);
			},
			resolve:function(self){
				this.get(function(status){
					status?this.fresh(0,self,this.data):self.refresh(false,[this]);
				});
			},
			set:function(i,name,value,data){
				data=data[this.ops.index[i]];
				name.push(data.n);
				value.push(data.c);
				return (M.isArray(data.l)&&data.l.length>0)?this.set(++i,name,value,data.l):{name:name,value:value};
			},
			fresh:function(i,self,data){
				self.ops.column[i]={index:this.ops.index[i],html:this.renderHTML(data)};
				if(M.isArray(data[this.ops.index[i]].l)&&data[this.ops.index[i]].l.length>0){
					this.fresh(i+1,self,data[this.ops.index[i]].l);
				}else{
					i<2&&(self.ops.column[i+1]={index:this.ops.index[i+1],html:null});
					self.refresh(true,[this]);
				};
			},
			renderHTML:function(data){
				for(var i=0,str='';i<data.length;i++){
					str+=M.renderHTML({
						proto:{
							class:'mt-select-picker',
							dataPickerValue:data[i].c
						},
						html:data[i].n
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
				index:[0,0,0],
				separator:' ',
				title:'请选择城市',
				isCloseButton:true,
				sure:function(){},
				cancel:function(){}
			},	
			init:function(ops){
				return new init(M.extend(true,{},this.defaults,ops));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);