define(["app", "service/accountBalanceService", ], function(app) {
	app.register.controller("accountBalanceCtrl", accountBalanceCtrl);
	accountBalanceCtrl.$inject = ["$scope", "accountBalanceAPI"];

	function accountBalanceCtrl($scope, accountBalanceAPI) {
		getPieCharts();

		function getPieCharts() {
			accountBalanceAPI.getPieCharts().then(function(data) {
				console.log(data);
				var leftMoney = data.leftMoney.toFixed(2);
				var allConsume = (Math.abs(data.all_consume) + data.sum_consume_score).toFixed(2);
				$scope.leftMoney = leftMoney;
				$scope.allConsume = "消费总额" + allConsume + "元";
				var orderList = data.order_list;
				var pieArray = new Array();
				for(var i in orderList) {
					var orderRemark = orderList[i].orderRemark;
					var allMoney = orderList[i].allMoney;
					var tempArray = new Array();
					tempArray.push(orderRemark);
					tempArray.push(allMoney);
					pieArray.push(tempArray);
				}
				var consumeList = data.consume_list;
				var itemArray=new Array();
				for(var i in consumeList) {
					var detailArray = new Array();
					var consumeTimeStr = consumeList[i].consumeTimeStr;
					var consumePrice = consumeList[i].consumePrice.toFixed(2);
					var consumeRemark = consumeList[i].consumeRemark;
					var userName = consumeList[i].userName;
					detailArray.push(consumeTimeStr);
					detailArray.push(consumePrice);
					detailArray.push(consumeRemark);
					detailArray.push(userName);
					itemArray.push(detailArray);
				}
				$scope.Array=itemArray;
				Highcharts.chart('container', {
					chart: {
						renderTo: 'consume_pie',
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,

					},
					colors: ['#BDE4BB', '#FFE9BC', '#E4D5BF', '#EEC4D2', '#C8CCE5', '#FFD4DC'],
					title: {
						text: "当月消费图"
					},
					tooltip: {
						enabled: false,
						formatter: function() {
							return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(2) + ' %';
						}
					},
					plotOptions: {
						pie: {
							allowPointSelect: false,
							cursor: 'pointer',
							dataLabels: {
								enabled: true,
								distance: 25,
//								color: '#000000',
//								connectorColor: '#000000',
								formatter: function() {
									return this.percentage.toFixed(1) + ' %';
								}
							},
							showInLegend: true
						}
					},
					credits: {
						enabled: false
					},
					series: [{
						type: 'pie',
						name: 'pie',
						innerSize: '35%',
						data: pieArray
					}]
				});
			}, function(error) {

			});

		}

	}
});