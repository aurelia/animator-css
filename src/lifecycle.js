import {animationEvent} from 'aurelia-templating';
import {Property} from './property';
import {DOM} from 'aurelia-pal';

interface LifeCycleStep {
  addClass: Array|String, // Array of classNames
  removeClass: Array|String, // Array of classNames
  dispatch: String, // Event to be dispatched
}

interface LifeCycleStrategy {
  name: String;
  canStagger: Boolean;
  suppressEvents: Boolean;
  begin: Array<LifeCycleStep>;
  prepare: Array<LifeCycleStep>;
  activate: Array<LifeCycleStep>;
  done: Array<LifeCycleStep>;
  timout: Array<LifeCycleStep>;
  animationStart: Array<LifeCycleStep>;
  animationEnd: Array<LifeCycleStep>;
}

const eventKeyMap = {
  begin: 'Begin',
  done: 'Done',
  timeout: 'Timeout',
  animationStart: 'Active',
  get(step, name) {
    if (step in eventKeyMap) {
      return animationEvent[name + eventKeyMap[step]];
    }
    return false;
  }
};

class DefaultLifeCycleStrategy {
  constructor(name: String) {
    let className = `au-${name}`
    let activeClassName = `${className}-active`;
    this.name = name;
    this.canStagger = true;
    this.prepare = [
      {addClass: className}
    ];
    this.animationEnd = [
      {removeClass: [activeClassName, className]}
    ];
    this.activate = [
      {addClass: activeClassName}
    ];
    this.timeout = [
      {removeClass: [activeClassName, className]}
    ];
  }
}

const EnterLifeCycleStrategy = new DefaultLifeCycleStrategy('enter');
const LeaveLifeCycleStrategy = new DefaultLifeCycleStrategy('leave');
export class AnimationLifeCycle {

  static enter(): DefaultLifeCycleStrategy {
    return EnterLifeCycleStrategy;
  }

  static leave(): DefaultLifeCycleStrategy {
    return LeaveLifeCycleStrategy;
  }

  constructor(animator: CssAnimator) {
    this._animator = animator;
  }

  _changeClass(method: String, classList: Array = [], element: HTMLElement) {
    classList = classList.filter(c => {
      return c !== undefined && c !== 'undefined';
    });
    classList.length && element.classList[method](...classList);
  }

  /**
   * Checks the animator in order to apply doneClasses
   * If check passes, fetches the proper doneClasses by name from the animator
   */
  _setDoneClass(element: HTMLElement, instruction: LifeCycleStrategy, addOrRemove: Boolean): void {
    if (this._animator.useAnimationDoneClasses) {
      let doneClass = this._animator._lookupDoneClass(addOrRemove ? instruction.name : false);
      this._changeClass(addOrRemove ? 'add' : 'remove', doneClass, element);
    }
  }

  /**
   * Triggers a DOM-Event with the given type as name and adds the provided element as detail
   * @param eventType the event type
   * @param element   the element to be dispatched as event detail
   */
  dispatch(eventName: string, element: HTMLElement, instruction: LifeCycleStrategy): void {
    let suppressEvents = instruction ? instruction.suppressEvents : false;
    if (!suppressEvents) {
      return triggerDOMEvent(eventName, element);
    }
  }

  /**
   * Adds a list of classNames to the current Element
   * If the @classList param is a String{} the we turn it into an Array
   */
  addClass(classList: Array = [], element: HTMLElement, instruction: LifeCycleStrategy, step: String): void {
    this._changeClass('add', Array.isArray(classList) ? classList : [classList], element);

  }

  /**
   * Removes a list of classNames to the current Element
   * If the @classList param is a String{} the we turn it into an Array
   */
  removeClass(classList: Array = [], element: HTMLElement, instruction: LifeCycleStrategy, step: String): void {
    this._changeClass('remove', Array.isArray(classList) ? classList : [classList], element);
  }

  /**
   * Prototype(): runStep
   * @description loops through Tasks found in the lifeCycleStep
   *              and invoked either addClass, removeClass, or dispatch
   */
  runStep(step:string, element: HTMLElement, instruction: LifeCycleStrategy): void {
    let stepInstruction = instruction[step];
    let eventName = eventKeyMap.get(step, instruction.name);
    if (stepInstruction) {
      for (let index in stepInstruction) {
        for (let key in stepInstruction[index]) {
          if (key in this) {
            this[key](stepInstruction[index][key], element, instruction, stepInstruction[index]);
          }
        }
      }
    }
    if (eventName && !instruction.suppressEvents) {
      triggerDOMEvent(eventName, element);
    }
  }

