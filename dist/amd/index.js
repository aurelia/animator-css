define(['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var CssAnimator = (function () {
    function CssAnimator() {
      _classCallCheck(this, CssAnimator);

      this.animationStack = [];

      this.useAnimationDoneClasses = false;
      this.animationEnteredClass = 'au-entered';
      this.animationLeftClass = 'au-left';
      this.isAnimating = false;

      this.animationTimeout = 50;
    }

    CssAnimator.prototype.addMultipleEventListener = function addMultipleEventListener(el, s, fn) {
      var evts = s.split(' '),
          i,
          ii;

      for (i = 0, ii = evts.length; i < ii; ++i) {
        el.addEventListener(evts[i], fn, false);
      }
    };

    CssAnimator.prototype.addAnimationToStack = function addAnimationToStack(animId) {
      if (this.animationStack.indexOf(animId) < 0) {
        this.animationStack.push(animId);
      }
    };

    CssAnimator.prototype.removeAnimationFromStack = function removeAnimationFromStack(animId) {
      var idx = this.animationStack.indexOf(animId);
      if (idx > -1) {
        this.animationStack.splice(idx, 1);
      }
    };

    CssAnimator.prototype.getElementAnimationDelay = function getElementAnimationDelay(element) {
      var styl = window.getComputedStyle(element);
      var prop, delay;

      if (styl.getPropertyValue('animation-delay')) {
        prop = 'animation-delay';
      } else if (styl.getPropertyValue('-webkit-animation-delay')) {
        prop = '-webkit-animation-delay';
      } else if (styl.getPropertyValue('-moz-animation-delay')) {
        prop = '-moz-animation-delay';
      } else {
        return 0;
      }
      delay = styl.getPropertyValue(prop);
      delay = Number(delay.replace(/[^\d\.]/g, ''));

      return delay * 1000;
    };

    CssAnimator.prototype.move = function move() {
      return Promise.resolve(false);
    };

    CssAnimator.prototype.enter = function enter(element) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var animId = element.toString() + Math.random(),
            classList = element.classList;

        var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.enterBegin, { bubbles: true, cancelable: true, detail: element });
        document.dispatchEvent(evt);

        if (_this.useAnimationDoneClasses) {
          classList.remove(_this.animationEnteredClass);
          classList.remove(_this.animationLeftClass);
        }

        classList.add('au-enter');

        var animStart;
        _this.addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function (evAnimStart) {
          _this.isAnimating = true;

          var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.enterActive, { bubbles: true, cancelable: true, detail: element });
          document.dispatchEvent(evt);

          evAnimStart.stopPropagation();

          _this.addAnimationToStack(animId);

          var animEnd;
          _this.addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function (evAnimEnd) {
            evAnimEnd.stopPropagation();

            classList.remove('au-enter-active');
            classList.remove('au-enter');

            _this.removeAnimationFromStack(animId);

            evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

            if (_this.useAnimationDoneClasses && _this.animationEnteredClass !== undefined && _this.animationEnteredClass !== null) {
              classList.add(_this.animationEnteredClass);
            }

            _this.isAnimating = false;
            var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.enterDone, { bubbles: true, cancelable: true, detail: element });
            document.dispatchEvent(evt);
            resolve(true);
          }, false);

          evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
        }, false);

        var parent = element.parentElement,
            delay = 0;

        if (parent !== null && parent !== undefined && parent.classList.contains('au-stagger')) {
          var elemPos = Array.prototype.indexOf.call(parent.childNodes, element);
          delay = _this.getElementAnimationDelay(parent) * elemPos;

          var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.staggerNext, { bubbles: true, cancelable: true, detail: element });
          document.dispatchEvent(evt);

          setTimeout(function () {
            classList.add('au-enter-active');
          }, delay);
        } else {
          classList.add('au-enter-active');
        }

        setTimeout(function () {
          if (_this.animationStack.indexOf(animId) < 0) {
            classList.remove('au-enter-active');
            classList.remove('au-enter');

            var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.enterTimeout, { bubbles: true, cancelable: true, detail: element });
            document.dispatchEvent(evt);
            resolve(false);
          }
        }, _this.getElementAnimationDelay(element) + _this.animationTimeout + delay);
      });
    };

    CssAnimator.prototype.leave = function leave(element) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var animId = element.toString() + Math.random(),
            classList = element.classList;

        var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.leaveBegin, { bubbles: true, cancelable: true, detail: element });
        document.dispatchEvent(evt);

        if (_this2.useAnimationDoneClasses) {
          classList.remove(_this2.animationEnteredClass);
          classList.remove(_this2.animationLeftClass);
        }

        classList.add('au-leave');

        var animStart;
        _this2.addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function (evAnimStart) {
          _this2.isAnimating = true;

          var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.leaveActive, { bubbles: true, cancelable: true, detail: element });
          document.dispatchEvent(evt);

          evAnimStart.stopPropagation();

          _this2.addAnimationToStack(animId);

          var animEnd;
          _this2.addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function (evAnimEnd) {
            evAnimEnd.stopPropagation();

            classList.remove('au-leave-active');
            classList.remove('au-leave');

            _this2.removeAnimationFromStack(animId);

            evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

            if (_this2.useAnimationDoneClasses && _this2.animationLeftClass !== undefined && _this2.animationLeftClass !== null) {
              classList.add(_this2.animationLeftClass);
            }

            _this2.isAnimating = false;
            var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.leaveDone, { bubbles: true, cancelable: true, detail: element });
            document.dispatchEvent(evt);
            resolve(true);
          }, false);

          evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
        }, false);

        var parent = element.parentElement,
            delay = 0;

        if (parent !== null && parent !== undefined && parent.classList.contains('au-stagger')) {
          var elemPos = Array.prototype.indexOf.call(parent.childNodes, element);
          delay = _this2.getElementAnimationDelay(parent) * elemPos;

          var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.staggerNext, { bubbles: true, cancelable: true, detail: element });
          document.dispatchEvent(evt);

          setTimeout(function () {
            classList.add('au-leave-active');
          }, delay);
        } else {
          classList.add('au-leave-active');
        }

        setTimeout(function () {
          if (_this2.animationStack.indexOf(animId) < 0) {
            classList.remove('au-leave-active');
            classList.remove('au-leave');

            var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.leaveTimeout, { bubbles: true, cancelable: true, detail: element });
            document.dispatchEvent(evt);
            resolve(false);
          }
        }, _this2.getElementAnimationDelay(element) + _this2.animationTimeout + delay);
      });
    };

    CssAnimator.prototype.removeClass = function removeClass(element, className) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var classList = element.classList;

        if (!classList.contains(className)) {
          resolve(false);
          return;
        }

        var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.removeClassBegin, { bubbles: true, cancelable: true, detail: element });
        document.dispatchEvent(evt);

        var animId = element.toString() + className + Math.random();

        classList.remove(className);

        var animStart;
        _this3.addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function (evAnimStart) {
          _this3.isAnimating = true;

          evAnimStart.stopPropagation();

          _this3.addAnimationToStack(animId);

          var animEnd;
          _this3.addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function (evAnimEnd) {
            evAnimEnd.stopPropagation();

            classList.remove(className + '-remove');

            _this3.removeAnimationFromStack(animId);

            evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

            _this3.isAnimating = false;
            var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.removeClassDone, { bubbles: true, cancelable: true, detail: element });
            document.dispatchEvent(evt);
            resolve(true);
          }, false);

          evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
        }, false);

        classList.add(className + '-remove');

        setTimeout(function () {
          if (_this3.animationStack.indexOf(animId) < 0) {
            classList.remove(className + '-remove');
            classList.remove(className);

            var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.removeClassTimeout, { bubbles: true, cancelable: true, detail: element });
            document.dispatchEvent(evt);
            resolve(false);
          }
        }, _this3.getElementAnimationDelay(element) + _this3.animationTimeout);
      });
    };

    CssAnimator.prototype.addClass = function addClass(element, className) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var animId = element.toString() + className + Math.random(),
            classList = element.classList;

        var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.addClassBegin, { bubbles: true, cancelable: true, detail: element });
        document.dispatchEvent(evt);

        var animStart;
        _this4.addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function (evAnimStart) {
          _this4.isAnimating = true;

          evAnimStart.stopPropagation();

          _this4.addAnimationToStack(animId);

          var animEnd;
          _this4.addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function (evAnimEnd) {
            evAnimEnd.stopPropagation();

            classList.add(className);

            classList.remove(className + '-add');

            _this4.removeAnimationFromStack(animId);

            evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

            _this4.isAnimating = false;
            var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.addClassDone, { bubbles: true, cancelable: true, detail: element });
            document.dispatchEvent(evt);
            resolve(true);
          }, false);

          evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
        }, false);

        classList.add(className + '-add');

        setTimeout(function () {
          if (_this4.animationStack.indexOf(animId) < 0) {
            classList.remove(className + '-add');
            classList.add(className);

            var evt = new window.CustomEvent(_aureliaTemplating.animationEvent.addClassTimeout, { bubbles: true, cancelable: true, detail: element });
            document.dispatchEvent(evt);
            resolve(false);
          }
        }, _this4.getElementAnimationDelay(element) + _this4.animationTimeout);
      });
    };

    return CssAnimator;
  })();

  exports.CssAnimator = CssAnimator;

  function configure(aurelia, cb) {
    var animator = aurelia.container.get(CssAnimator);
    _aureliaTemplating.Animator.configureDefault(aurelia.container, animator);
    if (typeof cb === 'function') {
      cb(animator);
    }
  }
});