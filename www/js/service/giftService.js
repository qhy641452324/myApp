define(['app', 'service/exHttpService', 'commonService', "service/popupService"], function(app) {
	"use strict";
	app.register.service("giftAPI", giftAPI);

	giftAPI.$inject = ['$q', 'exHttp', 'commonMethod', 'publicToast'];

	function giftAPI($q, exHttp, commonMethod, publicToast) {
		return {
			getRecommend: getRecommend, //获取推荐礼包
			addFood: addFood, //添加商品
			getSpecialOrder: getSpecialOrder, //获取订单
			getLuckListReceive: getLuckListReceive, //获取收到的礼包
			getLuckListSend: getLuckListSend, //获取发送的礼包
			getLuckyDetail: getLuckyDetail, //获取礼包详情
			subSpecialOrder:subSpecialOrder,//礼包结算
			sendingLuckyPacket:sendingLuckyPacket,//分享礼包
			
		}

		function getRecommend() {
			console.log("开始执行");
			var def = $q.defer();
			exHttp.init({
				url: '/goodService/getLuckyCommodityList',
				method: 'post',
				loading: 'circle',
				loginTimeOut: true,
			}).then(function(response) {

				var recommend = response.returnData;
				def.resolve(recommend);
			});
			return def.promise;
		}

		function addFood(idCommodity, orderNumber, optType) {
			var def = $q.defer();
			exHttp.init({
				url: "lucky_p/add_food_to_order",
				method: 'post',
				params: {
					idCommodity: idCommodity,
					orderNumber: orderNumber,
					optType: optType
				},
			}).then(function(response) {
				def.resolve(response);
			});
			return def.promise;
		}

		//获取订单
		function getSpecialOrder() {
			var def = $q.defer();
			exHttp.init({
				url: 'lucky_p/get_special_order',
				method: 'post',
				loading: 'circle',
				loginTimeOut: true,
			}).then(function(response) {
				var result = response.returnData;
				//  		console.log(result);
				def.resolve(response);
			});
			return def.promise;
		}
		//收到的礼包
		function getLuckListReceive() {
			var def = $q.defer();
			exHttp.init({
				url: 'lucky_p/get_lucky_list_receive',
				method: 'post',
				loading: 'circle',
				loginTimeOut: true,
			}).then(function(response) {
				var result = response.returnData;
				def.resolve(response);
			});
			return def.promise;
		}

		//发送的礼包
		function getLuckListSend() {
			var def = $q.defer();
			exHttp.init({
				url: 'lucky_p/get_lucky_list_send',
				method: 'post',
				loading: 'circle',
				loginTimeOut: true,
			}).then(function(response) {
				var result = response.returnData;
				def.resolve(response);
			});
			return def.promise;
		}
//获取礼包详情
		function getLuckyDetail(id) {
			var def = $q.defer();
			exHttp.init({
				url: "lucky_p/get_lucky_order_detail",
				method: 'post',
				loading: 'circle',
				loginTimeOut: true,
				params: {
					idLucky: id
				}
			}).then(function(response) {
				var result = response.returnData;
				def.resolve(result);
				//		def.resolve(response);
			});
			return def.promise;
		}
	//礼包结算
		function subSpecialOrder(id,type,payTypeStr,channelType,count) {
				var def=$q.defer();
				exHttp.init({
					url:'lucky_p/sub_special_order',
					method:'post',
					loading:'circle',
					loginTimeOut:true,
					params:{
						special_id_order:id,//订单id
						luckyType:type,//礼包类型
						conPayType:payTypeStr,//支付方式
						channelType:2,//订单来源，:0:微信下单;1:点菜机下单;2:app下单; 3:pc下单
						packet_count:count,//礼包数量
					}
				}).then(function(response){
					console.log(response);
					def.resolve(response);
				});
				return def.promise;
		}

//礼包分享
		function sendingLuckyPacket(id){
			var def=$q.defer();
			exHttp.init({
				url:'lucky_p/sending_lucky_packet',
				method:'post',
				loading:'circle',
				loginTimeOut:true,
				params:{
					idLucky:id,//礼包id
				}
			}).then(function(response){
				def.resolve(response)
			});
			return def.promise;
		}

	}
})