import {
  animationEvent,
  TemplatingEngine
} from 'aurelia-templating';
import {
  DOM
} from 'aurelia-pal';
export declare interface CssAnimation {
  className: string;
  element: HTMLElement;
}

/**
 * An implementation of the Animator using CSS3-Animations.
 */
/**
 * An implementation of the Animator using CSS3-Animations.
 */
export declare class CssAnimator {
  
  /**
     * Creates an instance of CssAnimator.
     */
  constructor();
  
  /**
     * Add multiple listeners at once to the given element
     *
     * @param el the element to attach listeners to
     * @param s  collection of events to bind listeners to
     * @param fn callback that gets executed
     */
  _addMultipleEventListener(el: HTMLElement, s: string, fn: Function): void;
  
  /**
     * Vendor-prefix save method to get the animation-delay
     *
     * @param element the element to inspect
     * @returns animation-delay in seconds
     */
  _getElementAnimationDelay(element: HTMLElement): number;
  
  /**
     * Vendor-prefix safe method to get the animation names
     *
     * @param element the element to inspect
     * @returns array of animation names
     */
  _getElementAnimationNames(element: HTMLElement): Array<String>;
  
  /**
     * Run an animation for the given element with the specified className
     *
     * @param element   the element to be animated
     * @param className the class to be added and removed
     * @returns {Promise<Boolean>}
     */
  _performSingleAnimate(element: HTMLElement, className: string): Promise<boolean>;
  
  /**
     * Triggers a DOM-Event with the given type as name and adds the provided element as detail
     * @param eventType the event type
     * @param element   the element to be dispatched as event detail
     */
  _triggerDOMEvent(eventType: string, element: HTMLElement): void;
  
  /**
     * Returns true if there is a new animation with valid keyframes
     * @param animationNames the current animation style.
     * @param prevAnimationNames the previous animation style
     * @private
     */
  _animationChangeWithValidKeyframe(animationNames: Array<string>, prevAnimationNames: Array<string>): boolean;
  
  /* Public API Begin */
  /**
     * Execute a single animation.
     * @param element Element to animate
     * @param className Properties to animate or name of the effect to use. For css animators this represents the className to be added and removed right after the animation is done.
     * @param options options for the animation (duration, easing, ...)
     * @returns Resolved when the animation is done
     */
  animate(element: HTMLElement | Array<HTMLElement>, className: string): Promise<boolean>;
  
  /**
     * Run a sequence of animations one after the other.
     * @param sequence An array of effectNames or classNames
     * @returns Resolved when all animations are done
     */
  runSequence(animations: Array<CssAnimation>): Promise<boolean>;
  
  /**
     * Execute an 'enter' animation on an element
     * @param element Element to animate
     * @returns Resolved when the animation is done
     */
  enter(element: HTMLElement): Promise<boolean>;
  
  /**
     * Execute a 'leave' animation on an element
     * @param element Element to animate
     * @returns Resolved when the animation is done
     */
  leave(element: HTMLElement): Promise<boolean>;
  
  /**
     * Add a class to an element to trigger an animation.
     * @param element Element to animate
     * @param className Properties to animate or name of the effect to use
     * @param suppressEvents Indicates whether or not to suppress animation events.
     * @returns Resolved when the animation is done
     */
  removeClass(element: HTMLElement, className: string, suppressEvents?: boolean): Promise<boolean>;
  
  /**
     * Add a class to an element to trigger an animation.
     * @param element Element to animate
     * @param className Properties to animate or name of the effect to use
     * @param suppressEvents Indicates whether or not to suppress animation events.
     * @returns Resolved when the animation is done
     */
  addClass(element: HTMLElement, className: string, suppressEvents?: boolean): Promise<boolean>;
}

/* Public API End */
/**
 * Configuires the CssAnimator as the default animator for Aurelia.
 * @param config The FrameworkConfiguration instance.
 * @param callback A configuration callback provided by the plugin consumer.
 */
export declare function configure(config: Object, callback?: ((animator: CssAnimator) => void)): void;