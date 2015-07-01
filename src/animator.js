import {animationEvent} from 'aurelia-templating';

/**
 * Aurelia animator implementation using CSS3-Animations
 */
export class CssAnimator {

  constructor(){
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
   * @param el {HTMLElement} the element to attach listeners to
   * @param s  {String}      collection of events to bind listeners to
   * @param fn {Function}    callback that gets executed
   * @private
   */
  _addMultipleEventListener(el, s, fn) {
    var evts = s.split(' '),
      i, ii;

    for (i = 0, ii = evts.length; i < ii; ++i) {
      el.addEventListener(evts[i], fn, false);
    }
  }

  /**
   * Pushes the given animationId onto the stack
   *
   * @param animId {String}
   * @private
   */
  _addAnimationToStack(animId) {
    if(this.animationStack.indexOf(animId) < 0) {
      this.animationStack.push(animId);
    }
  }

  /**
   * Removes the given animationId from the stack
   *
   * @param animId {String}
   * @private
   */
  _removeAnimationFromStack(animId) {
    var idx = this.animationStack.indexOf(animId);
    if(idx > -1) {
      this.animationStack.splice(idx, 1);
    }
  }

  /**
   * Vendor-prefix save method to get the animation-delay
   *
   * @param element {HtmlElement} the element to inspect
   * @private
   *
   * @returns {number} animation-delay in seconds
   */
  _getElementAnimationDelay(element) {
    var styl = window.getComputedStyle(element);
    var prop,
        delay;

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
   * @param element   {HtmlElement} the element to be animated
   * @param className {String}      the class to be added and removed
   * @private
   *
   * @returns {Promise.<Boolean>}
   */
  _performSingleAnimate(element, className) {
    this._triggerDOMEvent(animationEvent.animateBegin, element);

    return this.addClass(element, className, true)
      .then( (result) => {
        this._triggerDOMEvent(animationEvent.animateActive, element);

        if(result !== false) {
          return this.removeClass(element, className, true)
            .then( () => {
              this._triggerDOMEvent(animationEvent.animateDone, element);
            });
        } else {
          return false;
        }
      })
      .catch( () => {
        this._triggerDOMEvent(animationEvent.animateTimeout, element);
      });
  }

  /**
   * Triggers a DOM-Event with the given type as name and adds the provided element as detail
   * @param eventType {String}      the event type
   * @param element   {HtmlElement} the element to be dispatched as event detail
   * @private
   */
  _triggerDOMEvent(eventType, element) {
    var evt = new window.CustomEvent(eventType, {bubbles: true, cancelable: true, detail: element});
    document.dispatchEvent(evt);
  }

  /* Public API Begin */
  /**
   * Run an animation for the given element/elements with the specified className in parallel
   *
   * @param element   {HtmlElement, Array<HtmlElement>} the element/s to be animated
   * @param className {String}                          the class to be added and removed
   *
   * @returns {Promise}
   */
  animate(element, className) {
    if(Array.isArray(element)) {
      return Promise.all( element.map( (el) => {
        return this._performSingleAnimate(el, className);
      }));
    } else {
      return this._performSingleAnimate(element, className);
    }
  }

  /**
   * Runs a series of animations in sequence
   *
   * @param animations {Array<{element, className}>} array of animation parameters
   *
   * @returns {Promise.<Boolean>}
   */
  runSequence(animations) {
    this._triggerDOMEvent(animationEvent.sequenceBegin, null);

    return animations.reduce( (p, anim) => {
      return p.then( () => { return this.animate(anim.element, anim.className); });
    }, Promise.resolve(true) ).then( () => {
      this._triggerDOMEvent(animationEvent.sequenceDone, null);
    });
  }

  /**
   * Stub of move interface method
   *
   * @returns {Promise.<Boolean>}
   */
  move() {
    return Promise.resolve(false);
  }

  /**
   * Performs the enter animation for the given element, triggered by a [my-class]-enter-active css-class
   *
   * @param element {HtmlElement} the element to be animated
   *
   * @returns {Promise.<Boolean>}
   */
  enter(element) {
    return new Promise( (resolve, reject) => {
      // Step 1: generate animation id
      var animId = element.toString() + Math.random(),
          classList = element.classList;

      this._triggerDOMEvent(animationEvent.enterBegin, element);

      // Step 1.2: remove done classes
      if(this.useAnimationDoneClasses) {
        classList.remove(this.animationEnteredClass);
        classList.remove(this.animationLeftClass);
      }

      // Step 2: Add animation preparation class
      classList.add('au-enter');

      // Step 3: setup event to check whether animations started
      var animStart;
      this._addMultipleEventListener(element, "webkitAnimationStart animationstart", animStart = (evAnimStart) => {
        this.isAnimating = true;

        this._triggerDOMEvent(animationEvent.enterActive, element);

        // Step 3.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 3.1: Animation exists, put on stack
        this._addAnimationToStack(animId);

        // Step 3.2: Wait for animation to finish
        var animEnd;
        this._addMultipleEventListener(element, "webkitAnimationEnd animationend", animEnd = (evAnimEnd) => {
          // Step 3.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 3.2.1: remove animation classes
          classList.remove('au-enter-active');
          classList.remove('au-enter');

          // Step 3.2.2 remove animation from stack
          this._removeAnimationFromStack(animId);

          // Step 3.2.3 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          // Step 3.2.4 in case animation done animations are active, add the defined entered class to the element
          if(this.useAnimationDoneClasses &&
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
      var parent = element.parentElement,
          delay = 0;

      if(parent !== null &&
         parent !== undefined &&
         parent.classList.contains('au-stagger')) {
        var elemPos = Array.prototype.indexOf.call(parent.childNodes, element);
        delay = this._getElementAnimationDelay(parent) * elemPos;

        this._triggerDOMEvent(animationEvent.staggerNext, element);

        setTimeout(() => {
          classList.add('au-enter-active');
        }, delay);
      } else {
        classList.add('au-enter-active');
      }

      // Step 5: if no animations happened cleanup animation classes
      setTimeout(() => {
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
   * Performs the leave animation for the given element, triggered by a [my-class]-leave-active css-class
   *
   * @param element {HtmlElement} the element to be animated
   *
   * @returns {Promise.<Boolean>}
   */
  leave(element) {
    return new Promise( (resolve, reject) => {
      // Step 1: generate animation id
      var animId = element.toString() + Math.random(),
          classList = element.classList;

      this._triggerDOMEvent(animationEvent.leaveBegin, element);

      // Step 1.1: remove done classes
      if(this.useAnimationDoneClasses) {
        classList.remove(this.animationEnteredClass);
        classList.remove(this.animationLeftClass);
      }

      // Step 2: Add animation preparation class
      classList.add('au-leave');

      // Step 3: setup event to check whether animations started
      var animStart;
      this._addMultipleEventListener(element, "webkitAnimationStart animationstart", animStart = (evAnimStart) => {
        this.isAnimating = true;

        this._triggerDOMEvent(animationEvent.leaveActive, element);

        // Step 3.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 3.1: Animation exists, put on stack
        this._addAnimationToStack(animId);

        // Step 3.2: Wait for animation to finish
        var animEnd;
        this._addMultipleEventListener(element, "webkitAnimationEnd animationend", animEnd = (evAnimEnd) => {
          // Step 3.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 3.2.1: remove animation classes
          classList.remove('au-leave-active');
          classList.remove('au-leave');

          // Step 3.2.2 remove animation from stack
          this._removeAnimationFromStack(animId);

          // Step 3.2.3 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          // Step 3.2.4 in case animation done animations are active, add the defined left class to the element
          if(this.useAnimationDoneClasses &&
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
      var parent = element.parentElement,
        delay = 0;

      if(parent !== null &&
         parent !== undefined &&
         parent.classList.contains('au-stagger')) {
        var elemPos = Array.prototype.indexOf.call(parent.childNodes, element);
        delay = this._getElementAnimationDelay(parent) * elemPos;

        this._triggerDOMEvent(animationEvent.staggerNext, element);

        setTimeout(() => {
          classList.add('au-leave-active');
        }, delay);
      } else {
        classList.add('au-leave-active');
      }

      // Step 5: if no animations happened cleanup animation classes
      setTimeout(() => {
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
   * Executes an animation by removing a css-class
   *
   * @param element        {HtmlElement}                    the element to be animated
   * @param className      {String}                         css-class to be removed
   * @param suppressEvents {Boolean} [suppressEvents=false] suppress event triggering
   *
   * @returns {Promise.<Boolean>}
   */
  removeClass(element, className, suppressEvents = false) {
    return new Promise( (resolve, reject) => {
      var classList = element.classList;

      if (!classList.contains(className)) {
        resolve(false);
        return;
      }

      if(suppressEvents !== true) {
        this._triggerDOMEvent(animationEvent.removeClassBegin, element);
      }

      // Step 1: generate animation id
      var animId = element.toString() + className + Math.random();

      // Step 2: Remove final className, so animation can start
      classList.remove(className);

      // Step 3: setup event to check whether animations started
      var animStart;
      this._addMultipleEventListener(element, "webkitAnimationStart animationstart", animStart = (evAnimStart) => {
        this.isAnimating = true;

        if(suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.removeClassActive, element);
        }

        // Step 3.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 3.1: Animation exists, put on stack
        this._addAnimationToStack(animId);

        // Step 3.2: Wait for animation to finish
        var animEnd;
        this._addMultipleEventListener(element, "webkitAnimationEnd animationend", animEnd = (evAnimEnd) => {
          // Step 3.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 3.2.1 Remove -remove suffixed class
          classList.remove(className + "-remove");

          // Step 3.2.2 remove animation from stack
          this._removeAnimationFromStack(animId);

          // Step 3.2.3 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          this.isAnimating = false;

          if(suppressEvents !== true) {
            this._triggerDOMEvent(animationEvent.removeClassDone, element);
          }

          resolve(true);
        }, false);

        // Step 3.3 remove animationstart listener
        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 4: Add given className + -remove suffix to kick off animation
      classList.add(className + "-remove");

      // Step 5: if no animations happened cleanup animation classes and remove final class
      setTimeout(() => {
        if (this.animationStack.indexOf(animId) < 0) {
          classList.remove(className + "-remove");
          classList.remove(className);

          if(suppressEvents !== true) {
            this._triggerDOMEvent(animationEvent.removeClassTimeout, element);
          }

          resolve(false);
        }
      }, this._getElementAnimationDelay(element) + this.animationTimeout);
    });
  }

  /**
   * Executes an animation by adding a css-class
   *
   * @param element        {HtmlElement}                    the element to be animated
   * @param className      {String}                         css-class to be removed
   * @param suppressEvents {Boolean} [suppressEvents=false] suppress event triggering
   *
   * @returns {Promise.<Boolean>}
   */
  addClass(element, className, suppressEvents = false) {
    return new Promise( (resolve, reject) => {
      // Step 1: generate animation id
      var animId = element.toString() + className + Math.random(),
          classList = element.classList;

      if(suppressEvents !== true) {
        this._triggerDOMEvent(animationEvent.addClassBegin, element);
      }

      // Step 2: setup event to check whether animations started
      var animStart;
      this._addMultipleEventListener(element, "webkitAnimationStart animationstart", animStart = (evAnimStart) => {
        this.isAnimating = true;

        if(suppressEvents !== true) {
          this._triggerDOMEvent(animationEvent.addClassActive, element);
        }

        // Step 2.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 2.1: Animation exists, put on stack
        this._addAnimationToStack(animId);

        // Step 2.2: Wait for animation to finish
        var animEnd;
        this._addMultipleEventListener(element, "webkitAnimationEnd animationend", animEnd = (evAnimEnd) => {
          // Step 2.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 2.2.1: Add final className
          classList.add(className);

          // Step 2.2.2 Remove -add suffixed class
          classList.remove(className + "-add");

          // Step 2.2.3 remove animation from stack
          this._removeAnimationFromStack(animId);

          // Step 2.2.4 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          this.isAnimating = false;

          if(suppressEvents !== true) {
            this._triggerDOMEvent(animationEvent.addClassDone, element);
          }

          resolve(true);
        }, false);

        // Step 2.3 remove animationstart listener
        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 3: Add given className + -add suffix to kick off animation
      classList.add(className + "-add");

      // Step 4: if no animations happened cleanup animation classes and add final class
      setTimeout(() => {
        if (this.animationStack.indexOf(animId) < 0) {
          classList.remove(className + "-add");
          classList.add(className);

          if(suppressEvents !== true) {
            this._triggerDOMEvent(animationEvent.addClassTimeout, element);
          }

          resolve(false);
        }
      }, this._getElementAnimationDelay(element) + this.animationTimeout);
    });
  }

  /* Public API End */
}
