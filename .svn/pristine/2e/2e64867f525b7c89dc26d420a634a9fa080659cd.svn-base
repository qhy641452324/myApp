define(["app", "service/addressToolService", "service/popupService", "commonDirective", "service/editAddrMesService"], function(app) {
	app.register.controller("editAddrMesCtrl", editAddrMesCtrl);
	editAddrMesCtrl.$inject = ["$scope", 'popupAPI', '$state', 'addressToolAPI', 'editAddrMesAPI'];

	function editAddrMesCtrl($scope, popupAPI, $state, addressToolAPI, editAddrMesAPI) {
		var vm = this;
		initMap(); //初始化地图
		initPage();

		function initPage() {
			vm.receiveName = $state.params.receiveName;
			vm.phoneUser = $state.params.phoneUser;
		}
		$scope.addTypeList = [{
			"value": "住宅",
			"id": 1
		},{
			"value": "公司",
			"id": 2
		},{
			"value": "其他",
			"id": 3
		},{
			"value": "学校",
			"id": 4
		}];
		function initMap() {
			var map = new BMap.Map("allmap"); // 创建Map实例
			map.centerAndZoom("上海", 12); // 初始化地图,设置城市和地图级别。
			var geoc = new BMap.Geocoder();
			var ac = new BMap.Autocomplete( //建立一个自动完成的对象
				{
					"input": "addDesc",
					"location": map
				});
			map.addEventListener("dragend", function() {
				//拖动地图事件
				var center = map.getCenter();
				geoc.getLocation(center, function(rs) {
					var addComp = rs.addressComponents; //结构化地址描述
					var district = addComp.district;
					var city = addComp.city;
					vm.addDescSelect = city + "" + district;
					var addDesc = rs.address;
					ac.setInputValue(addDesc);
				});
			});

		}
		//提示信息
		function inputAlert(title, titleContent) {
			var opts = {
				imgUrl: "img/1.png",
				title: title,
				titleContent: titleContent
			}
			popupAPI.popupAlert(opts, function() {});
		}
		//确认提交
		vm.sumitMessage = function() {
			if(vm.receiveName == "" || vm.receiveName == null) {
				inputAlert("请填写收货人姓名", "");
				return;
			}
			if(vm.phoneUser == "" || vm.phoneUser == null) {
				inputAlert("请填写收货人手机号", "");
				return;
			}
			if(!checkMobile(vm.phoneUser)) {
				inputAlert("请填写正确的手机号", "");
				return;
			}
			if(vm.addDescSelect == "" || vm.addDescSelect == null) {
				inputAlert("请填写所在地区", "");
				return;
			}
			if(vm.addDesc == "" || vm.addDesc == null) {
				inputAlert("请填写详细地址", "");
				return;
			}
			var idSite = "",
				_id_site = "",
				idDeliveryCell = 32,
				siteType = 2;
			var is_in_site = false,
				is_in_send_area = false;
			addressToolAPI.init(vm.addDesc, function(deliveryData) {
				var adCountry = vm.addDescSelect.substring(0, 3);
				var adCity = vm.addDescSelect.substring(3);
				editAddrMesAPI.sumitMes(deliveryData, vm.addDesc, vm.phoneUser, vm.receiveName,adCountry,adCity).then(function(data) {
					if(data.status == "0") {
						var opts = {
							imgUrl: "img/1.png",
							title: "提交成功",
							titleContent: ""
						}
						popupAPI.popupAlert(opts, function() {
							$state.go('tab.addressManagement');
						})
					}
				}, function(error) {});

			}, "上海");

		}
		$scope.butchecked=function(){
			$scope.checked=true;
		}
		//校验手机号码
		function checkMobile(str) {
			var re = /^1\d{10}$/
			if(re.test(str) && str.length == 11) {
				return true;
			} else {
				return false;
			}
		}
		$scope.list = [{
			"value": "上海市",
			"child": [{
				"value": "请选择"
			}, {
				"value": "黄浦区"
			}, {
				"value": "卢湾区"
			}, {
				"value": "徐汇区"
			}, {
				"value": "长宁区"
			}, {
				"value": "静安区"
			}, {
				"value": "普陀区"
			}, {
				"value": "闸北区"
			}, {
				"value": "虹口区"
			}, {
				"value": "杨浦区"
			}, {
				"value": "宝山区"
			}, {
				"value": "闵行区"
			}, {
				"value": "嘉定区"
			}, {
				"value": "松江区"
			}, {
				"value": "金山区"
			}, {
				"value": "青浦区"
			}, {
				"value": "南汇区"
			}, {
				"value": "奉贤区"
			}, {
				"value": "浦东新区"
			}, {
				"value": "崇明县"
			}, {
				"value": "其他"
			}],
			"id": 0
		}];

	}

});