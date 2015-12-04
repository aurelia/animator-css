import {animationEvent} from 'aurelia-templating';
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
    this.animationStack = [];

    this.useAnimationDoneClasses = false;
    this.animationEnteredClass = 'au-entered';
    this.animationLeftClass = 'au-left';
    this.isAnimating = false;

    this.animationTimeout = 50;
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
   * Pushes the given animationId onto the stack
   *
   * @param animId
   * @private
   */
  _addAnimationToStack(animId: string): void {
    if (this.animationStack.indexOf(animId) < 0) {
      this.animationStack.push(animId);
    }
  }

  /**
   * Removes the given animationId from the stack
   *
   * @param animId
   */
  _removeAnimationFromStack(animId: string): void {
    let idx = this.animationStack.indexOf(animId);
    if (idx > -1) {
      this.animationStack.splice(idx, 1);
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
      // Step 1: generate animation id
      let animId = element.toString() + Math.random();
      let classList = element.classList;

      this._triggerDOMEvent(animationEvent.enterBegin, element);

      // Step 1.2: remove done classes
      if (this.useAnimationDoneClasses) {
        classList.remove(this.animationEnteredClass);
        classList.remove(this.animationLeftClass);
      }

      // Step 2: Add animation preparation class
      classList.add('au-enter');

      // Step 3: setup event to check whether animations started
      let animStart;
      let noAnimTimeout;
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = (evAnimStart) => {
        this.isAnimating = true;

        this._triggerDOMEvent(animationEvent.enterActive, element);

        // Step 3.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 3.1: Animation exists, put on stack
        this._addAnimationToStack(animId);

        // Step 3.2: Wait for animation to finish
        let animEnd;
        this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = (evAnimEnd) => {
          // Step 3.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 3.2.1: remove animation classes
          classList.remove('au-enter-active');
          classList.remove('au-enter');

          // Step 3.2.2 remove animation from stack
          window.clearTimeout(noAnimTimeout);
          this._removeAnimationFromStack(animId);

          // Step 3.2.3 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          // Step 3.2.4 in case animation done animations are active, add the defined entered class to the element
          if (this.useAnimationDoneClasses &&
             this.animationEnteredClass !== undefined &&
             this.animationEnteredClass !== null) {
            classList.add(this.animationEnteredClass);
          }

          this.isAnimating = false;
          this._triggerDOMEvent(animationEvent.enterDone, element);

          resolve(true);
        }, false);

        // Step 3.3 remove animationstart listener
        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 4: check if parent element is defined to stagger animations otherwise trigger active immediately
      let parent = element.parentElement;
      let delay = 0;

      if (parent !== null &&
         parent !== undefined &&
         (
          parent.classList.contains('au-stagger') ||
          parent.classList.contains('au-stagger-enter')
         )) {
        let elemPos = Array.prototype.indexOf.call(parent.childNodes, element);
        delay = this._getElementAnimationDelay(parent) * elemPos;

        this._triggerDOMEvent(animationEvent.staggerNext, element);

        setTimeout(() => {
          classList.add('au-enter-active');
        }, delay);
      } else {
        classList.add('au-enter-active');
      }

      // Step 5: if no animations happened cleanup animation classes
      noAnimTimeout = setTimeout(() => {
        if (this.animationStack.indexOf(animId) < 0) {
          classList.remove('au-enter-active');
          classList.remove('au-enter');

          this._triggerDOMEvent(animationEvent.enterTimeout, element);

          resolve(false);
        }
      }, this._getElementAnimationDelay(element) + this.animationTimeout + delay);
    });
  }

  /**
   * Execute a 'leave' animation on an element
   * @param element Element to animate
   * @returns Resolved when the animation is done
   */
  leave(element: HTMLElement): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Step 1: generate animation id
      let animId = element.toString() + Math.random();
      let classList = element.classList;

      this._triggerDOMEvent(animationEvent.leaveBegin, element);

      // Step 1.1: remove done classes
      if (this.useAnimationDoneClasses) {
        classList.remove(this.animationEnteredClass);
        classList.remove(this.animationLeftClass);
      }

      // Step 2: Add animation preparation class
      classList.add('au-leave');

      // Step 3: setup event to check whether animations started
      let animStart;
      let noAnimTimeout;
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = (evAnimStart) => {
        this.isAnimating = true;

        this._triggerDOMEvent(animationEvent.leaveActive, element);

        // Step 3.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 3.1: Animation exists, put on stack
        this._addAnimationToStack(animId);

        // Step 3.2: Wait for animation to finish
        let animEnd;
        this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = (evAnimEnd) => {
          // Step 3.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 3.2.1: remove animation classes
          classList.remove('au-leave-active');
          classList.remove('au-leave');

          // Step 3.2.2 remove animation from stack
          window.clearTimeout(noAnimTimeout);
          this._removeAnimationFromStack(animId);

          // Step 3.2.3 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          // Step 3.2.4 in case animation done animations are active, add the defined left class to the element
          if (this.useAnimationDoneClasses &&
             this.animationLeftClass !== undefined &&
             this.animationLeftClass !== null) {
            classList.add(this.animationLeftClass);
          }

          this.isAnimating = false;
          this._triggerDOMEvent(animationEvent.leaveDone, element);

          resolve(true);
        }, false);

        // Step 3.3 remove animationstart listener
        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 4: check if parent element is defined to stagger animations otherwise trigger leave immediately
      let parent = element.parentElement;
      let delay = 0;

      if (parent !== null &&
         parent !== undefined &&
         (
           parent.classList.contains('au-stagger') ||
           parent.classList.contains('au-stagger-leave')
         )) {
        let elemPos = Array.prototype.indexOf.call(parent.childNodes, element);
        delay = this._getElementAnimationDelay(parent) * elemPos;

        this._triggerDOMEvent(animationEvent.staggerNext, element);

        setTimeout(() => {
          classList.add('au-leave-active');
        }, delay);
      } else {
        classList.add('au-leave-active');
      }

      // Step 5: if no animations happened cleanup animation classes
      noAnimTimeout = setTimeout(() => {
        if (this.animationStack.indexOf(animId) < 0) {
          classList.remove('au-leave-active');
          classList.remove('au-leave');

          this._triggerDOMEvent(animationEvent.leaveTimeout, element);

          resolve(false);
        }
      }, this._getElementAnimationDelay(element) + this.animationTimeout + delay);
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

      // Step 1: generate animation id
      let animId = element.toString() + className + Math.random();

      // Step 2: Remove final className, so animation can start
      classList.remove(className);

      // Step 3: setup event to check whether animations started
      let animStart;
      let noAnimTimeout;
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = (evAnimStart) => {
        this.isAnimating = true;

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.removeClassActive, element);
        }

        // Step 3.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 3.1: Animation exists, put on stack
        this._addAnimationToStack(animId);

        // Step 3.2: Wait for animation to finish
        let animEnd;
        this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = (evAnimEnd) => {
          // Step 3.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 3.2.1 Remove -remove suffixed class
          classList.remove(className + '-remove');

          // Step 3.2.2 remove animation from stack
          window.clearTimeout(noAnimTimeout);
          this._removeAnimationFromStack(animId);

          // Step 3.2.3 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          this.isAnimating = false;

          if (suppressEvents !== true) {
            this._triggerDOMEvent(animationEvent.removeClassDone, element);
          }

          resolve(true);
        }, false);

        // Step 3.3 remove animationstart listener
        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 4: Add given className + -remove suffix to kick off animation
      classList.add(className + '-remove');

      // Step 5: if no animations happened cleanup animation classes and remove final class
      noAnimTimeout = setTimeout(() => {
        if (this.animationStack.indexOf(animId) < 0) {
          classList.remove(className + '-remove');
          classList.remove(className);

          if (suppressEvents !== true) {
            this._triggerDOMEvent(animationEvent.removeClassTimeout, element);
          }

          resolve(false);
        }
      }, this._getElementAnimationDelay(element) + this.animationTimeout);
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
      // Step 1: generate animation id
      let animId = element.toString() + className + Math.random();
      let classList = element.classList;

      if (suppressEvents !== true) {
        this._triggerDOMEvent(animationEvent.addClassBegin, element);
      }

      // Step 2: setup event to check whether animations started
      let animStart;
      let noAnimTimeout;
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', animStart = (evAnimStart) => {
        this.isAnimating = true;

        if (suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.addClassActive, element);
        }

        // Step 2.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 2.1: Animation exists, put on stack
        this._addAnimationToStack(animId);

        // Step 2.2: Wait for animation to finish
        let animEnd;
        this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', animEnd = (evAnimEnd) => {
          // Step 2.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 2.2.1: Add final className
          classList.add(className);

          // Step 2.2.2 Remove -add suffixed class
          classList.remove(className + '-add');

          // Step 2.2.3 remove animation from stack
          window.clearTimeout(noAnimTimeout);
          this._removeAnimationFromStack(animId);

          // Step 2.2.4 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          this.isAnimating = false;

          if (suppressEvents !== true) {
            this._triggerDOMEvent(animationEvent.addClassDone, element);
          }

          resolve(true);
        }, false);

        // Step 2.3 remove animationstart listener
        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 3: Add given className + -add suffix to kick off animation
      classList.add(className + '-add');

      // Step 4: if no animations happened cleanup animation classes and add final class
      noAnimTimeout = setTimeout(() => {
        if (this.animationStack.indexOf(animId) < 0) {
          classList.remove(className + '-add');
          classList.add(className);

          if (suppressEvents !== true) {
            this._triggerDOMEvent(animationEvent.addClassTimeout, element);
          }

          resolve(false);
        }
      }, this._getElementAnimationDelay(element) + this.animationTimeout);
    });
  }

  /* Public API End */
}
