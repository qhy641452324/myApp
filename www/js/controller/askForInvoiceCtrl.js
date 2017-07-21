define(["app", "service/askForInvoiceService", "service/popupService", "commonDirective"], function(app) {
	app.register.controller("askForInvoiceCtrl", askForInvoiceCtrl);
	askForInvoiceCtrl.$inject = ["$scope", "askForInvoiceAPI", "popupAPI", "$state"];

	function askForInvoiceCtrl($scope, askForInvoiceAPI, popupAPI, $state) {
		$scope.invoiceTypeData = [{
			"value": "公司",
			"id": 0
		}, {
			"value": "个人",
			"id": 1
		}];
		$scope.invoiceContentData = [{
			"value": "食品",
			"id": 0
		}, {
			"value": "日用品",
			"id": 1
		}];
		var vm = this;
		pageInit(); //页面初始化
		function pageInit() {
			var idReceipt = $state.params.idReceipt;
			console.log(idReceipt);
			askForInvoiceAPI.pageInit(idReceipt).then(function(data) {
				console.log(data);
				vm.misJiaYuan = data.recharge_amount;
				vm.invoiceHistory = data.history_amount;
				vm.leftMoney = data.left_receipt_price;
				var user_receipt=data.user_receipt;
				if(user_receipt!=null){
					var receiptTypeStr="";
					var receiptContentStr="";
					if(user_receipt.receiptType==0){
						receiptTypeStr="公司";
					}
					if(user_receipt.receiptType==1){
						receiptTypeStr="个人";
					}
					if(user_receipt.receiptContent==0){
						receiptContentStr="食品";
					}
					if(user_receipt.receiptContent==1){
						receiptContentStr="日用品";
					}
					vm.invoiceMoney=user_receipt.receiptPrice;
					vm.invoiceType=receiptTypeStr;
					vm.invoiceContent=receiptContentStr;
					vm.invoiceTopCom=user_receipt.receiptTitle;
					vm.invoiceAddDesc=user_receipt.receiptAddr;
				}
				var userAddList = data.user_add_list;
				console.log(userAddList);
				var userAddListArr = [];
				for(var i = 0; i < userAddList.length; i++) {
					userAddListArr.push({
						value: userAddList[i].addDesc,
						id: userAddList[i].idUserAddrMgr
					});
				}
				vm.invoiceAddDescData = userAddListArr;
			}, function(error) {});
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
		//点击提交
		vm.submitInvoice = function() {
			if(vm.invoiceMoney == "" || vm.invoiceMoney == undefined) {
				inputAlert("请填写开票金额", "");
				return;
			}
			if(vm.invoiceTopCom == "" || vm.invoiceTopCom == undefined) {
				inputAlert("请填写发票抬头", "");
				return;
			}
			var idInvoiceTypeNode = vm.askForInvoiceFrom.askForInvoiceInvoiceType.nodeData[0].id;
			var idInvoiceContentNode = vm.askForInvoiceFrom.askForInvoiceInvoiceContent.nodeData[0].id;
			var idInvoiceAddDescNode = vm.askForInvoiceFrom.askForInvoiceInvoiceAddDesc.nodeData[0].id;
			var InvoiceAddDescNode = vm.askForInvoiceFrom.askForInvoiceInvoiceAddDesc.nodeData[0].value;
			askForInvoiceAPI.submitInvoice(vm.invoiceMoney, vm.invoiceTopCom, idInvoiceTypeNode, idInvoiceContentNode, idInvoiceAddDescNode, InvoiceAddDescNode).then(function(data) {
				if(data.status == "0") {
					var opts = {
						imgUrl: "img/1.png",
						title: "提交成功",
						titleContent: ""
					}
					popupAPI.popupAlert(opts, function() {
						$state.go('tab.invoiceHistory');
					})
				}

			}, function(error) {});

		}

	}

});