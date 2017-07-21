define(['app', 'service/exHttpService'], function(app) {
		"use strict";
		app.register.service("userAPI", UserAPI);

		UserAPI.$inject = ['$q', 'exHttp'];

		function UserAPI($q, exHttp) {
			return {
				pageInit: pageInit, //索要发票初始化
				myAccount: myAccount, //我家账户
				feedbackRecord: feedbackRecord,//反馈记录
				loginOff:loginOff,//退出登录
				getUserName:getUserName,//获取用户名
				getDeductionTicket:getDeductionTicket,//获取现金券
			}

			function pageInit() {
				var def = $q.defer();
				exHttp.init({
					url: 'login/show_user_info?idAppendUser=1',
					method: 'get',
					timeout: 120000,
					loading: 'circle',
				}).then(function(response) {
					var fromData = response.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}

			function myAccount() {
				var def = $q.defer();
				exHttp.init({
					url: 'user_order/getMySelfAccount',
					method: 'get',
					timeout: 120000,
					loading: 'circle',
				}).then(function(response) {
					var fromData = response.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}

			function feedbackRecord() {
				var def = $q.defer();
				exHttp.init({
					url: 'user_comment/select_user_comment_list',
					method: 'get',
					timeout: 120000,
					loading: 'circle',
				}).then(function(response) {
					var fromData = response.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}

			function loginOff() {
				var def = $q.defer();
				exHttp.init({
					url: 'login/logout_check',
					method: 'get',
					timeout: 120000,
					loading: 'circle',
				}).then(function(response) {
					console.log(response);
					var fromData = response;
					def.resolve(fromData);
				});
				return def.promise;
			}
			function getUserName() {
				var def = $q.defer();
				exHttp.init({
					url: 'login/show_user_infos',
					method: 'get',
					timeout: 120000,
					loading: 'circle',
				}).then(function(response) {
					console.log(response);
					var fromData = response.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}
			
      function getDeductionTicket() {
        var def = $q.defer();
        exHttp.init({
          url: 'activity/cashCoupon/getDeductionTicket',
          method: 'post',
          loading: 'circle',
        }).then(function(response) {
          var formData = response.params.list;
          var tt=(new Date()).getTime();
          var tickets={unused:[],expired:[],used:[]};
          for(var i in formData){
            /*
             *tickedStatus  0:未到期 tickets.unused    1：已到期  tickets.expired   2：已使用  tickets.used
             * */
            if(formData[i].endTimeLong>tt&&!formData[i].idOrder){
              formData[i].tickedStatus=0;
              formData[i].dayLeft=Math.floor((formData[i].endTimeLong-tt)/86400000);//剩余有效天数
              tickets.unused.push(formData[i]);
            }if(formData[i].endTimeLong<=tt&&!formData[i].idOrder){
              formData[i].tickedStatus=1;
              tickets.expired.push(formData[i]);
            }if(formData[i].idOrder){
              formData[i].tickedStatus=2;
              tickets.used.push(formData[i]);
            }
          }
          def.resolve(tickets);
        });
        return def.promise;
      }			
			
		}
	})
	/*http://www.jialebao.cc*/