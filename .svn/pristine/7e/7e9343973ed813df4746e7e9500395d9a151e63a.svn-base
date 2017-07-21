define(["app","service/goodsService","commonDirective","commonService","directive/goodsDirective"],function(app){
	app.register.controller("searchCtrl",SearchCtrl);
	
	SearchCtrl.$inject=['$scope','$state','goodsAPI','publicToast','$controller']
	function SearchCtrl($scope,$state,goodsAPI,publicToast,$controller){
	  var goodsPublic=$controller('goodsPublic',{$scope:$scope,$state:$state});
		var vm=this;
		vm.searchAction=searchAction;
		vm.searchByHistory=searchByHistory;
		vm.promotionType=goodsPublic.foodPromotionImage;//促销新品
		var modelCtrl;
		pageInit();
		
		function pageInit(){
		  var searchHistoryTemp=localStorage.getItem("searchHistory");
		  if(!!!searchHistoryTemp){
		    searchHistoryTemp=[];
		  }else{
		    searchHistoryTemp=JSON.parse(searchHistoryTemp);
		  }
		  vm.searchHistory=searchHistoryTemp.reverse();
		  goodsAPI.searchFoodInfoList(5,7).then(function(response){
		    vm.hotOrderDetail=response.hot_order_detail;
		    goodsPublic.countTotalNumerTab(response.unfinish_order_detail);
		    $scope.modelSearchCtrl=modelCtrl=$scope.searchForm.searchBar;
		  });
		}
		
		function searchAction(inValid){
		  if(inValid){
		    publicToast.show("请输入搜索关键词");
		    return ;
		  }
		  vm.searchBarValue=(vm.searchBarValue+'').trim();
      searchRequest();
		}
		
		function searchRequest(){
		  manageHistory();//在搜索前管理历史记录
		  if(modelCtrl&&modelCtrl.$$lastModel==vm.searchBarValue){//如果上次搜索内容与此次搜索内容相同，直接忽略此次搜索
		    return ;
		  }
		  vm.goodsList=[];
      try {
        cordova.plugins.Keyboard.close();
      } catch(e) {}		  
      goodsAPI.searchFoodInfoList(1000,8,vm.searchBarValue).then(function(response){
        vm.goodsList=response.commend_order_detail;
        modelCtrl.$$lastModel=vm.searchBarValue;
      });     		  
		}
		
		/*历史记录：存入缓存，历史记录中存在或不存在此次搜索内容，都会排到首位。历史记录最长为10。*/
		function manageHistory(){
      var searchHistoryTemp=localStorage.getItem("searchHistory");
      if(!!!searchHistoryTemp){
        searchHistoryTemp=[];
      }else{
        searchHistoryTemp=JSON.parse(searchHistoryTemp);
      }
      var searchHistoryItemIndex=searchHistoryTemp.indexOf(vm.searchBarValue);
      if(searchHistoryItemIndex>=0){
        searchHistoryTemp.splice(searchHistoryItemIndex,1);
      }
      if(searchHistoryTemp.length>9){
        searchHistoryTemp.shift();
      }      
      searchHistoryTemp.push(vm.searchBarValue);
      localStorage.setItem("searchHistory",JSON.stringify(searchHistoryTemp));
      vm.searchHistory=searchHistoryTemp.reverse(); 
		}
		
		function searchByHistory(item){
		  vm.searchBarValue=item;
		  searchRequest();
		}
	}

});