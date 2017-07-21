define(["app", "service/addressManagementService", "service/modalService", "service/popupService"], function(app) {
	app.register.controller("addressManagementCtrl", addressManagementCtrl);
	addressManagementCtrl.$inject = ["$scope", 'addressManagementAPI', 'popupAPI', '$cacheFactory', '$state'];

	function addressManagementCtrl($scope, addressManagementAPI, popupAPI, $cacheFactory, $state) {
		var vm = this;
		getInit(); //初始化页面
		radioListener();

		function getInit() {
			addressManagementAPI.pageInit().then(function(data) {
				console.log(data);
				var userAddList = data.user_add_list;
				var appendUser = data.append_user;
				var weichatNickname = data.weichatNickname;
				var mobilePhone = data.mobilePhone;
				var userAddArr = [];
				for(var i in userAddList) {
					var receiveName = userAddList[i].receiveName;
					var phoneUser = userAddList[i].phoneUser;
					var addType = userAddList[i].addType;
					var addDesc = userAddList[i].addDesc;
					var defaultState = userAddList[i].defaultState;
					var idUserAddrMgr = userAddList[i].idUserAddrMgr;
					var addTypeStr = "";
					switch(addType) {
						case 1:
							addTypeStr = "住宅";
							break;
						case 2:
							addTypeStr = "公司";
							break;
						case 3:
							addTypeStr = "其他";
							break;
					}
					var defaultStateStr = "";
					switch(defaultState) {
						case 0:
							defaultStateStr = "默认地址";
							break;
						case 1:
							defaultStateStr = "设为默认";
							break;
					}
					if(userAddList[i].defaultState==0){
						vm.defaultState = i;
					}
					userAddArr.push({
						receiveName: receiveName,
						phoneUser: phoneUser,
						addTypeStr: addTypeStr,
						addDesc: addDesc,
						defaultStateStr: defaultStateStr,
						idUserAddrMgr: idUserAddrMgr,
						defaultState: defaultState
					});
					$scope.userAddList = userAddArr;
				}

			}, function(error) {})
		}
		//提示是否删除地址
		$scope.isDelete = function(idUserAddrMgr) {
				var opts = {
					imgUrl: "img/1.png",
					title: "确定删除该地址？",
					titleContent: ""
				}
				popupAPI.popupconfirm(opts, function() {}, function() {
					addressManagementAPI.deleteAdd(idUserAddrMgr).then(function(data) {
						if(data.status == 0) {
							vm.defaultState=-1;
							getInit();
						}
					}, function(error) {})
				});
			}
			//修改地址
		$scope.toEditAddrMes = function(receiveName, phoneUser) {
				$state.go('tab.editAddrMes', {
					receiveName: receiveName,
					phoneUser: phoneUser
				});
			}
			//新增地址
		$scope.getNewAddrMes = function(weichatNickname, mobilePhone) {
			$state.go('tab.editAddrMes');
		}

		function radioListener() {
			$scope.$watch("addressManagement.defaultState", function() {
				var index = parseInt($scope.addressManagement.defaultState);
				if(!isNaN(index)) {
					//					console.log($scope.userAddList[index]);
					addressManagementAPI.isdefault($scope.userAddList[index].idUserAddrMgr,$scope.userAddList[index].addDesc).then(function(data) {
						if(data.status == 0) {
							getInit();
						}
						
					}, function(error) {})
				}

			})

		}

	}

});