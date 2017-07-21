define(['app', 'service/exHttpService'], function(app) {
	app.register.service("addressToolAPI", AddressToolAPI);

	AddressToolAPI.$inject = ['$q', 'exHttp'];

	function AddressToolAPI($q, exHttp) {
		return {
			init: init, //首页内容初始化
			addressToPoint1: addressToPoint1,
			addressToPoint2: addressToPoint2,
			getPoint: getPoint,
			getIdDelivery: getIdDelivery,
			//					number: number,
			//					cutaddress: cutaddress,
			check_addr_delivery: check_addr_delivery
		}

		function init(add, fn, city) {
			var vm = this;
			//					var add = cutaddress(add);
			var city = !!city ? city : "上海市";
			vm.addressToPoint1(add, city).then(function(data) {
				vm.addressToPoint2(add, city).then(function(data2) {
					var deliveryData = {
						id_delivery: 32,
						idSite: 999,
						idCenter: -1,
						point: {
							lng: "",
							lat: ""
						}
					}
					if(data || data2) { //至少有一个转化成功
						if(!(data && data2)) { //非两个都转化成功
							deliveryData = data || data2;
						} else {
							if(data.id_delivery == data2.id_delivery) {
								deliveryData = data;
							}
						}
					}
					vm.point = deliveryData.point;
					vm.id_delivery = deliveryData.id_delivery;
					angular.isFunction(fn) && fn.call(this, deliveryData);
				})
			})

		}

		function addressToPoint1(add, city) {
			var def = $q.defer();
			var map = new BMap.Map("map");
			var that = this;
			var local = new BMap.LocalSearch(city, { //智能搜索
				onSearchComplete: _getMapPoint
			});

			local.search(add);

			return def.promise;

			function _getMapPoint() {
				if(!!local.getResults().getPoi(0)) {
					var point = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
					var lng = point.lng; //输入地点经度
					var lat = point.lat; //输入地点纬度
					console.log('lng:' + lng + '###lat:' + lat);
					check_addr_delivery(point, function(id_delivery, idSite, idCenter) {
						var _data = angular.extend({}, {
							id_delivery: id_delivery,
							idSite: idSite,
							idCenter: idCenter,
							point: point
						});
						def.resolve(_data);
					});
				} else {
					var _data = null;
					def.resolve(_data);
				}
			}

		}

		function addressToPoint2(add, city) {
			var def = $q.defer();
			var geoc = new BMap.Geocoder();
			geoc.getPoint(add, function(point) {
				if(point) {
					check_addr_delivery(point, function(id_delivery, idSite, idCenter) {
						var _data = angular.extend({}, {
							id_delivery: id_delivery,
							idSite: idSite,
							idCenter: idCenter,
							point: point
						});
						def.resolve(_data);
					});
				} else {
					var _data = null;
					def.resolve(_data);
				}

			}, city);
			return def.promise;
		}

		function getPoint() {
			return this.point;
		}

		function getIdDelivery() {
			return this.id_delivery;
		}

		//				function number(address, string) {
		//					var number = "0123456789";
		//					if(address.indexOf(string) !== -1) {
		//						if(number.indexOf(address[address.indexOf(string) - 1]) !== -1) {
		//							return true;
		//
		//						} else {
		//							return false;
		//						}
		//					}
		//				}

		//				function cutaddress(addDesc) {
		//					var map_add = addDesc;
		//					var arr_add = map_add.split("");
		//					var new_str = "";
		//					if(this.number(addDesc, "弄")) {
		//						new_str = map_add.substring(0, map_add.indexOf("弄") + 1);
		//					} else if(this.number(addDesc, "号")) {
		//						new_str = map_add.substring(0, map_add.indexOf("号") + 1);
		//					} else {
		//						new_str = addDesc;
		//					}
		//					return new_str;
		//				}

		function check_addr_delivery(point, fn) {
			var is_in_send_area = false;
			var def = $q.defer();
			exHttp.init({
				url: '/user_mgr/find_sender_User',
				method: 'get',
				timeout: 120000,
				loading: 'circle',
				loginTimeOut: false,
			}).then(function(response) {
				var fromData = response.returnData;
				var send_map_area_list = new Array();
				var id_delivery = 32;
				var idSite = 999;
				var idCenter = -1;
				var deliveryCells = fromData.sender_User_List;
				for(var i = 0; i < deliveryCells.length; i++) {
					var send_area = deliveryCells[i];
					var idSite = send_area.idSite;
					var idDeliveryCell = send_area.idDeliveryCell;
					var idCenter = send_area.idCenter;
					var send_dimensions = send_area.cell_dimensions;
					if(send_dimensions == undefined || send_dimensions.length <= 0) {
						continue;
					}
					var dimensions_list = send_dimensions.split(";");
					var dimensionsArray = new Array();
					for(var m = 0; m < dimensions_list.length; m++) {
						var dimensions_longitude = parseFloat(dimensions_list[m].split(",")[0]); //精度
						var dimensions_latitude = parseFloat(dimensions_list[m].split(",")[1]); //纬度
						dimensionsArray.push(new BMap.Point(dimensions_longitude, dimensions_latitude));
					}
					var ply = new BMap.Polygon(dimensionsArray); //获得地图区域
					var send_ply = [idDeliveryCell, ply, idSite, idCenter];
					send_map_area_list.push(send_ply);
				}
				for(var n = 0; n < send_map_area_list.length; n++) {
					var ply = send_map_area_list[n][1];
					is_in_send_area = BMapLib.GeoUtils.isPointInPolygon(point, ply);
					if(is_in_send_area) {
						id_delivery = send_map_area_list[n][0];
						idSite = send_map_area_list[n][2];
						console.log('idDeliveryCell=' + idDeliveryCell);
						break;
					}
				}
				angular.isFunction(fn) && fn.call(this, id_delivery, idSite, idCenter);
			});
		}
	}
})