import {animationEvent,TemplatingEngine} from 'aurelia-templating';
import {DOM} from 'aurelia-pal';

interface CssAnimation {
  className: string;
  element: HTMLElement;
}

/**
 * An implementation of the Animator using CSS3-Animations.
 */
export class CssAnimator {
  /**
   * Creates an instance of CssAnimator.
   */
  constructor() {
    this.useAnimationDoneClasses = false;
    this.animationEnteredClass = 'au-entered';
    this.animationLeftClass = 'au-left';
    this.isAnimating = false;
    // toggle this on to save performance at the cost of animations referring
    // to missing keyframes breaking detection of termination
    this.verifyKeyframesExist = true;
  }

  /**
   * Add multiple listeners at once to the given element
   *
   * @param el the element to attach listeners to
   * @param s  collection of events to bind listeners to
   * @param fn callback that gets executed
   */
  _addMultipleEventListener(el: HTMLElement, s: string, fn: Function) : void {
    let evts = s.split(' ');
    for (let i = 0, ii = evts.length; i < ii; ++i) {
      el.addEventListener(evts[i], fn, false);
    }
  }

  /**
   * Remove multiple listeners at once from the given element
   *
   * @param el the element
   * @param s  collection of events to remove
   * @param fn callback to remove
   */
  _removeMultipleEventListener(el: HTMLElement, s: string, fn: Function) : void {
    let evts = s.split(' ');
    for (let i = 0, ii = evts.length; i < ii; ++i) {
      el.removeEventListener(evts[i], fn, false);
    }
  }

  /**
   * Vendor-prefix save method to get the animation-delay
   *
   * @param element the element to inspect
   * @returns animation-delay in seconds
   */
  _getElementAnimationDelay(element: HTMLElement): number {
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

    return (delay * 1000);
  }

  /**
   * Vendor-prefix safe method to get the animation names
   *
   * @param element the element to inspect
   * @returns array of animation names
   */
  _getElementAnimationNames(element: HTMLElement): Array<String> {
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

  /**
   * Run an animation for the given element with the specified className
   *
   * @param element   the element to be animated
   * @param className the class to be added and removed
   * @returns {Promise<Boolean>}
   */
  _performSingleAnimate(element: HTMLElement, className: string): Promise<boolean> {
    this._triggerDOMEvent(animationEvent.animateBegin, element);

    return this.addClass(element, className, true)
      .then((result) => {
        this._triggerDOMEvent(animationEvent.animateActive, element);

        if (result !== false) {
          return this.removeClass(element, className, true)
            .then(() => {
              this._triggerDOMEvent(animationEvent.animateDone, element);
            });
        }

        return false;
      })
      .catch(() => {
        this._triggerDOMEvent(animationEvent.animateTimeout, element);
      });
  }

  /**
   * Triggers a DOM-Event with the given type as name and adds the provided element as detail
   * @param eventType the event type
   * @param element   the element to be dispatched as event detail
   */
  _triggerDOMEvent(eventType: string, element: HTMLElement): void {
    let evt = DOM.createCustomEvent(eventType, {bubbles: true, cancelable: true, detail: element});
    DOM.dispatchEvent(evt);
  }

  /**
   * Returns true if there is a new animation with valid keyframes
   * @param animationNames the current animation style.
   * @param prevAnimationNames the previous animation style
   * @private
   */
  _animationChangeWithValidKeyframe(animationNames: Array<string>, prevAnimationNames: Array<string>): bool {
    let newAnimationNames = animationNames.filter(name => prevAnimationNames.indexOf(name) === -1);

    if (newAnimationNames.length === 0) {
      return false;
    }

    if (! this.verifyKeyframesExist) {
      return true;
    }

    const keyframesRuleType = window.CSSRule.KEYFRAMES_RULE ||
                              window.CSSRule.MOZ_KEYFRAMES_RULE  ||
                              window.CSSRule.WEBKIT_KEYFRAMES_RULE;

    // loop through the stylesheets searching for the keyframes. no cache is
    // used in case of dynamic changes to the stylesheets.
    let styleSheets = document.styleSheets;

    try {
      for (let i = 0; i < styleSheets.length; ++i) {
        let cssRules = null;

        try {
          cssRules = styleSheets[i].cssRules;
        } catch (e) {
          // do nothing
        }

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
    } catch (e) {
      //do nothing
    }

    return false;
  }

  /* Public API Begin */
  /**
   * Execute a single animation.
   * @param element Element to animate
   * @param className Properties to animate or name of the effect to use. For css animators this represents the className to be added and removed right after the animation is done.
   * @param options options for the animation (duration, easing, ...)
   * @returns Resolved when the animation is done
   */
  animate(element: HTMLElement | Array<HTMLElement>, className: string): Promise<boolean> {
    if (Array.isArray(element)) {
      return Promise.all(element.map( (el) => {
        return this._performSingleAnimate(el, className);
      }));
    }

    return this._performSingleAnimate(element, className);
  }

  /**
   * Run a sequence of animations one after the other.
   * @param sequence An array of effectNames or classNames
   * @returns Resolved when all animations are done
   */
  runSequence(animations: Array<CssAnimation>): Promise<boolean> {
    this._triggerDOMEvent(animationEvent.sequenceBegin, null);

    return animations.reduce((p, anim) => {
      return p.then(() => { return this.animate(anim.element, anim.className); });
    }, Promise.resolve(true) ).then(() => {
      this._triggerDOMEvent(animationEvent.sequenceDone, null);
    });
  }

  /**
   * Execute an 'enter' animation on an element
   * @param element Element to animate
   * @returns Resolved when the animation is done
   */
  enter(element: HTMLElement): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let classList = element.classList;

      this._triggerDOMEvent(animationEvent.enterBegin, element);

      // Step 1.2: remove done classes
      if (this.useAnimationDoneClasses) {
        classList.remove(this.animationEnteredClass);
        classList.remove(this.animationLeftClass);
      }

      // Step 2: Add animation preparation class
      classList.add('au-enter');
      let prevAnimationNames = this._getElementAnimationNames(element);

      // Step 3: setup event to check whether animations started
      let animStart;
      let animHasStarted = false;
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = (evAnimStart) => {
        animHasStarted = true;
        this.isAnimating = true;

        this._triggerDOMEvent(animationEvent.enterActive, element);

        // Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 3.1: Wait for animation to finish
      let animEnd;
      this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = (evAnimEnd) => {
        if (! animHasStarted) {
          return;
        }

        // Step 3.1.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimEnd.stopPropagation();

        // Step 3.1.1: remove animation classes
        classList.remove('au-enter-active');
        classList.remove('au-enter');

        // Step 3.1.2 remove animationend listener
        evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

        // Step 3.1.3 in case animation done animations are active, add the defined entered class to the element
        if (this.useAnimationDoneClasses &&
           this.animationEnteredClass !== undefined &&
           this.animationEnteredClass !== null) {
          classList.add(this.animationEnteredClass);
        }

        this.isAnimating = false;
        this._triggerDOMEvent(animationEvent.enterDone, element);

        resolve(true);
      }, false);

      // Step 4: check if parent element is defined to stagger animations otherwise trigger active immediately
      let parent = element.parentElement;
      let delay = 0;

      let cleanupAnimation = () => {
        // Step 5: if no animations scheduled cleanup animation classes
        let animationNames = this._getElementAnimationNames(element);
        if (! this._animationChangeWithValidKeyframe(animationNames, prevAnimationNames)) {
          classList.remove('au-enter-active');
          classList.remove('au-enter');

          this._removeMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd);
          this._removeMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart);

          this._triggerDOMEvent(animationEvent.enterTimeout, element);
          resolve(false);
        }
      };

