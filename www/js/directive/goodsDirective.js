define(['app', "service/orderService", "service/goodsService", "service/popupService"], function(app) {
  app.register.directive("dirActiveGroup", ActiveGroup) //一级分类
    .directive("dirActiveItem", ActiveItem) //二级分类
    .directive("dirAddToBasket", AddToBasket) //加入菜篮子
    .directive("dirSubFromBasket", SubFromBasket) //减少菜篮子数量
    .directive("dirChangeFoodOrderNumber", ChangeFoodOrderNumber) //修改菜篮子数量
    .directive("dirDraggableSlide", DraggableSlide) //商品swiper上拉下拉效果
    .directive("dirShouldHaveLoad", ShouldHaveLoad) //辅助DraggableSlide，在图片加载成功后广播事件
    .directive("dirVerticalPager", VerticalPager) //商品详情页翻页效果
    .directive("dirCurrentIndexListener", CurrentIndexListener) //获取当前轮播index
    .controller("goodsPublic", GoodsPublic) //商品、菜篮子相关页面公共方法controller

  var hascomplieGroupElements = false;
  ActiveGroup.$inject = ['$ionicGesture', 'goodsAPI', '$ionicScrollDelegate'];

  function ActiveGroup($ionicGesture, goodsAPI, $ionicScrollDelegate) {
    return {
      restrict: "A",
      link: function(scope, $element, attr) {
        var element = $element[0];
        initCssClass();
        var allGroups, hasStoreAllGroups = false;
        var tapHandler = $ionicGesture.on('tap', activeGroupElement, $element);
        scope.$on("$destroy", function() {
          $ionicGesture.off(tapHandler, 'tap', activeGroupElement);
        });

        function activeGroupElement(e) {
          var selectedItemBolongToThisGroup = false;
          e.stopPropagation();
          if(!hasStoreAllGroups) {
            allGroups = element.parentNode.parentNode.getElementsByClassName("item-stable");
            hasStoreAllGroups = true;
          }
          if(scope.buy.selectedItem && scope.buy.selectedItem.idNavigationParent == scope.group.idCommodityNavigation) {
            selectedItemBolongToThisGroup = true;
          }
          scope.$evalAsync(function() {
            scope.buy.selectedItem = null;
          });
          if($element.hasClass("active") && !selectedItemBolongToThisGroup) {
            scope.$evalAsync(function() {
              if(scope.buy.shownGroup === null) {
                scope.buy.shownGroup = scope.group;
              } else {
                scope.buy.shownGroup = null;
              }
            });
          } else {
            activeDomManipulate(selectedItemBolongToThisGroup);
            immediatelyScopeDigest(selectedItemBolongToThisGroup);
            $ionicScrollDelegate.$getByHandle('buyContent').scrollTop();
            groupChangeInit();
          }
        }

        function initCssClass() {
          if(!hascomplieGroupElements) {
            var allGroupElements = element.parentElement.parentElement.getElementsByClassName("defined-menu");
            if(allGroupElements[0]) {
              var compliedGroup = allGroupElements[0];
              compliedGroup.classList.add("active");
              hascomplieGroupElements = true;
            }
          }
        }

        function groupChangeInit() {
          scope.buy.initReady = false;
          goodsAPI.goodsAType(scope.group.idCommodityNavigation, null, 0, 20).then(function(result) {
            scope.buy.goodsList = result.food_subtype_list;
            scope.buy.hasToTheEnd = result.goodsHasToEnd;
            scope.buy.initReady = true;
          });
        }

        function activeDomManipulate(selectedItemBolongToThisGroup) {
          if(selectedItemBolongToThisGroup) {
            var itemsInThisGroup = element.nextElementSibling.children;
            angular.element(itemsInThisGroup).removeClass("active");
          } else {
            angular.element(allGroups).removeClass("active");
            element.classList.add("active");
          }
        }

        function immediatelyScopeDigest(selectedItemBolongToThisGroup) {
          scope.$evalAsync(function() {
            if(selectedItemBolongToThisGroup) {
              scope.buy.shownGroup = null;
            } else {
              scope.buy.shownGroup = scope.group;
            }
            scope.buy.goodsList = [];
            scope.buy.selectedGroup = scope.group;
            scope.buy.page = 20;
          });
        }

      }
    }
  }

  ActiveItem.$inject = ['$ionicGesture', 'goodsAPI', '$ionicScrollDelegate'];

  function ActiveItem($ionicGesture, goodsAPI, $ionicScrollDelegate) {
    return {
      restrict: "A",
      link: function(scope, $element, attr) {
        var element = $element[0];
        var tapHandler = $ionicGesture.on('tap', activeItemElement, $element);
        scope.$on("$destroy", function() {
          $ionicGesture.off(tapHandler, 'tap', activeItemElement);
        });

        function activeItemElement(e) {
          e.stopPropagation();
          scope.$evalAsync(function() {
            scope.buy.selectedItem = scope.item;
          });
          if($element.hasClass("active")) {} else {
            var allItemsInGroup = element.parentElement.children;
            angular.element(allItemsInGroup).removeClass("active");
            element.classList.add("active");
            immediatelyScopeDigest();
            $ionicScrollDelegate.$getByHandle('buyContent').scrollTop();
            itemChangeInit();
          }
        }

        function immediatelyScopeDigest() {
          scope.$evalAsync(function() {
            scope.buy.goodsList = [];
            scope.buy.page = 20;
          });
        }

        function itemChangeInit() {
          scope.buy.initReady = false;
          goodsAPI.goodsAType(scope.group.idCommodityNavigation, scope.item.idCommodityNavigation, 0, 20).then(function(result) {
            scope.buy.goodsList = result.food_subtype_list;
            scope.buy.hasToTheEnd = result.goodsHasToEnd;
            setTimeout(function() {
              scope.buy.initReady = true;
            }, 500);
          });
        }

      }
    }
  }

  AddToBasket.$inject = ['goodsAPI', '$ionicGesture', '$controller', '$state', '$ionicSlideBoxDelegate', '$rootScope', 'publicToast'];
  var basketElement, offsetTopBasket, offsetLeftBasket, widthBasket, heightBasket;
  var body = document.getElementsByTagName("body")[0];

  function AddToBasket(goodsAPI, $ionicGesture, $controller, $state, $ionicSlideBoxDelegate, $rootScope, publicToast) {
    return {
      restrict: 'A',
      link: function(scope, $element, attr) {
        var element = $element[0];
        var imgElement, $imgElement, offsetLeft, offsetTop;
        var tapHandler = $ionicGesture.on('tap', addBasketRequest, $element);
        var unitPriceStr = attr['unitPriceStr'],
          idCommodityStr = attr['idCommodityStr'],
          unitNumberStr = attr['unitNumberStr'] ? attr['unitNumberStr'] : false,
          useSimple = attr['useSimple'] ? attr['useSimple'] : false,
          imageSrcStr = attr['imageSrcStr'];
        var inGoodsPage;
        var inFoodNumberEditPage; //是否在菜篮子页中，因为菜篮子页可以直接修改菜品数，所以需要在改变值的时候同步数量model状态，避免额外的请求
        var modelCtrl;
        initParamsStrByState();
        scope.$on("$destroy", function() {
          $ionicGesture.off(tapHandler, 'tap', addBasketRequest);
        });

        //判断所在页面，下面执行的内容会根据页面的不同调整对应动画
        function initParamsStrByState() {
          switch(attr['dirAddToBasket']) {
            case 'buy':
            case 'home':
              inGoodsPage = true;
              break;
            case 'basket':
              inFoodNumberEditPage = true;
              inGoodsPage = true;
              modelCtrl = scope.basketCartGroup['basketCart' + scope.food.idCommodity]; //菜篮子页会有input改菜篮子数量，此处引用input控制器
              break;
            case 'foodDetail':
            case 'bibuSelection':
              inGoodsPage = false;
              break;
          }
        }

        function addBasketRequest(e) {
          e.preventDefault();
          e.stopPropagation();
          var unitPrice = eval(unitPriceStr),
            idCommodity = eval(idCommodityStr),
            unitNumber = eval(unitNumberStr);
          var countStr = unitNumberStr + '++';
          if(!useSimple) posistionBasket();
          goodsAPI.addGoodsToBasket(1, unitPrice, idCommodity, 1)
            .then(function(result) {
              if(!useSimple) {
                if(inGoodsPage) {
                  ionic.requestAnimationFrame(imgAnimationWithFly);
                } else {
                  ionic.requestAnimationFrame(disableImageInFlowingViews);
                }
                updateBasketView();
              } else {
                updateBasketView();
                publicToast.show("已加入购物车");
              }
            }, function() {
            //  publicToast.show("请求超时");
              if(inFoodNumberEditPage) {
                modelCtrl.$setViewValue(modelCtrl.$$last);
              }
            }).finally(function() {
              if(inFoodNumberEditPage) {
                modelCtrl.$setPristine();
              }
            });

          function updateBasketView() {
            if(unitNumberStr !== false) {
              eval(countStr);
              if(inFoodNumberEditPage) {
                modelCtrl.$$last = scope.food.orderNumber;
              }
            }
            $rootScope.totalNumberTab++;
            console.log($rootScope.totalNumberTab);
          }
        }

        //获取不同页面的菜篮子element位置
        function posistionBasket() {
          imgElement = eval(scope.imgStr);
          $imgElement = angular.element(imgElement);
          if(!scope[attr['dirAddToBasket']].addBasketDirectiveExecutedTimes) {
            basketElement = eval(scope.elementStr);
            var basketElementPosition = basketElement.getBoundingClientRect();
            offsetTopBasket = basketElementPosition.top;
            offsetLeftBasket = basketElementPosition.left;
            widthBasket = basketElementPosition.width;
            heightBasket = basketElementPosition.height;
            scope[attr['dirAddToBasket']].addBasketDirectiveExecutedTimes++;
          }
        }

        //获取图片运动起点
        function positionImg() {
          var position = element.getBoundingClientRect();
          offsetLeft = position.left;
          offsetTop = position.top;
        }

        //显示图片描述视图时，不显示飞入购物车效果
        function disableImageInFlowingViews() {
          var viewIndex = $ionicSlideBoxDelegate.$getByHandle("detailPageSlide").currentIndex();
          if(viewIndex > 0) {
            imgAnimationWithoutFly(angular.element(basketElement));
          } else if(viewIndex == 0) {
            imgAnimationWithFly();
          }
        }

        function imgAnimationWithFly() {
          if(attr['dirAddToBasket'] == 'basket') {
            imgAnimationWithoutFly(angular.element(basketElement));
            return;
          }
          positionImg();
          var imgSrc = eval(imageSrcStr);
          var imgClone = angular.element('<img class="fly-image" src="' + imgSrc + '"/>');
          var $basketElement = angular.element(basketElement);
          imgClone.css({
            'height': '3rem',
            'width': '3rem',
            'top': offsetTop + 'px',
            'left': offsetLeft + 'px',
          });
          imgClone.addClass('itemaddedanimate');
          angular.element(body).append(imgClone);
          if(inGoodsPage) {
            animationLinear();
          } else {
            animationHalfCricle()
          }
          setTimeout(function() {
            imgClone.css({
              'height': 0,
            });
            $basketElement.addClass('shakeit');
          }, 600);
          setTimeout(function() {
            $basketElement.removeClass('shakeit');
            imgClone.remove();
          }, 900);

          //XXX:暂时使用，后续使用canvas替代
          function animationHalfCricle() {
            setTimeout(function() {
              imgClone.css({
                'height': '2rem',
                'width': '2rem',
                'top': (offsetTopBasket + heightBasket / 2) - 30 + 'px',
                'left': (offsetLeftBasket + widthBasket / 2) + 50 + 'px',
              });
            }, 100);
            setTimeout(function() {
              imgClone.css({
                'height': '1.5rem',
                'width': '1.5rem',
                'top': (offsetTopBasket + heightBasket / 2) - 40 + 'px',
                'left': (offsetLeftBasket + widthBasket / 2) + 40 + 'px',
              });
            }, 200);
            setTimeout(function() {
              imgClone.css({
                'height': '1.2rem',
                'width': '1.2rem',
                'top': (offsetTopBasket + heightBasket / 2) - 50 + 'px',
                'left': (offsetLeftBasket + widthBasket / 2) + 30 + 'px',
              });
            }, 300);
            setTimeout(function() {
              imgClone.css({
                'height': '1.1rem',
                'width': '1.1rem',
                'top': (offsetTopBasket + heightBasket / 2) - 40 + 'px',
                'left': (offsetLeftBasket + widthBasket / 2) + 20 + 'px',
              });
            }, 400);
            setTimeout(function() {
              imgClone.css({
                'height': '1rem',
                'width': '1rem',
                'top': (offsetTopBasket + heightBasket / 2) - 30 + 'px',
                'left': (offsetLeftBasket + widthBasket / 2) + 20 + 'px',
              });
            }, 500);
            setTimeout(function() {
              imgClone.css({
                'height': '0.5rem',
                'width': '0.5rem',
                'top': (offsetTopBasket + heightBasket / 2) + 'px',
                'left': (offsetLeftBasket + widthBasket / 2) + 'px',
              });
            }, 600);
          }

          function animationLinear() {
            setTimeout(function() {
              imgClone.css({
                'height': '5px',
                'width': '5px',
                'top': (offsetTopBasket + heightBasket / 2) + 'px',
                'left': (offsetLeftBasket + widthBasket / 2) + 'px',
              });
            }, 300);
          }
        }
      }
    }
  }

  function imgAnimationWithoutFly(basketElement) {
    setTimeout(function() {
      basketElement.addClass('shakeit');
    }, 300);
    setTimeout(function() {
      basketElement.removeClass('shakeit');
    }, 600);
  }

  SubFromBasket.$inject = ['goodsAPI', '$controller', '$ionicGesture', '$rootScope'];

  function SubFromBasket(goodsAPI, $controller, $ionicGesture, $rootScope) {
    return {
      restrict: 'A',
      link: function(scope, $element, attr) {
        var unitPriceStr = attr['unitPriceStr'],
          idCommodityStr = attr['idCommodityStr'],
          unitNumberStr = attr['unitNumberStr'],
          basketListArray = attr['basketListArray'],
          inFoodNumberEditPage = (attr['dirSubFromBasket'] == 'basket');
        var modelCtrl;
        var tapHandler = $ionicGesture.on('tap', subBasketRequest, $element);
        var goodsPublic = $controller('goodsPublic', {
          $scope: scope
        });
        scope.$on("$destroy", function() {
          $ionicGesture.off(tapHandler, 'tap', subBasketRequest);
        });

        function subBasketRequest(e) {
          e.stopPropagation();
          if(inFoodNumberEditPage && !!!modelCtrl) {
            modelCtrl = scope.basketCartGroup['basketCart' + scope.food.idCommodity];
          }
          var unitPrice = eval(unitPriceStr),
            idCommodity = eval(idCommodityStr),
            num = parseInt(eval(unitNumberStr));
          var countStr = unitNumberStr + '--';
          if(num > 0) {
            if(num == 1 && basketListArray) {
              goodsPublic.removeFromFoodList(scope.food, eval(basketListArray));
              return;
            }
            num = num - 1;
            goodsAPI.addGoodsToBasket(num, unitPrice, idCommodity, 0)
              .then(function(result) {
                eval(countStr);
                $rootScope.totalNumberTab--;
                if(inFoodNumberEditPage) {
                  modelCtrl.$$last = scope.food.orderNumber;
                }
              }, function(error) {
                if(inFoodNumberEditPage) {
                  modelCtrl.$setViewValue(modelCtrl.$$last);
                }
              }).finally(function() {
                if(inFoodNumberEditPage) {
                  modelCtrl.$setPristine();
                }
              });
          }
        }
      }
    }
  }

  ChangeFoodOrderNumber.$inject = ['$ionicGesture', 'goodsAPI', 'publicToast', '$controller', 'popupAPI'];

  function ChangeFoodOrderNumber($ionicGesture, goodsAPI, publicToast, $controller, popupAPI) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, $element, attr, ctrl) {
        var goodsPublic = $controller('goodsPublic', {
          $scope: scope.$parent.$parent
        });
        var element = $element[0];
        ctrl.$$last = scope.food.orderNumber; //新增变量在ngModel的私有controller中，保存上一次提交的菜品数量，每次加减或修改数量成功后更新它
        var blurHandler = $ionicGesture.on('blur', changeNumberIfDirty, $element);
        element.addEventListener("keydown", onlyNumerAllowed);

        scope.$on("$destroy", function() {
          $ionicGesture.off(blurHandler, 'blur', changeNumberIfDirty);
          element.removeEventListener("keydown", onlyNumerAllowed);
        });

        //不允许在input为number的时候输入'+','-','.'
        function onlyNumerAllowed(e) {
          try {
            if(e.key == "Backspace") return;
            JSON.parse(e.key);
          } catch(err) {
            e.preventDefault();
          }
        }

        function changeNumberIfDirty() {
          if(ctrl.$dirty) {
            if(ctrl.$modelValue == ctrl.$$last) {
              return;
            } else {
              if(!!!ctrl.$modelValue) {
                ctrl.$setViewValue(0);
                popupAPI.popupconfirm({
                    imgUrl: '../img/caution-icon.png',
                    title: '温馨提示',
                    titleContent: '您确认删除该商品吗？'
                  },
                  function() {
                    ctrl.$$last = ctrl.$modelValue;
                    ctrl.$setPristine();
                  },
                  function() {
                    implementChange(true);
                  }
                )
                return;
              } else {
                implementChange();
              }

              function implementChange(remove) {
                goodsAPI.addGoodsToBasket(ctrl.$modelValue, scope.food.unitPrice, scope.food.idCommodity, 0)
                  .then(function(result) {
                    if(ctrl.$modelValue > ctrl.$$last) {
                      imgAnimationWithoutFly(angular.element(document.getElementById("tabBasket")));
                    }
                    ctrl.$$last = ctrl.$modelValue;
                    goodsPublic.countTotalNumerTab(result.returnData.unfinish_order_detail); //统计菜篮子菜品总数量
                    if(remove) {
                      var idx = scope.basket.orderDetail.indexOf(scope.food);
                      if(idx >= 0) {
                        scope.basket.orderDetail.splice(idx, 1);
                      }
                    }
                    publicToast.show("修改成功");
                  }, function(error) {
                 //   publicToast.show("请求超时");
                    ctrl.$setViewValue(ctrl.$$last);
                  }).finally(function() {
                    ctrl.$setPristine(); //移除脏值，以便下次变化再次置位
                  });
              }
            }
          }
        }
      }
    }
  }

  DraggableSlide.$inject = ['$ionicGesture', '$ionicScrollDelegate'];

  function DraggableSlide($ionicGesture, $ionicScrollDelegate) {
    return {
      restrict: 'A',
      link: function(scope, $element, attr) {
        scope.hasAImageLoad = false;
        var element = $element[0];
        var scrollerHandle = $ionicScrollDelegate.$getByHandle(attr.delegateHandle);
        var scrollElement = element.children[0];
        var scrollTop;
        scope.$on("slideReady", slideReadyFn);

        function slideReadyFn(evt) {
          evt.stopPropagation();
          var sliders = element.getElementsByClassName("zoom-slide");
          var sliderFirstScope = angular.element(sliders[0]).scope();
          if(sliderFirstScope){
            var slidersScope = sliderFirstScope.$parent.$parent;
          }else{
            return ;
          }
          var slideContainer = element.getElementsByClassName("goods-slide")[0];
          var sliderHeight = slideContainer.clientHeight;
          var translateAmt, scaleAmt, scrollTop, lastScrollTop;
          var ticking = false;
          var activeSlide;

          window.addEventListener('resize', function() {
            sliderHeight = sliders[0].clientHeight;
          }, false);
          element.addEventListener('scroll', requestTick);
          scope.$on('destroy', function() {
            element.removeEventListener('scroll', requestTick);
          });

          function requestTick(e) {
            if(!chooseAnActiveSlize()) return;
            if(!ticking) {
              ionic.requestAnimationFrame(updateElasticHeader);
            }
            ticking = true;
          }

          //判断轮播是否在换页状态，如果是则阻止下拉触发
          function chooseAnActiveSlize() {
            activeSlide = sliders[slidersScope.currentSlide];
            var slideTransformX = getTransformX(activeSlide, true);
            if(!slideTransformX && slideTransformX != NaN) {
              return true;
            } else {
              return false;
            }
          }

          function updateElasticHeader() {
            if(!scrollerHandle || !scrollerHandle.getScrollPosition()) {
              return;
            }
            scrollTop = scrollerHandle.getScrollPosition().top;
            imageZoom();

            function imageZoom() {
              var cssText;
              if(scrollTop > 0) {
                /*
                 * 用于收起图片，会导致放大图片显示有问题，暂时搁置
                 * translateAmt = scrollTop/2;
                   scaleAmt = 1;
                   cssText = 'translate(0,' + translateAmt + 'px) scale(' + scaleAmt + ',' + scaleAmt + ')';
                   activeSlide.style[ionic.CSS.TRANSFORM] = cssText;
                 * */
              } else {
                translateAmt = -scrollTop / 2;
                scaleAmt = -scrollTop / sliderHeight + 1;
                /*  if(getTransformX(activeSlide,false)!=0){
                    activeSlide.style[ionic.CSS.TRANSFORM] = 'translate(0px, 0px) scale(1, 1);';
                  }*/
                slideContainer.style[ionic.CSS.TRANSFORM] = 'translate(0px,' + scrollTop / 2 + 'px) scale(' + scaleAmt + ',' + scaleAmt + ')';
              }
              ticking = false;
            }
          }

          function getTransformX(slide, xOrY) {
            if(xOrY) {
              return parseFloat(document.defaultView.getComputedStyle(slide, null).webkitTransform.split(',')[4]);
            } else {
              return parseFloat(document.defaultView.getComputedStyle(slide, null).webkitTransform.split(',')[5]);
            }
          }
        }
      },
    }
  }

  function ShouldHaveLoad($interval) {
    return {
      restrict: 'A',
      link: function(scope, $element, attr) {
        var element = $element[0];
        attr.$observe('dirShouldHaveLoad', function(n) {
          if(!n) {
            return;
          } else {
            var image = new Image();
            image.src = n;
            image.onload = function() {
              $element.css({
                "background-image": "url(" + n + ")"
              });
              if(!scope.hasAImageLoad) {
                scope.$emit("slideReady");
                scope.hasAImageLoad = true;
              }
            };
            image.onerror = function() {
              //TODO:error implement later
            };
          }
        });
      }
    }
  }

  VerticalPager.$inject = ['$ionicGesture', '$ionicScrollDelegate', '$window', '$ionicSlideBoxDelegate'];

  function VerticalPager($ionicGesture, $ionicScrollDelegate, $window, $ionicSlideBoxDelegate) {
    return {
      restrict: 'A',
      link: function(scope, $element, attr) {
        var element = $element[0];
        var scrollerHandle, swipeHandler;
        var scrollTop, consist, winH = $window.innerHeight,
          directionBottom, initialMaxScrollTop = function() {};
        var dividElement = document.getElementById("your-interest"),dividElementsGreyFrontGround=dividElement.getElementsByClassName("style-grey")[0],
             describtionImg,describtionImgGreyFrontGround,tsbIcWrp = document.getElementsByClassName("food-detail tsb-ic-wrp")[0].getElementsByTagName("a");
        var scrollClass = $element.saveInstance;//ionic的scroll类
        var ionTabSlide = $ionicSlideBoxDelegate.$getByHandle("detailPageSlide");
        var fingerOn = false,frequencyCount = 0,directionDown = true;

        element.addEventListener("scroll", scrollListenerFn);
        element.addEventListener("touchstart", setFingerOn);
        element.addEventListener("touchend", removeFingerOff);
        scope.$on("$destroy", function() {
          element.removeEventListener("scroll", scrollListenerFn);
          element.removeEventListener("touchstart", setFingerOn);
          element.removeEventListener("touchend", removeFingerOff);
        });

        function scrollListenerFn(e) {
          if(!scrollerHandle) {
            scrollerHandle = $ionicScrollDelegate.$getByHandle(attr.delegateHandle);
          }
          //对scroll监听分频
          if(frequencyCount == 0) {
            frequencyCount = 1;
            everyListenerFn(e);
          }
          frequencyCount--;
        }

        function everyListenerFn(e) {
          if(angular.isFunction(initialMaxScrollTop)) {
            initialMaxScrollTop = scrollClass.__maxScrollTop
            describtionImg = dividElement.nextElementSibling;
            describtionImgGreyFrontGround=describtionImg.getElementsByClassName("style-grey")[0];
          };
          if(!consist) {
            consist = dividElement.getBoundingClientRect();
            directionBottom = {
              top: 0,
              bottom: consist.bottom - winH + 44
            }            
          }
          scrollTop = scrollerHandle.getScrollPosition().top;
          if(!directionDown&&scrollTop > consist.bottom - winH / 6 && scrollTop < consist.bottom) {
            if(!fingerOn){
              scrollerHandle.scrollTo(0, consist.bottom+31);
            }
          }          
        }

        function setFingerOn() {
          fingerOn = true;
        }

        function removeFingerOff() {
          if(!consist){return ;}
          fingerOn = false;
          if(directionDown) { //自上而下滑动
            upperActionAndLimitPager();
          } else { //自下而上滑动
            lowerActionAndLimitPager();
          }
        }

        function lowerActionAndLimitPager() {
          if(scrollTop > consist.bottom - winH / 6 && scrollTop < consist.bottom) {
            scrollerHandle.scrollTo(0, consist.bottom,true);//未突破临界点时回弹
          } else if((scrollTop < consist.bottom - winH / 6)) {
            if(!fingerOn) {
              directionDownToTopAnimationFn();//突破临界点后翻页
            } else {
              scrollClass.__maxDecelerationScrollTop = scrollClass.__maxScrollTop = initialMaxScrollTop;
            }
          }else{
            scrollClass.__maxDecelerationScrollTop = scrollClass.__maxScrollTop = initialMaxScrollTop;
          }
        }

        function upperActionAndLimitPager() {
          if(scrollTop<directionBottom.bottom + winH / 6) {
            scrollClass.__maxDecelerationScrollTop = scrollClass.__maxScrollTop = directionBottom.bottom;
          } else{
            scrollClass.__maxDecelerationScrollTop = scrollClass.__maxScrollTop = initialMaxScrollTop;
            if(!fingerOn) {
              directionTopToDownAnimationFn(); 
            } else {
              scrollClass.__maxDecelerationScrollTop = scrollClass.__maxScrollTop = directionBottom.bottom;
            }
          }
        }

        function directionTopToDownAnimationFn() {
          scrollerHandle.scrollTo(0, consist.bottom+31, true);
          directionDown = false;
          describtionImgGreyFrontGround.classList.add("ng-hide");
          dividElementsGreyFrontGround.classList.remove("ng-hide");
          tsbIcWrp[0].classList.remove("active");
          tsbIcWrp[0].classList.add("ng-hide");
          tsbIcWrp[1].classList.add("active");
          ionTabSlide.enableSlide(false);
        }

        function directionDownToTopAnimationFn() {
          scrollerHandle.scrollTo(0, directionBottom.bottom, true);
          scrollClass.__maxDecelerationScrollTop = scrollClass.__maxScrollTop = directionBottom.bottom;
          directionDown = true;
          describtionImgGreyFrontGround.classList.remove("ng-hide");
          dividElementsGreyFrontGround.classList.add("ng-hide");
          tsbIcWrp[1].classList.remove("active");
          tsbIcWrp[0].classList.remove("ng-hide");
          tsbIcWrp[0].classList.add("active");
          ionTabSlide.enableSlide(true);
        }
      }
    }
  }

  CurrentIndexListener.$inject = ['$ionicSlideBoxDelegate'];

  function CurrentIndexListener($ionicSlideBoxDelegate) {
    return {
      restrict: 'A',
      link: function(scope, $element, attr) {
        scope.$on('slideBox.slideChanged', function() {
          allSlides[attr.dirCurrentIndexListener] = $ionicSlideBoxDelegate.$getByHandle(attr.delegateHandle).currentIndex();
        });
      }
    }
  }

  var allSlides = {
    slideIndexOfFoodDetail: 0
  }

  GoodsPublic.$inject = ['$scope', '$state', '$rootScope', 'goodsAPI', 'popupAPI'];

  function GoodsPublic($scope, $state, $rootScope, goodsAPI, popupAPI) {
    var vm = this;
    vm.getBasketElementByState = getBasketElementByState;
    vm.countTotalNumerTab = countTotalNumerTab;
    vm.removeFromFoodList = removeFromFoodList;
    vm.foodPromotionImage = foodPromotionImage;
    vm.bindTotalPrice = bindTotalPrice;

    function getBasketElementByState() {
      var stateName = $state.current.name;
      if(stateName == 'tab.buy' || 'tab.basket'||'tab.home') {
        $scope.elementStr = 'document.getElementById("tabBasket")';
        $scope.imgStr = 'element.parentElement.firstElementChild.getElementsByTagName("img")[0]';
      }
      if(stateName == 'tab.foodDetail') {
        $scope.elementStr = 'element.previousElementSibling.firstElementChild';
        $scope.imgStr = 'document.getElementsByClassName("food-detail-slide")[allSlides.slideIndexOfFoodDetail]';
      }
    }

    function countTotalNumerTab(arr) {
      if(!!arr) {
        var i = arr.length,
          totalNumberTab = 0;
        while(--i >= 0) {
          $scope.totalNumber += arr[i].orderNumber;
          totalNumberTab += arr[i].orderNumber;
        }
        $rootScope.totalNumberTab = totalNumberTab;
      }
    }

    function removeFromFoodList(item, arr, withoutConfirm) {
      if(withoutConfirm) {
        implementRemove();
        return;
      }
      popupAPI.popupconfirm({
          imgUrl: '../img/caution-icon.png',
          title: '温馨提示',
          titleContent: '您确认删除该商品吗？'
        },
        function() {},
        function() {
          implementRemove();
        }
      )

      function implementRemove() {
        var i = arr.indexOf(item);
        goodsAPI.addGoodsToBasket(0, item.unitPrice, item.idCommodity, 0)
          .then(function(result) {
            arr.splice(i, 1);
            var orderNewest = Array.prototype.slice.call(result.returnData.unfinish_order_detail, 0);
            countTotalNumerTab(orderNewest);
            if(!orderNewest.length) {
              $scope.$root.orderId = false;
            }
          });
      }
    }

    function foodPromotionImage(food) {
      switch(food.typePromotion) {
        case 1:
          return {
            'background-image': 'url("img/tag_new.png")'
          };
          break;
        case 4:
          return {
            'background-image': 'url("img/tag_promotion.png")'
          };
          break;
        case 5:
          return {
            'background-image': 'url("img/tag_import.png")'
          };
          break;
        default:
          return {};
          break;
      }
    }

    function bindTotalPrice(arr, keyPrice, keyNumber) {
      var totalPrice = 0;
      for(var i in arr) {
        totalPrice += arr[i][keyPrice] * arr[i][keyNumber];
      }
      return totalPrice;
    }

  }
})