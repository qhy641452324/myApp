define(['app'], function(app) {
	app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
		$stateProvider.decorator('views', function(state, parent) {
			var result = {},
				views = parent(state);
			var head = "";
			angular.forEach(views, function(config, name) {
				config.controllerUrl = head + config.controllerUrl;
				config.templateUrl = head + config.templateUrl;
				result[name] = config;
			});
			return result;
		});
		var pageData = [{
			state: 'login',
			paramObj: {
				url: '/login',
				templateUrl: "pages/login.html",
				controller: "loginCtrl",
				controllerUrl: 'js/controller/loginCtrl.js',
				controllerAs: 'login'
			}
		}, {
			state: 'registerPhone',
			paramObj: {
				url: '/registerPhone',
				templateUrl: "pages/register-phone.html",
				controller: "registerCtrl",
				controllerUrl: 'js/controller/registerCtrl.js',
				controllerAs: 'register'
			}
		}, {
			state: 'registerPsw',
			paramObj: {
				url: '/registerPsw?phone',
				templateUrl: "pages/register-psw.html",
				controller: "registerCtrl",
				controllerUrl: 'js/controller/registerCtrl.js',
				controllerAs: 'registerPsw'
			}
		}, {
			state: 'noNetwork',
			paramObj: {
				url: '/noNetwork',
				templateUrl: "pages/noNetwork.html",
			}
		}, {
			state: 'tab',
			paramObj: {
				url: '/tab',
				abstract: true,
				templateUrl: 'pages/tabs.html'
			}
		}, {
			state: 'tab.home',
			paramObj: {
				url: '/home',
				nativeTransitions: {
					"type": "fade",
				},
				views: {
					home: {
						templateUrl: 'pages/home.html',
						controller: 'homeCtrl',
						controllerUrl: 'js/controller/homeCtrl.js',
						controllerAs: 'home'
					}
				}
			}
		}, {
			state: 'tab.buy',
			paramObj: {
				url: '/buy',
				nativeTransitions: {
					"type": "fade",
				},
				views: {
					buy: {
						templateUrl: 'pages/buy.html',
						controller: 'buyCtrl',
						controllerUrl: 'js/controller/buyCtrl.js',
						controllerAs: 'buy'
					}
				}
			}
		}, {
			state: 'tab.gift',
			paramObj: {
				url: '/gift',
				nativeTransitions: {
					"type": "fade",
				},
				views: {
					gift: {
						templateUrl: 'pages/giftIndex.html',
						controller: 'giftCtrl',
						controllerUrl: 'js/controller/giftCtrl.js',
						controllerAs: 'gift'
					}
				}
			}
		}, {
			state: 'tab.aboutGift',
			paramObj: {
				url: '/aboutGift',
				nativeTransitions: {
					"type": "fade",
				},
				views: {
					gift: {
						templateUrl: "pages/aboutGift.html",
						controller: '',
					}
				}
			}
		}, {
			state: 'tab.giftPay',
			paramObj: {
				url: '/giftPay',
				nativeTransitions: {
					"type": "fade",
				},
				views: {
					gift: {
						templateUrl: 'pages/giftPay.html',
						controller: 'giftPayCtrl',
						controllerUrl: 'js/controller/giftPayCtrl.js',
						controllerAs: 'giftPay',
					}
				}

			}
		}, {
			state: 'tab.giftSelectGoods',
			paramObj: {
				url: '/giftSelectGoods',
				nativeTransitions: {
					"type": "fade",
				},
				params: {
					"giftType": null
				}, //礼包类型
				views: {
					gift: {
						templateUrl: 'pages/giftSelectGoods.html',
						controller: 'giftSelectGoodsCtrl',
						controllerUrl: 'js/controller/giftSelectGoodsCtrl.js',
						controllerAs: 'giftSelectGoods'
					}
				}
			}
		}, {
			state: 'tab.giftMygift',
			paramObj: {
				url: '/giftMygift',
				nativeTransitions: {
					"type": "fade",
				},
				views: {
					gift: {
						templateUrl: 'pages/giftMygift.html',
						controller: 'giftMygiftCtrl',
						controllerUrl: 'js/controller/giftMygiftCtrl.js',
						controllerAs: 'giftMygift'
					}
				}
			}
		}, {
			state: 'tab.giftDetails',
			paramObj: {
				url: "/giftDetails",
				nativeTransitions: {
					"type": "fade",
				},
				params: {
					"idLucky": null
				},
				views: {
					gift: {
						templateUrl: "pages/giftDetails.html",
						controller: 'giftDetailsCtrl',
						controllerUrl: 'js/controller/giftDetailsCtrl.js',
						controllerAs: 'giftDetails'
					}
				}
			}
		}, {
			state: 'tab.GiftRedPackShare',
			paramObj: {
				url: "/GiftRedPackShare",
				nativeTransitions: {
					"type": "fade",
				},
				params: {
					"result": null
				},
				views: {
					gift: {
						templateUrl: "pages/giftRedPackShare.html",
						controller: 'giftRedPackShareCtrl',
						controllerUrl: "js/controller/giftRedPackShareCtrl.js",
						controllerAs: 'packShare'
					}
				}
			}
		}, {
			state: "tab.IntegralShop",
			paramObj: {
				url: "/IntegralShop",
				nativeTransitions: {
					"type": "fade",
				},
				views: {
					user: {
						templateUrl: "pages/IntegralShop.html",
						controller: "integralShopCtrl",
						controllerUrl: 'js/controller/IntegralShopCtrl.js',
						controllerAs: 'IntegralShop'
					}
				}
			}
		}, {
			state: 'tab.welfare',
			paramObj: {
				url: '/welfare',
				nativeTransitions: {
					"type": "fade",
				},
				views: {
					user: {
						templateUrl: 'pages/welfare.html',
					}
				}
			}
		}, {
			state: 'tab.basket',
			paramObj: {
				url: '/basket',
				nativeTransitions: {
					"type": "fade",
				},
				views: {
					basket: {
						templateUrl: 'pages/basket.html',
						controller: 'basketCtrl',
						controllerUrl: 'js/controller/basketCtrl.js',
						controllerAs: 'basket'
					}
				}
			}
		}, {
			state: 'tab.user',
			paramObj: {
				url: '/user',
				nativeTransitions: {
					"type": "fade",
				},
				views: {
					user: {
						templateUrl: 'pages/user.html',
						controller: 'userCtrl',
						controllerUrl: 'js/controller/userCtrl.js',
						controllerAs: 'user'
					}
				}
			}
		}, {
			state: 'tab.userQrCode',
			paramObj: {
				url: '/userQrCode?idAppendUser&idUser',
				views: {
					user: {
						templateUrl: 'pages/userQrCode.html',
						controller: 'userQrCodeCtrl',
						controllerUrl: 'js/controller/userQrCodeCtrl.js',
						controllerAs: 'userQrCode'
					}
				}
			}
		}, {
			state: 'tab.setUp',
			paramObj: {
				url: '/setUp',
				views: {
					user: {
						templateUrl: 'pages/setUp.html',
						controller: 'setUpCtrl',
						controllerUrl: 'js/controller/setUpCtrl.js',
						controllerAs: 'setUp'
					}
				}
			}
		}, {
			state: 'tab.myProfile',
			paramObj: {
				url: '/myProfile',
				views: {
					user: {
						templateUrl: 'pages/myProfile.html',
						controller: 'myProfileCtrl',
						controllerUrl: 'js/controller/myProfileCtrl.js',
						controllerAs: 'myProfile'
					}
				}
			}
		}, {
			state: 'tab.changePhone',
			paramObj: {
				url: '/changePhone',
				views: {
					user: {
						templateUrl: 'pages/changePhone.html',
						controller: 'changePhoneCtrl',
						controllerUrl: 'js/controller/changePhoneCtrl.js',
						controllerAs: 'changePhone'
					}
				}
			}
		}, {
			state: 'tab.MyBalance',
			paramObj: {
				url: '/MyBalance',
				views: {
					user: {
						templateUrl: 'pages/MyBalance.html',
						controller: 'MyBalanceCtrl',
						controllerUrl: 'js/controller/MyBalanceCtrl.js',
						controllerAs: 'MyBalance'
					}
				}
			}
		}, {
			state: 'tab.MyIntegral',
			paramObj: {
				url: '/MyIntegral',
				views: {
					user: {
						templateUrl: 'pages/MyIntegral.html',
						controller: 'MyIntegralCtrl',
						controllerUrl: 'js/controller/MyIntegralCtrl.js',
						controllerAs: 'MyIntegral'
					}
				}
			}
		}, {
			state: 'tab.AboutIntegral',
			paramObj: {
				url: "/AboutIntegral",
				views: {
					user: {
						templateUrl: "pages/AboutIntegral.html",
					}
				}
			}
		}, {
			state: 'tab.weChatPay',
			paramObj: {
				url: '/weChatPay',
				views: {
					user: {
						templateUrl: 'pages/weChatPay.html',
						controller: 'weChatPayCtrl',
						controllerUrl: 'js/controller/weChatPayCtrl.js',
						controllerAs: 'weChatPay'
					}
				}
			}
		}, {
			state: 'tab.alipay',
			paramObj: {
				url: '/alipay',
				views: {
					user: {
						templateUrl: 'pages/alipay.html',
						controller: 'alipayCtrl',
						controllerUrl: 'js/controller/alipayCtrl.js',
						controllerAs: 'alipay'
					}
				}
			}
		}, {
			state: 'tab.eleJiaYuan',
			paramObj: {
				url: '/eleJiaYuan',
				views: {
					user: {
						templateUrl: 'pages/eleJiaYuan.html',
						controller: 'eleJiaYuanCtrl',
						controllerUrl: 'js/controller/eleJiaYuanCtrl.js',
						controllerAs: 'eleJiaYuan'
					}
				}
			}
		}, {
			state: 'tab.jiaYuanBalance',
			paramObj: {
				url: '/jiaYuanBalance',
				views: {
					user: {
						templateUrl: 'pages/jiaYuanBalance.html',
						controller: 'jiaYuanBalanceCtrl',
						controllerUrl: 'js/controller/jiaYuanBalanceCtrl.js',
						controllerAs: 'jiaYuanBalance'
					}
				}
			}
		}, {
			state: 'tab.onlineRecharge',
			paramObj: {
				url: '/onlineRecharge',
				views: {
					user: {
						templateUrl: 'pages/onlineRecharge.html',
						controller: 'onlineRechargeCtrl',
						controllerUrl: 'js/controller/onlineRechargeCtrl.js',
						controllerAs: 'onlineRecharge'
					}
				}
			}
		}, {
			state: 'tab.useRule',
			paramObj: {
				url: '/useRule',
				views: {
					user: {
						templateUrl: 'pages/useRule.html',
					}
				}
			}
		}, {
			state: 'tab.accountBalance',
			paramObj: {
				url: '/accountBalance',
				views: {
					user: {
						templateUrl: 'pages/accountBalance.html',
						controller: 'accountBalanceCtrl',
						controllerUrl: 'js/controller/accountBalanceCtrl.js',
						controllerAs: 'accountBalance'
					}
				}
			}
		}, {
			state: 'tab.myAccount',
			paramObj: {
				url: '/myAccount',
				views: {
					user: {
						templateUrl: 'pages/myAccount.html',
						controller: 'myAccountCtrl',
						controllerUrl: 'js/controller/myAccountCtrl.js',
						controllerAs: 'myAccount'
					}
				}
			}
		}, {
			state: 'tab.addressManagement',
			paramObj: {
				url: '/addressManagement',
				views: {
					user: {
						templateUrl: 'pages/addressManagement.html',
						controller: 'addressManagementCtrl',
						controllerUrl: 'js/controller/addressManagementCtrl.js',
						controllerAs: 'addressManagement'
					}
				}
			}
		}, {
			state: 'tab.notAddress',
			paramObj: {
				url: '/notAddress',
				views: {
					user: {
						templateUrl: 'pages/notAddress.html',
					}
				}
			}
		}, {
			state: 'tab.editAddrMes',
			paramObj: {
				url: '/editAddrMes?receiveName&phoneUser',
				views: {
					user: {
						templateUrl: 'pages/editAddrMes.html',
						controller: 'editAddrMesCtrl',
						controllerUrl: 'js/controller/editAddrMesCtrl.js',
						controllerAs: 'editAddrMes'
					}
				}
			}
		}, {
			state: 'tab.myProfit',
			paramObj: {
				url: '/myProfit',
				views: {
					user: {
						templateUrl: 'pages/myProfit.html',
						controller: 'myProfitCtrl',
						controllerUrl: 'js/controller/myProfitCtrl.js',
						controllerAs: 'myProfit'
					}
				}
			}
		}, {
			state: 'tab.askForInvoice',
			paramObj: {
				url: '/askForInvoice?idReceipt',
				views: {
					user: {
						templateUrl: 'pages/askForInvoice.html',
						controller: 'askForInvoiceCtrl',
						controllerUrl: 'js/controller/askForInvoiceCtrl.js',
						controllerAs: 'askForInvoice'
					}
				}
			}
		}, {
			state: 'tab.invoiceHistory',
			paramObj: {
				url: '/invoiceHistory',
				views: {
					user: {
						templateUrl: 'pages/invoiceHistory.html',
						controller: 'invoiceHistoryCtrl',
						controllerUrl: 'js/controller/invoiceHistoryCtrl.js',
						controllerAs: 'invoiceHistory'
					}
				}
			}
		}, {
			state: 'tab.accountSecurity',
			paramObj: {
				url: '/accountSecurity',
				views: {
					user: {
						templateUrl: 'pages/accountSecurity.html',
						controller: 'accountSecurityCtrl',
						controllerUrl: 'js/controller/accountSecurityCtrl.js',
						controllerAs: 'accountSecurity'
					}
				}
			}
		}, {
			state: 'tab.bindPhone',
			paramObj: {
				url: '/bindPhone',
				views: {
					user: {
						templateUrl: 'pages/bindPhone.html',
						controller: 'bindPhoneCtrl',
						controllerUrl: 'js/controller/bindPhoneCtrl.js',
						controllerAs: 'bindPhone'
					}
				}
			}
		}, {
			state: 'tab.setPassword',
			paramObj: {
				url: '/setPassword?phoneNumber',
				views: {
					user: {
						templateUrl: 'pages/setPassword.html',
						controller: 'setPasswordCtrl',
						controllerUrl: 'js/controller/setPasswordCtrl.js',
						controllerAs: 'setPassword'
					}
				}
			}
		}, {
			state: 'tab.editPassword',
			paramObj: {
				url: '/editPassword',
				views: {
					user: {
						templateUrl: 'pages/editPassword.html',
						controller: 'editPasswordCtrl',
						controllerUrl: 'js/controller/editPasswordCtrl.js',
						controllerAs: 'editPassword'
					}
				}
			}
		}, {
			state: 'tab.customerHelp',
			paramObj: {
				url: '/customerHelp',
				views: {
					user: {
						templateUrl: 'pages/customerHelp.html',
						controller: 'customerHelpCtrl',
						controllerUrl: 'js/controller/customerHelpCtrl.js',
						controllerAs: 'customerHelp'
					}
				}
			}
		}, {
			state: 'tab.cardCoupons',
			paramObj: {
				url: '/cardCoupons',
				views: {
					user: {
						templateUrl: 'pages/cardCoupons.html',
						controller: 'cardCouponsCtrl',
						controllerUrl: 'js/controller/cardCouponsCtrl.js',
						controllerAs: 'cardCoupons'
					}
				}
			}
		}, {
			state: 'tab.userFeedback',
			paramObj: {
				url: '/userFeedback',
				views: {
					user: {
						templateUrl: 'pages/userFeedback.html',
						controller: 'userFeedbackCtrl',
						controllerUrl: 'js/controller/userFeedbackCtrl.js',
						controllerAs: 'userFeedback'
					}
				}
			}
		}, {
			state: 'tab.aboutUs',
			paramObj: {
				url: '/aboutUs',
				views: {
					user: {
						templateUrl: 'pages/aboutUs.html',
						controller: 'aboutUsCtrl',
						controllerUrl: 'js/controller/aboutUsCtrl.js',
						controllerAs: 'aboutUs'
					}
				}
			}
		}, {
			state: 'tab.aboutJLB',
			paramObj: {
				url: '/aboutJLB',
				views: {
					user: {
						templateUrl: 'pages/aboutJLB.html',
					}
				}
			}
		},{
			state: 'tab.messageCenter',
			paramObj: {
				url: '/messageCenter',
				views: {
					user: {
						templateUrl: 'pages/messageCenter.html',
						controller: 'messageCenterCtrl',
						controllerUrl: 'js/controller/messageCenterCtrl.js',
						controllerAs: 'messageCenter'
					}
				}
			}
		},{
			state: 'tab.mallMessage',
			paramObj: {
				url: '/mallMessage?idMessageType',
				views: {
					user: {
						templateUrl: 'pages/mallMessage.html',
						controller: 'mallMessageCtrl',
						controllerUrl: 'js/controller/mallMessageCtrl.js',
						controllerAs: 'mallMessage'
					}
				}
			}
		},{
			state: 'tab.mallMessageDetail',
			paramObj: {
				url: '/mallMessageDetail',
				views: {
					user: {
						templateUrl: 'pages/mallMessageDetail.html',
						controller: 'mallMessageDetailCtrl',
						controllerUrl: 'js/controller/mallMessageDetailCtrl.js',
						controllerAs: 'mallMessageDetail'
					}
				}
			}
		},{
			state: 'tab.bibuMessage',
			paramObj: {
				url: '/bibuMessage?idMessageType',
				views: {
					user: {
						templateUrl: 'pages/bibuMessage.html',
						controller: 'bibuMessageCtrl',
						controllerUrl: 'js/controller/bibuMessageCtrl.js',
						controllerAs: 'bibuMessage'
					}
				}
			}
		},{
			state: 'tab.giftMessage',
			paramObj: {
				url: '/giftMessage?idMessageType',
				views: {
					user: {
						templateUrl: 'pages/giftMessage.html',
						controller: 'giftMessageCtrl',
						controllerUrl: 'js/controller/giftMessageCtrl.js',
						controllerAs: 'giftMessage'
					}
				}
			}
		},{
			state: 'tab.userFeedbackMessage',
			paramObj: {
				url: '/userFeedbackMessage?idMessageType',
				views: {
					user: {
						templateUrl: 'pages/userFeedbackMessage.html',
						controller: 'userFeedbackMessageCtrl',
						controllerUrl: 'js/controller/userFeedbackMessageCtrl.js',
						controllerAs: 'userFeedbackMessage'
					}
				}
			}
		},{
			state: 'tab.fightGroupsMessage',
			paramObj: {
				url: '/fightGroupsMessage?idMessageType',
				views: {
					user: {
						templateUrl: 'pages/fightGroupsMessage.html',
						controller: 'fightGroupsMessageCtrl',
						controllerUrl: 'js/controller/fightGroupsMessageCtrl.js',
						controllerAs: 'fightGroupsMessage'
					}
				}
			}
		},{
			state: 'tab.address',
			paramObj: {
				url: '/address',
				views: {
					user: {
						templateUrl: 'pages/address.html',
						controller: 'addressCtrl',
						controllerUrl: 'js/controller/addressCtrl.js',
						controllerAs: 'address'
					}
				}
			}
		}, {
			state: 'tab.search',
			paramObj: {
				url: '/search',
				views: {
					buy: {
						templateUrl: 'pages/search.html',
						controller: 'searchCtrl',
						controllerUrl: 'js/controller/searchCtrl.js',
						controllerAs: 'search'
					}
				}
			}
		}, {
			state: 'tab.foodDetail',
			paramObj: {
				url: '/foodDetail?idCommodity&idLoad',
				views: {
					buy: {
						templateUrl: 'pages/food_detail.html',
						controller: 'foodDetailCtrl',
						controllerUrl: 'js/controller/foodDetailCtrl.js',
						controllerAs: 'foodDetail'
					}
				}
			}
		}, {
			state: 'tab.bibuSelection',
			paramObj: {
				url: '/bibuSelection',
				views: {
					home: {
						templateUrl: 'pages/bibuSelection.html',
						controller: 'bibuSelectionCtrl',
						controllerUrl: 'js/controller/bibuSelectionCtrl.js',
						controllerAs: 'bibuSLC'
					}
				}
			}
		}, {
			state: 'tab.rechargePolite',
			paramObj: {
				url: '/rechargePolite',
				views: {
					home: {
						templateUrl: 'pages/rechargePolite.html',
						controller: 'rechargePoliteCtrl',
						controllerUrl: 'js/controller/rechargePoliteCtrl.js',
						controllerAs: 'rechargePolite'
					}
				}
			}
		}, {
			state: 'tab.rechargeConfirmation',
			paramObj: {
				url: '/rechargeConfirmation?idGiftDetail',
				views: {
					home: {
						templateUrl: 'pages/rechargeConfirmation.html',
						controller: 'rechargeConfirmationCtrl',
						controllerUrl: 'js/controller/rechargeConfirmationCtrl.js',
						controllerAs: 'rechargeConfirmation'
					}
				}
			}
		}, {
			state: 'tab.freshDynamic',
			paramObj: {
				url: '/freshDynamic',
				views: {
					home: {
						templateUrl: 'pages/freshDynamic.html',
						controller: 'freshDynamicCtrl',
						controllerUrl: 'js/controller/freshDynamicCtrl.js',
						controllerAs: 'freshDynamic'
					}
				}
			}
		}, {
			state: 'tab.freshDynamicDetail',
			paramObj: {
				url: '/freshDynamicDetail?idDynamic',
				views: {
					home: {
						templateUrl: 'pages/freshDynamicDetail.html',
						controller: 'freshDynamicDetailCtrl',
						controllerUrl: 'js/controller/freshDynamicDetailCtrl.js',
						controllerAs: 'freshDynamicDetail'
					}
				}
			}
		}, {
			state: 'tab.feedbackRecord',
			paramObj: {
				url: '/feedbackRecord',
				views: {
					home: {
						templateUrl: 'pages/feedbackRecord.html',
						controller: 'feedbackRecordCtrl',
						controllerUrl: 'js/controller/feedbackRecordCtrl.js',
						controllerAs: 'feedbackRecord'
					}
				}
			}
		},   {
			state: 'tab.share',
			paramObj: {
				url: '/share',
				views: {
					home: {
						templateUrl: 'pages/share.html',
						controller: 'shareCtrl',
						controllerUrl: 'js/controller/shareCtrl.js',
						controllerAs: 'share'
					}
				}
			}
		}, {
			state: 'tab.userOrder',
			paramObj: {
				url: '/userOrder',
				views: {
					user: {
						templateUrl: 'pages/userOrder.html',
						controller: 'userOrderCtrl',
						controllerUrl: 'js/controller/userOrderCtrl.js',
						controllerAs: 'userOrder'
					}
				}
			}
		}, {
			state: 'tab.userOrderDetail',
			paramObj: {
				url: '/userOrderDetail?shipState&orderID',
				views: {
					user: {
						templateUrl: 'pages/userOrderDetail.html',
						controller: 'userOrderDetailCtrl',
						controllerUrl: 'js/controller/userOrderDetailCtrl.js',
						controllerAs: 'orderDetail'
					}
				}
			}
		}, {
			state: 'tab.receivingInfo',
			paramObj: {
				url: '/receivingInfo?orderID',
				views: {
					user: {
						templateUrl: 'pages/receivingInfo.html',
						controller: 'receivingInfoCtrl',
						controllerUrl: 'js/controller/receivingInfoCtrl.js',
						controllerAs: 'receivingInfo'
					}
				}
			}
		}, {
			state: 'tab.groupIndex',
			paramObj: {
				url: '/groupIndex',
				views: {
					user: {
						templateUrl: 'pages/groupIndex.html',
						controller: 'groupIndexCtrl',
						controllerUrl: 'js/controller/groupIndexCtrl.js',
						controllerAs: 'groupIndex'
					}
				}
			}
		}, {
			state: 'tab.groupDetail',
			paramObj: {
				url: '/groupDetail',
				views: {
					user: {
						templateUrl: 'pages/groupDetail.html',
						controller: 'groupDetailCtrl',
						controllerUrl: 'js/controller/groupDetailCtrl.js',
						controllerAs: 'groupDetail'
					}
				}
			}
		}, {
			state: 'tab.groupBeforePay',
			paramObj: {
				url: '/groupBeforePay',
				views: {
					user: {
						templateUrl: 'pages/groupBeforePay.html',
						controller: 'groupBeforePayCtrl',
						controllerUrl: 'js/controller/groupBeforePayCtrl.js',
						controllerAs: 'groupBeforePay'
					}
				}
			}
		}, {
			state: 'tab.groupPay',
			paramObj: {
				url: '/groupPay',
				views: {
					user: {
						templateUrl: 'pages/groupPay.html',
						controller: 'groupPayCtrl',
						controllerUrl: 'js/controller/groupPayCtrl.js',
						controllerAs: 'groupPay'
					}
				}
			}
		}, {
			state: 'tab.groupWaiting',
			paramObj: {
				url: '/groupWaiting',
				views: {
					user: {
						templateUrl: 'pages/groupWaiting.html',
						controller: 'groupWaitingCtrl',
						controllerUrl: 'js/controller/groupWaitingCtrl.js',
						controllerAs: 'groupWaiting'
					}
				}
			}
		}, {
      state: 'tab.basketDeduction',
      paramObj: {
        url: '/foodDetail?deductions',
        views: {
          buy: {
            templateUrl: 'pages/basketDeduction.html',
            controller: 'basketDeductionCtrl',
            controllerUrl: 'js/controller/basketDeductionCtrl.js',
            controllerAs: 'basketD'
          }
        }
      }
    } ,{
			state: 'tab.payDemo',
			paramObj: {
				url: '/payDemo',
				views: {
					user: {
						templateUrl: 'pages/payDemo.html',
						controller: 'payDemoCtrl',
						controllerUrl: 'js/controller/payDemoCtrl.js',
						controllerAs: 'payDemo'
					}
				}
			}
		}];

		angular.forEach(pageData, function(item) {
			$stateProvider.state(item.state, item.paramObj);
		});
		//  $locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise("/tab/home");

	}])

})