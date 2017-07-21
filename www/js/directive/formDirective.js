define(['app', 'commonService', "service/platformService"], function(app) {
	app.register
		.directive("dirValidPhone", ValidPhone) //手机合法性验证
		.directive("dirValidCapcha", ValidCapcha) //验证码验证
		.directive("dirValidPassword", ValidPassword) //密码验证
		.directive("dirAlwaysKeepKey", AlwaysKeepKey) //保持键盘显示
		.directive("dirParentScrollControl", ParentScrollControl) //手动控制视图滚动
		.directive("dirEditable", Editable) //为非input的可输入元素定义双向绑定
	/*********************************************/
	/*
	 * <form name="login">
	 *	<input name="phone" ng-model="phone" valid-phone> //指令用于此标签
	 *	<span ng-show="login.phone.$error.phone">  //$error.phone在ctrl.$setValidity("phone", valid)中定义;
	 * </form>
	 * /
	/*********************************************/

	ValidPhone.$inject = ['validator'];

	function ValidPhone(validator) {
		return {
			require: 'ngModel',
			link: function(scope, elem, attrs, ctrl) {
				var validateParser = function(value) {
					var valid = validator.checkMobile(value);
					ctrl.$setValidity("phone", valid);
					return value;
				}
				ctrl.$parsers.push(validateParser);
			}
		}
	}
	/*********************************************/
	/*
	 * <form name="login">
	 *	<input name="capcha" ng-model="capcha" dir-valid-capcha> //指令用于此标签
	 *	<span ng-show="login.capcha.$error.capcha">  //$error.phone在ctrl.$setValidity("capcha", valid)中定义;
	 * </form>
	 * /
	/*********************************************/
	ValidCapcha.$inject = ['validator'];

	function ValidCapcha(validator) {
		return {
			require: 'ngModel',
			link: function(scope, elem, attrs, ctrl) {
				var validateParser = function(value) {
					var valid = validator.checkCapcha(value);
					ctrl.$setValidity("capcha", valid);
					return value;
				}
				ctrl.$parsers.push(validateParser);
			}
		}
	}

	/*********************************************/
	/*
	 * <form name="login">
	 *	<input name="password" ng-model="password" dir-valid-password> //指令用于此标签
	 *	<span ng-show="login.password.$error.password">  //$error.phone在ctrl.$setValidity("password", valid)中定义;
	 * </form>
	 * /
	/*********************************************/
	ValidPassword.$inject = ['validator'];

	function ValidPassword(validator) {
		return {
			require: 'ngModel',
			link: function(scope, elem, attrs, ctrl) {
				var validateParser = function(value) {
					var valid = validator.checkPassword(value);
					ctrl.$setValidity("password", valid);
					return value;
				}
				ctrl.$parsers.push(validateParser);
			}
		}
	}

	/*@<label for="password" ng-if="login.shownPsw" class="label" contenteditable="true" editable ng-model="login.password" ></label>
	 * 上述标签在需要显示密码时显示 使用editable指令确保该文本可作为input使用。
	 * @<label class="button button-icon icon" ng-if="login.password" ng-class="{true:'ion-eye',false:'ion-eye-disabled'}[login.shownPsw]" dir-always-keep-key></label>
	 * 上述标签用于显示是否显示密码的按钮（“eye”），并在点击时保持键盘不收缩。
	 				<div class="list list-inset input-inner-content">
					  <label class="item item-input">
					    <i class="icon placeholder-icon ion-locked"></i>
					    <input id="password" ng-show="!login.shownPsw" type="password" name="password" placeholder="请输入密码" ng-model="login.password"  dir-valid-password  required autocomplete="off" autocomplete="new-password" >
					    <label for="password" ng-if="login.shownPsw" class="label" contenteditable="true" editable ng-model="login.password" ></label>
					    <i class="icon ion-ios-close-outline closeBtn margin-a-button-right" ng-show="login.password" ></i>
					  </label>
					  <label  class="button button-icon icon" ng-if="login.password" ng-class="{true:'ion-eye',false:'ion-eye-disabled'}[login.shownPsw]" dir-always-keep-key></label>
					</div>	
	 * */
	//按按钮显示或关闭密码
	AlwaysKeepKey.$inject = ['$ionicGesture', '$timeout'];
  function AlwaysKeepKey($ionicGesture, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var inputEle = elem.parent().parent()[0].querySelector(".form-input"),
          pswText = elem.parent().parent()[0].querySelector(".label");
        var touchHandler = $ionicGesture.on('tap', touchStartFn, elem.parent());
        
        scope.$on("$destroy", function() {
          $ionicGesture.off(touchHandler, 'tap', touchStartFn);
        });
        
        scope.$watch("passwordOff",function(n){
          if(n){
            inputEle.type="password"; 
            scope.shownPsw = false;
          }
        });

        function touchStartFn(e) {
          e.preventDefault();
          if(!scope.shownPsw) {
           inputEle.type="text";
            scope.$apply(function() {
              scope.shownPsw = true;
            });       
          } else {
            hidePassword();
          }
        }
        
        function hidePassword(){
          inputEle.type="password"; 
          scope.$apply(function() {
            scope.shownPsw = false;
          });           
        }
      }
    }
  }
