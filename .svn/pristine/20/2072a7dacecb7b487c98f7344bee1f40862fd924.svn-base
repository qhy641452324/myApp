(function(wid, dcm) {
  var win = wid;
  var doc = dcm;
  var hasInstance = false;

  function $id(id) {
    return doc.getElementById(id);
  }

  function $class(name) {
    return doc.getElementsByClassName(name);
  }

  function loop(begin, length, fuc) {
    for(var i = begin; i < length; i++) {
      if(fuc(i)) break;
    }
  }

  function on(action, selector, callback) {
    doc.addEventListener(action, function(e) {
      if(selector == e.target.tagName.toLowerCase() || selector == e.target.className || selector == e.target.id) {
        callback(e);
      }
    })
  }

  function singleSelector(config) {
    this.input = config.input;
    this.container = config.container;
    this.type = config.type;
    this.param = (config.type == 1) ? [1, 1, 1, 1, 1] : config.param;
    this.beginTime = config.beginTime;
    this.endTime = config.endTime;
    this.recentTime = config.recentTime;
    this.success = config.success;
    this.beforeInputClick = config.beforeInputClick;
    this.afterOrMor = config.afterOrMor;
    this.timeAll = Array.prototype.slice.call(config.timeAll, 0);
    this.ulCount = 0;
    this.ulDomArr = [];
    this.idxArr = [];
    this.staticClass=config.staticClass;
    this.liHeight = wid.lib ? parseInt(doc.getElementsByTagName('HTML')[0].style.fontSize) * 1 : 40;
    this.maxHeight = [];
    this.distance = [];
    this.start = {
      Y: 0,
      time: ''
    };
    this.move = {
      Y: 0,
      speed: []
    };
    this.end = {
      Y: 0,
      index: 0
    };
    this.resultArr = [];
    this.initDomFuc();
    this.initReady();
    this.initBinding();
  }

  singleSelector.prototype = {
    constructor: singleSelector,
    checkParam: function() {
      var idxArr = [];
      var _this = this;
      this.ulCount = this.timeAll.length;
      loop(0, _this.ulCount, function(i) {
        _this.idxArr.push(i);
      });
    },
    checkTimeArr: function(arr1, arr2, length) {
      var checkStatus = true;
      loop(0, length, function(i) {
        if(arr1[i] != arr2[i]) checkStatus = false;
      });
      return checkStatus;
    },
    initDomFuc: function() {
      var _this = this;
      this.checkParam();
      var html = '';
      html += '<div class="date-selector-bg" id="date-selector-bg-' + _this.container + '">' +
        '<div  class="date-selector-container '+_this.staticClass+'" id="date-selector-container-' + _this.container + '">' +
        '<div class="date-selector-btn-box">' +
        '<div class="date-selector-btn button button-clear button-stable" id="date-selector-btn-cancel">返回</div>';
      html += '<div class="date-selector-btn button button-clear button-assertive" id="date-selector-btn-save-' + _this.container + '">确定</div>' +
        '</div>' +
        '<div class="date-selector-content">';
      loop(0, _this.idxArr.length, function(i) {
        html += '<div class="date-selector date-selector-left">' +
          '<ul id="date-selector-' + _this.container + '-' + _this.idxArr[i] + '"></ul>' +
          '</div>';
      });
      html += '<div class="date-selector-up-shadow"></div>' +
        '<div class="date-selector-down-shadow"></div>' +
        '<div class="date-selector-line"></div>' +
        '</div>';
      html += '</div></div>';
      if(!!!$id(_this.container)){
        var containerElement=document.createElement("div");
        containerElement.id=_this.container;
        document.body.appendChild(containerElement);
      }
      $id(_this.container).innerHTML = html;
      loop(0, _this.ulCount, function(i) {
        $id('date-selector-container-' + _this.container).querySelectorAll(".date-selector")[i].style.width = (100 / _this.ulCount).toFixed(2) + '%';
      });
    },
    initReady: function() {
      var _this = this;
      var realIdx = 0;
      loop(0, _this.ulCount, function(i) {
        realIdx = _this.idxArr[i];
        var min = 0;
        var max = 0;
        var tempDomUl = $id('date-selector-' + _this.container + '-' + _this.idxArr[i]);
        var tempArray = _this['array' + _this.idxArr[i]] = [];
        _this.initCommonArr(tempDomUl, tempArray, 0, _this.timeAll[i].length - 1, '', i);
        tempDomUl.addEventListener('touchstart', function() {
          _this.touch(event, _this, tempDomUl, _this['array' + _this.idxArr[i]], i);
        }, false);
        tempDomUl.addEventListener('touchmove', function() {
          _this.touch(event, _this, tempDomUl, _this['array' + _this.idxArr[i]], i);
        }, false);
        tempDomUl.addEventListener('touchend', function() {
          _this.touch(event, _this, tempDomUl, _this['array' + _this.idxArr[i]], i);
        }, true);
      });
    },
    initBinding: function() {
      var _this = this;
      var bg = $id('date-selector-bg-' + _this.container);
      var container = $id('date-selector-container-' + _this.container);
      var body = doc.body;
      var inputElement = _this.input;
      inputElement.addEventListener("click", function() {
        bg.classList.add('date-selector-bg-up', 'date-selector-bg-delay');
        container.classList.add('date-selector-container-up');
        body.classList.add('date-selector-locked');
        if(hasInstance) {
        /*  _this.beforeInputClick(_this);
          loop(0, _this.ulCount, function(i) {
            var tempDomUl = $id('date-selector-' + _this.container + '-' + _this.idxArr[i]);
            var res = _this.recentTime[i];
            tempDomUl.style.transform = 'translate3d(0,-' + _this.liHeight * (res) + 'px, 0)';
            tempDomUl.style.webkitTransform = 'translate3d(0,-' + _this.liHeight * (res) + 'px, 0)';
          });*/
        }
        loop(0, _this.ulCount, function(i) {
          _this.resultArr[i] = _this['array' + i][_this.recentTime[i] + 2];
        });
        hasInstance = true;
      });

      on('touchstart', 'date-selector-btn-save-' + _this.container, function() {
        _this.success(_this.resultArr.slice(0, 3),_this.recentTime);
        bg.classList.remove('date-selector-bg-up');
        container.classList.remove('date-selector-container-up');
        setTimeout(function() {
          bg.classList.remove('date-selector-bg-delay');
        }, 350);
        body.classList.remove('date-selector-locked');
      }, false);

      on('touchstart', 'date-selector-bg-' + _this.container, function() {
        bg.classList.remove('date-selector-bg-up');
        container.classList.remove('date-selector-container-up');
        setTimeout(function() {
          bg.classList.remove('date-selector-bg-delay');
        }, 350);
        body.classList.remove('date-selector-locked');
      }, false);

      on('touchstart', 'date-selector-btn-cancel', function() {
        bg.classList.remove('date-selector-bg-up');
        container.classList.remove('date-selector-container-up');
        setTimeout(function() {
          bg.classList.remove('date-selector-bg-delay');
        }, 350);
        body.classList.remove('date-selector-locked');
      }, false);

      on('touchstart', 'date-selector-tab date-selector-' + _this.container + '-tab', function(event) {
        var tab = container.getElementsByClassName('date-selector-tab');
        var content = container.getElementsByClassName('date-selector-content');
        loop(0, tab.length, function(i) {
          tab[i].classList.remove('date-selector-tab-active');
        });
        event.target.classList.add('date-selector-tab-active');
        content[0].classList.add('date-selector-content-left');
        content[1].classList.remove('date-selector-content-right');
      }, false);
    },
    initCommonArr: function(tempDomUl, tempArr, min, max, str, idx) {
      var _this = this;
      var Html = '';
      loop(min, max + 1, function(i) {
        tempArr[i] = _this.timeAll[idx][i];
      });
      _this.maxHeight[idx]=_this.liHeight * (max - min);
      var res = _this.recentTime[idx];
      tempArr.unshift('', '');
      tempArr.push('', '');
      tempDomUl.style.transform = 'translate3d(0,-' + this.liHeight * (res) + 'px, 0)';
      tempDomUl.style.webkitTransform = 'translate3d(0,-' + this.liHeight * (res) + 'px, 0)';
      _this.distance[idx] = this.liHeight * (res - 4);
      loop(0, tempArr.length, function(j) {
        Html += '<li>' + tempArr[j] + (tempArr[j] === '' ? '' : str) + '</li>';
      });
      tempDomUl.innerHTML = Html;
    },
    initPosition: function(dis, max, idx) {
      dis = dis < 0 ? 0 : dis;
      dis = dis > max ? max : dis;
      var sub = dis % this.liHeight;
      if(sub < this.liHeight / 2) {
        this.distance[idx] = dis - sub;
      } else {
        this.distance[idx] = dis + (this.liHeight - sub);
      }
      return this;
    },
    initSpeed: function(arr, dir, max, idx) {
      var variance = 0;
      var sum = 0;
      for(var i in arr) {
        sum += arr[i] - 0;
      }
      for(var j in arr) {
        variance += (arr[j] - (sum / arr.length)) * (arr[j] - (sum / arr.length));
      }
      var rate = 0;
      if((variance / arr.length).toFixed(2) > .1) {
        rate = max > this.liHeight * 15 ? dir * 2 : 0;
        this.initPosition(this.distance[idx] + rate, max, idx);
        this.move.speed[0] = .2;
      } else {
        this.initPosition(this.distance[idx], max, idx);
        this.move.speed[0] = this.move.speed[0] > 0.2 ? .2 : this.move.speed[0];
      }
      return this;
    },
    touch: function(event, that, $selector, array, idx) {
      event = event || window.event;
      event.preventDefault();
      switch(event.type) {
        case "touchstart":
          that.move.speed = [];
          that.start.Y = event.touches[0].clientY;
          that.start.time = Date.now();
          break;
        case "touchend":
          that.end.Y = event.changedTouches[0].clientY;
          var tempDis = that.distance[idx] + (that.start.Y - that.end.Y);
          that.distance[idx] = tempDis < 0 ? 0 : (tempDis < that.maxHeight[idx] ? tempDis : that.maxHeight[idx]);
          that.initSpeed(that.move.speed, that.start.Y - that.end.Y, that.maxHeight[idx], idx);
          var tempRes = that.end.index = that.distance[idx] / that.liHeight + 2;
          $selector.style.transform = 'translate3d(0,-' + that.distance[idx] + 'px, 0)';
          $selector.style.webkitTransform = 'translate3d(0,-' + that.distance[idx] + 'px, 0)';
          $selector.style.transition = 'transform ' + that.move.speed[0] + 's ease-out';
          $selector.style.webkitTransition = '-webkit-transform ' + that.move.speed[0] + 's ease-out';
          that.resultArr[idx] = array[tempRes];
          !isNaN(tempRes)&&(that.recentTime[idx] = tempRes-2);
          if(idx == 0){
            that.recentTime[1] = 0;
            if(tempRes == 2 && !that.afterOrMor) {
              that.timeAll[1] = ["16", "17", "18"];
            }else {
              that.timeAll[1] = ["07", "08", "09", "10", "11", "16", "17", "18"];
            }
            var tempDomUl = $id('date-selector-' + that.container + '-' + that.idxArr[1]);
            var tempArray = that['array' + that.idxArr[1]] = [];
            that.initCommonArr(tempDomUl, tempArray, 0, that.timeAll[1].length - 1, '', 1);
            that.resultArr[1] = that.timeAll[1][that.recentTime[1]];   
          }
          break;
        case "touchmove":
          event.preventDefault();
          that.move.Y = event.touches[0].clientY;
          var offset = that.start.Y - that.move.Y;
          if(that.distance[idx] == 0 && offset < 0) {
            $selector.style.transform = 'translate3d(0,' + 1.5 * that.liHeight + 'px, 0)';
            $selector.style.webkitTransform = 'translate3d(0,' + 1.5 * that.liHeight + 'px, 0)';
            $selector.style.transition = 'transform 0.3s ease-out';
            $selector.style.webkitTransition = '-webkit-transform 0.3s ease-out';
          } else {
            $selector.style.transform = 'translate3d(0,-' + (offset + that.distance[idx]) + 'px, 0)';
            $selector.style.webkitTransform = 'translate3d(0,-' + (offset + that.distance[idx]) + 'px, 0)';
          }
          if(this.distance[idx] <= -that.maxHeight[idx]) {
            $selector.style.transform = 'translate3d(0, -' + that.liHeight + 'px, 0)';
            $selector.style.webkitTransform = 'translate3d(0, -' + that.liHeight + 'px, 0)';
            $selector.style.transition = 'transform 0.3s ease-out';
            $selector.style.webkitTransition = '-webkit-transform 0.3s ease-out';
          }
          if(Math.abs(offset).toFixed(0) % 5 === 0) {
            var time = Date.now();
            that.move.speed.push((Math.abs(offset) / (time - that.start.time)).toFixed(2));
          }
          break;
      }
    }
  };
  if(typeof exports == "object") {
    module.exports = singleSelector;
  } else if(typeof define == "function" && define.amd) {
    define([], function() {
      return singleSelector;
    })
  } else {
    win.singleSelector = singleSelector;
  }
})(window, document);