      if (parent !== null &&
         parent !== undefined &&
         (
          parent.classList.contains('au-stagger') ||
          parent.classList.contains('au-stagger-enter')
         )) {
        let elemPos = Array.prototype.indexOf.call(parent.children, element);
        delay = this._getElementAnimationDelay(parent) * elemPos;

        this._triggerDOMEvent(animationEvent.staggerNext, element);

        setTimeout(() => {
          classList.add('au-enter-active');
          cleanupAnimation();
        }, delay);
      } else {
        classList.add('au-enter-active');
        cleanupAnimation();
      }
    });
  }

  /**
   * Execute a 'leave' animation on an element
   * @param element Element to animate
   * @returns Resolved when the animation is done
   */
  leave(element: HTMLElement): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let classList = element.classList;

      this._triggerDOMEvent(animationEvent.leaveBegin, element);

      // Step 1.1: remove done classes
      if (this.useAnimationDoneClasses) {
        classList.remove(this.animationEnteredClass);
        classList.remove(this.animationLeftClass);
      }

      // Step 2: Add animation preparation class
      classList.add('au-leave');
      let prevAnimationNames = this._getElementAnimationNames(element);

      // Step 3: setup event to check whether animations started
      let animStart;
      let animHasStarted = false;
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = (evAnimStart) => {
        animHasStarted = true;
        this.isAnimating = true;

        this._triggerDOMEvent(animationEvent.leaveActive, element);

        // Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 3.1: Wait for animation to finish
      let animEnd;
      this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = (evAnimEnd) => {
        if (! animHasStarted) {
          return;
        }

        // Step 3.1.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimEnd.stopPropagation();

        // Step 3.1.1: remove animation classes
        classList.remove('au-leave-active');
        classList.remove('au-leave');

        // Step 3.1.2 remove animationend listener
        evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

        // Step 3.1.3 in case animation done animations are active, add the defined left class to the element
        if (this.useAnimationDoneClasses &&
           this.animationLeftClass !== undefined &&
           this.animationLeftClass !== null) {
          classList.add(this.animationLeftClass);
        }

        this.isAnimating = false;
        this._triggerDOMEvent(animationEvent.leaveDone, element);

        resolve(true);
      }, false);


      // Step 4: check if parent element is defined to stagger animations otherwise trigger leave immediately
      let parent = element.parentElement;
      let delay = 0;

      let cleanupAnimation = () => {
        // Step 5: if no animations scheduled cleanup animation classes
        let animationNames = this._getElementAnimationNames(element);
        if (! this._animationChangeWithValidKeyframe(animationNames, prevAnimationNames)) {
          classList.remove('au-leave-active');
          classList.remove('au-leave');

          this._removeMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd);
          this._removeMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart);

          this._triggerDOMEvent(animationEvent.leaveTimeout, element);
          resolve(false);
        }
      };

      if (parent !== null &&
         parent !== undefined &&
         (
           parent.classList.contains('au-stagger') ||
           parent.classList.contains('au-stagger-leave')
         )) {
        let elemPos = Array.prototype.indexOf.call(parent.children, element);
        delay = this._getElementAnimationDelay(parent) * elemPos;

        this._triggerDOMEvent(animationEvent.staggerNext, element);

        setTimeout(() => {
          classList.add('au-leave-active');
          cleanupAnimation();
        }, delay);
      } else {
        classList.add('au-leave-active');
        cleanupAnimation();
      }
    });
  }

  /**
   * Add a class to an element to trigger an animation.
   * @param element Element to animate
   * @param className Properties to animate or name of the effect to use
   * @param suppressEvents Indicates whether or not to suppress animation events.
   * @returns Resolved when the animation is done
   */
  removeClass(element: HTMLElement, className: string, suppressEvents: boolean = false): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      let classList = element.classList;

      if (!classList.contains(className) && !classList.contains(className + '-add')) {
        resolve(false);
        return;
      }

      if (suppressEvents !== true) {
        this._triggerDOMEvent(animationEvent.removeClassBegin, element);
      }

      // Step 2: Remove final className, so animation can start
      classList.remove(className);
      let prevAnimationNames = this._getElementAnimationNames(element);

      // Step 3: setup event to check whether animations started
      let animStart;
      let animHasStarted = false;
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = (evAnimStart) => {
        animHasStarted = true;
        this.isAnimating = true;

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.removeClassActive, element);
        }

        // Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 3.1: Wait for animation to finish
      let animEnd;
      this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = (evAnimEnd) => {
        if (! animHasStarted) {
          return;
        }

        // Step 3.1.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimEnd.stopPropagation();

        // Step 3.1.1 Remove -remove suffixed class
        classList.remove(className + '-remove');

        // Step 3.1.2 remove animationend listener
        evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

        this.isAnimating = false;

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.removeClassDone, element);
        }

        resolve(true);
      }, false);


      // Step 4: Add given className + -remove suffix to kick off animation
      classList.add(className + '-remove');

      // Step 5: if no animations happened cleanup animation classes and remove final class
      let animationNames = this._getElementAnimationNames(element);
      if (! this._animationChangeWithValidKeyframe(animationNames, prevAnimationNames)) {
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

  /**
   * Add a class to an element to trigger an animation.
   * @param element Element to animate
   * @param className Properties to animate or name of the effect to use
   * @param suppressEvents Indicates whether or not to suppress animation events.
   * @returns Resolved when the animation is done
   */
  addClass(element: HTMLElement, className: string, suppressEvents: boolean = false): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let classList = element.classList;

      if (suppressEvents !== true) {
        this._triggerDOMEvent(animationEvent.addClassBegin, element);
      }

      // Step 2: setup event to check whether animations started
      let animStart;
      let animHasStarted = false;
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = (evAnimStart) => {
        animHasStarted = true;
        this.isAnimating = true;

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.addClassActive, element);
        }

        // Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 2.1: Wait for animation to finish
      let animEnd;
      this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = (evAnimEnd) => {
        if (! animHasStarted) {
          return;
        }

        // Step 2.1.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimEnd.stopPropagation();

        // Step 2.1.1: Add final className
        classList.add(className);

        // Step 2.1.2 Remove -add suffixed class
        classList.remove(className + '-add');

        // Step 2.1.3 remove animationend listener
        evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

        this.isAnimating = false;

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.addClassDone, element);
        }

        resolve(true);
      }, false);

      let prevAnimationNames = this._getElementAnimationNames(element);

      // Step 3: Add given className + -add suffix to kick off animation
      classList.add(className + '-add');

      // Step 4: if no animations happened cleanup animation classes and add final class
      let animationNames = this._getElementAnimationNames(element);
      if (! this._animationChangeWithValidKeyframe(animationNames, prevAnimationNames)) {
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

  /* Public API End */
}

/**
 * Configuires the CssAnimator as the default animator for Aurelia.
 * @param config The FrameworkConfiguration instance.
 * @param callback A configuration callback provided by the plugin consumer.
 */
export function configure(config: Object, callback?:(animator:CssAnimator) => void): void {
  let animator = config.container.get(CssAnimator);
  config.container.get(TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') { callback(animator); }
}
