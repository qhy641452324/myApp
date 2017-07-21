/** 
 * 日历控件
 * created by mr.x on 16/01/11.
 * @import common/fx.common.js  common/ui/fx.picker.js
 *
 * @target                    object        		(必须)触发源					          			默认 null
 * @title                 	  string              	(可选)标题			        					默认 '请选择日期'
 * @isCloseButton             boolean        		(必须)是否展示关闭按钮				          		默认 true
 * @label			  	  	  boolean				(可选)是否展示label								默认 true
 * --@separate			  	  object
 * --''width''     	  		  number      			(可选)列表分割线边框宽度								默认 0  
 * --''style''     	  		  string      			(可选)列表分割线边框形态								默认 'solid'  
 * --''color''     	  		  string      			(可选)列表分割线边框颜色								默认 'rgba(0,0,0,.08)'    
 * --@date					  object
 * --''format''     	  	  string      			(必须)显示格式										默认 YYYY-MM-DD ⇒ YYYY/MM/DD  YYYYMMDD  YYYY年MM月DD日  YY/MM/DD  hh:mm:ss  hh时mm分ss秒 
 * --''select''     	  	  string      			(可选)指定当前日期									默认 null    
 * --''min''     	  	  	  number		      	(可选)最小日期										默认 null ⇒['YYYY-MM-DD'] [hh:mm:ss]  
 * --''max''     	 	  	  number      			(可选)最大日期										默认 null  
 * --''interval''     	  	  number      			(可选)距离指定当前日期N天,指定当前日期会根据这个天数改变	默认 0    
 * --''@year''     	  		  						
 * ----''enabled''     	  	  boolean      			(必须)是否展示										默认 true   
 * ----''interval''     	  number      			(可选)间隔										默认 0   
 * ----''min''     	  	  	  number		      	(可选)最小值										默认 null  
 * ----''max''     	 	  	  number      			(可选)最大值										默认 null    
 * ----''data''     	 	  array      			(可选)自定义数据									默认 null    
 * ----''skip''     	 	  array      			(可选)需要屏蔽数据									默认 null    
 * @type    	  	  	  	  number      			(必须)快捷限制选择区域								默认 0 ⇒ 0-正常  1-指定时间之后  -1-指定时间之前 
 * @weekend    	  	  	  	  boolean      			(必须)是否展示星期									默认 false  
 * --@relative				  object
 * --''type''     	  	  	  number      			(可选)联动类型										默认 0 ⇒ 0-正常  1-指定时间之后  -1-指定时间之前 
 * --''point''     	  	 	  object      			(可选)联动日历对象									默认 null    
 * @callback                  function            	(可选)初始化完成回调
 * @sure                 	  function            	(可选)确定回调
 * @cancel                    function            	(可选)取消回调
 */
