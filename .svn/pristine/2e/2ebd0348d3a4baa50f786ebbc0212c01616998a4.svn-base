/** 
 * 公共库
 * created by mr.x on 16/01/26.
 * @import core/jquery-1.7.2.min.js  
 */
;(function(M,window){
	M.extend({
		server:function(){//服务器环境
		    return {
				0   : 'http://www.jialebao.cc/', //生产
				1   : 'http://cs.jialebao.me/', //测试
//				2   : typeof(PATH)=='undefined'?'':PATH,  //开发 
				888 : 'http://localhost:8080/jialebao/':PATH //本地
			}[888]/*[/\(updebug\s(\d+)\)/g.exec(navigator.userAgent.toLowerCase())[1]];//(updebug 888)*/
		}(),
		//path:'http://121.40.155.207/',
		//path:'http://localhost:8080/jialebao/',
		path:'../../../',//首页使用  M.path='';
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
		Loading:{
			show:function(){
				var svg_str='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="40" height="40" fill="#04A2B3">\
					  <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"/>\
					  <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">\
					    <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />\
					  </path>\
					</svg>';
			$('body').append('<div class="ui-loading-pic">'+svg_str+'</div>');
			},
			hide:function(){
				$('.ui-loading-pic').remove();
			}
		},
		setNumberPoint:function(number,n){//保留n位小数,默认2位
			return this.isString(number)?number:this.isNumeric(number)?Number(number).toFixed(n||2):number;
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
			var s={1:'images',2:'js',3:'css',4:'data'}[type||1];
			if(this.isString(param)){
				return this.server+s+'/'+param;
			};
			if(this.isArray(param)&&param.length>0){
				for(var i=0,str=[];i<param.length;i++){
					str.push(this.server+s+'/'+param[i]);
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
			init:function(data,fn,context,container){
				var controller=container||document.getElementById('template-controller');
				controller.innerHTML=this.resolve(controller.innerHTML,data);
				M.isFunction(fn)&&fn.apply(context||this,[].slice.call(arguments,4));
			},
			resolve:function(template,data){
				var key,replaceData;
				for(key in data){
					M.isPlainObject(data[key])?arguments.callee(template,data[key]):template=this.replace(template,key,replaceData=(!data[key]&&data[key]!=0)?'':data[key]);
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
								return 'undefined';
							};
						};
					};
				}else{
					return 'undefined';	
				};
			},
			clear:function(name){//清除
				this.set(name,null,-1);	
			}
		},
			
		/**
		 * 定义组件
		 * @name                  string              (必须)组件名称                       
		 * @value                 object|function     (可选)组件内容               	       	
		 */
		define:function(name,value){
			if(M.isString(name)){
				M.extend(this,M.creatObj(name,M.isFunction(value)?value.call(this):value));	
			};
			return M;
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
			this.bind(type||'click',M.tools.preventDefault);
			return this;
		},
		stopPropagation:function(type){
			this.bind(type||'click',M.tools.stopPropagation);
			return this;
		},
		release:function(type){
			this.unbind(type||'click',M.tools.preventDefault);
			return this;
		}
	});
	
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
	
	if(!document.getElementsByClassName){
		document.getElementsByClassName=function(className,element){
			var children=(element||document).getElementsByTagName('*'),elements=[];
			for(var i=0;i<children.length;i++){
				var child=children[i],classNames=child.className.split(' ');
				for(var j=0;j<classNames.length;j++){
					if(classNames[j]==className){ 
						elements.push(child);
						break;
					};
				};
			}; 
			return elements;
		};
	};
	
	M(document).bind('keypress',function(e){
		if(e.keyCode==13) return false;
	});
	
})(window.jQuery,window);