/*长按显示密码	function AlwaysKeepKey($ionicGesture, $timeout) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				var inputEle = elem.parent().parent()[0].querySelector(".form-input"),
					pswText = elem.parent().parent()[0].querySelector(".label");
				var touchHandler = $ionicGesture.on('touch', touchStartFn, elem.parent());
				var touchEndHandler = $ionicGesture.on('touchend', touchEndFn, elem.parent());
				scope.$on("$destroy", function() {
					$ionicGesture.off(touchHandler, 'touch', touchStartFn);
					$ionicGesture.off(touchEndHandler, 'touchend', touchEndFn);
				});

				function touchStartFn(e) {
					e.preventDefault();
					inputEle.classList.remove("top-lay");
					inputEle.classList.add("bottom-lay");
					pswText.classList.remove("bottom-lay");
					pswText.classList.add("top-lay");
					scope.$apply(function() {
						scope.shownPsw = true;
					});
					window.addEventListener("native.keyboardhide", keyboardEvent);
				}

				function touchEndFn(e) {
					e.preventDefault();
					pswText.classList.remove("top-lay");
					pswText.classList.add("bottom-lay");
					inputEle.classList.remove("bottom-lay");
					inputEle.classList.add("top-lay");
					$timeout(function() {
						scope.$apply(function() {
							scope.shownPsw = false;
						});
						window.removeEventListener("native.keyboardhide", keyboardEvent);
					}, 1000);
				}

				function keyboardEvent() {
					$timeout(function() {
						inputEle.focus();
					}, 0);
				}
			}
		}
	}*/
  
	/*手动控制ion-content滚动以确保form中的submit button始终保持在视图内*/
	ParentScrollControl.$inject = ['$timeout','platformAPI'];

	function ParentScrollControl($timeout,platformAPI) {
		return {
			resctrict: 'A',
			link: function(scope, elem, attr) {
			  var bodyClass=attr["dirParentScrollControl"];
				var activeBody; //当前显示的view
				var windowHeight, screenData = platformAPI.getScreenData();
				var noInputsHasFocus; //如果没有input拥有焦点，此值为true
				var scrollElement = elem[0].parentNode; //ion-content内包的下一级div
				var viewElement = elem[0].parentNode.parentNode.parentNode; //ion-content
				var scrollElementOffset = false; //表单submit按钮是否在键盘下，为数字是，为true否，为false表明未初始化
				screenData.ready = false; //初始化屏幕尺寸都未计算
				screenCalculator();
				window.addEventListener("native.keyboardshow", showFn);
				window.addEventListener("native.keyboardhide", hideFn);
				scope.$on("$destroy", function() {
					window.removeEventListener("native.keyboardshow", showFn);
					window.removeEventListener("native.keyboardhide", hideFn);
				});

				function showFn(e) {
					if(!screenData.ready) {
						screenData.keyboardHeight = e.keyboardHeight;
						screenCalculator();
					}
					if(viewElement.getAttribute("nav-view") == "active") {
						getActiveBody();
						activeBody.getElementsByTagName("ion-content")[0].classList.remove("has-footer");
						if(!scrollElementOffset) {
							checkButtonUnderKeyBoard();
						}
						if(angular.isNumber(scrollElementOffset)) {
							//键盘显示后原生滚动会滚动到拥有焦点的最后一个input上，
							//  此时加上一个相对这个input偏移量和button高度即可								
							window.requestAnimationFrame(function() {
								scrollElement.style.transform = "translate3d(0%, -70px, 0px)";
								activeBody.style.backgroundPositionY = "-70px";
							});
						}
					}
				}

				function hideFn(e) {
					if(!screenData.ready) {
						screenCalculator();
					}
					if(viewElement.getAttribute("nav-view") == "active") {
						getActiveBody();
						activeBody.getElementsByTagName("ion-content")[0].classList.add("has-footer");
						if(!scrollElementOffset) {
							checkButtonUnderKeyBoard();
						}
						if(angular.isNumber(scrollElementOffset)) {
							noInputsHasFocus = true;
							var inputs = document.querySelectorAll(".form-input");
							angular.forEach(inputs, function(item) {
								if(document.activeElement == item) {
									noInputsHasFocus = false;
								}
							});
							if(noInputsHasFocus) {
								window.requestAnimationFrame(function() {
									scrollElement.style.transform = "translate3d(0%, 0px, 0px)";
									activeBody.style.backgroundPositionY = "top";
								});
							} else {
								//判断键盘隐藏是因为键盘切换还是因为关闭键盘，键盘切换后一段时间内键盘仍然显示
								//键盘切换不需要滚动复位，而键盘隐藏需要复位					
								$timeout(function() {
								  try{
                    if(!cordova.plugins.Keyboard.isVisible) {
                      window.requestAnimationFrame(function() {
                        scrollElement.style.transform = "translate3d(0%, 0px, 0px)";
                        activeBody.style.backgroundPositionY = "top";
                      });
                    }								  	
								  }catch(e){}
								}, 300);
							}
						}
					}
				}

				function getActiveBody() {
					var allFormBody = document.querySelectorAll(bodyClass);
					angular.forEach(allFormBody, function(item) {
						if(item.getAttribute("nav-view") == "active") {
							activeBody = item;
						}
					});
				}

				function checkButtonUnderKeyBoard() {
				  var sumitButtonStr=attr["relativeElement"];//submit按钮，根据submit按钮未知重新定位页面滚动
					var sumitButton = activeBody.querySelector(sumitButtonStr);
					var buttonOffsetTop = (function() {
						var obj = sumitButton.getBoundingClientRect();
						return obj.bottom - 20;
					})();
					if(buttonOffsetTop >= screenData.windowMinHeight) {
						scrollElementOffset = -70;
					} else {
						scrollElementOffset = true;
					}
				}

				function screenCalculator() {
					try {
						if(!cordova.plugins.Keyboard.isVisible) {
							if(angular.isFunction(screenData.windowMaxHeight)) {
								windowHeight = window.innerHeight;
								screenData.windowMaxHeight = window.innerHeight;
								platformAPI.setScreenData("windowMaxHeight", windowHeight);
							}
						} else {
							if(angular.isFunction(screenData.windowMinHeight)) {
								windowHeight = screenData.windowMaxHeight - screenData.keyboardHeight;
								screenData.windowMinHeight = windowHeight;
								platformAPI.setScreenData("windowMinHeight", windowHeight);
								platformAPI.setScreenData("keyboardHeight", screenData.keyboardHeight);
								platformAPI.setScreenData("ready", true);
								screenData.ready = true;
							}
						}
					} catch(e) {}

				}
			}
		}
	}

	/*允许属性为contenteditable
	 * 为true的tag进行ng-model绑定
	 * 将指令以editable属性加入tag即可*/
	Editable.$inject = ['$ionicGesture'];

	function Editable($ionicGesture) {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, element, attr, ngModel) {
				var handler = $ionicGesture.on('blur keyup change', actionOnRead, element);
				scope.$on("$destroy", function() {
					$ionicGesture.off(handler, 'blur keyup change', actionOnRead);
				});
				ngModel.$render = function() {
					element.html(ngModel.$viewValue || "");
				};

				function read() {
					ngModel.$setViewValue(element.html());
				}

				function actionOnRead(e) {
					scope.$apply(read);
				}

			}
		}
	}

})