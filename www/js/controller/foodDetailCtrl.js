define(["app", "service/goodsService","directive/goodsDirective","commonDirective"], function(app) {
  adaptSlideByScreenSize();//根据屏幕尺寸提供轮播初始化数据
	app.register.controller("foodDetailCtrl", FoodDetailCtrl);

	FoodDetailCtrl.$inject = ['$scope','$state', 'goodsAPI','$ionicSlideBoxDelegate','$controller']

	function FoodDetailCtrl($scope,$state, goodsAPI,$ionicSlideBoxDelegate,$controller) {
    var vm = this;
    var goodsPublic=$controller('goodsPublic',{$scope:$scope,$state:$state});
    vm.idLoad=parseInt($state.params.idLoad);
    vm.addBasketDirectiveExecutedTimes=0;
		vm.goodsImg=[];
		InitGoodDetail();
		getBasketElementByStateOnce();

    vm.sliderOptions = {
      slidesPerView:slidesPerView,
      freeMode: true,
      showPager: false,
      spaceBetween:0,
    }      

    vm.sliderFullOptions = {
        direction: 'vertical',
        slidesPerView: 'auto',
    }      

    vm.carouselMock = [{
      commodityName: "炒菜必备的大葱",
      saleDescribe: "约250g/份",
      standardRetailPrice: "1.11",
      commodityImage: "https://www.jialebao.cc/food_img/img/food_img/20150914114114430.jpg",
      idCommodity: 646
    }, {
      commodityName: "颜值撑起的大西芹",
      saleDescribe: "约500g/份",
      standardRetailPrice: "2.22",
      commodityImage: "https://www.jialebao.cc/food_img/img/food_img/20170215021723652.jpg",
      idCommodity: 646
    }, {
      commodityName: "南汇本地上海青",
      saleDescribe: "约500g/份",
      standardRetailPrice: "3.33",
      commodityImage: "https://www.jialebao.cc/food_img/img/food_img/20161118105407520.jpg",
      idCommodity: 646
    }, {
      commodityName: "深海大黄鱼",
      saleDescribe: "约500g/份",
      standardRetailPrice: "4.44",
      commodityImage: "https://www.jialebao.cc/food_img/img/food_img/20170515013544219.jpg",
      idCommodity: 646
    }, {
      commodityName: "营养鸡毛菜",
      saleDescribe: "约500g/份",
      standardRetailPrice: "5.05",
      commodityImage: "https://www.jialebao.cc/food_img/img/food_img/20170306110307535.jpg",
      idCommodity: 646
    }];		
		
		function getBasketElementByStateOnce(){
		  var i=0;
      $scope.$on("slideReady",function(){
        if(i<1){
          goodsPublic.getBasketElementByState();
          i++;
        }  
      });    		  
		}
		
		function InitGoodDetail(){
			if(!!$state.params.idCommodity){
				vm.goodsId=$state.params.idCommodity;
				goodsAPI.getGoodsDetail($state.params.idCommodity)
				.then(function(result){
					vm.goodsImg=result.food_img_list;
					vm.foodInfo=result.food_info;
					vm.foodInfo.productionPlace=vm.foodInfo.productionPlace||'上海';
					vm.foodInfo.saleDescribe=vm.foodInfo.saleDescribe||'暂无描述';
					vm.foodInfo.storageType=vm.foodInfo.storageType||'暂无';
					$scope.totalNumber=result.total_Num;
					$ionicSlideBoxDelegate.update();
				});
			}		
		}


	}

  function adaptSlideByScreenSize(){
    var width=ionic.viewWidth;
    if(width<330){
      slidesPerView=3;
    }else if(width<410){
      slidesPerView=3.5;
    }else if(width<490){
      slidesPerView=4;
    }else if(width<570){
      slidesPerView=4.5;
    }else if(width<650){
      slidesPerView=5;
    }else if(width<730){
      slidesPerView=5.5;
    }else{
      slidesPerView=5.5;
    }
  }

});