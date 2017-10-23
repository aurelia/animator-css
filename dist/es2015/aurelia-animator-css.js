import { animationEvent, TemplatingEngine } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';

export let CssAnimator = class CssAnimator {
  constructor() {
    this.useAnimationDoneClasses = false;
    this.animationEnteredClass = 'au-entered';
    this.animationLeftClass = 'au-left';
    this.isAnimating = false;

    this.verifyKeyframesExist = true;
  }

  _addMultipleEventListener(el, s, fn) {
    let evts = s.split(' ');
    for (let i = 0, ii = evts.length; i < ii; ++i) {
      el.addEventListener(evts[i], fn, false);
    }
  }

  _removeMultipleEventListener(el, s, fn) {
    let evts = s.split(' ');
    for (let i = 0, ii = evts.length; i < ii; ++i) {
      el.removeEventListener(evts[i], fn, false);
    }
  }

  _getElementAnimationDelay(element) {
    let styl = DOM.getComputedStyle(element);
    let prop;
    let delay;

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
  }

  _getElementAnimationNames(element) {
    let styl = DOM.getComputedStyle(element);
    let prefix;

    if (styl.getPropertyValue('animation-name')) {
      prefix = '';
    } else if (styl.getPropertyValue('-webkit-animation-name')) {
      prefix = '-webkit-';
    } else if (styl.getPropertyValue('-moz-animation-name')) {
      prefix = '-moz-';
    } else {
      return [];
    }

    let animationNames = styl.getPropertyValue(prefix + 'animation-name');
    return animationNames ? animationNames.split(' ') : [];
  }

  _performSingleAnimate(element, className) {
    this._triggerDOMEvent(animationEvent.animateBegin, element);

    return this.addClass(element, className, true).then(result => {
      this._triggerDOMEvent(animationEvent.animateActive, element);

      if (result !== false) {
        return this.removeClass(element, className, true).then(() => {
          this._triggerDOMEvent(animationEvent.animateDone, element);
        });
      }

      return false;
    }).catch(() => {
      this._triggerDOMEvent(animationEvent.animateTimeout, element);
    });
  }

  _triggerDOMEvent(eventType, element) {
    let evt = DOM.createCustomEvent(eventType, { bubbles: true, cancelable: true, detail: element });
    DOM.dispatchEvent(evt);
  }

  _animationChangeWithValidKeyframe(animationNames, prevAnimationNames) {
    let newAnimationNames = animationNames.filter(name => prevAnimationNames.indexOf(name) === -1);

    if (newAnimationNames.length === 0) {
      return false;
    }

    if (!this.verifyKeyframesExist) {
      return true;
    }

    const keyframesRuleType = window.CSSRule.KEYFRAMES_RULE || window.CSSRule.MOZ_KEYFRAMES_RULE || window.CSSRule.WEBKIT_KEYFRAMES_RULE;

    let styleSheets = document.styleSheets;

    try {
      for (let i = 0; i < styleSheets.length; ++i) {
        let cssRules = null;

        try {
          cssRules = styleSheets[i].cssRules;
        } catch (e) {}

        if (!cssRules) {
          continue;
        }

        for (let j = 0; j < cssRules.length; ++j) {
          let cssRule = cssRules[j];

          if (cssRule.type === keyframesRuleType) {
            if (newAnimationNames.indexOf(cssRule.name) !== -1) {
              return true;
            }
          }
        }
      }
    } catch (e) {}

    return false;
  }

  animate(element, className) {
    if (Array.isArray(element)) {
      return Promise.all(element.map(el => {
        return this._performSingleAnimate(el, className);
      }));
    }

    return this._performSingleAnimate(element, className);
  }

  runSequence(animations) {
    this._triggerDOMEvent(animationEvent.sequenceBegin, null);

    return animations.reduce((p, anim) => {
      return p.then(() => {
        return this.animate(anim.element, anim.className);
      });
    }, Promise.resolve(true)).then(() => {
      this._triggerDOMEvent(animationEvent.sequenceDone, null);
    });
  }

  _stateAnim(element, direction, doneClass) {
    const auClass = 'au-' + direction;
    const auClassActive = auClass + '-active';
    return new Promise((resolve, reject) => {
      const classList = element.classList;

      this._triggerDOMEvent(animationEvent[direction + 'Begin'], element);

      if (this.useAnimationDoneClasses) {
        classList.remove(this.animationEnteredClass);
        classList.remove(this.animationLeftClass);
      }

      classList.add(auClass);
      const prevAnimationNames = this._getElementAnimationNames(element);

      let animStart;
      let animHasStarted = false;
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = evAnimStart => {
        if (evAnimStart.target !== element) {
          return;
        }
        animHasStarted = true;
        this.isAnimating = true;

        this._triggerDOMEvent(animationEvent[direction + 'Active'], element);

        evAnimStart.stopPropagation();

        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      let animEnd;
      this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = evAnimEnd => {
        if (!animHasStarted) {
          return;
        }
        if (evAnimEnd.target !== element) {
          return;
        }

        evAnimEnd.stopPropagation();

        classList.remove(auClassActive);
        classList.remove(auClass);

        evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

        if (this.useAnimationDoneClasses && doneClass !== undefined && doneClass !== null) {
          classList.add(doneClass);
        }

        this.isAnimating = false;
        this._triggerDOMEvent(animationEvent[direction + 'Done'], element);

        resolve(true);
      }, false);

      const parent = element.parentElement;
      const attrib = 'data-animator-pending' + direction;

      const cleanupAnimation = () => {
        const animationNames = this._getElementAnimationNames(element);
        if (!this._animationChangeWithValidKeyframe(animationNames, prevAnimationNames)) {
          classList.remove(auClassActive);
          classList.remove(auClass);

          this._removeMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd);
          this._removeMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart);

          this._triggerDOMEvent(animationEvent[direction + 'Timeout'], element);
          resolve(false);
        }
        parent && parent.setAttribute(attrib, +(parent.getAttribute(attrib) || 1) - 1);
      };

      if (parent !== null && parent !== undefined && (parent.classList.contains('au-stagger') || parent.classList.contains('au-stagger-' + direction))) {
        const offset = +(parent.getAttribute(attrib) || 0);
        parent.setAttribute(attrib, offset + 1);
        const delay = this._getElementAnimationDelay(parent) * offset;
        this._triggerDOMEvent(animationEvent.staggerNext, element);

        setTimeout(() => {
          classList.add(auClassActive);
          cleanupAnimation();
        }, delay);
      } else {
        classList.add(auClassActive);
        cleanupAnimation();
      }
    });
  }

  enter(element) {
    return this._stateAnim(element, 'enter', this.animationEnteredClass);
  }

  leave(element) {
    return this._stateAnim(element, 'leave', this.animationLeftClass);
  }

  removeClass(element, className, suppressEvents = false) {
    return new Promise((resolve, reject) => {
      let classList = element.classList;

      if (!classList.contains(className) && !classList.contains(className + '-add')) {
        resolve(false);
        return;
      }

      if (suppressEvents !== true) {
        this._triggerDOMEvent(animationEvent.removeClassBegin, element);
      }

      if (classList.contains(className + '-add')) {
        classList.remove(className + '-add');
        classList.add(className);
      }

      classList.remove(className);
      let prevAnimationNames = this._getElementAnimationNames(element);

      let animStart;
      let animHasStarted = false;
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = evAnimStart => {
        if (evAnimStart.target !== element) {
          return;
        }
        animHasStarted = true;
        this.isAnimating = true;

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.removeClassActive, element);
        }

        evAnimStart.stopPropagation();

        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      let animEnd;
      this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = evAnimEnd => {
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

        evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

        this.isAnimating = false;

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.removeClassDone, element);
        }

        resolve(true);
      }, false);

      classList.add(className + '-remove');

      let animationNames = this._getElementAnimationNames(element);
      if (!this._animationChangeWithValidKeyframe(animationNames, prevAnimationNames)) {
        classList.remove(className + '-remove');
        classList.remove(className);

        this._removeMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd);
        this._removeMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart);

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.removeClassTimeout, element);
        }

        resolve(false);
      }
    });
  }

  addClass(element, className, suppressEvents = false) {
    return new Promise((resolve, reject) => {
      let classList = element.classList;

      if (suppressEvents !== true) {
        this._triggerDOMEvent(animationEvent.addClassBegin, element);
      }

      if (classList.contains(className + '-remove')) {
        classList.remove(className + '-remove');
        classList.remove(className);
      }

      let animStart;
      let animHasStarted = false;
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = evAnimStart => {
        if (evAnimStart.target !== element) {
          return;
        }
        animHasStarted = true;
        this.isAnimating = true;

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.addClassActive, element);
        }

        evAnimStart.stopPropagation();

        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      let animEnd;
      this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = evAnimEnd => {
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

        evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

        this.isAnimating = false;

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.addClassDone, element);
        }

        resolve(true);
      }, false);

      let prevAnimationNames = this._getElementAnimationNames(element);

      classList.add(className + '-add');

      let animationNames = this._getElementAnimationNames(element);
      if (!this._animationChangeWithValidKeyframe(animationNames, prevAnimationNames)) {
        classList.remove(className + '-add');
        classList.add(className);

        this._removeMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd);
        this._removeMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart);

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.addClassTimeout, element);
        }

        resolve(false);
      }
    });
  }

};

export function configure(config, callback) {
  let animator = config.container.get(CssAnimator);
  config.container.get(TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') {
    callback(animator);
  }
}