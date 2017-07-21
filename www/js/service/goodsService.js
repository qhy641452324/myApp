define(['app', 'service/exHttpService'], function(app) {
	app.register.service("goodsAPI", GoodsAPI);

	GoodsAPI.$inject = ['$q', 'exHttp'];

	function GoodsAPI($q, exHttp) {
		return {
			pageForm: pageForm,//初始获取
			goodsAType:goodsAType,//菜单获取
			addGoodsToBasket:addGoodsToBasket,//加菜篮子
			getGoodsDetail:getGoodsDetail,//菜品详情
			loadChildCls:loadChildCls,  //load_child_cls原vip专区获取商品类型
			loadSubClsNew:loadSubClsNew, //load_sub_cls_new原vip专区获取商品
			searchFoodInfoList:searchFoodInfoList//搜索页初始请求
		}
		function pageForm() {
			var def = $q.defer();
			exHttp.init({
				url: 'mgr_food/load_big_cls_and_first_sub_cls?begin=0&length=20&idCommodityNavigation=0',
				method: 'post',
				loading:'circle',
				cache:true,
				loginTimeOut: false,
			}).then(function(response) {
			  persistUnfinishedOrderIdBeforeExit(response);
        var d=response.returnData
        if(d&&d.unfinish_order&&d.unfinish_order.hasOwnProperty("idOrder")&&d.unfinish_order.idOrder!=0&&d.unfinish_order_detail){
          sessionStorage.setItem('unfinishOrderId',response.returnData.unfinish_order.idOrder);
        }else{
          sessionStorage.setItem('unfinishOrderId',0); 
        }			  
				var fromData = response.returnData;
				def.resolve(fromData);
			});
			return def.promise;
		}
		
		function goodsAType(idCommodityNavigation,idCommoditySecondNavigation,begin,length,loading){
			var def = $q.defer();
			var params={
          isOnline:0,
          idCommodityNavigation:idCommodityNavigation,
          begin:begin,
          length:length
      };
      if(!!idCommoditySecondNavigation){
        params.idCommoditySecondNavigation=idCommoditySecondNavigation;
      }
			exHttp.init({
				url: 'mgr_food/load_sub_cls',
				method: 'post',
				params:params,
				loading:loading||'circle',
				loginTimeOut: false,	
				cache:true,
			}).then(function(response) {
				var formData = response.returnData;
				if(formData.food_subtype_list.length<length){
					formData.goodsHasToEnd=true;
				}else{
					formData.goodsHasToEnd=false;
				}
				def.resolve(formData);
			});
			return def.promise;			
		}
		
		function addGoodsToBasket(orderNumber,unitPrice,idCommodity,optType){
			var def = $q.defer();
			exHttp.init({
				url: 'user_order/upd_user_selected_order',
				method: 'post',
				params:{
					isOnline:0,
					orderNumber:orderNumber,
					unitPrice:unitPrice,
					totalPrices:unitPrice*orderNumber,
					idCommodity:idCommodity,
					optType:optType
				},
				loading:'circle',
				loginTimeOut: true,				
			}).then(function(response) {
        persistUnfinishedOrderIdBeforeExit(response);
				def.resolve(response);
			},function(error){
			  def.reject(error);
			});
			return def.promise;						
		}
		
		function getGoodsDetail(idCommodity){
			var def = $q.defer();
			exHttp.init({
				url: 'mgr_food/show_food_info',
				method: 'post',
				params:{
					idLoad:1,
					idCommodity:idCommodity,
				},
				loading:'circle',
				cache:true,
			}).then(function(response) {
				def.resolve(response.returnData);
			});
			return def.promise;					
		}
		
		function loadChildCls(){
      var def = $q.defer();
      exHttp.init({
        url: 'mgr_food/load_child_cls?type_father=322&isOnline=0',
        method: 'post',
        loading:'circle',
        cache:true,
      }).then(function(response) {
        def.resolve(response.returnData);
      });
      return def.promise;   		  
		}
		
    function loadSubClsNew(begin,length,idCommodity){
      var def = $q.defer();
      exHttp.init({
        url: 'vip_zone/load_sub_cls_new?params={begin:'+begin+',length:'+length+',idCommodityNavigation:'+idCommodity+'}',
        method: 'post',
        loading:'circle',
        cache:true,
      }).then(function(response) {
        var result={};
        result.foods=response.params.food_subtype_list;
        if(result.foods.length<length){
          result.hasToTheEnd=true;
        }else{
          result.hasToTheEnd=false;
        }
        def.resolve(result);
      });
      return def.promise;         
    }
    
    function searchFoodInfoList(userRecommendLength,hotRecommendLength,commodityName){
      var def = $q.defer();
      exHttp.init({
        url: 'user_mgr/search_food_info_list',
        method: 'post',
        params:{
          user_recommend_length:userRecommendLength,
          hot_recommend_length:hotRecommendLength,
          commodityName:commodityName,          
        },
        loading:'circle',
        cache:true,
      }).then(function(response) {
        var result=response.returnData;
        def.resolve(result);
      });
      return def.promise;          
    }
    
    function persistUnfinishedOrderIdBeforeExit(response){
      if(response.returnData&&response.returnData.unfinish_order&&response.returnData.unfinish_order.hasOwnProperty("idOrder")&&response.returnData.unfinish_order_detail.length){
        sessionStorage.setItem('unfinishOrderId',response.returnData.unfinish_order.idOrder);
      }else{
        sessionStorage.setItem('unfinishOrderId',0); 
      }
    }
    
	}
})