;(function(M,window){
	M.ui.define('calendar',function(){
		function init(ops){
			this.ops=ops;
			this.creat();
		};
		init.prototype={
			constructor:init,
			creat:function(){
				this.ops.target&&this.get(function(){
					this.ops.target.bind('click',{context:this},this.bindEvent);
					M.isFunction(this.ops.callback)&&this.ops.callback.apply(this);
				});	
				return this;
			},
			bindEvent:function(e){
				var target=M(this),that=e.data.context,name=target.attr('for');
				!!name&&(that.valueElement=M('input[name='+name+']'));
				that.targetElement=target;
				if(that.picker){
					that.picker.show();
					var info=M.extend(that.getDateInfo(new Date(that.ops.date.select)),that.getTimeInfo(that.ops.time.select));
					for(var i=0;i<that.list.length;i++){
						var inner=that.picker.ops.column[i],index=that.getIndex(inner.type,inner.name,info[inner.name]);
						that[inner.name]!==info[inner.name]?that.picker.indexTo(that.ops[inner.type][inner.name].index=index,i):inner.index!==index+that.picker.ops.freeFill?that.picker.indexTo(index,i):that.picker.high(inner);
					};
				}else{
					that.exec();
				};
				return false;
			},
			getDateInfo:function(date){
				date=date||new Date();
				return {
					year:date.getFullYear(),
					month:date.getMonth()+1,
					day:date.getDate(),
					hour:date.getHours(),
					minute:date.getMinutes(),
					second:date.getSeconds()	
				};
			},
			getTimeInfo:function(time){
				time=time.split(':');
				return {
					hour:parseInt(time[0]),
					minute:parseInt(time[1]),
					second:parseInt(time[2])
				};	
			},
			getMonthLen:function(year,month){
				var nextMonth=new Date(year,month,1);
				nextMonth.setHours(nextMonth.getHours()-3);
				return nextMonth.getDate(); 
			},
			getSection:function(year,length){
				return {
					year:{
						min:function(){
							return year-100;
						}(),
						max:function(){
							return year+100;
						}()
					},
					month:{min:1,max:12},
					day:{min:1,max:length},
					hour:{min:0,max:23},
					minute:{min:0,max:59},
					second:{min:0,max:59}	
				};
			},
			getNewDate:function(Y,M,D,h,m,s){
				return new Date(Y,M-1,D,h,m,s);	
			},
			setIndex:function(a,b,fn){
				if(a>b[b.length-1]){
					M.isFunction(fn)&&fn.call(this,b[b.length-1]);
					return b.length-1;
				}else{
					for(var i=0;i<b.length;i++){
						if(a>b[i]&&a<b[i+1]){
							if(a-b[i]>b[i+1]-a){
								M.isFunction(fn)&&fn.call(this,b[i+1]);
								return i+1;
							}else{
								M.isFunction(fn)&&fn.call(this,b[i]);
								return i;	
							};
						};
					};
				};
			},
			getCurrent:function(data){
				var i,o=this.getDateInfo(this.ops.date.select),section=this.getSection(o.year,this.getMonthLen(o.year,o.month));
				for(i in data){
					if(M.isPlainObject(data[i])){
						this.list=this.list||[];
						if(data[i].enabled){
							data[i].min=M.isNumeric(data[i].min)?Math.max(section[i].min,data[i].min):section[i].min;
							data[i].max=M.isNumeric(data[i].max)?Math.min(section[i].max,data[i].max):section[i].max;
							data[i].start=section[i].min;
							data[i].data=M.isArray(data[i].data)?this.getData(this.putArray(data[i].data),data[i].min,data[i].max):this.creatData(section[i].min,data[i].min,data[i].max,data[i].interval);
							if(data[i].data.length){
								(data[i].skip=M.isArray(data[i].skip)?this.putArray(data[i].skip):[]).length>0&&(data[i].data=this.resetData(data[i].data,data[i].skip));
								var m=M.getArrayIndex(data[i].data,o[i]);
								data[i].index=m>=0?m:this.setIndex(o[i],data[i].data,function(value){
									o[i]=value;
								});
								this[i]=o[i];
								this.list.push(i);
							};
						}else{
							this[i]=this.getDateInfo()[i];
						};
					};
				};	
			},
			creatData:function(a,m,n,c){
				for(var i=a,arr=[];i<=n;i+=Math.max(1,c)){
					i>=m&&arr.push(i);
				};
				return arr;
			},
			putArray:function(arr){
				var a={},b=[],j;
				for(var i=0;i<arr.length;i++){
					M.isNumeric(arr[i])&&!a[arr[i]]&&(a[arr[i]]=arr[i]);
				};
				for(j in a){
					b.push(a[j]);
				};
				return b.sort(function(m,n){
					return m-n;	
				});
			},
			getData:function(data,a,b){
				for(var i=0,arr=[];i<data.length;i++){
					data[i]>=a&&data[i]<=b&&arr.push(data[i]);
				};
				return arr;
			},
			resetData:function(a,b){
				for(var i=0,c;i<b.length;i++){
					(c=M.getArrayIndex(a,b[i]))>=0&&a.splice(c,1);
				};
				return a;
			},
			get:function(fn){
				var info=M.isString(this.ops.time.select)?this.changeTime():this.getDateInfo(),h=info.hour,m=info.minute,s=info.second;
				this.ops.time.select=M.formatDate(h)+':'+M.formatDate(m)+':'+M.formatDate(s);
				this.ops.date.select=(this.ops.date.select==null||!M.isDate(new Date(this.ops.date.select)))?new Date():function(that,info){
					return that.getNewDate(info.year,info.month,info.day,h,m,s);
				}(this,this.getDateInfo(new Date(this.ops.date.select)));
				M.isNumeric(this.ops.date.interval)&&(this.ops.date.select=this.getNewDate(this.ops.date.select.getFullYear(),this.ops.date.select.getMonth()+1,this.ops.date.select.getDate()+this.ops.date.interval,h,m,s));
				this.list&&delete this.list;
				this.getCurrent(this.ops.date);
				this.getCurrent(this.ops.time);
				M.isFunction(fn)&&fn.call(this);
			},
			changeTime:function(){
				var time=this.getTimeInfo(this.ops.time.select),info=this.getSection();
				return {
					hour:Math.min(info.hour.max,Math.max(info.hour.min,time.hour)),
					minute:Math.min(info.minute.max,Math.max(info.minute.min,time.minute)),
					second:Math.min(info.second.max,Math.max(info.second.min,time.second))
				};
			},
			exec:function(){
				this.ops.label&&(this.ops.separate.width=0);
				this.picker=M.ui.picker.init({
					title:this.ops.title,
					isCloseButton:this.ops.isCloseButton,
					separate:this.ops.separate,
					callback:function(that){
						that.resolve(this);
					},
					reload:function(that){
						that.resolve(this);
					},
					select:function(type,that){
						({year:1,month:1}[this.ops.column[type].name])&&that.ops.date.day.enabled&&that.pull(type,this);
					},
					scroll:function(type,that){
						if(!that.status){
							M.delay(1,function(type){
								var inner=this.ops.column[type],
									data=that.ops[inner.type][inner.name].data[this.ops.column[type].index-this.ops.freeFill],
									info=that.getDateInfo(),
									type={year:1,month:2,day:3,hour:4,minute:5,second:6}[inner.name],
									min={year:info.year,month:info.month,day:info.day,hour:info.hour,minute:info.minute,second:info.second},
									max={year:info.year,month:info.month,day:info.day,hour:info.hour,minute:info.minute,second:info.second},
									dateMin,timeMin,dateMax,timeMax;
								if(that.ops.date.min){
									dateMin=that.getDateInfo(new Date(that.ops.date.min));
									min.year=dateMin.year;
									min.month=dateMin.month;
									min.day=dateMin.day;
								};
								if(that.ops.time.min){
									timeMin=that.getTimeInfo(that.ops.time.min);
									min.hour=timeMin.hour;
									min.minute=timeMin.minute;
									min.second=timeMin.second;
								};	
								if(that.ops.date.max){
									dateMax=that.getDateInfo(new Date(that.ops.date.max));
									max.year=dateMax.year;
									max.month=dateMax.month;
									max.day=dateMax.day;
								};
								if(that.ops.time.max){
									timeMax=that.getTimeInfo(that.ops.time.max);
									max.hour=timeMax.hour;
									max.minute=timeMax.minute;
									max.second=timeMax.second;
								};	
								(dateMin||timeMin)&&!that.pass(min,this,1)&&that.goInto(this,type,min,timeMin,function(){
									inner=data=info=type=min=max=dateMin=timeMin=dateMax=timeMax=undefined;	
								});
								(dateMax||timeMax)&&!that.pass(max,this,0)&&that.goInto(this,type,max,timeMax,function(){
									inner=data=info=type=min=max=dateMin=timeMin=dateMax=timeMax=undefined;	
								});
							},this,type);
						};
					},
					sure:function(that){
						for(var i=0;i<this.inner.length;i++){
							var inner=this.ops.column[i];
							that[inner.name]=that.setValue(inner.type,inner.name,this,i);
						};
						that.change(that.ops.sure);
					},
					cancel:function(that){
						M.isFunction(that.ops.cancel)&&that.ops.cancel.call(that);
					}
				},this);
			},
			change:function(fn){
				var o={
						date:M.trim(this.ops.date.format),
						time:M.trim(this.ops.time.format)	
					},
					get={
						year:{r:/Y+/g,s:1},
						month:{r:/M+/g,s:0},
						day:{r:/D+/g,s:0},
						hour:{r:/h+/g,s:0},
						minute:{r:/m+/g,s:0},
						second:{r:/s+/g,s:0}
					};
				for(var i=0;i<this.picker.inner.length;i++){
					var inner=this.picker.ops.column[i];
					o[inner.type]=this.replace(o[inner.type],this[inner.name],get[inner.name].r,get[inner.name].s);
				};
				this.ops.date.select=this.getNewDate(this.year,this.month,this.day,this.hour,this.minute,this.second);
				this.ops.time.select=M.formatDate(this.hour)+':'+M.formatDate(this.minute)+':'+M.formatDate(this.second);
				o.date=this.startTrim(o.date);
				o.time=this.startTrim(o.time);
				o.date.length&&o.time.length&&(o.date=o.date.concat(String.fromCharCode(32)));
				this.targetElement.html(o.date+o.time+(this.ops.weekend?String.fromCharCode(32).concat(M.getWeekend(this.ops.date.select)):'')).addClass('black');
				this.valueElement&&this.valueElement.val(o.date+o.time);
				this.setPoint({'1':'next','-1':'prev'}[this.ops.relative.type],fn);
			},
			setPoint:function(type,fn){
				type?this[type](this.ops.relative.point,fn):M.isFunction(fn)&&fn.call(this);		
			},
			next:function(point,fn){
				var info=this.getDateInfo(this.getNewDate(this.year,this.month,this.day+point.ops.date.interval,this.hour,this.minute,this.second)),
					A=this.getNewDate(this.year,this.month,this.day,this.hour,this.minute,this.second),
					B=this.getNewDate(point.year,point.month,point.day,point.hour,point.minute,point.second);
				point.ops.date.min=M.formatDate(info.year)+'-'+M.formatDate(info.month)+'-'+M.formatDate(info.day);
				point.ops.time.min=M.formatDate(info.hour)+':'+M.formatDate(info.minute)+':'+M.formatDate(info.second);
				if(A.getTime()>B.getTime()){							
					if(point.picker){
						for(var i=0;i<point.list.length;i++){
							point[point.list[i]]=info[point.list[i]];
						};
						point.change();
					}else{
						point.ops.date.select=this.getNewDate(this.year,this.month,this.day,this.hour,this.minute,this.second);
						point.ops.time.select=point.ops.time.min;
						point.get();
					};		
				};
				M.isFunction(fn)&&fn.call(this);
			},
			prev:function(point,fn){
				point.ops.date.max=M.formatDate(this.year)+'-'+M.formatDate(this.month)+'-'+M.formatDate(this.day);
				point.ops.time.max=M.formatDate(this.hour)+':'+M.formatDate(this.minute)+':'+M.formatDate(this.second);
				M.isFunction(fn)&&fn.call(this);		
			},
			pass:function(obj,self,type){
				var A=this.getNewDate(obj.year,obj.month,obj.day,obj.hour,obj.minute,obj.second),B=this.getDateInfo();
				for(var i=0;i<this.list.length;i++){
					var o=self.ops.column[i];
					B[o.name]=this.ops[o.type][o.name].data[o.index-self.ops.freeFill];
				};
				B=this.getNewDate(B.year,B.month,B.day,B.hour,B.minute,B.second);
				return type?B.getTime()>=A.getTime():B.getTime()<=A.getTime();
			},
			goInto:function(self,type,data,status,fn){
				this.status=true;
				this.level(self,type,data,['year','month','day','hour','minute','second'],!!status,function(n){
					M.delay(self.ops.speed*2,function(){
						delete this.status;	
						M.isFunction(fn)&&fn();
					},this);
				});
			},
			level:function(self,type,data,arr,status,fn){
				switch(type){
					case  1 : status?this.reset(self,data,arr.slice(0),fn):this.reset(self,data,arr.slice(0,3),fn); break ;
					case  2 : status?this.reset(self,data,arr.slice(1),fn):this.reset(self,data,arr.slice(0,3),fn); break ;
					case  3 : status?this.reset(self,data,arr.slice(2),fn):this.reset(self,data,arr.slice(0,3),fn); break ;
					case  4 : this.reset(self,data,arr.slice(3),fn); break ;
					case  5 : this.reset(self,data,arr.slice(4),fn); break ;
					case  6 : this.reset(self,data,arr.slice(5),fn); break ;
					default : break ;
				};
			},
			reset:function(self,data,arr,fn){
				for(var i=0;i<arr.length;i++){
					if(M.getArrayIndex(this.list,arr[i])>=0){
						var j=M.getArrayIndex(this.list,arr[i]),inner=self.ops.column[j],list=this.ops[inner.type][inner.name].data;
						list[inner.index-self.ops.freeFill]!==data[arr[i]]&&self.indexTo(this.getIndex(inner.type,inner.name,data[arr[i]]),j);	
					};
					i==arr.length-1&&fn.call(this);
				};
			},
			getIndex:function(type,name,value){
				return M.getArrayIndex(this.ops[type][name].data,value);	
			},
			endTrim:function(str){
				var m=str.substr(0,str.length-1);
				return str.length?/((\d)|([\u4e00-\u9fa5]))$/.test(str)?/[\u4e00-\u9fa5]$/.test(m)?arguments.callee(m):str:arguments.callee(m):str;
			},
			startTrim:function(str){
				for(var i=0,m='';i<str.length;i++){
					/(\d)|([\u4e00-\u9fa5])|(-)|(\/)|(:)|(_)|(|)|(\*)|(\%)/.test(str[i])&&(m+=str[i]);
				};
				return m.length?/^\d/.test(m)?this.endTrim(m):this.startTrim(m.substring(1)):m;	
			},
			setValue:function(type,name,self,index){
				return this.ops[type][name].enabled?this.getValue(self,type,name,index):this[name];
			},
			replace:function(str,value,reg,status){
				return str.replace(reg.exec(str)[0],function(a,b,c){
					return M.formatDate(value.toString()).substring(status?{2:2,4:0}[a.length]:0);
				});
			},
			getValue:function(self,type,name,i){
				this.ops[type][name].index=self.ops.column[i].index-self.ops.freeFill;
				return this.ops[type][name].data[this.ops[type][name].index];
			},
			pull:function(type,self){
				if(self.inner[type].ops.snapIndex===0){
					if(!!!this.top){
						this.changeDay(self);
						this.top=true;
						this.bottom&&delete this.bottom;
					};
				}else if(self.inner[type].ops.snapIndex===self.inner[type].snapList.length-2*(self.ops.freeFill+1)){
					if(!!!this.bottom){
						this.changeDay(self);
						this.bottom=true;
						this.top&&delete this.top;
					};
				}else{
					this.changeDay(self);
					this.top&&delete this.top;
					this.bottom&&delete this.bottom;
				};
			},
			changeDay:function(self){
				var a=M.getArrayIndex(this.list,'year'),
					b=M.getArrayIndex(this.list,'month'),
					c=M.getArrayIndex(this.list,'day'),
					day=this.ops.date.day,
					y=a>=0?this.ops.date.year.data[self.ops.column[a].index-self.ops.freeFill]:this.year,
					m=b>=0?this.ops.date.month.data[self.ops.column[b].index-self.ops.freeFill]:this.month,
					d=day.data[self.ops.column[c].index-self.ops.freeFill],
					l=this.getMonthLen(y,m),
					data=this.resetData(this.creatData(day.start,day.min,day.max<l?Math.min(l,day.max):l,day.interval),day.skip),
					q=M.getArrayIndex(data,d);
				self.ops.column[c].index=q>=0?q:this.setIndex(d,data);
				self.ops.column[c].html=this.renderHTML(data);
				self.add(c,self,[this]);
			},
			resolve:function(self){
				var i,m=0,arr=[],label={year:'年',month:'月',day:'日',hour:'时',minute:'分',second:'秒'},data={date:this.ops.date,time:this.ops.time};
				for(i in data){
					var j;
					for(j in data[i]){
						if(M.isPlainObject(data[i][j])&&data[i][j].enabled){
							self.ops.column[m]={index:data[i][j].index,html:this.renderHTML(data[i][j].data),type:i,name:j};
							arr.push(this.renderLabel(label[j],m));
							m++;
						};
					};	
				};
				if(m){
					self.refresh(true,[this]);
					if(this.ops.label){
						for(var i=0;i<arr.length;i++){
							self.ops.column[i].warp.after(arr[i]);
						};
					};
					this.setSection({
						'-1':{a:'max',b:'min'},
						'1':{a:'min',b:'max'}
					}[this.ops.type]);
				}else{
					self.refresh(false,[this]);
				};
				data=label=arr=i=m=undefined;
			},
			setSection:function(obj){
				if(obj){
					this.ops.date[obj.a]=this.set(this.year,this.ops.date.year[obj.a],obj.b)+'-'+this.set(this.month,this.ops.date.month[obj.a],obj.b)+'-'+this.set(this.day,this.ops.date.day[obj.a],obj.b);
					this.ops.time[obj.a]=this.set(this.hour,this.ops.time.hour[obj.a],obj.b)+':'+this.set(this.minute,this.ops.time.minute[obj.a],obj.b)+':'+this.set(this.second,this.ops.time.second[obj.a],obj.b);
				};
			},
			set:function(a,b,c){
				return M.formatDate(b==null?a:Math[c](a,b));
			},
			renderLabel:function(name,index){
				return M(M.creatlabel(),{
					class:'mt-select-separate mt-select-label m'.concat(index),
					html:name
				});
			},
			renderHTML:function(data){
				for(var i=0,str='';i<data.length;i++){
					str+=M.renderHTML({
						proto:{
							class:'mt-select-picker'
						},
						html:M.formatDate(data[i].toString())
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
				title:'请选择日期',
				isCloseButton:true,
				label:true,
				type:0,
				separate:{
					width:0,
					style:'solid',
					color:'rgba(0,0,0,.08)'	
				},
				weekend:false,
				date:{
					format:'YYYY-MM-DD',
					select:null,
					min:null,
					max:null,
					interval:0,
					year:{
						enabled:true,
						interval:0,
						min:null,
						max:null,
						data:null,
						skip:null
					},
					month:{
						enabled:true,
						interval:0,
						min:null,
						max:null,
						data:null,
						skip:null
					},
					day:{
						enabled:true,
						interval:0,
						min:null,
						max:null,
						data:null,
						skip:null
					}	
				},
				time:{
					format:'hh:mm:ss',
					select:null,
					min:null,
					max:null,
					hour:{
						enabled:true,
						interval:0,
						min:null,
						max:null,
						data:null,
						skip:null
					},
					minute:{
						enabled:true,
						interval:0,
						min:null,
						max:null,
						data:null,
						skip:null
					},
					second:{
						enabled:true,
						interval:0,
						min:null,
						max:null,
						data:null,
						skip:null
					}
				},
				relative:{
					type:0,
					point:null
				},
				callback:function(){},
				sure:function(){},
				cancel:function(){}
			},	
			init:function(ops){
				return new init(M.extend(true,{},this.defaults,ops));
			}
		};
	});
})(window.jQuery||window.Zepto||window.xQuery,window);