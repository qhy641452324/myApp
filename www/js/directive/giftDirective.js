define(['app', "service/orderService", "service/goodsService", "service/popupService"], function(app) {
	"use strict";
	app.register.directive("activeGroup", ActiveGroup) //一级分类
		.directive("activeItem", ActiveItem) //二级分类
		.directive("addToBasket", AddToBasket) //加入菜篮子
		.directive("subFromBasket", SubFromBasket) //减少菜篮子数量
		.directive("dirChangeFoodOrderNumber", ChangeFoodOrderNumber) //修改菜篮子数量
		.directive("draggableSlide", DraggableSlide) //商品swiper上拉下拉效果
		.directive("shouldHaveLoad", ShouldHaveLoad) //辅助DraggableSlide，在图片加载成功后广播事件
		.directive("currentIndexListener", CurrentIndexListener) //获取当前轮播index
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
					if(scope.giftSelectGoods.selectedItem && scope.giftSelectGoods.selectedItem.idNavigationParent == scope.group.idCommodityNavigation) {
						selectedItemBolongToThisGroup = true;
					}
					scope.$evalAsync(function() {
						scope.giftSelectGoods.selectedItem = null;
					});
					if($element.hasClass("active") && !selectedItemBolongToThisGroup) {
						scope.$evalAsync(function() {
							if(scope.giftSelectGoods.shownGroup === null) {
								scope.giftSelectGoods.shownGroup = scope.group;
							} else {
								scope.giftSelectGoods.shownGroup = null;
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
					scope.giftSelectGoods.initReady = false;
					goodsAPI.goodsAType(scope.group.idCommodityNavigation, null, 0, 20).then(function(result) {
						scope.giftSelectGoods.goodsList = result.food_subtype_list;
						scope.giftSelectGoods.hasToTheEnd = result.goodsHasToEnd;
						scope.giftSelectGoods.initReady = true;
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
							scope.giftSelectGoods.shownGroup = null;
						} else {
							scope.giftSelectGoods.shownGroup = scope.group;
						}
						scope.giftSelectGoods.goodsList = [];
						scope.giftSelectGoods.selectedGroup = scope.group;
						scope.giftSelectGoods.page = 20;
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
						scope.giftSelectGoods.selectedItem = scope.item;
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
						scope.giftSelectGoods.goodsList = [];
						scope.giftSelectGoods.page = 20;
					});
				}

				function itemChangeInit() {
					scope.giftSelectGoods.initReady = false;
					goodsAPI.goodsAType(scope.group.idCommodityNavigation, scope.item.idCommodityNavigation, 0, 20).then(function(result) {
						scope.giftSelectGoods.goodsList = result.food_subtype_list;
						scope.giftSelectGoods.hasToTheEnd = result.goodsHasToEnd;
						setTimeout(function() {
							scope.giftSelectGoods.initReady = true;
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

				//判断所在页面
				function initParamsStrByState() {
					switch(attr['addToBasket']) {
						case 'buy':
							inGoodsPage = true;
							break;
						case 'basket':
							inFoodNumberEditPage = true;
							inGoodsPage = true;
							modelCtrl = scope.basketCartGroup['basketCart' + scope.food.idCommodity];
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
								publicToast.show("已加入购物车");
							}
						}, function() {
							publicToast.show("请求超时");
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
					if(!scope[attr['addToBasket']].addBasketDirectiveExecutedTimes) {
						basketElement = eval(scope.elementStr);
						var basketElementPosition = basketElement.getBoundingClientRect();
						offsetTopBasket = basketElementPosition.top;
						offsetLeftBasket = basketElementPosition.left;
						widthBasket = basketElementPosition.width;
						heightBasket = basketElementPosition.height;
						scope[attr['addToBasket']].addBasketDirectiveExecutedTimes++;
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
					if(attr['addToBasket'] == 'basket') {
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
					inFoodNumberEditPage = (attr['subFromBasket'] == 'basket');
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
										publicToast.show("请求超时");
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
				var sliderFullWidth = window.innerWidth;
				var scrollElement = element.children[0];
				var pageBorderElement = document.getElementById("your-interest");
				var scorllTopLimit = null;
				var maxScrollTop = null;

				scope.$on("slideReady", slideReadyFn);

				function slideReadyFn() {
					var sliders = element.getElementsByClassName("zoom-slide");
					var sliderFirstScope = angular.element(sliders[0]).scope();
					var slidersScope = sliderFirstScope.$parent.$parent;
					var slideContainer = element.getElementsByClassName("goods-slide")[0];
					var sliderHeight = slideContainer.clientHeight;
					var translateAmt, scaleAmt, scrollTop, lastScrollTop;
					var ticking = false;
					var activeSlide;
					var mainContainer = element.getElementsByClassName("main-container")[0];

					/*  maxScrollTop=$element.saveInstance.__maxScrollTop+44;后续处理*/

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
							updateElasticHeader();
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

					var hasDoneSlide = false; /*后续处理*/
					function updateElasticHeader() {
						//      $element.saveInstance.__maxDecelerationScrollTop=0;  
						if(!scrollerHandle || !scrollerHandle.getScrollPosition()) {
							return;
						}
						var scrollTop = scrollerHandle.getScrollPosition().top;
						//TODO:后续做滚动到底部hold松开翻页
						// 供调试  
						var winh = window.innerHeight;

						/*  var offbottom = pageBorderElement.getBoundingClientRect().bottom;
						  if((offbottom + 44) < winh) {
						    if(scrollTop>400){
						      if(!hasDoneSlide){
						        $element.saveInstance.__maxScrollTop=212;
						        $element.saveInstance.__maxDecelerationScrollTop=212;
						        var dragUpHandler = $ionicGesture.on('dragup',dragUpFn, $element);
						      }
						      function dragUpFn(e){
						        $element.saveInstance.__maxScrollTop=maxScrollTop;
						        $element.saveInstance.__maxDecelerationScrollTop=maxScrollTop;    
						        if(scrollTop>250){
						          scrollerHandle.scrollTo(0,692,true);
						          hasDoneSlide=true;
						          $ionicGesture.off(dragUpHandler, 'dragup', dragUpFn);                         
						        }
						      }
						    }
						  } else {
						    if(!$element.saveInstance.__isDown){
						      var dragDownHandler = $ionicGesture.on('dragdown',dragDownFn, $element);
						      function dragDownFn(e){
						        hasDoneSlide=false;
						        scrollerHandle.scrollTo(0,0,true);
						        $ionicGesture.off(dragDownHandler, 'dragdown', dragDownFn); 
						      }
						    }
						  } */
						/*后续处理*/
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
							return parseFloat(document.defaultView.getComputedStyle(slide, null).transform.split(',')[4]);
						} else {
							return parseFloat(document.defaultView.getComputedStyle(slide, null).transform.split(',')[5]);
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
				attr.$observe('shouldHaveLoad', function(n) {
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

	CurrentIndexListener.$inject = ['$ionicSlideBoxDelegate'];

	function CurrentIndexListener($ionicSlideBoxDelegate) {
		return {
			restrict: 'A',
			link: function(scope, $element, attr) {
				scope.$on('slideBox.slideChanged', function() {
					allSlides[attr.currentIndexListener] = $ionicSlideBoxDelegate.$getByHandle(attr.delegateHandle).currentIndex();
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
			if(stateName == 'tab.buy' || 'tab.basket') {
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