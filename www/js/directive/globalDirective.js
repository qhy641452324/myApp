define(['service/platformService'], function() {
  angular.module('globalDirective', ['platformModule'])
    //ionic自带的hide-on-keyboard-open有延迟，body中加上可更快隐藏
    .directive("dirHideOnKeyboardOpen", HideOnKeyboardOpen)
    //隐藏指定页面的tab
    .directive("dirHideTabsTarget", HideTabsTarget)
    //ng-repeat之后触发事件
    .directive("dirOnFinishRender", OnFinishRender)
    //ne-repeat列表渲染动画
    .directive("dirFadeInOnLoad", FadeInOnLoad)
    //可swipe的tab视图
    .directive("dirTabSlideBox", TabSlideBox)
    //价格保留小数点后两位
    .directive("dirPriceToFixed", PriceToFixed)
    //页面跳转
    .directive("dirGoState", GoState)
    //限制输入长度
    .directive("dirLimitTo", LimitTo)
    //跳过引导页
    .directive("dirSkipWalkthrough", SkipWalkthrough)

  //ionic自带的hide-on-keyboard-open有延迟，body中加上可更快隐藏
  HideOnKeyboardOpen.$inject = ['$ionicScrollDelegate', 'platformAPI'];

  function HideOnKeyboardOpen($ionicScrollDelegate, platformAPI) {
    return {
      restrict: "A",
      link: function(scope, ele) {
        window.addEventListener("native.keyboardshow", showElements);
        window.addEventListener("native.keyboardhide", hideElements);
        var elements;

        function showElements() {
          platformAPI.setKeyboardStatus("hadJustHide", false); //保存键盘的状态，justhide说明键盘关闭后未开启。
          platformAPI.setKeyboardStatus("isOpen", true);
          elements = document.getElementsByClassName("hide-on-keyboard-open");
          angular.forEach(elements, function(item) {
            angular.element(item).addClass("display-none");
          });
        }

        function hideElements() {
          platformAPI.setKeyboardStatus("hadJustHide", true);
          platformAPI.setKeyboardStatus("isOpen", false);
          elements = document.getElementsByClassName("hide-on-keyboard-open");
          angular.forEach(elements, function(item) {
            angular.element(item).removeClass("display-none");
          });
        }
        scope.$on("$destroy", function() {
          window.removeEventListener("native.keyboardshow", showElements);
          window.removeEventListener("native.keyboardhide", hideElements);
        });
      }
    }
  }

  //因为页面都在tab下，会存在tab不在主菜单的页面下仍会显示，需要将其隐藏
  HideTabsTarget.$inject = ['$rootScope', '$ionicHistory', '$state'];

  function HideTabsTarget($rootScope, $ionicHistory, $state) {
    return {
      restrict: 'A',
      link: function(scope, $element, attrs) {
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          if(toState.name == "tab.home" || toState.name == "tab.buy" || toState.name == "tab.gift" || toState.name == "tab.basket" || toState.name == "tab.user") {
            $rootScope.hideTabs = '';
          } else {
            $rootScope.hideTabs = 'tabs-item-hide';
          }
        });
      }
    }
  }

  OnFinishRender.$inject = ['$timeout'];

  function OnFinishRender($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if(!!!scope.$parent.notFirstTime){
          if(scope.$last === true) {
            $timeout(function() {
              scope.$emit('ngRepeatFinished');
            });
          }          
        }
      }
    }
  }

  function FadeInOnLoad() {
    return {
      restrict: 'A',
      link: function(scope, $element, attr) {
        var element = $element[0];
        var elementHeight;
        var childHeight,children;
        var winHeight=window.innerHeight;
        element.style.position = "relative";
        element.style.opacity = 0;
        var frontGround = angular.element("<div class='full-size position-upper'></div>");
        scope.$on('ngRepeatFinished', function(evt) {
          evt.stopPropagation();
          elementHeight=element.offsetHeight;
          if(!elementHeight) return;
          listViewPosition();
          frontGroungView();
       //   eachElementWatcher();
        });
        //顶层透明度变化动画
        function frontGroungView() {
          element.appendChild(frontGround[0]);
          element.style.opacity = 1;
          setTimeout(function() {
            element.removeChild(frontGround[0]);
          }, 300);
        }
        //列表自下而上运动
        function listViewPosition() {
          element.classList.add("pull-top-animate");
          setTimeout(function() {
            element.classList.remove("pull-top-animate");
          }, 300);
        }
        /*用于操作每个listitem的高度变化，依次递减，暂时无法达到理想效果 保留代码*/
        function eachElementWatcher() {
          children = element.getElementsByClassName("animate-list");
          childHeight=children[0].offsetHeight;
          var length=Math.ceil(winHeight/childHeight);
          length=length<children.length?length:children.length;
          if(!length) return;
          var eachTime =1000/length;
          for(var i=0;i<length-1;i++){
            children[i].classList.add("margin-dynamic");
            children[i].style.webkitAnimationDuration=eachTime*(i+1)+"ms";
          }
          setTimeout(function(){
            children = element.getElementsByClassName("animate-list");
            if(children.length){
              for(var i=0;i<length;i++){
                children[i].classList.remove("margin-dynamic");
              }              
            }
          },1500);
        }
      }
    }
  }

  TabSlideBox.$inject = ['$timeout', '$window', '$ionicSlideBoxDelegate', '$ionicScrollDelegate'];

  function TabSlideBox($timeout, $window, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
    return {
      restrict: 'A, E, C',
      link: function(scope, element, attrs, ngModel) {
        var shiftWrp = Object.prototype.hasOwnProperty.call(attrs, 'shiftWrp');
        var bodyWidth = ionic.viewWidth;
        var ta = element[0],
          $ta = element;
        $ta.addClass("tabbed-slidebox");
        if(attrs.tabsPosition === "bottom") {
          $ta.addClass("btm");
        }

        //Handle multiple slide/scroll boxes
        var handle = ta.querySelector('.slider').getAttribute('delegate-handle');

        var ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
        if(handle) {
          ionicSlideBoxDelegate = ionicSlideBoxDelegate.$getByHandle(handle);
        }

        var ionicScrollDelegate = $ionicScrollDelegate;
        if(handle) {
          ionicScrollDelegate = ionicScrollDelegate.$getByHandle(handle);
        }

        function renderScrollableTabs() {
          var iconsDiv = angular.element(ta.querySelector(".tsb-icons")),
            icons = iconsDiv.find("a"),
            wrap = iconsDiv[0].querySelector(".tsb-ic-wrp"),
            totalTabs = icons.length;
          var scrollDiv = wrap.querySelector(".scroll");
          angular.forEach(icons, function(value, key) {
            var a = angular.element(value);
            a.on('click', function() {
              ionicSlideBoxDelegate.slide(key);
            });
            if(a.attr('icon-off')) {
              a.attr("class", a.attr('icon-off'));
            }
          });
          var initialIndex = attrs.tab;
          //Initializing the middle tab
          if(typeof attrs.tab === 'undefined' || (totalTabs <= initialIndex) || initialIndex < 0) {
            initialIndex = Math.floor(icons.length / 2);
          }

          //If initial element is 0, set position of the tab to 0th tab 
          if(initialIndex == 0) {
            setPosition(0);
          }

          $timeout(function() {
            ionicSlideBoxDelegate.update();
            ionicSlideBoxDelegate.slide(initialIndex);
          }, 0);
        }

        function setPosition(index) {
          var iconsDiv = angular.element(ta.querySelector(".tsb-icons")),
            icons = iconsDiv.find("a"),
            wrap = iconsDiv[0].querySelector(".tsb-ic-wrp"),
            totalTabs = icons.length;
          var scrollDiv = wrap.querySelector(".scroll");
          var wrapWidth = wrap.offsetWidth;
          var middle = iconsDiv[0].offsetWidth / 2;
          var curEl = angular.element(icons[index]);
          var prvEl = angular.element(iconsDiv[0].querySelector(".active"));
          if(curEl && curEl.length) {
            var curElBoundingClientRect = curEl[0].getBoundingClientRect();
            var curElWidth = curElBoundingClientRect.width,
              curElLeft = curElBoundingClientRect.left;
            if(prvEl.attr('icon-off')) {
              prvEl.attr("class", prvEl.attr('icon-off'));
            } else {
              prvEl.removeClass("active");
            }
            if(curEl.attr('icon-on')) {
              curEl.attr("class", curEl.attr('icon-on'));
            }
            curEl.addClass("active");
            if(curElLeft + bodyWidth > wrapWidth - 10) {
              curElLeft = wrapWidth - bodyWidth + 10;
            }
            var leftStr = (40 - (curElLeft) - curElWidth / 2 + 5);
            //If tabs are not scrollable
            if(!scrollDiv) {
              leftStr += "px";
              if(shiftWrp) {
                wrap.style.webkitTransform = "translate3d(" + leftStr + ",0,0)";
              }
            } else {
              //If scrollable tabs
              var currentX = Math.abs(getX(scrollDiv.style.webkitTransform));
              var leftOffset = 100;
              var elementOffset = 40;
              //If tabs are reaching right end or left end
              if(((currentX + wrapWidth) < (curElLeft + curElWidth + elementOffset)) || (currentX > (curElLeft - leftOffset))) {
                if(leftStr > 0) {
                  leftStr = 0;
                }
                //Use this scrollTo, so when scrolling tab manually will not flicker
                ionicScrollDelegate.scrollTo(Math.abs(leftStr), 0, true);
              }
            }
          }
        };

        function getX(matrix) {
          matrix = matrix.replace("translate3d(", "");
          matrix = matrix.replace("translate(", "");
          return(parseInt(matrix));
        }
        var events = scope.events;
        events.on('slideChange', function(data) {
          setPosition(data.index);
        });
        events.on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
          renderScrollableTabs();
        });
        renderScrollableTabs();
      },
      controller: function($scope, $attrs, $element) {
        $scope.events = new SimplePubSub();

        $scope.slideHasChanged = function(index) {
          $scope.events.trigger("slideChange", {
            "index": index
          });
          $timeout(function() {
            if($scope.onSlideMove) $scope.onSlideMove({
              "index": eval(index)
            });
          }, 100);
        };

        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
          $scope.events.trigger("ngRepeatFinished", {
            "event": ngRepeatFinishedEvent
          });
        });
      }
    };
  }

  var SimplePubSub = (function() {
    var events = {};

    function SimplePubSub() {}
    SimplePubSub.prototype = {
      on: function(names, handler) {
        names.split(' ').forEach(function(name) {
          if(!events[name]) {
            events[name] = [];
          }
          events[name].push(handler);
        });
        return this;
      },
      trigger: function(name, args) {
        angular.forEach(events[name], function(handler) {
          handler.call(null, args);
        });
        return this;
      }
    }
    return SimplePubSub;
  }())

  function PriceToFixed() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        attr.$observe('dirPriceToFixed', function(n) {
          var price = parseFloat(n).toFixed(2);
          element.text(price);
        });
      }
    }
  }

  GoState.$inject = ['$ionicGesture', '$ionicPlatform', '$state'];

  function GoState($ionicGesture, $ionicPlatform, $state) {
    return {
      restrict: 'A',
      link: function(scope, $element, attr) {
        var element = $element[0];
        var tabTapHandler = $ionicGesture.on('tap', tapFn, $element);
        scope.$on("$destroy", function() {
          $ionicGesture.off(tabTapHandler, 'touch', tapFn);
        });

        function tapFn(e) {
          if(!!attr.dirGoState)
            $state.go(attr.dirGoState);
        }
      }
    }
  }

  LimitTo.$inject = ['$ionicGesture'];

  function LimitTo($ionicGesture) {
    return {
      restrict: 'A',
      link: function(scope, $element, attr) {
        var element = $element[0];
        var limit = parseInt(attr.dirLimitTo);
        var keyHandler = $ionicGesture.on('keypress', keyFn, $element);
        scope.$on("$destroy", function() {
          $ionicGesture.off(keyHandler, 'keypress', keyFn);
        });

        function keyFn(e) {
          if(this.value.length == limit) e.preventDefault();
        }
      }
    }
  }

  SkipWalkthrough.$inject = ['$ionicGesture'];

  function SkipWalkthrough($ionicGesture) {
    return {
      restrict: 'A',
      link: function(scope, $element, attr) {
        var element = $element[0];
        var tapHandler = $ionicGesture.on('tap', tapFn, $element);
        scope.$on("$destroy", function() {
          $ionicGesture.off(tapHandler, 'tap', tapFn);
        });

        function tapFn(e) {
          scope.$apply(function() {
            scope.$root.walkThrough = true;
            scope.$root.startUp = true;
            localStorage.setItem("walkThrough", true);
            sessionStorage.setItem("startUp",true);
          });
        }
      }
    }
  }
})