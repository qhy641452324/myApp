/** 
 * 表单验证
 * created by mr.x on 15/12/06.
 * @import common/fx.common.js
 *
 * @container                 object	            (必须)验证表单对象,支持css选择器		          			默认 null
 * @type					  string				(必须)验证类型,多个类型以|分割							默认 required
 * @number               	  number      			(可选)小数点位数（仅当验证小数生效）				        默认 null
 * @isMust               	  boolean      			(可选)是否必须验证										默认 true
 * @success                	  function            	(可选)验证成功回调
 * @error                     function            	(可选)验证失败回调
 *
 * ''required''  			  非空
 * ''ACSII''  				  仅ACSII字符
 * ''number''  				  纯数字，不能包含任何非数字
 * ''integer''  			  正负整数
 * ''negativeInteger''  	  负整数
 * ''positiveInteger''  	  正整数
 * ''float''  				  正负浮点数
 * ''negativeFloat''  		  负浮点数
 * ''positiveFloat''  		  正浮点数
 * ''alphabet''  			  大小写字母
 * ''LETTER''  				  大写字母
 * ''letter''  				  小写字母
 * ''chinese''  			  中文
 * ''color''  				  16进制色值
 * ''date''  				  日期
 * ''card''  				  验证国内银行卡号
 * ''username''  			  用户名
 * ''password''  			  密码
 * ''trueName''  			  真实姓名
 * ''tellphone''  			  手机号码
 * ''phoneNumber''  		  包括验证国内区号,国际区号,分机号
 * ''email''  				  邮箱
 * ''QQ''  					  QQ
 * ''IDcard''  				  身份证
 * ''IP''  					  IP地址
 * ''postCode''  			  邮政编码
 * ''img''  				  图片
 * ''file''  				  判断压缩文件
 * ''site'' 				  网址
 * ''ftp''  				  ftp地址
 * ''passport''  			  护照号码
 * ''driver''  				  驾驶证
 * ''ccv''  				  验证CCV
 * ''creditCard''  			  验证信用卡
 * ''usaCreditCard''  		  验证美国信用卡
 * ''usaPostCard''  		  验证美国邮政编码
 */
