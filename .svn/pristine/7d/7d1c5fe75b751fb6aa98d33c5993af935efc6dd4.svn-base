define(['app', 'service/exHttpService'], function(app) {
		app.register.service("askForInvoiceAPI", AskForInvoiceAPI);

		AskForInvoiceAPI.$inject = ['$q', 'exHttp'];

		function AskForInvoiceAPI($q, exHttp) {
			return {
				pageInit: pageInit, //索要发票初始化
				submitInvoice: submitInvoice, //提交
				invHisInitPage: invHisInitPage, //开票记录初始化
				invHisCancelInvoice: invHisCancelInvoice //开票记录取消
			}

			function pageInit(idReceipt) {
				var def = $q.defer();
				var receipt_id = '';
				if(idReceipt) receipt_id = '?idReceipt=' + idReceipt;
				exHttp.init({
					url: 'receipt/select_receipt_price'+receipt_id,
					method: 'post',
					timeout: 120000,
					loading: 'circle',
					loginTimeOut: false,
				}).then(function(response) {
					var fromData = response.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}

			function submitInvoice(invoiceMoney, invoiceTopCom, invoiceType, invoiceContent, idUserAddrMgr, invoiceAddDesc) {
				var def = $q.defer();
				exHttp.init({
					url: 'receipt/insert_receipt',
					method: 'post',
					params: {
						receiptPrice: invoiceMoney,
						receiptTitle: invoiceTopCom,
						receiptType: invoiceType,
						receiptContent: invoiceContent,
						idUserAddrMgr: idUserAddrMgr,
						receiptAddr: invoiceAddDesc
					},
					timeout: 120000,
					loading: 'circle',
					loginTimeOut: false,
				}).then(function(response) {
					var fromData = response;
					def.resolve(fromData);
				});
				return def.promise;
			}

			function invHisInitPage() {
				var def = $q.defer();
				exHttp.init({
					url: 'receipt/user_wechat_receipt_list',
					method: 'get',
					timeout: 120000,
					loading: 'circle',
					loginTimeOut: false,
				}).then(function(response) {
					var fromData = response.returnData;
					def.resolve(fromData);
				});
				return def.promise;
			}

			function invHisCancelInvoice(idReceipt) {
				var def = $q.defer();
				exHttp.init({
					url: 'receipt/delete_receipt?idReceipt=' + idReceipt,
					method: 'get',
					timeout: 120000,
					loading: 'circle',
					loginTimeOut: false,
				}).then(function(response) {
					var fromData = response;
					def.resolve(fromData);
				});
				return def.promise;
			}
		}

	})
	/*http://www.jialebao.cc*/