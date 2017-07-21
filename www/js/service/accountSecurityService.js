define(['app', 'service/exHttpService'], function(app) {
		app.register.service("accountSecurityAPI", accountSecurityAPI);

		accountSecurityAPI.$inject = ['$q', 'exHttp'];

		function accountSecurityAPI($q, exHttp) {
			return {
				getVerificationCode: getVerificationCode, //获取手机验证码
				bindPhone: bindPhone,//绑定手机号
				appRegister:appRegister//设置密码
			}

			function getVerificationCode(phoneNumber) {
				var def = $q.defer();
				exHttp.init({
					url: 'mgr_sms/sendIdentifyingCode',
					method: 'get',
					params: {
						phones: phoneNumber,
						verify_code: 123,
						flag_verify_code: 1
					},
					timeout: 120000,
					loading: 'circle',
				}).then(function(response) {
					console.log(response);
					var fromData = response.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}

			function bindPhone(phoneNumber, verificationCode) {
				var def = $q.defer();
				exHttp.init({
					url: 'mgr_sms/verify_sms',
					method: 'get',
					params: {
						phoneUser: phoneNumber,
						content: verificationCode
					},
					timeout: 120000,
					loading: 'circle',
				}).then(function(response) {
					console.log(response);
					var fromData = response.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}

			function appRegister(phoneUser, enterCode, password, type) {
				var def = $q.defer();
				exHttp.init({
					url: "app/register",
					params: {
						phoneUser: phoneUser,
						enterCode: enterCode,
						password: password,
						type: type
					},
					loading: 'circle',
				}).then(function(response) {
					def.resolve(response);
				});
				return def.promise;
			}
		}
	})
	/*http://www.jialebao.cc*/