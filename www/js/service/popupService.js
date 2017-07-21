define(['app'], function(app) {
  (function(app) {
    app.register.service("popupAPI", PopupAPI);

    PopupAPI.$inject = ['$ionicPopup'];

    function PopupAPI($ionicPopup) {
      var defaults = {
        cancelText: "取消",
        cancelType: null,
        okText: "确定",
        okType: 'button-positive',
        inputType: null,
        defaultText: null,
        inputPlaceholder: null,
        imgUrl: 'img/1.png',
        title: '温馨提示',
        titleContent: null,
      }
      return {
        popupShow: popupShow,
        popupAlert: popupAlert,
        popupconfirm: popupconfirm,
        popupShowCode:popupShowCode,
        popupCautionWithoutCallback:popupCautionWithoutCallback,
        popupSuccessWithoutCallback:popupSuccessWithoutCallback
      }

      function popupShow(opts, fn1, fn2) {
        opts = angular.extend({}, defaults, opts);
        $ionicPopup.show({
          template: '<img src="' + opts.imgUrl + '"/><p class="title">' + opts.title + '</p><p class="titleContent">' + opts.titleContent + '</p><input ng-model="opts.defaultText" type="' + opts.inputType + '"  placeholder="' + opts.inputPlaceholder + '"/>',
          buttons: [{
            text: opts.cancelText,
            type: opts.cancelType,
            onTap: fn1
          }, {
            text: opts.okText,
            type: opts.okType,
            onTap: fn2
          }]
        });
      }
			 function popupShowCode(opts, fn1, fn2) {
        opts = angular.extend({}, defaults, opts);
        $ionicPopup.show({
          template: '<img src="' + opts.imgUrl + '"/><p class="title">' + opts.title + '</p><p class="titleContent">' + opts.titleContent + '</p><input style="width:60%;" ng-model="opts.defaultText" type="' + opts.inputType + '"  placeholder="' + opts.inputPlaceholder + '"/><span style="background:#333333;margin-left:3%;padding:0.3rem;color:#ffffff;" ng-model="opts.codeNumber">'+ opts.codeNumber +'</span>',
          buttons: [{
            text: opts.cancelText,
            type: opts.cancelType,
            onTap: fn1
          }, {
            text: opts.okText,
            type: opts.okType,
            onTap: fn2
          }]
        });
      }
      function popupAlert(opts, fn1) {
        opts = angular.extend({}, defaults, opts);
        $ionicPopup.show({
          template: '<img src="' + opts.imgUrl + '"/><p class="title">' + opts.title + '</p><p class="titleContent">' + opts.titleContent + '</p>',
          buttons: [{
            text: opts.okText,
            type: opts.okType,
            onTap: fn1
          }]
        });
      }

      function popupconfirm(opts, fn1, fn2) {
        opts = angular.extend({}, defaults, opts);
        $ionicPopup.show({
          template: '<img src="' + opts.imgUrl + '"/><p class="title">' + opts.title + '</p><p class="titleContent">' + opts.titleContent + '</p>',
          buttons: [{
            text: opts.cancelText,
            type: opts.cancelType,
            onTap: fn1
          }, {
            text: opts.okText,
            type: opts.okType,
            onTap: fn2
          }]
        });
      }

      function popupCautionWithoutCallback(text) {
        popupAlert({
            imgUrl: '../img/caution-icon.png',
            title: '温馨提示',
            titleContent: text
          },
          function() {});
      }

      function popupSuccessWithoutCallback(title,text) {
        popupAlert({
            imgUrl: '../img/1.png',
            title: title,
            titleContent: text
          },
          function() {});
      }

    }
  })(app)
})
/*http://www.jialebao.cc*/