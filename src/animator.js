export class Animator {
  constructor() {
    Animator.instance = this;
    this.animationStack = [];
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

  move() {
    return Promise.resolve(false);
  }

  enter(element) {
    return new Promise( (resolve, reject) => {
      // Step 1: generate animation id
      var animId = element.toString() + Math.random(),
          classList = element.classList;

      // Step 2: Add animation preparation class
      classList.add('au-enter');

      // Step 3: setup event to check whether animations started
      var animStart;
      this.addMultipleEventListener(element, "webkitAnimationStart animationstart", animStart = (evAnimStart) => {
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

          resolve(true);
        }, false);

        // Step 3.3 remove animationstart listener
        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 4: Add active class to kick off animation
      classList.add('au-enter-active');

      // Step 5: if no animations happened cleanup animation classes
      setTimeout(() => {
        if (this.animationStack.indexOf(animId) < 0) {
          classList.remove('au-enter-active');
          classList.remove('au-enter');

          resolve(false);
        }
      }, 50);
    });
  }

  leave(element) {
    return new Promise( (resolve, reject) => {
      // Step 1: generate animation id
      var animId = element.toString() + Math.random(),
          classList = element.classList;

      // Step 2: Add animation preparation class
      classList.add('au-leave');

      // Step 3: setup event to check whether animations started
      var animStart;
      this.addMultipleEventListener(element, "webkitAnimationStart animationstart", animStart = (evAnimStart) => {
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

          resolve(true);
        }, false);

        // Step 3.3 remove animationstart listener
        evAnimStart.target.removeEventListener(evAnimStart.type, animStart);
      }, false);

      // Step 4: Add active class to kick off animation
      classList.add('au-leave-active');

      // Step 5: if no animations happened cleanup animation classes
      setTimeout(() => {
        if (this.animationStack.indexOf(animId) < 0) {
          classList.remove('au-leave-active');
          classList.remove('au-leave');

          resolve(false);
        }
      }, 50);
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
      }, 50);
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
      }, 50);
    });
  }
}
