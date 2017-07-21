define(['app', 'service/exHttpService', 'commonService', "service/popupService"], function(app) {
  app.register.service("orderAPI", OrderAPI);

  OrderAPI.$inject = ['$q', 'exHttp', 'commonMethod','publicToast'];

  function OrderAPI($q, exHttp, commonMethod,publicToast) {
    return {
      selectUserAddrMgr: selectUserAddrMgr, 
      setOrderRecordRequireTime:setOrderRecordRequireTime,//选择地址
      getUserOrderList: getUserOrderList, //获取历史订单
      getOrderdetails: getOrderdetails, //获取订单详情
      updateOrderByLucky: updateOrderByLucky, //保存地址信息
      checkAddressType: checkAddressType, //地址类型中文文本
      timeListToLocalObj: timeListToLocalObj, //本地化timelist
      submitOrder:submitOrder,//结账
      cancelOrder:cancelOrder,//取消订单
      modOrderStatus:modOrderStatus //修改订单
    }

    function selectUserAddrMgr(idUserAddrMgr) {
      var def = $q.defer();
      exHttp.init({
        url: 'user_mgr/select_user_addr_mgr2',
        method: 'post',
        loading: 'circle',
        params: {
          idUserAddrMgr: idUserAddrMgr
        },
        loginTimeOut: true,
      }).then(function(response) {
        var addressData = response.returnData;
        def.resolve(addressData);
      });
      return def.promise;
    }
    
    function setOrderRecordRequireTime(idUserAddrMgr,requireTime,ship_type){
      var def = $q.defer();
      exHttp.init({
        url: 'user_order/setOrderRecordRequireTime',
        method: 'post',
        loading: 'circle',
        params: {
          idUserAddrMgr:idUserAddrMgr||'',
          requireTime:requireTime||'',
       //   ship_type:ship_type||''
        },
        loginTimeOut: true,
      }).then(function(response) {
        def.resolve(response);
      });
      return def.promise;      
    }
    

    function getUserOrderList(begin, cache,sortType) {
      var def = $q.defer();
      exHttp.init({
        url: 'user_order/get_user_order_list',
        method: 'post',
        cache: !!cache,
        params: {
          begin: begin,
          length: 20,
          shipState:sortType.shipState,
          isOnline:sortType.isOnline
        }
      }).then(function(response) {
        var result = {};
        var orders = response.returnData.order_list;
        console.log(orders);
        if(orders.length < 20) {
          //分页是否加载完
          result.hasToTheEnd = true;
        } else {
          result.hasToTheEnd = false;
        }
        //根据订单类型sorting
        for(var i in orders) {
          orders[i].orderTimeStruct = commonMethod.getFormatDay(orders[i].orderTimeMill, true);
          orders[i].confirmTimeStruct = commonMethod.getFormatDay(orders[i].confirmTimeMill, true);
          orders[i].requireTimeStruct = commonMethod.getFormatDay(orders[i].requireTimeMill, true);
          checkOrderType(orders[i].orderType, orders[i]);
        /*  switch(orders[i].shipState) {
            //未完成
            case 0:
            case 1:
            case 2:
            case 3:
            case 11:
            case 12:
              result.unfinished.push(orders[i]);
              break;
              //已完成  
            case 4:
              result.finished.push(orders[i]);
              break;
            default:
              break;
          }*/
        }
        result.orders=orders;
        def.resolve(result);
      });
      return def.promise;
    }

    function getOrderdetails(idOrder, selectAddrMgr, localAddressTypeCH) {
      var def = $q.defer();
      exHttp.init({
        url: 'user_order/get_orderdetails',
        method: 'post',
        loading: 'circle',
        params: {
          idOrder: idOrder,
          begin: 0,
          length: 1000
        },
        loginTimeOut: true,
      }).then(function(response) {
        var allData = response.returnData;
        var nominalDefaultAddress;
        checkOrderType(allData.order_record.orderType, allData);
        if(localAddressTypeCH) { //是否本地化ordertype '地址类型:家庭1、公司2、其它3'
            var usefulAddress=[];//合法的非默认地址
            allData.user_add_list.forEach(function(item) {
            checkAddressType(item.addType, item);
            if(item.defaultState==0){
              nominalDefaultAddress=item;
            }else if(item.addDesc!="请更新送货地址"){
              usefulAddress.push(item);
            }
          });
        }
        if(selectAddrMgr) { //是否获取用户默认收货信息
          privteTimeLocalStringCH();
          var orderId=0;
          if(!!!nominalDefaultAddress&&usefulAddress&&usefulAddress[0]){
            nominalDefaultAddress=usefulAddress[0];
          }          
          if(allData.order_record.userAddrMgr&&allData.order_record.userAddrMgr.idUserAddrMgr){
            orderId=allData.order_record.userAddrMgr.idUserAddrMgr;
          }
          selectUserAddrMgr(allData.order_record.userAddrMgr.idUserAddrMgr).then(function(result) {
            allData.userAddr = result;
            if(!result.userAddrMgr) {
              allData.userAddr.userAddrMgr=nominalDefaultAddress;
            }
            nominalDefaultAddress&&checkAddressType(allData.userAddr.userAddrMgr.addType, allData.userAddr.userAddrMgr);
            def.resolve(allData);
          });
        } else {
          def.resolve(allData);
        }

        function privteTimeLocalStringCH() {
          if(!!allData.order_record.orderTimeMill) {
            var otm = commonMethod.getFormatDay(allData.order_record.orderTimeMill, true);
            allData.order_record.otm = otm; //下单时间
            allData.orderTimeCH = otm.year + '-' + otm.month + '-' + otm.date + '\t' + otm.h + ':' + otm.m;
          }
          if(!!allData.order_record.requireTimeMill) {
            var rtm = commonMethod.getFormatDay(allData.order_record.requireTimeMill, true);
            allData.order_record.rtm = rtm; //用户要求的收菜时间            
            allData.requireTimeCH = rtm.year + '-' + rtm.month + '-' + rtm.date + '\t' + rtm.h + ':' + rtm.m;
          } else {
            
          }
        }
      }, function(error) {
        def.reject(error);
      });
      return def.promise;
    }

    function updateOrderByLucky(idOrder, requireTime, idUserAddrMgr) {
      var def = $q.defer();
      var params = {
        idOrder: idOrder,
        requireTime: requireTime,
        idUserAddrMgr: idUserAddrMgr
      };
      exHttp.init({
        url: 'lucky_p/update_order_by_lucky',
        method: 'post',
        loading: 'circle',
        params: params,
        loginTimeOut: true,
      }).then(function(response) {
        def.resolve(response.returnData);
      });
      return def.promise;
    }

    function timeListToLocalObj(timeList) {
      var patternCH = /[\u4e00-\u9fa5]+/g;
      var defaultRequiredTime;
      var index;
      timeList = Array.prototype.slice.call(timeList, 0);
      for(var i in timeList) {
        timeList[i].todayFragmentCH = timeList[i].show_require_time.match(patternCH) || '';
        timeList[i].dayFragmentCH = commonMethod.getFormatDay(timeList[i].send_require_time, true);
        if(timeList[i].is_check_require_time == "0") {
          defaultRequiredTime = timeList[i];
          index = i;
        }
        if(i == timeList.length - 1 && index == undefined) {
          defaultRequiredTime = timeList[0];
          index = 0;
        }
      }
      return {
        timeList: timeList, //当前订单可选的收货日
        defaultRequiredTime: defaultRequiredTime, //初始化时显示的收货日
        index: index
      }; //defaultRequiredTime在timeList中的位置
    }

    function checkOrderType(type, targetObj) {
      switch(eval(type)) {
        case 0:
          targetObj.orderTypeCH = "普通";
          break;
        case 1:
          targetObj.orderTypeCH = "团购（线上）";
          break;
        case 2:
          targetObj.orderTypeCH = "团购（线下）";
          break;
        case 3:
          targetObj.orderTypeCH = "预购";
          break;
        case 4:
          targetObj.orderTypeCH = "礼包";
          break;
        case 5:
          targetObj.orderTypeCH = "礼券";
          break;
        case 6:
          targetObj.orderTypeCH = "补单";
          break;
        default:
          targetObj.orderTypeCH = "普通";
          break;
      }
    }

    function checkAddressType(type, targetObj) {
      switch(eval(type)) {
        case 1:
          targetObj.selectedAddressType = "[家庭]";
          break;
        case 2:
          targetObj.selectedAddressType = "[公司]";
          break;
        case 3:
          targetObj.selectedAddressType = "[其它]";
          break;
      }
    }
    
    function submitOrder(idUserAddrMgr,requireTime,exchangeTicketNumber,conPayType,payType,isDeductionTicket,orderRemark){
      var def = $q.defer();
      var params = {
        channelType: 2,
        idUserAddrMgr: idUserAddrMgr,
        requireTime: requireTime,
        exchangeTicketNumber:exchangeTicketNumber,
        conPayType:conPayType,
        payType:payType,
        isDeductionTicket:isDeductionTicket,
        orderRemark:orderRemark
      };
      exHttp.init({
        url: 'user_order/submit_order',
        method: 'post',
        loading: 'circle',
        params: params,
        loginTimeOut: true,
      }).then(function(response) {
        def.resolve(response.returnData);
      });
      return def.promise;      
    }
    
    function cancelOrder(idOrder){
      var def = $q.defer();
      exHttp.init({
        url: 'user_order/cancel_order',
        method: 'post',
        loading: 'circle',
        params:{
          idOrder:idOrder
        },
        loginTimeOut: true,
      }).then(function(response) {
        def.resolve(response.returnData);
        publicToast.show('订单取消成功！');
      });
      return def.promise;           
    }
    
    function modOrderStatus(idOrder){
      var def = $q.defer();
      exHttp.init({
        url: 'user_order/mod_order_status',
        method: 'post',
        loading: 'circle',
        params:{
          idOrder:idOrder
        },
        loginTimeOut: true,
      }).then(function(response) {
        var d=response.returnData.unfinish_order;
        if(d&&d.idOrder>0){
          def.resolve(response.returnData);
        }else{
          publicToast.show('订单不存在！');
          def.reject(response.returnData);
        }
      });
      return def.promise;        
    }
    
  }
})