  /**
   * run
   * @param  {Element} element The Element to run the LifeCycle against
   * @param  {AnimationInstruction} instruction [description]
   * @return {Promise}
   * @private
   */
  run(element: HTMLElement, instruction: LifeCycleStrategy): Promise<boolean> {
    let prevAnimationNames;
    let onAnimationStart;
    let onAnimationEnd;
    let tryStagger;
    let animStart;
    let animEnd;
    let activate;

    return new Promise((resolve, reject) => {

      // Create event handlers
      onAnimationStart = (event: Event)=> {
        this._animator.isAnimating = true;

        // Stop event propagation, bubbling will otherwise prevent parent animation
        event.stopPropagation();

        // Step: animationStart
        this.runStep('animationStart', element, instruction);

        // Dispose animationstart eventListener
        animStart.dispose();
      }

      onAnimationEnd = (event: Event)=> {
        // If animStart hasn't been triggered stop
        if (!animStart.triggered) {return;}

        // Stop event propagation, bubbling will otherwise prevent parent animation
        event.stopPropagation();

        // Step: animationEnd
        this.runStep('animationEnd', element, instruction);

        // Dispose animationend eventListener
        animEnd.dispose();

        // If animStart is still bound, then dispose
        if (animStart.bound) animStart.dispose();

        this._animator.isAnimating = false;

        // Step done:
        this._setDoneClass(element, instruction, true);
        this.runStep('done', element, instruction);

        resolve(true);
      }

      tryStagger = ()=> {
        if (!instruction.canStagger) {
          return activate();
        }

        let parent = element.parentElement instanceof DOM.Element && element.parentElement;
        let canStagger = false;

        if (parent) {
          canStagger = (parent.classList.contains('au-stagger') || parent.classList.contains(`au-stagger-${instruction.name}`));
          if (!canStagger) {
            return activate();
          }
        }

        let elementIndex;
        let delay = 0;

        elementIndex = Array.prototype.indexOf.call(parent.childNodes, element);
        delay = Property.getPropertyValue(parent, 'animation-delay');
        delay = (delay * elementIndex) || delay;

        // Manually dispatch stagger Event
        triggerDOMEvent(animationEvent.staggerNext, element);

        // Step stagger:
        this.runStep('stagger', element, instruction);

        runTimeout(delay, ()=> {
          activate();
        });
      }

      /*
        Begin Running Animation Steps
       */
      // Clear Done classes
      this._setDoneClass(element, instruction, false);

      // Step: Begin
      this.runStep('begin', element, instruction);

      // Step: Prepare
      this.runStep('prepare', element, instruction);

      // Save a reference to the current animationNames
      prevAnimationNames = Property.getAnimationNames(element);

      // add animationstart Event Listener
      animStart = Property.subscribe(element, 'animationstart', onAnimationStart, false);

      // add animationEnd eventListener
      animEnd = Property.subscribe(element, 'animationend', onAnimationEnd, false);

      tryStagger( activate = ()=> {

        // Step activate:
        this.runStep('activate', element, instruction);

        // if no animations scheduled cleanup animation classes
        let animationNames = Property.getAnimationNames(element);
        let possibleAnimations = Property.keyframes.validateKeyFrames(
          this._animator.verifyKeyframesExist,
          animationNames,
          prevAnimationNames
        );
        if (!possibleAnimations) {
          // Step timeout
          this.runStep('timeout', element, instruction);
          resolve(false);
        }
      });
    });
  }
}

function triggerDOMEvent(eventName: String, element: HTMLElement):void {
  let evt = DOM.createCustomEvent(eventName, {bubbles: true, cancelable: true, detail: element});
  DOM.dispatchEvent(evt);
}

function runTimeout(time: Number, cb: Function) {
  if (!cb) return;
  if (!time) return cb();
  let TIMEOUT_ID = setTimeout(()=> {
    cb();
    clearTimeout(TIMEOUT_ID);
  }, time);
}
