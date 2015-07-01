declare module 'aurelia-animator-css' {
  import { animationEvent, Animator }  from 'aurelia-templating';
  
  /**
   * Aurelia animator implementation using CSS3-Animations
   */
  export class CssAnimator {
    constructor();
    
    /* Public API Begin */
    /**
       * Run an animation for the given element/elements with the specified className in parallel
       *
       * @param element   {HtmlElement, Array<HtmlElement>} the element/s to be animated
       * @param className {String}                          the class to be added and removed
       *
       * @returns {Promise}
       */
    animate(element: any, className: any): any;
    
    /**
       * Runs a series of animations in sequence
       *
       * @param animations {Array<{element, className}>} array of animation parameters
       *
       * @returns {Promise.<Boolean>}
       */
    runSequence(animations: any): any;
    
    /**
       * Stub of move interface method
       *
       * @returns {Promise.<Boolean>}
       */
    move(): any;
    
    /**
       * Performs the enter animation for the given element, triggered by a [my-class]-enter-active css-class
       *
       * @param element {HtmlElement} the element to be animated
       *
       * @returns {Promise.<Boolean>}
       */
    enter(element: any): any;
    
    /**
       * Performs the leave animation for the given element, triggered by a [my-class]-leave-active css-class
       *
       * @param element {HtmlElement} the element to be animated
       *
       * @returns {Promise.<Boolean>}
       */
    leave(element: any): any;
    
    /**
       * Executes an animation by removing a css-class
       *
       * @param element        {HtmlElement}                    the element to be animated
       * @param className      {String}                         css-class to be removed
       * @param suppressEvents {Boolean} [suppressEvents=false] suppress event triggering
       *
       * @returns {Promise.<Boolean>}
       */
    removeClass(element: any, className: any, suppressEvents?: any): any;
    
    /**
       * Executes an animation by adding a css-class
       *
       * @param element        {HtmlElement}                    the element to be animated
       * @param className      {String}                         css-class to be removed
       * @param suppressEvents {Boolean} [suppressEvents=false] suppress event triggering
       *
       * @returns {Promise.<Boolean>}
       */
    addClass(element: any, className: any, suppressEvents?: any): any;
  }
  export function configure(aurelia: any, cb: any): any;
}