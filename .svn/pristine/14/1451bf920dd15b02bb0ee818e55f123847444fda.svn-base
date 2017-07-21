/** 
 * 公共库
 * created by mr.x on 15/09/12.
 * @import core/jquery-1.7.2.min.js  core/xQuery.js 
 */
;(function(M,window){
	M.extend({
		server:function(){//服务器环境
		    return {
				0   : '', //生产
				1   : '', //测试
				2   : '',  //开发 
				888 : '' //本地
			}[888]/*[/\(updebug\s(\d+)\)/g.exec(navigator.userAgent.toLowerCase())[1]];//(updebug 888)*/
		}(),
		path:'http://192.168.1.37/',
//		path:'../',
		
		isString:function(obj){//是否字符串
			return this.type(obj)==='string';
		},
		isBoolean:function(obj){//是否boolean
			return this.type(obj)==='boolean';
		},
		isDate:function(obj){ //是否日期
			return this.type(obj)==='date';
		},
		isRegExp:function(obj){//是否正则
			return this.type(obj)==='regexp';
		},
		
		delay:function(time,callback){//延迟
			this.isNumeric(time)&&setTimeout(function(){
				callback.apply(arguments[0][0]||this,[].slice.call(arguments[0],1));	
			}.bind(this,[].slice.call(arguments,2)),time);
		},
		setNumberPoint:function(number,n){//保留n位小数,默认2位
			return this.isString(number)?number:this.isNumeric(number)?Number(number).toFixed(n||2):number;
		},
		getArrayMin:function(array){//获取数组最小值
			 return Math.min.apply(Math,array);
		},
		getArrayMax:function(array){//获取数组最大值
			 return Math.max.apply(Math,array);
		},
		getArraySum:function(obj,s){//数组求和(递加|递减)
			return this.isArray(obj)&&obj.length>0?eval(obj.join({1:String.fromCharCode(43),'-1':String.fromCharCode(45)}[s||1])):obj;	
		},
		JsonToString:function(obj){//json to string
			return this.isPlainObject(obj)?JSON.stringify(obj):obj;
		},
		StringToJson:function(obj){//string to json
			if(this.isString(obj)){
				try{  
					return JSON.parse(obj);
				}catch(e){   
					return obj;  
				}; 	
			}else{
				return obj;
			};
		},
		formatDate:function(number){//格式化数字  
			return this.isNumeric(number)?number<10?'0'+number:number:number;
		},
		getWeekend:function(date){//获取星期
			return '星期'+['日','一','二','三','四','五','六'][(this.isDate(date)?date:new Date()).getDay()];
		},
		getArrayIndex:function(arr,value){//匹配数组中value对应索引  
			arr=arr.toString(); 
			return arr.indexOf(value)>=0?arr.replace(new RegExp('((^|,)'+value+'(,|$))','gi'),'$2@$3').replace(/[^,@]/g,'').indexOf('@'):-1; 
		},
		getFormatTellphone:function(s){//格式化手机号码
			s=s.toString();
			return s.substr(0,3)+String.fromCharCode(32)+s.substr(3,4)+String.fromCharCode(32)+s.substring(7);
		},
		getFormatNumber:function(s,n){//格式化数字 例如['13,234,234.89','9,872,980','8,872.10']
			if(this.isNumeric(s)){
				 s+='';
				 s.indexOf('.')==-1&&parseFloat(s.replace(/[^\d\.-]/g,'')).toFixed(n||2);
				 var l=s.split('.')[0].split('').reverse();
				 for(var i=0,t='';i<l.length;i++){   
					t+=l[i]+((i+1)%3==0&&(i+1)!=l.length?',':'');   
				 };  
				 return t.split('').reverse().join('')+(s.indexOf('.')==-1?'.'+new Array((n||2)+1).join('0'):Number('0.'+s.split('.')[1]).toFixed(n||2).toString().substring(1));
			};
			return s;	
		},
		getChineseNumber:function(number){//金额转大写
			if(this.isNumeric(number)){
				var AA=['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'],
					BB=['','拾','佰','仟','万','亿','圆',''],
					CC=['角', '分', '厘'];
				var a =number.toString().replace(/(^0*)/g, '').split('.'), k = 0, re = '';
				for(var i=a[0].length-1;i>=0;i--){
					switch(k){
						case 0 : re = BB[7] + re; break;
						case 4 : !new RegExp('0{4}\\d{'+ (a[0].length-i-1) +'}M').test(a[0])&&(re = BB[4] + re); break;
						case 8 : re = BB[5] + re; BB[7] = BB[5]; k = 0; break;
					};
					if(k%4 == 2 && a[0].charAt(i)=='0' && a[0].charAt(i+2) != '0') re = AA[0] + re;
					if(a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k%4] + re; k++;
				};
				if(a.length>1){
					re+=BB[6];
					for(var i=0;i<a[1].length;i++){
						re+= AA[a[1].charAt(i)]+CC[i];
						if(i==2) break;
					};
				}else{
					re+='圆整';	
				};
				return re;
			};
			return number;	
		},
		getFormatCard:function(card,m){//格式化银行卡号 @card卡号 string  @m 分割位，默认为4
			if(this.isString(card)){
				m=this.isNumeric(m)?m:4;
				for(var i=0,str='';i<card.length;i+=m){
					str+=card.substr(i,m-1)+card.charAt(i+m-1).concat(String.fromCharCode(32));
				};
				return this.trim(str);
			};
			return card;	
		},
		formatPanCard:function(pan,m){//隐藏银行卡号|手机号 
			if(this.isString(pan)&&(pan=this.trim(pan)).length>=11){
				m=this.isNumeric(m)?m:4;
				return pan.substr(0,m).concat(new Array(pan.length-3-m).join(String.fromCharCode(42))).concat(pan.slice(-4));
			};
			return pan;
		},
		browser:function(n){//浏览器信息
			var u=n.userAgent,app=n.appVersion;
			return {
				touch:('ontouchstart' in window)||window.DocumentTouch&&document instanceof DocumentTouch,//是否支持touch事件
				isInstalledApp:/youragent/g.test(u.toLowerCase()),
				isWeixin:/micromessenger/g.test(u.toLowerCase()),
				isIOS:/iphone|ipad|ipod/g.test(u.toLowerCase()),
				versions:{
					trident:u.indexOf('Trident') > -1, //IE内核
					ie:u.indexOf('Trident')>-1&&((Object.hasOwnProperty.call(window,'ActiveXObject')&&!window.ActiveXObject)||parseInt(u.toLowerCase().match(/msie ([\d.]+)/)[1])),//ie版本(>=ie11为true)
					presto:u.indexOf('Presto') > -1, //opera内核
					webKit:u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
					gecko:u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
					mobile:!!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
					ios:!!u.match(/(i[^;]+;(U;)? CPU.+Mac OS X)/), //ios终端
					android:u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
					iPhone:u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
					iPod:u.indexOf('iPod') > -1 , //是否iPod
					iPad:u.indexOf('iPad') > -1, //是否iPad
					webApp:u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
				},
				language:(n.browserLanguage||n.language).toLowerCase()
			};
		}(navigator),
		deParam:function(str){// url to json     
			str=str||location.search.substr(1);
			var pairs=str.split('&'),obj={},pair,i;
			for(i in pairs){
				if(pairs[i]==='') continue;
				pair=pairs[i].split('=');
				obj[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1]);
			};
			return obj;
		},
		getNormalPath:function(param,type){//获取绝对路径  
			var s={1:'images',2:'js',3:'css',4:'data',5:'music'}[type||1];
			if(this.isString(param)){
				return this.server+'res/'+s+'/'+param;
			};
			if(this.isArray(param)&&param.length>0){
				for(var i=0,str=[];i<param.length;i++){
					str.push(this.server+'res/'+s+'/'+param[i]);
				};
				return str;
			};
			return param;
		},
		creatObj:function(name,value){//创建简单对象
			var o={};
			o[name]=value;
			return o;	
		},
		creatlabel:function(s){//创建<div>
			return String.fromCharCode(60)+(s||'div')+String.fromCharCode(62);
		},
		renderHTML:function(param){//创建dom outerHTML
			var m=param.name||'div',
				c=function(s){
					return s.replace(/[A-Z]/g,function(a,b){
						return '-'+a.toLowerCase();
					});
				},
				get=function(obj,type){
					if(M.isPlainObject(obj)){
						var str='',s=[{a:'="',b:'"',c:' '},{a:':',b:';',c:''}][type];
						for(var name in obj){
							str+=s.c+c(name)+s.a+(M.isPlainObject(obj[name])?arguments.callee(obj[name],1):obj[name])+s.b;
						};
						return str; 
					};
					return '';
				};
			return this.creatlabel(m+get(param.proto,0))+(M.isFunction(param.html)?param.html():(param.html||''))+this.creatlabel('/'+m);
		},
		
		/* 模板引擎 */
		template:{
			init:function(data,fn,context,id){
				var controller=document.getElementById(id||'template-controller');
				controller.innerHTML=this.resolve(controller.innerHTML,data);
				M.isFunction(fn)&&fn.apply(context||this,[].slice.call(arguments,4));
			},
			resolve:function(template,data){
				var key;
				for(key in data){
					M.isPlainObject(data[key])?arguments.callee(template,data[key]):template=this.replace(template,key,data[key]||'');
				};	
				return template;
			},
			replace:function(template,key,value){
				return template.replace(new RegExp('{{\\s*'+key+'\\s*}}','ig'),value);
			}
		},
		
		/* 操作查询url字符串 */   
		query:{
			get:location.search,
			getUrl:function(){
				return encodeURI(decodeURI(this.get));
			},
			setItem:function(key,value){//设置 参数(键,键值)
				value=encodeURIComponent(value);
				this.get.length==0?this.get='?'+key+'='+value:this.get=this.get+'&'+key+'='+value;
			},
			getItem:function(key){//获取 参数(键),返回(指定key对应的value)
				var str=this.get.substring(this.get.indexOf('?')+1);
				if(str.length){
					str='{"'+str.replace(/=/g,'":"').replace(/&/g,'","')+'"}';
					str=JSON.parse(str);
					return decodeURIComponent(decodeURI(str[key]));
				};
				return 'undefined';
			},
			removeItem:function(key){//移除 参数(键)
				var str=this.get.substring(this.get.indexOf('?')+1);
				str='{"'+str.replace(/=/g,'":"').replace(/&/g,'","')+'"}';
				str=JSON.parse(str);
				delete str[key];
				str=JSON.stringify(str);
				str='?'+str.substring(2,str.length-2);
				str=str.replace(/:/g,'=').replace(/,/g,'&').replace(/"/g,'');
				this.get=str;
			},
			clear:function(){//清空
				this.get='';
			}
		},
		
		/* localStorage操作 */
		localStorage:{
			get:function(name){
				var value;
				try{
					value=localStorage.getItem(name);
				}catch(e){
				}; 
				value==null&&(value=M.cookie.read(name));
				return M.StringToJson(value);
			},
			set:function(name,value){
				value=M.JsonToString(value);
				try{
					localStorage.setItem(name,value); 
				}catch(e){
					M.cookie.set(name,value,{expires:365});
				}; 
				return value;
			},
			clear:function(name){
				M.isString(name)?function(){
					try{
						localStorage.removeItem(name);
					}catch(e){
						M.cookie.clear(name);
					};	
				}():function(){
					try{
						localStorage.clear();
					}catch(e){
					};	
				}();
			}
		},

		/**
		 * 设置cookie
		 * @name         string      (必须)名字
		 * @value        string      (必须)值
		 * **对象options**
		 * ''expires''   number      (可选)有效期（天）
		 * ''path''      string      (可选)路径
		 * ''domain''    string      (可选)cookie
		 * ''secure''    boolean     (可选)是否安全协议https  默认false	
		 */
		cookie:{
			get:function(){//获取
				return document.cookie;	
			},
			set:function(name,value,param){//设置
				var str='',param=param||{};
				if(param.expires!=undefined&&M.isNumeric(param.expires)){
					var d=new Date();
					d.setTime(d.getTime()+param.expires*24*60*60*1000);
					str+=';expires='+d.toUTCString();
				}; 
				M.isString(param.path)&&(str+=';path='+param.path);
				M.isString(param.domain)&&(str+=';domain='+param.domain);
				str+=';'+((M.isBoolean(param.secure)&&param.secure)?true:false);
				document.cookie=name+'='+encodeURIComponent(value)+str;
			},
			read:function(name){//读
				var cookie=this.get();
				if(cookie.length>0){
					name+='=';
					var list=cookie.split(';');
					for(var i=0;i<list.length;i++){
						var c=M.trim(list[i]);
						if(c.indexOf(name)!=-1){
							return decodeURIComponent(c.substring(name.length,c.length));
						}else{
							if(i==list.length-1){
								return 'null';
							};
						};
					};
				}else{
					return 'null';	
				};
			},
			clear:function(name){//清除
				this.set(name,null,-1);	
			}
		},
		
		ui:{
			define:function(){
				return M.define.apply(this,arguments);
			},
			
			/**
			 * 缓存图片
			 * @pic                     string|array        (必须)图片						默认[]
			 * @time	                number              (可选)延迟时间			     		默认0
			 * @onProgress              function            (可选)单张图片缓存成功回调      		  		 	
			 * @onComplete              function            (可选)全部图片缓存成功回调
			 */
			loadImage:{
				defaults:{
					pic:[],
					time:0,
					onProgress:function(){},
					onComplete:function(){}
				},
				init:function(ops){
					ops=M.extend(true,{},this.defaults,ops);
					M.isString(ops.pic)&&(ops.pic=[ops.pic]);
					this.creat(ops,[].slice.call(arguments,1));
				},
				creat:function(ops,args){
					(M.isArray(ops.pic)&&ops.pic.length>0)?this.load(0,ops,args):ops.onComplete.apply(ops.pic,args);
				},
				load:function(index,ops,args){
					M.delay(ops.time,function(){
						M(M.creatlabel('img'),{
							src:M.getNormalPath(ops.pic[index])
						}).load(function(){	
							M.isFunction(ops.onProgress)&&ops.onProgress.apply(M.getNormalPath([ops.pic[index]]),[index+1,ops.pic.length].concat(args));
							(++index)<ops.pic.length?this.load(index,ops,args):M.isFunction(ops.onComplete)&&ops.onComplete.apply(M.getNormalPath(ops.pic),args);	
						}.bind(this));
					},this);
				}
			},
			
			/**
			 * 等待框|状态提示框
			 * @id                     string              (可选)对象id
			 * @warp	               object              (可选)被包裹容器			     	默认null
			 * @position               number              (必须)定位方式      	   		 	默认1 ⇒ 1-fixed/2-absolute
			 * @masterBackground       string              (必须)覆盖层背景颜色 	   		 	默认rgba(0,0,0,0)
			 * @innerBackground        string              (必须)背景框背景颜色 	  		 	默认rgba(0,0,0,.5) 
			 * @spinnerColor           string              (必须)等待动画颜色   	  		 	默认rgba(255,255,255,.5)
			 * @offsetLeft             number              (可选)手工调整左偏移 	  		 	默认0 
			 * @offsetTop              number              (可选)手工调整上偏移 	  		 	默认0
			 * @tip                    boolean             (可选)是否开启纯文字提醒    		 	默认false
			 * @status                 boolean             (必须)状态(只有tip为false才生效)  	默认null
			 * @time                   number              (可选)自动消失时间        		 	默认null
			 * @text                   string              (可选)文本      		  		 	默认null
			 * @callback               function            (可选)关闭之后回调
			 */
			waiting:{	
				defaults:{
					warp:null,
					position:1,
					masterBackground:'rgba(0,0,0,.3)',
					innerBackground:'rgba(0,0,0,.6)',
					spinnerColor:'rgba(255,255,255,.5)',
					offsetLeft:0,
					offsetTop:0,
					status:null,
					tip:false,
					time:null,
					text:null,
					ico:['ico_true.png','ico_error.png'],
					callback:function(){}
				},
				creat:function(ops){
					ops=M.extend(true,{},this.defaults,{id:'mt-loading-'+M.now()},ops);
					ops.warp&&(ops.position=2);
					ops.container=this.creatNode(ops);
					M.isNumeric(ops.time)&&M.delay(ops.time,function(){
						this.dismiss(ops);	
					},this);
					return M.extend(true,{},this,{defaults:ops});
				},
				creatNode:function(param){
					var position={1:'fixed',2:'absolute'},
						o=M(M.creatlabel(),{
							id:param.id,
							class:'mt-master-container mt-waiting-master in',
							css:{
								opacity:1,
								position:position[param.position],
								background:param.masterBackground,
								height:param.position==2&&(param.warp?param.warp.outerHeight(true):M(document).height()),
								zIndex:M.now()
							}	
						}),
						inner=M(M.creatlabel(),{
							class:'mt-loading-container'+(param.tip?' mt-loading-slider':''),
							css:{
								opacity:1,
								background:param.innerBackground,
								marginLeft:param.offsetLeft,
								marginTop:param.offsetTop
							},
							html:M.isString(param.text)&&M.renderHTML({
								proto:{class:'mt-loading-info'},
								html:param.text
							})
						}),
						appendNode=function(){
							(param.warp||M(document.body)).append(o.append(inner));
							param.delay=parseInt(parseFloat(inner.css('WebkitAnimationDuration')||inner.css('animationDuration'))*1000);
						};
					if(param.tip){
						M.isString(param.text)&&appendNode();
					}else{
						if(param.status==null){
							inner.prepend(this.renderLoading(param.spinnerColor));
							appendNode();
						}else if(M.isBoolean(param.status)){
							M(M.creatlabel('img'),{
								class:'mt-loading-status',
								src:M.getNormalPath('base/'+(param.status?param.ico[0]:param.ico[1]))	
							}).load(function(){	
								inner.prepend(M(this));
								appendNode();
							});
						};
					};
					return o;
				},
				renderLoading:function(color){
					var className=['mt-loading-spinner','mt-spinner-container','mt-spinner-circle','mt-loading-inner'];
					for(var str='',i=0,name=['one','two','three'];i<name.length;i++){
						for(var stp='',j=1;j<=4;j++){
							stp+=M.renderHTML({
								proto:{class:className[2]+j,style:{backgroundColor:color}}
							});
						};
						str+=M.renderHTML({
							proto:{class:className[1]+' '+name[i]},
							html:stp
						});
					};
					return M(M.creatlabel(),{
						class:className[3],
						html:M.renderHTML({
							proto:{class:className[0]},
							html:str/*M.renderHTML({
								name:'img',
								proto:{
									class:'mt-loading-icon mt-rotate-load',
									src:M.getNormalPath('base/load.png')
								}
							})*/
						})
					});
				},
				dismiss:function(param){
					if(param){
						param.container.addClass('out');
						M.delay(param.delay,function(){
							param.container.remove();
							M.isFunction(param.callback)&&param.callback.call(this,param);
						},this);
					}else{
						M('.mt-waiting-master').remove();
					};
				}
			},
			
			/**
			 * 确认框
			 * @id                     string              (可选)对象id
			 * @position               number              (必须)定位方式         		默认1 ⇒ 1-fixed/2-absolute
			 * @masterBackground       string              (必须)覆盖层背景颜色    		默认rgba(0,0,0,.3)
			 * @innerBackground        string              (必须)背景框背景颜色    		默认rgba(255,255,255,1) 
			 * @text                   string              (必须)文本            		默认null
			 * @type                   number              (必须)按钮展示类型          默认1
			 * @button                 array               (必须)按钮文字         		默认['确定']
			 * @data                   object              (可选)ajax请求参数     		默认null 
			 * @url                    string              (可选)Ajax请求地址     		默认null
			 * @callback               function            (可选)创建完成之后回调
			 * @sure                   function            (可选)确定之后回调
			 * @cancel                 function            (可选)取消之后回调
			 */
			confirm:{
				defaults:{
					position:1,
					masterBackground:'rgba(0,0,0,.3)',
					innerBackground:'rgba(255,255,255,0)',
					text:'测试文本',
					direction:'x',
					button:['确定'],
					data:null,
					url:null, 
					callback:function(){},
					sure:function(){},
					cancel:function(){}
				},
				creat:function(ops){	
					ops=M.extend(true,{},this.defaults,{id:'mt-confirm-'+M.now()},ops);
					ops.container=this.creatNode(ops);
					return M.extend(true,{},this,{defaults:ops});
				},
				creatNode:function(param){
					var position={1:'fixed',2:'absolute'},
						o=M(M.creatlabel(),{
							id:param.id,
							class:'mt-flex mt-flex-y mt-flex-center mt-master-container mt-confirm-master in',
							css:{
								position:position[param.position],
								background:param.masterBackground,
								height:param.position==2&&M(document).height(),
								zIndex:M.now()
							}
						}),
						inner=M(M.creatlabel(),{
							class:'mt-confirm-container',
							css:{
								background:param.innerBackground
							},
							html:M.renderHTML({
								name:'img',
								proto:{src:M.getNormalPath('m12.png'),class:'width-auto'}
							})+(M.isString(param.text)?M.renderHTML({
								proto:{class:'mt-confirm-content mt-flex mt-flex-y text-shadow'},
								html:M.renderHTML({
									name:'p',
									html:param.text
								})
							}):'')
						});
					param.button.length>0&&inner.append(this.renderButton(param));
					M(document.body).append(o.append(inner));	
					param.delay=parseInt(parseFloat(inner.css('WebkitAnimationDuration')||inner.css('animationDuration'))*1000);
					M.isFunction(param.callback)&&param.callback.call(this,param);
					return o;
				},
				renderButton:function(param){
					var length=param.button.length,
						className=['mt-confirm-bottom','mt-confirm-botton'];
					for(var i=0,str='',color=['gray','blue','blue'];i<length;i++){
						str+=M.renderHTML({
							name:'a',
							href:'javascript:;',
							proto:{class:className[1]+' '+(length==1?color[1]:color[i])},
							html:param.button[i]
						});
					};
					return this.addEvent(M(M.creatlabel(),{
						class:className[0]+' '+param.direction,
						html:str
					}),param);
				},
				addEvent:function(ele,param){
					param.list=ele.children();
					param.list.eq(0).bind('click',function(e){
						e.preventDefault();
						param.button.length>1?(this.close(param),M.isFunction(param.cancel)&&param.cancel.call(this,param)):this.sure.call(this,param);
						return false;	
					}.bind(this)); 
					param.button.length>1&&param.list.eq(1).bind('click',function(e){
						e.preventDefault();
						this.sure.call(this,param);
						return false;	
					}.bind(this)); 
					return ele;
				},
				sure:function(param){
					if(param.url==null){
						this.close(param);
						M.isFunction(param.sure)&&param.sure.call(this,param);
					}else{
						M.ui.ajax.init({
							data:param.data,
							url:param.url,
							isload:true,
							delay:300,
							beforeSend:function(){
								param.container.hide();
							},
							success:function(data){
								param.delay=0;
								this.close(param);
								M.isFunction(param.sure)&&param.sure.call(this,data);
							},
							error:function(msg){
								M.ui.waiting.creat({status:false,text:msg,time:500});	
								param.container.show();
							}	
						},this);
					};	
				},
				close:function(param,callback){
					param.container.addClass('out');
					M.delay(param.delay,function(){
						param.container.remove();
						M.isFunction(callback)&&callback.call(this,param);
					},this);
				}
			},
			
			/* 移动端横屏提示 */
			rotate:{
				status:true,
				container:null,
				init:function(callback,context){
					this.creat(callback,context,[].slice.call(arguments,2));
					window.orientation!=undefined&&('onorientationchange' in window)&&window.addEventListener('orientationchange',function(args){
						this.exec(callback,context,args);
					}.bind(this,[].slice.call(arguments,2)),false);
				},
				creat:function(callback,context,args){
					var image=M(M.creatlabel('img'),{src:M.getNormalPath('base/rotate.png')});
					this.container=M(M.creatlabel(),{
						class:'mt-vspromp-container',
						css:{
							zIndex:M.now()
						},
						html:M.renderHTML({
							proto:{class:'mt-vspromp-content'},
							html:M.renderHTML({
								proto:{class:'mt-vspromp-pic'},
								html:image[0].outerHTML
							})+M.renderHTML({
								proto:{class:'mt-vspromp-text'},
								html:'为了更好的体验，请将手机/平板竖过来'
							})
						})
					});
					image.load(function(){
						M(document.body).append(this.container);
						this.exec(callback,context,args);	
					}.bind(this));	
				},
				exec:function(callback,context,args){
					if(window.orientation==180||window.orientation==0){
						this.container.hide();
						if(this.status){
							this.status=false;
							M.isFunction(callback)&&callback.apply(context||this,args);
						};
					}else if(window.orientation==90||window.orientation==-90){
						this.container.show().css(zIndex,M.now());
					}else{
						M.isFunction(callback)&&callback.apply(context||this,args);
					};	
				}	
			},
			
			/**
			 * 图片懒加载
			 * @warp	               object	           (必须)被包裹容器			默认document
			 * @isBind                 boolean             (可选)是否绑定滚动事件   	默认true
			 */
			lazyload:{
				defaults:{
					warp:null,
					isBind:true	
				},
				init:function(ops){
					ops=M.extend(true,{},this.defaults,ops);
					ops.warp=ops.warp||M('.MAIN-BOX');
					this.exec(ops);
					ops.isBind&&ops.warp.bind('scroll',function(){
						this.exec(ops);	
					}.bind(this));
					return M.extend(true,{},this,{defaults:ops});
				},
				exec:function(ops){
					M.delay(50,function(){
						var o=M(window),img=M('img',ops.warp),x_oSize=o.width(),y_oSize=o.height();
						for(var i=0;i<img.length;i++){
							var target=img.eq(i),pic;
							if(!(pic=target.attr('original'))){ 
								continue;
							};
							var x_offset=target.offset().left,
								x_distance=o.scrollLeft(),
								x_size=target.width(),
								y_offset=target.offset().top,
								y_distance=o.scrollTop(),
								y_size=target.height();
							if(x_offset>=x_distance-x_size&&x_offset<x_oSize+x_distance&&y_offset>=y_distance-y_size&&y_offset<y_oSize+y_distance){
								M.ui.loadImage.init({
									pic:pic,
									onComplete:function(that){
										that.css({display:'none'}).attr('src',this[0]).addClass('lazy-propfix-img').removeAttr('original').fadeIn();
									}
								},target);
							};
						};	
					});
				}
			},
			
			/**
			 * 输入框快速清空
			 * @warp	               object	           (必须)被包裹容器			默认所有input除了radio,checkbox,hidden
			 * @callback               function            (可选)清除成功执行回调   
			 */
			clear:{
				defaults:{
					warp:null,
					load:function(){},
					callback:function(){}
				},
				init:function(ops){
					ops=M.extend(true,{},this.defaults,ops);
					ops.warp=ops.warp||M('input:not([type=checkbox],[type=radio],[type=hidden])');
					this.creat(ops,[].slice.call(arguments,1),this);
					return M.extend(true,{},this,{defaults:ops});
				},
				creat:function(ops,args,self){
					ops.warp.each(function(index){
						var target=this,
							status={input:1}[this.nodeName.toLowerCase()],
							clear=M(M.creatlabel('em'),{
							class:'fa ui-public-clear',
							html:'&#xe61c;',
							click:function(){
								status?target.value='':target.innerHTML=target.getAttribute('placeholder')||'';
								ops.callback.apply(target,[clear].concat(args));
							}
						});
						if(status){
							M(target).bind({
								blur:function(){
									self.hide(clear);
								},
								focus:function(){
									
									self.show(clear);
								}
							});
						}else{
							ops.load.apply(self,[target,clear].concat(args));	
						};
						M(target).after(clear).parent().css({paddingRight:'2.2rem',position:'relative'});
					});
				},
				show:function(o){
					o.removeClass('out').addClass('in');	
				},
				hide:function(o){
					o.addClass('out');		
				}	
			},
			
			/**
			 * ajax请求
			 * @data                  object              (可选)请求参数                       		默认null
			 * @url                   string              (必须)请求地址                       		默认null
			 * @type                  string              (必须)请求方式                       		默认get
			 * @dataType              boolean             (必须)请求数据类型                    		默认json	
			 * @timeout               number              (可选)请求超时时间                    		默认0毫秒
			 * @delay                 number              (可选)延迟失败回调处理时间     				默认0      
			 * @times                 number              (可选)请求失败后重新连续请求次数     	 		默认0    
			 * @isload                boolean             (可选)请求之前是否显示loading     	 		默认true 
			 * @enabled               boolean             (可选)是否渲染失败映射                   		默认false
			 * @container             object              (可选)展示失败映射,仅当enabled为true生效   	默认null
			 * @button                boolean             (可选)展示失败映射按钮,仅当enabled为true生效	默认false
			 * @event				  boolean             (可选)是否绑定重新加载事件						默认true
			 * @beforeSend            function            (可选)请求之前回调  
			 * @success               function            (可选)请求成功回调  
			 * @error                 function            (可选)请求失败或超时回调
			 * @context               object              (可选)上下文指定	                    	
			 */
			ajax:{
				defaults:{
					data:null,
					url:null,
					type:'get',
					dataType:'json',
					timeout:10000,
					times:0,
					status:true,
					delay:0,
					isload:true,
					render:{
						enabled:false,
						container:null,
						button:false,
						event:true
					},
					beforeSend:function(){},
					success:function(){},
					error:function(){}
				},	
				init:function(ops,context){
					ops=M.extend(true,{},this.defaults,ops);
					this.creat(0,ops.isload,ops,context,[].slice.call(arguments,2));
					return M.extend(true,{},this,{defaults:ops});
				},
				creat:function(index,status,ops,context,args){
					M.ajax({
						data:M.extend({},ops.data),
						url:ops.url,
						type:ops.type,
						dataType:ops.dataType,
						context:this,
						timeout:ops.timeout,
						beforeSend:function(){
							if(index==0){
								if(status){
									M.ui.waiting.dismiss();
									M.delay(1,function(){
										ops.status&&M.ui.waiting.creat(/*{text:'加载中...'}*/);	
									});
								};
								M.isFunction(ops.beforeSend)&&ops.beforeSend.apply(context||this,args);
							};
						},
						success:function(data){
							M.delay(ops.delay,function(){
								ops.status=false;
								if(!!!data){
									M.ui.waiting.dismiss();
									ops.render.enabled&&(this.renderError?this.renderError.change(this.renderError.defaults.container,'没有数据'):this.render('没有数据',ops,context,args));
									M.isFunction(ops.error)&&ops.error.apply(context||this,['没有数据'].concat(args));
								}else{
									status&&M.ui.waiting.dismiss();
									if(data.status==0){
										this.renderError&&this.renderError.remove(this.renderError,null,function(){
											delete this.renderError;	
										});
										M.isFunction(ops.success)&&ops.success.apply(context||this,[data.returnData||data].concat(args));
									}else{
										ops.render.enabled&&(this.renderError?this.renderError.change(this.renderError.defaults.container,data.msg):this.render(data.msg,ops,context,args));	
										M.isFunction(ops.error)&&ops.error.apply(context||this,[data.msg].concat(args));
									};
								};	
							},this);
						},
						complete:function(XMLHttpRequest,status){
							M.delay(ops.delay,function(){
								ops.status=false;
								if(status!='success'){
									if(index<ops.times){
										this.creat(++index,status,ops,context,args);	
									}else{
										var text={
											error:'请求失败',
											timeout:'请求超时',
											parsererror:'数据格式错误'
										}[status];
										M.ui.waiting.dismiss();
										ops.render.enabled&&(this.renderError?this.renderError.change(this.renderError.defaults.container,text):this.render(text,ops,context,args));	
										M.isFunction(ops.error)&&ops.error.apply(context||this,[text].concat(args));
									};
								};
								XMLHttpRequest.abort();
							},this);
						}
					});	
				},
				render:function(text,ops,context,args){
					this.renderError=M.ui.error.init({
						text:text,
						warp:ops.render.container,
						button:{
							enabled:ops.render.button
						},
						callback:function(){
							ops.render.event&&M.delay(ops.delay,function(){
								this.creat(0,true,ops,context,args);	
							},this);
						}	
					},this);	
				}
			},
			
			/**
			 * 请求失败渲染页面
			 * @type                  number              (可选)展示图标类型                       默认 网络故障(0|1-网络故障,2-请求失败,3-请求超时,4-数据格式错误,5-无数据)
			 * @warp             	  object              (可选)渲染映射外包装					    默认 body
			 * @enabled               boolean             (可选)是否渲染按钮					    默认 true
			 * @text                  string              (可选)渲染按钮内容,仅当enabled为true生效					    
			 * @callback              function            (可选)重新加载回调
			 * @context               object              (必须)执行上下文                       	       	
			 */
			error:{
				defaults:{
					text:'请求失败',
					warp:null,
					html:null,
					button:{
						enabled:true,
						text:'重新加载'
					},
					callback:function(){}	
				},	
				init:function(ops,context){
					ops=M.extend(true,{},this.defaults,ops);
					ops.warp=ops.warp||M(document.body);
					ops.container=this.creat(ops,context,[].slice.call(arguments,2));
					return M.extend(true,{},this,{defaults:ops});
				},
				creat:function(ops,context,args){
					var self=this,
						o=M(M.creatlabel(),{
							class:'mt-master-container mt-error-container mt-flex mt-flex-y in',
							html:M.renderHTML({
								proto:{class:'mt-flex-inner relative'},
								html:M.renderHTML({
									proto:{class:'mt-flex mt-flex-y mt-flex-center mt-error-content'}
								})
							}),
							click:function(){
								M.isFunction(ops.callback)&&ops.callback.apply(context||self,args);
							}
						});
					ops.button.enabled&&o.append(M(M.creatlabel('a'),{
						class:'ui-submit-button mt-error-btn blue relative',	
						href:'javascript:;',
						html:ops.button.text
					}));
					self.change(o,ops.text,function(){
						ops.warp.append(o);	
					});
					return o;
				},
				change:function(obj,text,fn){
					M(M.creatlabel('img'),{
						class:'mt-error-pic',
						src:M.getNormalPath(['base/error_1.png','base/error_2.png'][Math.floor(Math.random()*2)])
					}).preventDefault('mousedown').load(function(){
						obj.children().eq(0).children().html(this.outerHTML+M.renderHTML({
							name:'p',
							proto:{class:'mar-top-10 mt-error-text'},
							html:text+'，'+M.renderHTML({
								name:'span',
								proto:{class:'blue'},
								html:'重新刷新试试'+M.renderHTML({
									name:'i',
									proto:{class:'fa'},
									html:'&#xe639;'
								})
							})
						}));
						M.isFunction(fn)&&fn();
					});		
				},
				remove:function(ops,time,fn,context){
					ops.defaults.container.addClass('out');
					M.delay(M.isNumeric(time)?time:parseInt(parseFloat(ops.defaults.container.css('WebkitAnimationDuration')||ops.defaults.container.css('animationDuration'))*1000),function(){
						ops.defaults.container.remove();
					});	
					M.isFunction(fn)&&fn.apply(this||context,[].slice.call(arguments,4));
				}
			},
			
			/**
			 * 全局滚动公告
			 * @html                  string              (必须)公告内容,支持html标签                     
			 * @href              	  string              (可选)链接地址								默认 null	
			 * @direction             string              (可选)移动方向(left|right)					默认 left	
			 * @speed              	  number              (可选)移动速度								默认 2秒	
			 * @delay              	  number              (可选)循环移动时间间隔						默认 6秒				             	       	
			 * @callback              function            (可选)关闭回调
			 */
			notice:{
				defaults:{
					html:'请输入公告内容，支持html标签',
					href:null,
					direction:'left',
					speed:2,
					delay:6,
					callback:function(){}
				},	
				init:function(ops){
					this.creat(M.extend(true,{},this.defaults,ops));
				},
				creat:function(ops){
					M('.MAIN-BOX').prepend(M(M.creatlabel(),{
						class:'ui-announce-container mt-flex mt-flex-x',
						html:M.renderHTML({
							name:'i',
							proto:{class:'fa icon'},
							html:'&#xe620;'
						})+M.renderHTML({
							proto:{class:'ui-announce-content mt-flex-inner'},
							html:M.renderHTML({
								name:'marquee',
								proto:{
									direction:ops.direction,
									scrollamount:ops.speed,
									scrolldelay:ops.delay
								},
								html:ops.html
							})
						})
					}).click(function(){
						ops.href&&(M.browser.isInstalledApp?M.ui.cordova.createWebPage({
							url:M.server+ops.href,
							navigationBar:{
								content:{
									title:{
										text:'消息详情'
									}	
								}	
							} 
						}):window.location=M.server+ops.href);
						return false;		
					}).append(M(M.creatlabel('em'),{
						class:'ui-notice-close',
						html:M.renderHTML({
							name:'i',
							proto:{class:'fa'},
							html:'&#xe61f'
						})
					}).click(function(){
						var o=M(this).parent();
						o.addClass('out');
						M.delay(parseInt(parseFloat(o.css('WebkitAnimationDuration')||o.css('animationDuration'))*1000),function(){
							M.isFunction(ops.callback)&&ops.callback.call(ops);
						});	
						return false;	
					})));
				}	
			},
			
			/* scrollTop */
			scrollTop:function(){
				var box=M('.MAIN-BOX'),
					top=M(M.creatlabel('a'),{
						html:'&#xe63c;',
						class:'fa',
						href:'javascript:;',
						id:'ui-scroll-top',
						click:function(){
							box.animate({scrollTop:0},300,'swing');
						}
					});
				M(document.body).append(top);
				box.bind('scroll',function(){
					M(this).scrollTop()>5?top.addClass('in'):top.removeClass('in');	
				});
			},
			
			/* IP城市定位 */
			IP:{
				init:function(callback){
					M.ajax({
						url:'http://pv.sohu.com/cityjson',
						dataType:'jsonp',
						context:this,
						error:function(msg){
							this.creat(returnCitySN.cip,callback);
						}	
					});	
				},
				creat:function(ip,fn){
					M.ajax({
						url:'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip='+ip,
						dataType:'jsonp',
						context:this,
						error:function(msg){
							var ip=M.localStorage.get('ip');
							if(ip){
								if(ip.country!=remote_ip_info.country||ip.province!=remote_ip_info.province||ip.city!=remote_ip_info.city||ip.district!=remote_ip_info.district){
									this.show(ip,fn);
								};
							}else{
								M.localStorage.set('ip',{
									country:remote_ip_info.country,
									province:remote_ip_info.province,
									city:remote_ip_info.city,
									district:remote_ip_info.district	
								});
								this.show(remote_ip_info,fn);
							};
						}	
					});		
				},
				show:function(ops,fn){
					var city=ops.district.length?ops.district:ops.city;
					M.ui.confirm.creat({
						text:'系统定位到您在'+city+'，需要切换至'+city+'吗？',
						button:['取消','确定'],
						sure:function(){
							M.isFunction(fn)&&fn.call(this,city);	
						}
					});	
				}	
			},
			
			/* 提示是否升级 */
			checkUpdataAPP:function(){
				if(M.query.getItem('vp')!='002'&&!!!M.localStorage.get('updataTip')){
					M.ui.confirm.creat({
						text:'前往“欧冶金融”公众号，升级APP，参与推荐有奖，欢乐领红包。',
						direction:'y',
						button:['立即升级','下次再说','不再提示'],
						callback:function(ops){
							ops.list.eq(2).click(function(){
								this.close(ops);
								M.localStorage.set('updataTip',1);
							}.bind(this));
						},
						cancel:function(){
							window.location=M.getNormalPath(M.browser.isIOS?'http://itunes.apple.com/cn/app/id995966598':'http://lc.ouyeelf.com/oycfmobile/download/ouyeelf.apk');	
						}
					});
				};	
			}
			
		},
		
		/* 路由 */
		router:{
			
		},
		
		/**
		 * 定义组件
		 * @name                  string              (必须)组件名称   
		 * @shim                  array               (可选)所依赖JS文件列表                       
		 * @value                 object|function     (可选)组件内容               	       	
		 */
		define:function(name,shim,value){
			if(M.isString(name)){
				M.isArray(shim)&&shim.length>0?M.use.init(shim,function(othis){
					return function(){
						M.extend(othis,M.creatObj(name,M.isFunction(value)?value.apply(othis,arguments):value));
					};
				}(this)):M.extend(this,M.creatObj(name,M.isFunction(shim)?shim.call(this):shim));	
			};
			return M;
		},
		
		/**
		 * require need js
		 * @name                  array               (必须)JS文件列表                       
		 * @callback              function            (可选)加载成功回调               	       	
		 */
		use:{
			number:5, 
			init:function(name,callback){
				M.isArray(name)&&name.length>0?this.creat(this.deep(name),callback):this.remove(callback);
				return M;
			},
			deep:function(name){
				return this.get([],name,require.s.contexts._.config.shims).reverse();	
			},
			get:function(arr,name,shim){
				for(var i=0;i<name.length;i++){
					arr.push(name[i]);
					if(shim[name[i]]&&shim[name[i]].deps){
						arguments.callee(arr,shim[name[i]].deps.concat(name.slice(i+1)),shim);
						break;
					};
				};
				return arr;
			},
			exec:function(name){
				return /\?/g.test(name)?name.substring(0,name.indexOf('?')).concat(name.substr(name.indexOf('?')).replace(/\d+$/g,M.now())):name.concat('?v='+M.now());	
			},
			creat:function(name,callback){
				if(M.browser.isInstalledApp){
					if(M.ui.cordova.connection()){
						this.loop(this,0,name,function(){
							this.remove(callback,arguments);	
						},[]);
					}else{
						//调用cordova 404页面
					};	
				}else{
					this.loop(this,0,name,function(){
						this.remove(callback,arguments);	
					},[]);
				};
			},
			loop:function(context,index,list,callback,args){
				require([list[index]],function(){
					args.push(arguments[0]);
					++index==list.length?callback.apply(context,args):context.loop(context,index,list,callback,args);	
				},function(error){
					var failedId;
					if(failedId=error.requireModules&&error.requireModules[0]){
						try{
							list=list.join('|').replace(failedId,context.exec(/.js/g.test(failedId)?failedId:require.toUrl(failedId)+'.js')).split('|');
							window.renderError=window.renderError||{number:0};
							if(++window.renderError.number<=context.number){
								window.requireStatus=window.requireStatus||{};
								context.loop(context,index,list,callback,args);
							}else{
								context.render(context,{nodefine:'没有定义',timeout:'网络延时',scripterror:'js文件格式错误'}[error.requireType],index,list,callback,args);
							};
						}catch(e){};
					};
				});	
			},
			render:function(context,text,index,list,callback,args){
				window.renderError&&delete window.renderError;
				M.ui.waiting.dismiss();
				M.ui.confirm.creat({
					text:text,
					button:['重新加载'],
					sure:function(){
						context.loop(context,index,list,callback,args);
					}
				});	
				/*if(!M.renderError){
					M.renderError=M.ui.error.init({
						type:type,
						callback:function(index,list,callback,args){
							M.ui.waiting.creat({innerBackground:'rgba(0,0,0,0)'});
							this.loop(this,index,list,callback,args);
						}	
					},this,index,list,callback,args);
				}else{
					M.renderError.change(M.renderError.defaults.container,type);
				};*/
			},
			remove:function(callback,args){
				window.renderError&&delete window.renderError;
				M.renderError&&M.renderError.remove(M.renderError,1,function(){
					delete M.renderError;
				});
				M.isFunction(callback)&&callback.apply(M,args);
			}
		},
		
		/* 阻止默认事件及冒泡 */
		tools:{
			preventDefault:function(e){
				e.preventDefault();
			},
			stopPropagation:function(e){
				e.stopPropagation();
			}
		}
	});
	
	M.fn.extend({
		preventDefault:function(type){
			this.bind(type||'touchmove',M.tools.preventDefault);
			return this;
		},
		stopPropagation:function(type){
			this.bind(type||'touchmove',M.tools.stopPropagation);
			return this;
		},
		release:function(type){
			this.unbind(type||'touchmove',M.tools.preventDefault);
			return this;
		}
	});
	
	M.ready=function(fn,args){
		/*M.browser.isInstalledApp?document.addEventListener('deviceready',function(){
			fn.apply(M,args)
		},false):fn.apply(this,args);*/
		fn.apply(M,args)
		return this;	
	};
	
	if(!Function.prototype.bind){
		Function.prototype.bind=function(oThis){
			if(!M.isFunction(this)){
				M.error('Function.prototype.bind - 非方法');
				return ;
			};
			var aArgs=Array.prototype.slice.call(arguments,1),
				fToBind=this, 
				fNOP=function(){},
				fBound=function(){
				 	return fToBind.apply(this instanceof fNOP && oThis ? this : oThis , aArgs.concat(Array.prototype.slice.call(arguments)));
				};
			fNOP.prototype=this.prototype;
			fBound.prototype=new fNOP();
			return fBound;
		};
	};
})(window.jQuery||window.Zepto||window.xQuery,window);