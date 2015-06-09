System.register([], function (_export) {
  'use strict';

  var CssAnimator;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [],
    execute: function () {
      CssAnimator = (function () {
        function CssAnimator() {
          _classCallCheck(this, CssAnimator);

          this.animationStack = [];

          this.useAnimationDoneClasses = false;
          this.animationEnteredClass = 'au-entered';
          this.animationLeftClass = 'au-left';
          this.isAnimating = false;
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

            if (_this.useAnimationDoneClasses) {
              classList.remove(_this.animationEnteredClass);
              classList.remove(_this.animationLeftClass);
            }

            classList.add('au-enter');

            var animStart;
            _this.addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function (evAnimStart) {
              _this.isAnimating = true;

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
                resolve(true);
              }, false);

              evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
            }, false);

            var parent = element.parentElement,
                delay = 0;

            if (parent !== null && parent !== undefined && parent.classList.contains('au-stagger')) {
              var elemPos = Array.prototype.indexOf.call(parent.childNodes, element);
              delay = _this.getElementAnimationDelay(parent) * elemPos;

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

                resolve(false);
              }
            }, _this.getElementAnimationDelay(element) + 400 + delay);
          });
        };

        CssAnimator.prototype.leave = function leave(element) {
          var _this2 = this;

          return new Promise(function (resolve, reject) {
            var animId = element.toString() + Math.random(),
                classList = element.classList;

            if (_this2.useAnimationDoneClasses) {
              classList.remove(_this2.animationEnteredClass);
              classList.remove(_this2.animationLeftClass);
            }

            classList.add('au-leave');

            var animStart;
            _this2.addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function (evAnimStart) {
              _this2.isAnimating = true;

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
                resolve(true);
              }, false);

              evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
            }, false);

            var parent = element.parentElement,
                delay = 0;

            if (parent !== null && parent !== undefined && parent.classList.contains('au-stagger')) {
              var elemPos = Array.prototype.indexOf.call(parent.childNodes, element);
              delay = _this2.getElementAnimationDelay(parent) * elemPos;

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

                resolve(false);
              }
            }, _this2.getElementAnimationDelay(element) + 400 + delay);
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
                resolve(true);
              }, false);

              evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
            }, false);

            classList.add(className + '-remove');

            setTimeout(function () {
              if (_this3.animationStack.indexOf(animId) < 0) {
                classList.remove(className + '-remove');
                classList.remove(className);

                resolve(false);
              }
            }, _this3.getElementAnimationDelay(element) + 400);
          });
        };

        CssAnimator.prototype.addClass = function addClass(element, className) {
          var _this4 = this;

          return new Promise(function (resolve, reject) {
            var animId = element.toString() + className + Math.random(),
                classList = element.classList;

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
                resolve(true);
              }, false);

              evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
            }, false);

            classList.add(className + '-add');

            setTimeout(function () {
              if (_this4.animationStack.indexOf(animId) < 0) {
                classList.remove(className + '-add');
                classList.add(className);

                resolve(false);
              }
            }, _this4.getElementAnimationDelay(element) + 400);
          });
        };

        return CssAnimator;
      })();

      _export('CssAnimator', CssAnimator);
    }
  };
});