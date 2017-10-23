'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CssAnimator = undefined;
exports.configure = configure;

var _aureliaTemplating = require('aurelia-templating');

var _aureliaPal = require('aurelia-pal');



var CssAnimator = exports.CssAnimator = function () {
  function CssAnimator() {
    

    this.useAnimationDoneClasses = false;
    this.animationEnteredClass = 'au-entered';
    this.animationLeftClass = 'au-left';
    this.isAnimating = false;

    this.verifyKeyframesExist = true;
  }

  CssAnimator.prototype._addMultipleEventListener = function _addMultipleEventListener(el, s, fn) {
    var evts = s.split(' ');
    for (var i = 0, ii = evts.length; i < ii; ++i) {
      el.addEventListener(evts[i], fn, false);
    }
  };

  CssAnimator.prototype._removeMultipleEventListener = function _removeMultipleEventListener(el, s, fn) {
    var evts = s.split(' ');
    for (var i = 0, ii = evts.length; i < ii; ++i) {
      el.removeEventListener(evts[i], fn, false);
    }
  };

  CssAnimator.prototype._getElementAnimationDelay = function _getElementAnimationDelay(element) {
    var styl = _aureliaPal.DOM.getComputedStyle(element);
    var prop = void 0;
    var delay = void 0;

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

  CssAnimator.prototype._getElementAnimationNames = function _getElementAnimationNames(element) {
    var styl = _aureliaPal.DOM.getComputedStyle(element);
    var prefix = void 0;

    if (styl.getPropertyValue('animation-name')) {
      prefix = '';
    } else if (styl.getPropertyValue('-webkit-animation-name')) {
      prefix = '-webkit-';
    } else if (styl.getPropertyValue('-moz-animation-name')) {
      prefix = '-moz-';
    } else {
      return [];
    }

    var animationNames = styl.getPropertyValue(prefix + 'animation-name');
    return animationNames ? animationNames.split(' ') : [];
  };

  CssAnimator.prototype._performSingleAnimate = function _performSingleAnimate(element, className) {
    var _this = this;

    this._triggerDOMEvent(_aureliaTemplating.animationEvent.animateBegin, element);

    return this.addClass(element, className, true).then(function (result) {
      _this._triggerDOMEvent(_aureliaTemplating.animationEvent.animateActive, element);

      if (result !== false) {
        return _this.removeClass(element, className, true).then(function () {
          _this._triggerDOMEvent(_aureliaTemplating.animationEvent.animateDone, element);
        });
      }

      return false;
    }).catch(function () {
      _this._triggerDOMEvent(_aureliaTemplating.animationEvent.animateTimeout, element);
    });
  };

  CssAnimator.prototype._triggerDOMEvent = function _triggerDOMEvent(eventType, element) {
    var evt = _aureliaPal.DOM.createCustomEvent(eventType, { bubbles: true, cancelable: true, detail: element });
    _aureliaPal.DOM.dispatchEvent(evt);
  };

  CssAnimator.prototype._animationChangeWithValidKeyframe = function _animationChangeWithValidKeyframe(animationNames, prevAnimationNames) {
    var newAnimationNames = animationNames.filter(function (name) {
      return prevAnimationNames.indexOf(name) === -1;
    });

    if (newAnimationNames.length === 0) {
      return false;
    }

    if (!this.verifyKeyframesExist) {
      return true;
    }

    var keyframesRuleType = window.CSSRule.KEYFRAMES_RULE || window.CSSRule.MOZ_KEYFRAMES_RULE || window.CSSRule.WEBKIT_KEYFRAMES_RULE;

    var styleSheets = document.styleSheets;

    try {
      for (var i = 0; i < styleSheets.length; ++i) {
        var cssRules = null;

        try {
          cssRules = styleSheets[i].cssRules;
        } catch (e) {}

        if (!cssRules) {
          continue;
        }

        for (var j = 0; j < cssRules.length; ++j) {
          var cssRule = cssRules[j];

          if (cssRule.type === keyframesRuleType) {
            if (newAnimationNames.indexOf(cssRule.name) !== -1) {
              return true;
            }
          }
        }
      }
    } catch (e) {}

    return false;
  };

  CssAnimator.prototype.animate = function animate(element, className) {
    var _this2 = this;

    if (Array.isArray(element)) {
      return Promise.all(element.map(function (el) {
        return _this2._performSingleAnimate(el, className);
      }));
    }

    return this._performSingleAnimate(element, className);
  };

  CssAnimator.prototype.runSequence = function runSequence(animations) {
    var _this3 = this;

    this._triggerDOMEvent(_aureliaTemplating.animationEvent.sequenceBegin, null);

    return animations.reduce(function (p, anim) {
      return p.then(function () {
        return _this3.animate(anim.element, anim.className);
      });
    }, Promise.resolve(true)).then(function () {
      _this3._triggerDOMEvent(_aureliaTemplating.animationEvent.sequenceDone, null);
    });
  };

  CssAnimator.prototype._stateAnim = function _stateAnim(element, direction, doneClass) {
    var _this4 = this;

    var auClass = 'au-' + direction;
    var auClassActive = auClass + '-active';
    return new Promise(function (resolve, reject) {
      var classList = element.classList;

      _this4._triggerDOMEvent(_aureliaTemplating.animationEvent[direction + 'Begin'], element);

      if (_this4.useAnimationDoneClasses) {
        classList.remove(_this4.animationEnteredClass);
        classList.remove(_this4.animationLeftClass);
      }

      classList.add(auClass);
      var prevAnimationNames = _this4._getElementAnimationNames(element);

      var _animStart = void 0;
      var animHasStarted = false;
      _this4._addMultipleEventListener(element, 'webkitAnimationStart animationstart', _animStart = function animStart(evAnimStart) {
        if (evAnimStart.target !== element) {
          return;
        }
        animHasStarted = true;
        _this4.isAnimating = true;

        _this4._triggerDOMEvent(_aureliaTemplating.animationEvent[direction + 'Active'], element);

        evAnimStart.stopPropagation();

        evAnimStart.target.removeEventListener(evAnimStart.type, _animStart);
      }, false);

      var _animEnd = void 0;
      _this4._addMultipleEventListener(element, 'webkitAnimationEnd animationend', _animEnd = function animEnd(evAnimEnd) {
        if (!animHasStarted) {
          return;
        }
        if (evAnimEnd.target !== element) {
          return;
        }

        evAnimEnd.stopPropagation();

        classList.remove(auClassActive);
        classList.remove(auClass);

        evAnimEnd.target.removeEventListener(evAnimEnd.type, _animEnd);

        if (_this4.useAnimationDoneClasses && doneClass !== undefined && doneClass !== null) {
          classList.add(doneClass);
        }

        _this4.isAnimating = false;
        _this4._triggerDOMEvent(_aureliaTemplating.animationEvent[direction + 'Done'], element);

        resolve(true);
      }, false);

      var parent = element.parentElement;
      var attrib = 'data-animator-pending' + direction;

      var cleanupAnimation = function cleanupAnimation() {
        var animationNames = _this4._getElementAnimationNames(element);
        if (!_this4._animationChangeWithValidKeyframe(animationNames, prevAnimationNames)) {
          classList.remove(auClassActive);
          classList.remove(auClass);

          _this4._removeMultipleEventListener(element, 'webkitAnimationEnd animationend', _animEnd);
          _this4._removeMultipleEventListener(element, 'webkitAnimationStart animationstart', _animStart);

          _this4._triggerDOMEvent(_aureliaTemplating.animationEvent[direction + 'Timeout'], element);
          resolve(false);
        }
        parent && parent.setAttribute(attrib, +(parent.getAttribute(attrib) || 1) - 1);
      };

      if (parent !== null && parent !== undefined && (parent.classList.contains('au-stagger') || parent.classList.contains('au-stagger-' + direction))) {
        var offset = +(parent.getAttribute(attrib) || 0);
        parent.setAttribute(attrib, offset + 1);
        var delay = _this4._getElementAnimationDelay(parent) * offset;
        _this4._triggerDOMEvent(_aureliaTemplating.animationEvent.staggerNext, element);

        setTimeout(function () {
          classList.add(auClassActive);
          cleanupAnimation();
        }, delay);
      } else {
        classList.add(auClassActive);
        cleanupAnimation();
      }
    });
  };

  CssAnimator.prototype.enter = function enter(element) {
    return this._stateAnim(element, 'enter', this.animationEnteredClass);
  };

  CssAnimator.prototype.leave = function leave(element) {
    return this._stateAnim(element, 'leave', this.animationLeftClass);
  };

  CssAnimator.prototype.removeClass = function removeClass(element, className) {
    var _this5 = this;

    var suppressEvents = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    return new Promise(function (resolve, reject) {
      var classList = element.classList;

      if (!classList.contains(className) && !classList.contains(className + '-add')) {
        resolve(false);
        return;
      }

      if (suppressEvents !== true) {
        _this5._triggerDOMEvent(_aureliaTemplating.animationEvent.removeClassBegin, element);
      }

      if (classList.contains(className + '-add')) {
        classList.remove(className + '-add');
        classList.add(className);
      }

      classList.remove(className);
      var prevAnimationNames = _this5._getElementAnimationNames(element);

      var _animStart2 = void 0;
      var animHasStarted = false;
      _this5._addMultipleEventListener(element, 'webkitAnimationStart animationstart', _animStart2 = function animStart(evAnimStart) {
        if (evAnimStart.target !== element) {
          return;
        }
        animHasStarted = true;
        _this5.isAnimating = true;

        if (suppressEvents !== true) {
          _this5._triggerDOMEvent(_aureliaTemplating.animationEvent.removeClassActive, element);
        }

        evAnimStart.stopPropagation();

        evAnimStart.target.removeEventListener(evAnimStart.type, _animStart2);
      }, false);

      var _animEnd2 = void 0;
      _this5._addMultipleEventListener(element, 'webkitAnimationEnd animationend', _animEnd2 = function animEnd(evAnimEnd) {
        if (!animHasStarted) {
          return;
        }
        if (evAnimEnd.target !== element) {
          return;
        }

        if (!element.classList.contains(className + '-remove')) {
          resolve(true);
        }

        evAnimEnd.stopPropagation();

        classList.remove(className);

        classList.remove(className + '-remove');

        evAnimEnd.target.removeEventListener(evAnimEnd.type, _animEnd2);

        _this5.isAnimating = false;

        if (suppressEvents !== true) {
          _this5._triggerDOMEvent(_aureliaTemplating.animationEvent.removeClassDone, element);
        }

        resolve(true);
      }, false);

      classList.add(className + '-remove');

      var animationNames = _this5._getElementAnimationNames(element);
      if (!_this5._animationChangeWithValidKeyframe(animationNames, prevAnimationNames)) {
        classList.remove(className + '-remove');
        classList.remove(className);

        _this5._removeMultipleEventListener(element, 'webkitAnimationEnd animationend', _animEnd2);
        _this5._removeMultipleEventListener(element, 'webkitAnimationStart animationstart', _animStart2);

        if (suppressEvents !== true) {
          _this5._triggerDOMEvent(_aureliaTemplating.animationEvent.removeClassTimeout, element);
        }

        resolve(false);
      }
    });
  };

  CssAnimator.prototype.addClass = function addClass(element, className) {
    var _this6 = this;

    var suppressEvents = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    return new Promise(function (resolve, reject) {
      var classList = element.classList;

      if (suppressEvents !== true) {
        _this6._triggerDOMEvent(_aureliaTemplating.animationEvent.addClassBegin, element);
      }

      if (classList.contains(className + '-remove')) {
        classList.remove(className + '-remove');
        classList.remove(className);
      }

      var _animStart3 = void 0;
      var animHasStarted = false;
      _this6._addMultipleEventListener(element, 'webkitAnimationStart animationstart', _animStart3 = function animStart(evAnimStart) {
        if (evAnimStart.target !== element) {
          return;
        }
        animHasStarted = true;
        _this6.isAnimating = true;

        if (suppressEvents !== true) {
          _this6._triggerDOMEvent(_aureliaTemplating.animationEvent.addClassActive, element);
        }

        evAnimStart.stopPropagation();

        evAnimStart.target.removeEventListener(evAnimStart.type, _animStart3);
      }, false);

      var _animEnd3 = void 0;
      _this6._addMultipleEventListener(element, 'webkitAnimationEnd animationend', _animEnd3 = function animEnd(evAnimEnd) {
        if (!animHasStarted) {
          return;
        }
        if (evAnimEnd.target !== element) {
          return;
        }

        if (!element.classList.contains(className + '-add')) {
          resolve(true);
        }

        evAnimEnd.stopPropagation();

        classList.add(className);

        classList.remove(className + '-add');

        evAnimEnd.target.removeEventListener(evAnimEnd.type, _animEnd3);

        _this6.isAnimating = false;

        if (suppressEvents !== true) {
          _this6._triggerDOMEvent(_aureliaTemplating.animationEvent.addClassDone, element);
        }

        resolve(true);
      }, false);

      var prevAnimationNames = _this6._getElementAnimationNames(element);

      classList.add(className + '-add');

      var animationNames = _this6._getElementAnimationNames(element);
      if (!_this6._animationChangeWithValidKeyframe(animationNames, prevAnimationNames)) {
        classList.remove(className + '-add');
        classList.add(className);

        _this6._removeMultipleEventListener(element, 'webkitAnimationEnd animationend', _animEnd3);
        _this6._removeMultipleEventListener(element, 'webkitAnimationStart animationstart', _animStart3);

        if (suppressEvents !== true) {
          _this6._triggerDOMEvent(_aureliaTemplating.animationEvent.addClassTimeout, element);
        }

        resolve(false);
      }
    });
  };

  return CssAnimator;
}();

function configure(config, callback) {
  var animator = config.container.get(CssAnimator);
  config.container.get(_aureliaTemplating.TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') {
    callback(animator);
  }
}