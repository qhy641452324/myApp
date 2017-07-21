define(['app', 'simplePicker', "service/orderService"], function(app, singleSelector) {  
  app.register.directive("dirUncorrelatedPicker", UncorrelatedPicker);
  app.register.controller("orderPublic", OrderPublic);

  UncorrelatedPicker.$inject = ['$controller'];//选择收菜时间

  function UncorrelatedPicker($controller) {
    return {
      restrict: 'A',
      scope: {
        recentTime: '=bindRecentTime',
        afterOrMor: '=bindAfterOrMor',
        timeStr: '=bindTimeStr',
        submitTime: '=bindSubmitTime',
        yearIndex: '=bindYearIndex',
      },
      link: function(scope, $element, attrs, ctrl) {
        var element = $element[0];
        var newHours, newMinutes;
        attrs.$observe("pickerDay", createSelector);

        function createSelector(newDays) {
          if(newDays.length) {
            var recentTime = angular.copy(scope.recentTime);
            if(!parseFloat(scope.afterOrMor) && recentTime[0] == 0) {
              newHours = ["16", "17", "18"];
            } else {
              newHours = ["07", "08", "09", "10", "11", "16", "17", "18"];
            }
            newDays = JSON.parse(newDays);
            newMinutes = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
              "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"
            ];
            var singleSelectorInstance = new singleSelector({
              input: element,
              container: attrs["targetId"],
              staticClass: attrs["staticClass"] || "",
              recentTime: recentTime,
              afterOrMor: scope.afterOrMor,
              timeAll: {
                0: newDays,
                1: newHours,
                2: newMinutes,
                length: 3
              },
              success: function(arr, recentTime) {
                console.log(arr);
                scope.yearIndex = newDays.indexOf(arr[0]);
                arr[0] = arr[0] || newDays[recentTime[0]];
                arr[1] = arr[1] || newHours[recentTime[1]];
                arr[2] = arr[2] || newMinutes[recentTime[2]];
                scope.recentTime = angular.copy(recentTime);
                scope.timeStr = arr[0] + "\t" + arr[1] + ":" + arr[2] + "前后30分钟内";
                var numberPattern = /[^0-9]+/g;
                var tempArr = arr[0].split('-');
                for(var i in tempArr) {
                  var a = tempArr[i].replace(numberPattern, '');
                  tempArr[i] = a;
                }
                Array.prototype.push.apply(tempArr, [arr[1], arr[2]]);
                scope.submitTime = tempArr;
                scope.$parent.$digest();
                if(attrs["targetId"] == "receiveTimeOnBasketPage") {
                  ctrl.processSubmitData(false, true);
                }
              },
              beforeInputClick: function(that) {
                //  that.recentTime=angular.copy(scope.recentTime);
              }
            });
          }
        }
      },
      controller: 'orderPublic',
    }
  }

  OrderPublic.$inject = ['$scope', 'orderAPI', 'commonMethod', '$ionicModal', '$q', 'popupAPI','$state'];

  function OrderPublic($scope, orderAPI, commonMethod, $ionicModal, $q,popupAPI,$state) {
    var vm = this;
    var selectedYear;
    var orderRequiredTime = [];
    vm.submitReceivingInfo = $scope.submitReceivingInfo = submitReceivingInfo; //提交修改
    vm.updateAddressOnlyInView = $scope.updateAddressOnlyInView = updateAddressOnlyInView; //更新地址        
    vm.initData = initData;
    vm.processSubmitData = processSubmitData;
    vm.changeOrder = changeOrder;
    vm.cancelOrder = cancelOrder;
    vm.selectAnAddress=selectAnAddress;
    $scope.downToCtrlHierarchy = {//作用域共享对象
      selectedAddressId: null,
      submitTimeArray: []
    };
    $scope.userAddr={};

    function initData() {
      var def = $q.defer();
      orderAPI.getOrderdetails($scope.idOrder, true, true)
        .then(function(result) {
          $scope.afterOrMor = result.after_or_mor;
          $scope.userAddList = result.user_add_list;
          if(result.userAddr&&!!result.userAddr.userAddrMgr) {
            $scope.userAddr = result.userAddr;
            $scope.downToCtrlHierarchy.selectedAddressId = $scope.userAddr.userAddrMgr.idUserAddrMgr;
          }else{
            $scope.userAddr.userAddrMgr = {addDesc:"请更新送货地址"};
            $scope.downToCtrlHierarchy.selectedAddressId=-1;
          } 
          $scope.orderRecord = result.order_record;
          timeListAndRequiredTime(result.time_list);
          timeListStrProcessBeforePicker();
          $scope.userAddList = result.user_add_list;
          actionSheetAddress();
          def.resolve(result);
        }, function(error) {
          def.reject(error);
        });
      return def.promise;
    }

    function submitReceivingInfo() {
      var submitTime=processSubmitData(true, false);
      if(submitTime){
        orderAPI.updateOrderByLucky($scope.idOrder,submitTime, $scope.downToCtrlHierarchy.selectedAddressId).then(function(result) {
          $scope.$ionicGoBack();
        });        
      }
    }

    function processSubmitData(longStr, inAnIsolateDirectiveCallback,actionIsBasketSubmit) {
      var activescope;
      if(inAnIsolateDirectiveCallback) {
        activescope = $scope.$parent;
      } else {
        activescope = $scope;
      }
      $scope.yearIndex = ($scope.yearIndex < 0) ? 0 : $scope.yearIndex;
      selectedYear = activescope.timeList[$scope.yearIndex].send_require_time.slice(0, 4);
      var requireTime = selectedYear + '-' + activescope.downToCtrlHierarchy.submitTimeArray[0] + '-' + activescope.downToCtrlHierarchy.submitTimeArray[1] + ' ' + activescope.downToCtrlHierarchy.submitTimeArray[2] + ':' + activescope.downToCtrlHierarchy.submitTimeArray[3];
      if(longStr) {
        requireTime += (':' + '00');
      }
      if(actionIsBasketSubmit&&requireTime.search(/undefined/) >= 0) {
        popupAPI.popupCautionWithoutCallback('请选择收菜时间。');
        return false;
      }
      if(inAnIsolateDirectiveCallback) {
        orderAPI.setOrderRecordRequireTime(activescope.downToCtrlHierarchy.selectedAddressId, requireTime);
      }
      return requireTime;
    }

    function timeListAndRequiredTime(timeList) {
      var obj = orderAPI.timeListToLocalObj(timeList);
      $scope.timeList = obj.timeList;
      if(!!obj.defaultRequiredTime) {
        var defaultRequiredTime = obj.defaultRequiredTime;
        $scope.yearIndex = obj.timeList.indexOf(defaultRequiredTime);
        selectedYear = defaultRequiredTime.dayFragmentCH.year;
        if($scope.orderRecord.requireTimeMill) {
          var time = new Date($scope.orderRecord.requireTimeMill);
          defaultRequiredTime.timeObj = commonMethod.getFormatDay(time, true);
          $scope.defaultRequiredTime = defaultRequiredTime;
          $scope.requiredTimeStr = vm.requiredTimeStr = ($scope.defaultRequiredTime.todayFragmentCH[0] ? $scope.defaultRequiredTime.todayFragmentCH[0] : '') + $scope.defaultRequiredTime.dayFragmentCH.month + "-" + $scope.defaultRequiredTime.dayFragmentCH.date + $scope.defaultRequiredTime.dayFragmentCH.dayCH + "\t" + $scope.defaultRequiredTime.timeObj.h + ":" + $scope.defaultRequiredTime.timeObj.m + "前后30分钟内";
          $scope.downToCtrlHierarchy.submitTimeArray = [$scope.defaultRequiredTime.timeObj.month, $scope.defaultRequiredTime.timeObj.date, $scope.defaultRequiredTime.timeObj.h, $scope.defaultRequiredTime.timeObj.m];
          //  console.log($scope.downToCtrlHierarchy.submitTimeArray);   
        } else {
          $scope.requiredTimeStr = vm.requiredTimeStr = "12:30前下单，可选择当日送达!";
        }
        recentTimeForTimePicker();
      }

      //初始化timepicker的参数
      function recentTimeForTimePicker() {
        var hourArr;
        var indexDay = parseInt(obj.index),
          indexHour, indexMinute;
        var afterOrMor = parseFloat($scope.afterOrMor);
        if(!isNaN(afterOrMor) && afterOrMor === 0 && indexDay == 0) {
          hourArr = ["16", "17", "18"];
        } else {
          hourArr = ["07", "08", "09", "10", "11", "16", "17", "18"];
        }
        var minuteArr = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"];
        if($scope.defaultRequiredTime) {
          indexHour = hourArr.indexOf($scope.defaultRequiredTime.timeObj.h);
          indexMinute = minuteArr.indexOf($scope.defaultRequiredTime.timeObj.m);
        } else {
          indexHour = 0;
          indexMinute = 30;
        }
        $scope.recentTime = [indexDay, indexHour, indexMinute];
        orderRequiredTime = [indexDay, indexHour, indexMinute];
      }
    }

    function timeListStrProcessBeforePicker() {
      var displayedTimeStrList = [];
      for(var i in $scope.timeList) {
        var item = $scope.timeList[i]
        item.displayedTimeStr = (!!item.todayFragmentCH ? item.todayFragmentCH[0] : '') + item.dayFragmentCH.month + "-" + item.dayFragmentCH.date + item.dayFragmentCH.dayCH;
        displayedTimeStrList.push(item.displayedTimeStr);
      }
      $scope.displayedTimeStrList = displayedTimeStrList;
    }

    function actionSheetAddress() {
      $ionicModal.fromTemplateUrl('template/addressSelectorList.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });
    }

    function updateAddressOnlyInView(save) {
      if(save) {
        orderAPI.setOrderRecordRequireTime($scope.downToCtrlHierarchy.selectedAddressId).then(function(result) {
          selectAnAddress();
        });
      } else {
        selectAnAddress();
      }

      function selectAnAddress() {
        for(var i in $scope.userAddList) {
          if($scope.userAddList[i].idUserAddrMgr == $scope.downToCtrlHierarchy.selectedAddressId) {
            if(!!!$scope.userAddr) {
              $scope.userAddr = {};
            }
            $scope.userAddr.userAddrMgr = angular.copy($scope.userAddList[i]);
            break;
          }
        }
        $scope.modal.hide();
      }
    }
    
    function changeOrder(e, order) {
      e.stopPropagation();
      e.preventDefault();
      var opts = {
        title: "您确定修改订单吗？",
        titleContent: "确定后此订单的货款将退到您的账户"
      }
      popupAPI.popupconfirm(opts,function(){},function() {
        orderAPI.modOrderStatus(order.idOrder)
        .then(function(result) {
          sessionStorage.setItem("unfinishOrderId",order.idOrder);
          $state.go('tab.basket');           
        });        
      });     
    }

    function cancelOrder(e, item, list) {
      e.stopPropagation();
      e.preventDefault();
      var opts = {
        title: "您确定取消订单吗？",
        titleContent: "确定后此订单的货款将退到您的账户"
      }
      popupAPI.popupconfirm(opts,function(){},function() {
        orderAPI.cancelOrder(item.idOrder)
        .then(function(result) {
          if(angular.isArray(list)){
            for(var i in list) {
              if(list[i].idOrder == item.idOrder) {
                list.splice(i, 1);
              }
            }            
          }else{
            $state.go("tab.buy");
          }   
        });        
      });
    }
        
    function selectAnAddress(){
      if($scope.downToCtrlHierarchy.selectedAddressId<=0){
        $state.go("tab.addressManagement");
        return ;
      }
      $scope.modal.show(); 
    }
  }

});