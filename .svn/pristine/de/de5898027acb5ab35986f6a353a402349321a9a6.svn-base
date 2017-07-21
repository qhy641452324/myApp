define(["app", "service/popupService", "commonService", "service/exHttpService", "commonDirective", "service/myProfileService"], function(app) {
	app.register.controller("myProfileCtrl", myProfileCtrl);
	myProfileCtrl.$inject = ['$ionicActionSheet', '$cordovaImagePicker', '$scope', '$cordovaCamera', 'exHttp', 'myProfileAPI', '$state', '$ionicScrollDelegate']

	function myProfileCtrl($ionicActionSheet, $cordovaImagePicker, $scope, $cordovaCamera, exHttp, myProfileAPI, $state, $ionicScrollDelegate) {
		var vm = $scope.vm = {};
		$scope.invoiceTypeData = [{
			"value": "女",
			"id": 0
		}, {
			"value": "男",
			"id": 1
		}];
		myProfileInit();
		//页面初始化
		function myProfileInit() {
			myProfileAPI.pageInit().then(function(data) {
				console.log(data);
				$scope.level=data.params.level;
				$scope.myProfile =data.params;
			}, function(error) {

			});
		}
	 $scope.getUserQrCode = function(idAppendUser, idUser) {
		$state.go('tab.userQrCode', {
			idAppendUser: idAppendUser,
			idUser: idUser
		});
		}
		//公共底部弹窗
		$scope.myProfileshow = function() {
			// 显示操作表
			$ionicActionSheet.show({
				buttons: [{
					text: '拍照上传'
				}, {
					text: '从相册中选择'
				}, ],
				cancelText: '取消',
				buttonClicked: function(index) {
					switch(index) {
						case 0:
							$scope.Camera();
							break;
						case 1:
							$scope.pickImage();
							break;
						default:
							break;
					}
					return true;
				}
			});

		};
		//打开相册
		$scope.pickImage = function() {
				var options = {
					maximumImagesCount: 10,
					width: 800,
					height: 800,
					quality: 80
				};

				$cordovaImagePicker.getPictures(options)
					.then(function(results) {
						//				          for (var i = 0; i < results.length; i++) {
						//				            $scope.logtext = $scope.logtext + results[i]+"\n";
						//				            $scope.imgurl = results[i];
						//				          }
					}, function(error) {
						// error getting photos
					});
			}
			//打开相机
		$scope.Camera = function() {
			var options = {
				quality: 50,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 200,
				targetHeight: 200,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				correctOrientation: true
			};

			$cordovaCamera.getPicture(options).then(function(imageData) {
				var image = document.getElementById('myImage');
				image.src = "data:image/jpeg;base64," + imageData;

				//						$scope.logtext = $scope.logtext + "拍摄照片路径：" + "data:image/jpeg;base64," + imageData + "\n";
			}, function(err) {
				// error
			});

		};
		//修改用户名
		$scope.editUserNameShow = function() {
			$ionicActionSheet.show({
				cancelText: '取消',
				okText: '完成',
				buttonClicked: function(index) {
					return true;
				},
				template: '<div class="action-sheet-backdrop" ion-action-sheet-prop>' +
					'<div class="action-sheet-wrapper action-sheet-wrapper-other">' +
					'<div class="action-sheet-user">' +
					'<button class="button button-left" ng-click="cancel()" ng-bind-html="cancelText"></button>' +
					'<button class="button button-right" ng-click="buttonClicked($index)" ng-bind-html="okText"></button>' +
					'<input class="actionSheetInput" type="text" ng-model="editUserName"/>' +
					'</div>' +
					'</div>' +
					'</div>'
			});
			try {
				cordova.plugins.Keyboard.show();
			} catch(e) {}
		};
	}

});