;(function(M){
	M.ui.define('validate',{
		ops:{
			container:null,
			type:'required',
			number:null,
			isMust:true,
			success:function(){},
			error:function(){}
		},
		init:function(ops){
			ops=M.extend(true,{},this.ops,ops);
			ops.type=M.trim(ops.type).split('|');
			for(var i=0;i<ops.type.length;i++){
				if(this.test(ops,ops.type[i])){
					return true;
				};
			};
			return false;
		},
		test:function(ops,type){
			return ops.isMust?this.exec(ops,type):ops.container.val().length?this.exec(ops,type):true;
		},
		exec:function(ops,type){
			var reg=this.regexp(ops.number),obj={IDcard:'checkIDCard',card:'cardsValid'};
			return obj.hasOwnProperty(type)?this[obj[type]](ops,reg[type],reg):function(){
				var s=reg[type].test(ops.container.val());
				s?ops.success.call(ops.container):ops.error.call(ops.container);
				return s
			}();	
		},
		regexp:function(n){
			return {
				price:/^([1-9]\d+|\d)(\.\d{1,2})?$/,
				required:/\S+/,
				ACSII:/^[\x00-\xFF]+$/,
				number:/^([+-]?)\d*\.?\d+$/,
				integer:/^-?[1-9]\d*$/,
				negativeInteger:/^-[1-9]\d*$/,
				positiveInteger:/^[0-9]\d*$/,
				float:/^-?(([1-9]\d+|\d)(\.\d{1,})?)$/,
				negativeFloat:new RegExp('^-(([1-9]\\d+|\\d)(\\.\\d{1,'+(M.isNumeric(n)?n:'')+'})?)$'),
				positiveFloat:new RegExp('^([1-9]\\d+|\\d)(\\.\\d{1,'+(M.isNumeric(n)?n:'')+'})?$'),
				alphabet:/^[A-Za-z]+$/,
				LETTER:/^[A-Z]+$/,
				letter:/^[a-z]+$/,
				chinese:/^[\u4e00-\u9fa5]+$/,
				color:/^#[a-fA-F0-9]{6}$/,
				date:/^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}$/,
				username:/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,
				password:/^[!"#$%&'()*+,\-.:;<=>?@\[\\\]^_`{|}~A-Za-z0-9]{6,20}$/,
				trueName:/^[?!$%~_#`.·@^\u4e00-\u9fa5]+$/,
				tellphone:/^1[3|4|5|7|8][0-9]\d{8}$/,
				phoneNumber:/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
				email:/\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/,
				QQ:/^[1-9]*[1-9][0-9]*$/,
				IDcard:{15:/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/,18:/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})([0-9xX])$/},
				IP:/((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/,
				postCode:/^[1-9][0-9]{5}$/,
				img:/(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/,
				file:/(.*)\.(rar|zip|7zip|tgz)$/,
				site:/[a-zA-z]+:\/\/[^\s]+/,
				ftp:/ftp\:\/\/[^:]*:@([^\/]*)/,
				passport:/^[0-9]{9}$/,
				driver:/\d{15}$/,
				ccv:/^[0-9]{3}$/,
				creditCard:/^(4\\d{12}(?:\\d{3})?)$/,
				usaCreditCard:/^[3-6]\d{14,15}$/,
				usaPostCard:/^\d{5}$|^\d{9}$/,
				area:{11:'北京',12:'天津',13:'河北',14:'山西',15:'内蒙古',21:'辽宁',22:'吉林',23:'黑龙江',31:'上海',32:'江苏',33:'浙江',34:'安徽',35:'福建',36:'江西',37:'山东',41:'河南',42:'湖北',43:'湖南',44:'广东',45:'广西',46:'海南',50:'重庆',51:'四川',52:'贵州',53:'云南',54:'西藏',61:'陕西',62:'甘肃',63:'青海',64:'宁夏',65:'新疆',71:'台湾',81:'香港',82:'澳门',91:'国外'}
			};
		},
		cardsValid:function(ops){
			var sum=0,pan=ops.container.val().toString();
			if(pan.length>0){
				for(var i=(pan.length-1),j=1;i>=0;i--,j++){
					 j%2==1&&(sum+=parseInt(pan[i]));
					 j%2==0&&(sum+=parseInt(pan[i]*2/10+pan[i]*2%10));
				};
				sum=sum%10==0;
				sum?ops.success.call(ops.container):ops.error.call(ops.container);
				return sum;
			};
			return false;
		},
		checkIDCard:function(ops,type,reg){
			 var value=ops.container.val(),l=value.length,re=type[l];
			 if(re==undefined){
				 ops.error.call(ops.container,'身份证号码位数不正确');
				 return false;
			 };
			 var idcard_array=value.split('');
			 if(reg.area[parseInt(value.substr(0,2))]==null){
				 ops.error.call(ops.container,'身份证号码地区正确');
				 return false;
			 };
			 var a=value.match(re);
			 if(a!=null){
				 var DD=new Date((l==15?'19':'')+a[3]+'/'+a[4]+'/'+a[5]),
				 	 flag=DD.getFullYear() == a[3] && (DD.getMonth() + 1) == a[4] && DD.getDate() == a[5];
				 if(!flag){
					 ops.error.call(ops.container,'身份证出生日期不对');
					 return false; 
				 };
				 if(l==18){
					 var S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2+ parseInt(idcard_array[7]) * 1+ parseInt(idcard_array[8]) * 6+ parseInt(idcard_array[9]) * 3,
					 	 Y = S % 11,
					 	 JYM = '10X98765432',
					 	 M = JYM.substr(Y, 1); //判断校验位
					 if(M==idcard_array[17]) {
						 ops.success.call(ops.container);
						 return true;
					 }else{
						 ops.error.call(ops.container,'身份证号码校验错误');
						 return false;
					 };
				 };
				 ops.success.call(ops.container);
				 return true;
			 }else{
				 ops.error.call(ops.container,'身份证含有非法字符');
				 return false;
			 };
		}
	});
})(window.jQuery||window.Zepto||window.xQuery);