define(["app","formDirective"], function(app) {
	/*此部分只对带清除功能的input且带自动验证的指令有效 修复ng-model验证服务在手动赋值的情况下无效的情况*/
	/*start*/
	app.register.decorator('dirValidPhoneDirective', ValidDecorator);
	app.register.decorator('dirValidCapchaDirective', ValidDecorator);
	app.register.decorator('dirValidPasswordDirective', ValidDecorator);
  /*登录注册页确保全屏*/
	app.register.decorator('ionFooterBarDirective', FooterBarInContent);
	
	ValidDecorator.$inject = ['$delegate', '$ionicGesture'];

	function ValidDecorator($delegate, $ionicGesture) {
		var directive = $delegate[0];
		var compile = directive.compile;
		directive.compile = function(tElement, tAttrs) {
			var link = compile.apply(this, arguments);
			return function(scope, elem, attrs) {
				link.apply(this, arguments);
				var ctrl = arguments[3];
				if(elem.next()) {
					$ionicGesture.on('tap', function(e) {
						scope.$apply(function() {
							ctrl.$setViewValue("");
							elem.val("");
						})
					}, elem.parent().parent().find("i").eq(0));
				}
			};
		};
		return $delegate;
	}
	/*end*/

	FooterBarInContent.$inject=['$delegate'];
	function FooterBarInContent($delegate){
		var directive = $delegate[0];
		var compile = directive.compile;		
		directive.compile = function(tElement, tAttrs) {
			var link = compile.apply(this, arguments);
			return function(scope, $element, attrs) {
				var element=$element[0];
				var viewElement=element.parentElement.parentElement.parentElement;
				var scrollElement=element.parentElement;
				var screenHeight=viewElement.clientHeight;
				scrollElement.style.height=screenHeight+'px'; 
			};
		};
		return $delegate;		
		
	}

});