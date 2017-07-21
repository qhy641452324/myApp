define(["app", "service/askForInvoiceService", "service/popupService"], function(app) {
	app.register.controller("invoiceHistoryCtrl", InvoiceHistoryCtrl);
	InvoiceHistoryCtrl.$inject = ["$scope", "askForInvoiceAPI", "$state", "popupAPI"];

	function InvoiceHistoryCtrl($scope, askForInvoiceAPI, $state, popupAPI) {
		pageInit(); //页面初始化
		var vm = this;

		function pageInit() {
			askForInvoiceAPI.invHisInitPage().then(function(data) {
				console.log(data);
				var userReceiptList = data.user_receipt_list;
				var arr = [];
				for(var i = 0; i < userReceiptList.length; i++) {
					var applyTimeStr = userReceiptList[i].applyTimeStr;
					var receiptPrice = userReceiptList[i].receiptPrice;
					var receiptTitle = userReceiptList[i].receiptTitle;
					var receiptAddr = userReceiptList[i].receiptAddr;
					var receiptContent = userReceiptList[i].receiptContent;
					var receiptType = userReceiptList[i].receiptType;
					var receiptState = userReceiptList[i].receiptState;
					var idReceipt = userReceiptList[i].idReceipt;
					var receiptStateStr = "";
					var receiptTypeStr="";
					var receiptContentStr="";
					switch(receiptState) {
						case 0:
							receiptStateStr = "申请中";
							break;
						case 1:
							receiptStateStr = "已开票";
							break;
						case 2:
							receiptStateStr = "已驳回";
							break;
					}
					switch(receiptType) {
						case 0:
							receiptTypeStr = "公司";
							break;
						case 1:
							receiptTypeStr = "个人";
							break;
					}
					switch(receiptContent) {
						case 0:
							receiptContentStr = "食品";
							break;
						case 1:
							receiptContentStr = "日用品";
							break;
					}
					arr.push({
						applyTimeStr: applyTimeStr,
						receiptPrice: receiptPrice,
						receiptTitle: receiptTitle,
						receiptAddr: receiptAddr,
						receiptContent: receiptContent,
						receiptContentStr:receiptContentStr,
						receiptType: receiptType,
						receiptTypeStr:receiptTypeStr,
						receiptStateStr: receiptStateStr,
						receiptState: receiptState,
						idReceipt: idReceipt
					});

				}
				$scope.userReceiptList = arr;
			}, function(error) {});
		}
		//取消
		$scope.cancelInvoice = function(idReceipt) {
				var opts = {
					imgUrl: "img/1.png",
					title: "确定取消",
					titleContent: ""
				}
				popupAPI.popupconfirm(opts, function() {}, function() {
					askForInvoiceAPI.invHisCancelInvoice(idReceipt).then(function(data) {
						if(data.status == "0") {
							pageInit();
						}
					}, function(error) {});
				})
			}
			//修改
		$scope.editInvoice = function(idReceipt) {
			$state.go('tab.askForInvoice', {
				idReceipt: idReceipt
			});
		}
	}

});