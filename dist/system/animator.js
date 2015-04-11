System.register([], function (_export) {
  var _classCallCheck, _createClass, CssAnimator;

  return {
    setters: [],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      CssAnimator = (function () {
        function CssAnimator() {
          _classCallCheck(this, CssAnimator);

          this.animationStack = [];
        }

        _createClass(CssAnimator, [{
          key: 'addMultipleEventListener',
          value: function addMultipleEventListener(el, s, fn) {
            var evts = s.split(' '),
                i,
                ii;

            for (i = 0, ii = evts.length; i < ii; ++i) {
              el.addEventListener(evts[i], fn, false);
            }
          }
        }, {
          key: 'addAnimationToStack',
          value: function addAnimationToStack(animId) {
            if (this.animationStack.indexOf(animId) < 0) {
              this.animationStack.push(animId);
            }
          }
        }, {
          key: 'removeAnimationFromStack',
          value: function removeAnimationFromStack(animId) {
            var idx = this.animationStack.indexOf(animId);
            if (idx > -1) {
              this.animationStack.splice(idx, 1);
            }
          }
        }, {
          key: 'move',
          value: function move() {
            return Promise.resolve(false);
          }
        }, {
          key: 'enter',
          value: function enter(element) {
            var _this = this;

            return new Promise(function (resolve, reject) {
              var animId = element.toString() + Math.random(),
                  classList = element.classList;

              classList.add('au-enter');

              var animStart;
              _this.addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function (evAnimStart) {
                evAnimStart.stopPropagation();

                _this.addAnimationToStack(animId);

                var animEnd;
                _this.addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function (evAnimEnd) {
                  evAnimEnd.stopPropagation();

                  classList.remove('au-enter-active');
                  classList.remove('au-enter');

                  _this.removeAnimationFromStack(animId);

                  evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

                  resolve(true);
                }, false);

                evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
              }, false);

              classList.add('au-enter-active');

              setTimeout(function () {
                if (_this.animationStack.indexOf(animId) < 0) {
                  classList.remove('au-enter-active');
                  classList.remove('au-enter');

                  resolve(false);
                }
              }, 400);
            });
          }
        }, {
          key: 'leave',
          value: function leave(element) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
              var animId = element.toString() + Math.random(),
                  classList = element.classList;

              classList.add('au-leave');

              var animStart;
              _this2.addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function (evAnimStart) {
                evAnimStart.stopPropagation();

                _this2.addAnimationToStack(animId);

                var animEnd;
                _this2.addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function (evAnimEnd) {
                  evAnimEnd.stopPropagation();

                  classList.remove('au-leave-active');
                  classList.remove('au-leave');

                  _this2.removeAnimationFromStack(animId);

                  evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

                  resolve(true);
                }, false);

                evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
              }, false);

              classList.add('au-leave-active');

              setTimeout(function () {
                if (_this2.animationStack.indexOf(animId) < 0) {
                  classList.remove('au-leave-active');
                  classList.remove('au-leave');

                  resolve(false);
                }
              }, 400);
            });
          }
        }, {
          key: 'removeClass',
          value: function removeClass(element, className) {
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
                evAnimStart.stopPropagation();

                _this3.addAnimationToStack(animId);

                var animEnd;
                _this3.addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function (evAnimEnd) {
                  evAnimEnd.stopPropagation();

                  classList.remove(className + '-remove');

                  _this3.removeAnimationFromStack(animId);

                  evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

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
              }, 400);
            });
          }
        }, {
          key: 'addClass',
          value: function addClass(element, className) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
              var animId = element.toString() + className + Math.random(),
                  classList = element.classList;

              var animStart;
              _this4.addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = function (evAnimStart) {
                evAnimStart.stopPropagation();

                _this4.addAnimationToStack(animId);

                var animEnd;
                _this4.addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = function (evAnimEnd) {
                  evAnimEnd.stopPropagation();

                  classList.add(className);

                  classList.remove(className + '-add');

                  _this4.removeAnimationFromStack(animId);

                  evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

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
              }, 400);
            });
          }
        }]);

        return CssAnimator;
      })();

      _export('CssAnimator', CssAnimator);
    }
  };
});