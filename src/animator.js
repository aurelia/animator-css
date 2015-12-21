import {animationEvent} from 'aurelia-templating';
import {Property} from './property';
import {DOM} from 'aurelia-pal';
import {AnimationLifeCycle} from './lifecycle';

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
    this.LifeCycle = new AnimationLifeCycle(this);
    this.useAnimationDoneClasses = false;
    this.animationEnteredClass = 'au-entered';
    this.animationLeftClass = 'au-left';
    this.isAnimating = false;

    // toggle this on to save performance at the cost of animations referring
    // to missing keyframes breaking detection of termination
    this.verifyKeyframesExist = true;
  }

  _lookupDoneClass(name) {
    return name === 'enter'
    ? [this.animationEnteredClass]
    : name === 'leave'
    ? [this.animationLeftClass]
    : [this.animationEnteredClass, this.animationLeftClass];
  }

  /**
   * _runAnimationLifeCycle
   * Run an animation for the given element with the specified className
   *
   * @param element   the element to be animated
   * @param className the class to be added and removed
   * @returns {Promise<Boolean>}
   * @private
   */
  _runAnimationLifeCycle(element: HTMLElement, className: string): Promise<boolean> {
    this.LifeCycle.dispatch(animationEvent.animateBegin, element);

    return this.addClass(element, className, true)
      .then( result => {
        this.LifeCycle.dispatch(animationEvent.animateActive, element);
        return (result !== false) ? this.removeClass(element, className, true) : false;
      })
      .then( result => {
        this.LifeCycle.dispatch(animationEvent.animateDone, element);
        return result;
      })
      .catch(() => {
        this.LifeCycle.dispatch(animationEvent.animateTimeout, element);
      });
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
    let elements = Array.prototype.slice.call(Array.isArray(element) ? element : [element]);
    return Promise.all(elements.map(el => {
      return this._runAnimationLifeCycle(el, className);
    }));
  }

  /**
   * Run a sequence of animations one after the other.
   * @param sequence An array of effectNames or classNames
   * @returns Resolved when all animations are done
   */
  runSequence(animations: Array<CssAnimation>): Promise<boolean> {
    this.LifeCycle.dispatch(animationEvent.sequenceBegin, null);

    let reduce = (promised: Promise, anim: Object)=> {
      return promised.then(()=> this.animate(anim.element, anim.className));
    }

    return animations.reduce(reduce, Promise.resolve(true))
      .then(() => this.LifeCycle.dispatch(animationEvent.sequenceDone, null));
  }

  /**
   * Execute an 'enter' animation on an element
   * @param element Element to animate
   * @returns Resolved when the animation is done
   */
  enter(element: HTMLElement): Promise<boolean> {
    return this.LifeCycle.run(element, AnimationLifeCycle.enter());
  }

  /**
   * Execute a 'leave' animation on an element
   * @param element Element to animate
   * @returns Resolved when the animation is done
   */
  leave(element: HTMLElement): Promise<boolean> {
    return this.LifeCycle.run(element, AnimationLifeCycle.leave());
  }

  /**
   * Add a class to an element to trigger an animation.
   * @param element Element to animate
   * @param className Properties to animate or name of the effect to use
   * @param suppressEvents Indicates whether or not to suppress animation events.
   * @returns Resolved when the animation is done
   */
  addClass(element: HTMLElement, className: string, suppressEvents: boolean = false): Promise<boolean> {

    let add = '-add';
    let instruction = {
      name: 'addClass',
      suppressEvents: suppressEvents,
      animationEnd: [
        {addClass: className},
        {removeClass: className + add}
      ],
      activate: [
        {addClass: className + add}
      ],
      timeout: [
        {removeClass: className + add},
        {addClass: className},
      ]
    };
    return this.LifeCycle.run(element, instruction);
  }

  /**
   * Remove a class from an element to trigger an animation.
   * @param element Element to animate
   * @param className Properties to animate or name of the effect to use
   * @param suppressEvents Indicates whether or not to suppress animation events.
   * @returns Resolved when the animation is done
   */
  removeClass(element: HTMLElement, className: string, suppressEvents: boolean = false): Promise<boolean> {

    if (!element.classList.contains(className) && !element.classList.contains(className + '-remove')) {
      return Promise.resolve(false);
    }
    let remove = '-remove';
    let instruction = {
      name: 'removeClass',
      suppressEvents: suppressEvents,
      prepare: [
        {removeClass: className}
      ],
      animationEnd: [
        {removeClass: className + remove}
      ],
      activate: [
        {addClass: className + remove}
      ],
      timeout: [
        {removeClass: [className + remove, className]},
      ]
    };
    return this.LifeCycle.run(element, instruction);
  }
  /* Public API End */
}

