declare module 'aurelia-animator-css' {
  import { animationEvent, Animator }  from 'aurelia-templating';
  export class CssAnimator {
    constructor();
    addMultipleEventListener(el: any, s: any, fn: any): any;
    addAnimationToStack(animId: any): any;
    removeAnimationFromStack(animId: any): any;
    getElementAnimationDelay(element: any): any;
    move(): any;
    enter(element: any): any;
    leave(element: any): any;
    removeClass(element: any, className: any): any;
    addClass(element: any, className: any): any;
  }
  export function configure(aurelia: any, cb: any): any;
}