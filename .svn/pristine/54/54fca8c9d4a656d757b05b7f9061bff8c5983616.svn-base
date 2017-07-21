(function(angular) {
  angular.module("appDecorator", [])
    .decorator('ionSideMenuDirective', ResponsableWith)//ionSideMenu宽度适应
/*<ion-side-menu  width="sideMenu" responsive>
  </ion-side-menu>
 *@width,使用数字保持ionic原api，值为"sideMenu"时，且具备responsive属性
 * 可以使sidemenu在第一次进入页面时调整宽度
 */
  ResponsableWith.$inject = ['$delegate'];
  function ResponsableWith($delegate) {
    var directive = $delegate[0];
    var complileFn = directive.compile;
    directive.compile = function(tElement, tAttrs) {
      if(Object.prototype.hasOwnProperty.call(tAttrs, 'responsive')) {
        if(tAttrs.width == 'sideMenu') {
          var winWidth =ionic.viewWidth;//根据屏幕宽度，调整ionSideMenu的宽度
          var proportion;
          if(winWidth < 380) {
            proportion = 0.27;
          } else if(winWidth < 450) {
            proportion = 0.25;
          } else {
            proportion = 0.2;
          }
          tAttrs.width = winWidth * proportion;
        }
      }
      var link = complileFn.apply(this, [tElement, tAttrs]);
      return function(scope, elem, attrs) {
        link.apply(this, arguments);
      };
    };
    return $delegate;
  }
})(angular);