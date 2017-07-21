define(['app'], function(app) {
	app.register
		.directive("dirUtilsImage", UtilsImage) //修复collection-repeat的图片鬼影
		.directive("dirLazyImage", LazyImage) //lazyload
		.directive("dirGoDetail", GoDetail) //进入商品详情页
		.directive("dirDecimalPrice", DecimalPrice) //截取价格小数点后两位		
		.directive("dirTapAction", TapAction) //首页导航tap事件
		.directive("dirAddressPicker", AddressPicker) //地址选择
		.directive("dirSinglePicker", SinglePicker) //单列选择
		.directive("dirTimeCounter", TimeCounter) //时钟

	function UtilsImage() {
		return {
			restrict: 'A',
			link: function(scope, $element, attr) {
				var currentElement = $element;
				var element = currentElement[0];
				attr.$observe('src', function(src) {
					if(src) {
						$element.addClass("opacity-hide");
						var newImg = $element.clone(true);
						newImg.attr('src', src);
						currentElement.replaceWith(newImg);
						currentElement = newImg;
						setTimeout(function() {
							currentElement.removeClass("opacity-hide");
						}, 200);
					}
				});
			}
		};
	}

	function LazyImage() {
		return {
			restrict: 'A',
			link: function(scope, $element, attr) {
				var element = $element[0];
				element.style.opacity = 0;
				element.onload = function() {
					element.style.opacity = 1;
				}
			}
		};
	}

	GoDetail.$inject = ['$ionicGesture', '$state'];

	function GoDetail($ionicGesture, $state) {
		return {
			restrict: 'A',
			link: function(scope, $element, attr) {
				var tapHandler = $ionicGesture.on('tap', GoFoodDetail, $element);
				scope.$on("$destroy", function() {
					$ionicGesture.off(tapHandler, 'tap', GoFoodDetail);
				});

				function GoFoodDetail(e) {
					e.preventDefault();
					e.stopPropagation();
					$state.go('tab.foodDetail', {
						idCommodity: scope.food.idCommodity,
						idLoad: attr.dirGoDetail||0
					});
				}
			}
		}
	}

	function DecimalPrice() {
		return {
			restrict: 'A',
			link: function(scope, $element, attr) {
				var element = $element[0];
				var priceWatcher = scope.$watch(attr.originalPrice, priceListener);

				function priceListener(n, o) {
					if(!!n) {
						var intN = parseInt(n);
						var decimalPart = parseInt(((n - intN).toFixed(2) * 100));
						var decimalNumber;
						if(decimalPart < 10) {
							decimalNumber = '.0' + decimalPart;
						} else {
							decimalNumber = '.' + decimalPart;
						}
						scope.$evalAsync(function() {
							scope[attr.scopeName].priceInt = intN;
							scope[attr.scopeName].priceIntDecimal = decimalNumber;
						});
						priceWatcher();
						element.style.visibility = "visible";
					}
				}
			}
		}
	}

	TapAction.$inject = ['$ionicGesture'];

	function TapAction($ionicGesture) {
		return {
			restrict: 'A',
			link: function(scope, $element, attr) {
				if(attr.dirTapAction) {
					var tapHandler = $ionicGesture.on('tap', evalTap, $element);
					scope.$on("$destroy", function() {
						$ionicGesture.off(tapHandler, 'tap', evalTap);
					});

					function evalTap() {
						scope.$eval(attr.dirTapAction);
					}
				}
			}
		}
	}

	function AddressPicker() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, $element, attr, ctrl) {
				var element = $element[0];
				new MultiPicker({
					div: element.id, //点击触发插件的input框的id
					container: 'container' + Date.parse(new Date()), //插件插入的容器id
					jsonData: scope.list,
					success: function(arr) {
						if(arr[1].index == 0) {
							//请选择为错误
							return;
						} else if(arr[2] && arr[2].index == 0) {
							//请选择为错误
							return;
						} else {
							var str = arr[0].value + arr[1].value + (arr[2] ? arr[2].value : '');
							ctrl.$setViewValue(str);
							element.innerHTML = str;
						}
					}
				});
			}
		}
	}


	var singlePickerLength = 0;
	
	SinglePicker.$inject=['$controller'];
	function SinglePicker($controller) {
		return {
			restrict: 'A',
			scope: {
				jsonData: '=bindJson'
			},
			require: 'ngModel',
			link: function(scope, $element, attr, ctrl) {
				var element = $element[0];
				if(!$element.timer){
				  $element.timer=Date.parse(new Date())+singlePickerLength++;
				}
				var watcher = scope.$watch("jsonData", function(n) {
					if((n instanceof Array) && n.length) {
						new MultiPicker({
							div: element.id, //点击触发插件的input框的id
  						container: element.name, //插件插入的容器id 以ele.name为名
							jsonData: scope.jsonData,
							success: function(arr) {
								console.log(arr);
								var str = arr[0] ? arr[0].value : '';
								ctrl.$setViewValue(str);
								ctrl.nodeData=arr;
								element.innerHTML = str;
							}
						});
						watcher();
					}
				});
			}
		}
	}
	
	
	function TimeCounter(){
    return {
      restrict: 'E',
      transclude:true,
      template:'<div class="ng-hide" ng-show="timeLeft>0"><span ng-transclude></span><span ng-bind="hour" class="time-unit">00</span><span class="time-colon">:</span><span ng-bind="minute" class="time-unit">00</span><span class="time-colon">:</span><span ng-bind="second"  class="time-unit">00</span></div>',
      scope: {
        timeMill:'@bindTime'
      },
      link: function(scope, $element, attr, ctrl) {
        var timer;
        var watcher=scope.$watch("timeMill",function(n){
          if(n){
            clearInterval(timer);
            updateTime();  
          }else{
            scope.timeMill=86400000;
            clearInterval(timer);
            updateTime();
          }
        });
        
        function updateTime(){
          if(Object.hasOwnProperty.call(attr,"hasCalculate")){
            var timeLeft=parseInt(scope.timeMill/1000);
          }else{
            var nowTime=new Date();
            var nowTimeMill=Date.parse(nowTime);
            var timeLeft=(scope.timeMill-nowTimeMill)/1000;            
          }
          if(timeLeft<=0){
            scope.timeLeft=-1;
          //  scope.$digest();
            return ;
          }
          scope.timeLeft=timeLeft;
          timer=setInterval(countTime,1000);
          function countTime(){
            var tt=scope.timeLeft;
            var s = tt % 60;
            tt = (tt - s) / 60; 
            var m = tt % 60;
            tt = (tt - m) / 60; 
            var h = tt % 24;
            scope.second=s<10?'0'+s:s;
            scope.minute=m<10?'0'+m:m;
            scope.hour=h<10?'0'+h:h;
            scope.timeLeft--;
            scope.$digest();
          }          
        }
      }
    }	  
	}
	

})