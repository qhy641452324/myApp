define(["app", "service/accountSecurityService", "service/popupService", "commonService"], function(app) {
	app.register.controller("bindPhoneCtrl", BindPhoneCtrl);
	BindPhoneCtrl.$inject = ["$scope", "accountSecurityAPI", "popupAPI", "publicToast","$state"]

	function BindPhoneCtrl($scope,accountSecurityAPI, popupAPI, publicToast,$state) {
		var vm = this;
		vm.buttonStatus = "获取验证码";
		$scope.getVerificationCode = function(phoneNumber) {
			if(checkFlow(phoneNumber) == false || phoneNumber.length != 11) {
				inputAlert("输入的手机号码有误", "");
				return;
			}
			getPhoneCode(phoneNumber);
			timeCounter();
			//				var opts = {
			//					imgUrl: "img/1.png",
			//					placeholder: "",
			//					title: "请填入图形验证码以获取短信验证码",
			//					titleContent: "",
			//					inputPlaceholder: "",
			//					codeNumber: randomNum(2)
			//				}
			//				popupAPI.popupShowCode(opts, function() {}, function(phoneNumber) {
			//					getPhoneCode(phoneNumber, randomNum(2));
			//				});
		}
		//去设置密码
		$scope.goSetPassword = function(phoneNumber, verificationCode) {
			if(phoneNumber == undefined || verificationCode == undefined) {
				publicToast.show("手机号和验证码不能为空", "");
				return;
			}
			$state.go('tab.setPassword', {
				phoneNumber: phoneNumber
			});
//			accountSecurityAPI.bindPhone(phoneNumber, verificationCode).then(function(data) {}, function(error) {
//					
//			});
		}
		
		//验证码倒计时
		function timeCounter() {
			timeCounter.n = 61;
			vm.intervalCount = setInterval(function() {
				if(timeCounter.n <= 1) {
					clearInterval(vm.intervalCount);
					vm.buttonStatus = "获取手机验证码";
					vm.intervalCount = null;
					$scope.$digest();
					return;
				}
				timeCounter.n--;
				vm.buttonStatus = timeCounter.n + "s后再次发送";
				$scope.$digest();
			}, 1000);
		}
		//获取手机验证码
		function getPhoneCode(phoneNumber) {
			accountSecurityAPI.getVerificationCode(phoneNumber).then(function(data) {}, function(error) {
				if(data.status == 0) {
					publicToast.show("验证码已发送，请在五分钟内完成验证。");
				}
			});
		}
		//提示输入错误信息
		function inputAlert(title, titleContent) {
			var opts = {
				imgUrl: "img/1.png",
				title: title,
				titleContent: titleContent
			}
			popupAPI.popupAlert(opts, function() {});
		}
		//验证手机号
		function checkFlow(txt) {
			var reg = /^\d*$/
			var re = true;
			if(!reg.test(txt) || txt.length != 11) {
				re = false;
			}
			return re;
		}
		//随机生成两位数
		function randomNum(n) {
			var t = '';
			for(var i = 0; i < n; i++) {
				t += Math.floor(Math.random() * 10);
			}
			return t;
		}
	}

});