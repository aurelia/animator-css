export class CssAnimator {

  constructor(){
    this.animationStack = [];

    this.useAnimationDoneClasses = false;
    this.animationEnteredClass = 'au-entered';
    this.animationLeftClass = 'au-left';
    this.isAnimating = false;
  }

  addMultipleEventListener(el, s, fn) {
    var evts = s.split(' '),
      i, ii;

    for (i = 0, ii = evts.length; i < ii; ++i) {
      el.addEventListener(evts[i], fn, false);
    }
  }

  addAnimationToStack(animId) {
    if(this.animationStack.indexOf(animId) < 0) {
      this.animationStack.push(animId);
    }
  }

  removeAnimationFromStack(animId) {
    var idx = this.animationStack.indexOf(animId);
    if(idx > -1) {
      this.animationStack.splice(idx, 1);
    }
  }

  getElementAnimationDelay(element) {
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

  move() {
    return Promise.resolve(false);
  }

  enter(element) {
    return new Promise( (resolve, reject) => {
      // Step 1: generate animation id
      var animId = element.toString() + Math.random(),
          classList = element.classList;

      // Step 1.1: remove done classes
      if(this.useAnimationDoneClasses) {
        classList.remove(this.animationEnteredClass);
        classList.remove(this.animationLeftClass);
      }

      // Step 2: Add animation preparation class
      classList.add('au-enter');

      // Step 3: setup event to check whether animations started
      var animStart;
      this.addMultipleEventListener(element, "webkitAnimationStart animationstart", animStart = (evAnimStart) => {
        this.isAnimating = true;

        // Step 3.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 3.1: Animation exists, put on stack
        this.addAnimationToStack(animId);

        // Step 3.2: Wait for animation to finish
        var animEnd;
        this.addMultipleEventListener(element, "webkitAnimationEnd animationend", animEnd = (evAnimEnd) => {
          // Step 3.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 3.2.1: remove animation classes
          classList.remove('au-enter-active');
          classList.remove('au-enter');

          // Step 3.2.2 remove animation from stack
          this.removeAnimationFromStack(animId);

          // Step 3.2.3 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          // Step 3.2.4 in case animation done animations are active, add the defined entered class to the element
          if(this.useAnimationDoneClasses &&
             this.animationEnteredClass !== undefined &&
             this.animationEnteredClass !== null) {
            classList.add(this.animationEnteredClass);
          }

          this.isAnimating = false;
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
        delay = this.getElementAnimationDelay(parent) * elemPos;

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

          resolve(false);
        }
      }, this.getElementAnimationDelay(element) + 400 + delay);
    });
  }

  leave(element) {
    return new Promise( (resolve, reject) => {
      // Step 1: generate animation id
      var animId = element.toString() + Math.random(),
          classList = element.classList;

      // Step 1.1: remove done classes
      if(this.useAnimationDoneClasses) {
        classList.remove(this.animationEnteredClass);
        classList.remove(this.animationLeftClass);
      }

      // Step 2: Add animation preparation class
      classList.add('au-leave');

      // Step 3: setup event to check whether animations started
      var animStart;
      this.addMultipleEventListener(element, "webkitAnimationStart animationstart", animStart = (evAnimStart) => {
        this.isAnimating = true;

        // Step 3.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 3.1: Animation exists, put on stack
        this.addAnimationToStack(animId);

        // Step 3.2: Wait for animation to finish
        var animEnd;
        this.addMultipleEventListener(element, "webkitAnimationEnd animationend", animEnd = (evAnimEnd) => {
          // Step 3.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 3.2.1: remove animation classes
          classList.remove('au-leave-active');
          classList.remove('au-leave');

          // Step 3.2.2 remove animation from stack
          this.removeAnimationFromStack(animId);

          // Step 3.2.3 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          // Step 3.2.4 in case animation done animations are active, add the defined left class to the element
          if(this.useAnimationDoneClasses &&
             this.animationLeftClass !== undefined &&
             this.animationLeftClass !== null) {
            classList.add(this.animationLeftClass);
          }

          this.isAnimating = false;
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
        delay = this.getElementAnimationDelay(parent) * elemPos;

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

          resolve(false);
        }
      }, this.getElementAnimationDelay(element) + 400 + delay);
    });
  }

  removeClass(element, className) {
    return new Promise( (resolve, reject) => {
      var classList = element.classList;

      if (!classList.contains(className)) {
        resolve(false);
        return;
      }

      // Step 1: generate animation id
      var animId = element.toString() + className + Math.random();

      // Step 2: Remove final className, so animation can start
      classList.remove(className);

      // Step 3: setup event to check whether animations started
      var animStart;
      this.addMultipleEventListener(element, "webkitAnimationStart animationstart", animStart = (evAnimStart) => {
        this.isAnimating = true;

        // Step 3.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 3.1: Animation exists, put on stack
        this.addAnimationToStack(animId);

        // Step 3.2: Wait for animation to finish
        var animEnd;
        this.addMultipleEventListener(element, "webkitAnimationEnd animationend", animEnd = (evAnimEnd) => {
          // Step 3.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 3.2.1 Remove -remove suffixed class
          classList.remove(className + "-remove");

          // Step 3.2.2 remove animation from stack
          this.removeAnimationFromStack(animId);

          // Step 3.2.3 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          this.isAnimating = false;
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

          resolve(false);
        }
      }, this.getElementAnimationDelay(element) + 400);
    });
  }

  addClass(element, className) {
    return new Promise( (resolve, reject) => {
      // Step 1: generate animation id
      var animId = element.toString() + className + Math.random(),
          classList = element.classList;

      // Step 2: setup event to check whether animations started
      var animStart;
      this.addMultipleEventListener(element, "webkitAnimationStart animationstart", animStart = (evAnimStart) => {
        this.isAnimating = true;

        // Step 2.0: Stop event propagation, bubbling will otherwise prevent parent animation
        evAnimStart.stopPropagation();

        // Step 2.1: Animation exists, put on stack
        this.addAnimationToStack(animId);

        // Step 2.2: Wait for animation to finish
        var animEnd;
        this.addMultipleEventListener(element, "webkitAnimationEnd animationend", animEnd = (evAnimEnd) => {
          // Step 2.2.0: Stop event propagation, bubbling will otherwise prevent parent animation
          evAnimEnd.stopPropagation();

          // Step 2.2.1: Add final className
          classList.add(className);

          // Step 2.2.2 Remove -add suffixed class
          classList.remove(className + "-add");

          // Step 2.2.3 remove animation from stack
          this.removeAnimationFromStack(animId);

          // Step 2.2.4 remove animationend listener
          evAnimEnd.target.removeEventListener(evAnimEnd.type, animEnd);

          this.isAnimating = false;
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

          resolve(false);
        }
      }, this.getElementAnimationDelay(element) + 400);
    });
  }
}
