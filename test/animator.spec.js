import {configure} from '../src/index';
import {CssAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-css', () => {
  let sut;
  beforeAll(() => initialize());
  beforeEach( () => {
    sut = new CssAnimator();
  });

  describe('plugin initialization', () => {
    let aurelia = {
      globalResources: () => {

      },
      container: {
        registerInstance: (type, instance) => {

        },
        get: (type) => {
          if (type === CssAnimator) {
            return new CssAnimator();
          }

          return {
            configureAnimator() {

            }
          };
        }
      }
    };

    it('should export configure function', () => {
      expect(typeof configure).toBe('function');
    });

    it('should accept a setup callback passing back the animator instance', (done) => {
      const cb = (instance) => {
        expect(typeof instance).toBe('object');
        done();
      };

      configure(aurelia, cb);
    });

    it('should have animation done classes disabled by default', () => {
      configure(aurelia, (instance) => {
        expect(instance.useAnimationDoneClasses).toBe(false);
      });
    });
  });

  describe('enter animation', () => {
    let elem;

    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('.au-animate').eq(0)[0];
    });

    it('should return a promise', () => {
      const result = sut.enter(elem).catch((error) => { throw error; });
      expect(result.then).toBeDefined();
    });

    it('should remove animation from stack after done', (done) => {
      const elemAnimated = $('.animated-item').eq(0)[0];

      sut.enter(elemAnimated).then( () => {
        expect(sut.isAnimating).toBe(false);
        done();
      });
    });

    it('should respect animation-delay', (done) => {
      const elemAnimated = $('#delayedElement').eq(0)[0];

      sut.enter(elemAnimated).then( () => {
        expect(sut.isAnimating).toBe(false);
        done();
      });
    });

    it('should kick off animation', (done) => {
      const elemAnimated = $('.animated-item').eq(0)[0];

      sut.enter(elemAnimated).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(true);
        done();
      });
    });

    it('should not kick off animation on element without proper classes', (done) => {
      const elemAnimated = $('.boring-item').eq(0)[0];
      sut.enter(elemAnimated).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(false);
        done();
      });
    });

    it('should cleanup animation classes', (done) => {
      const elemAnimated = $('.animated-item').eq(0)[0];

      sut.enter(elemAnimated).then( () => {
        expect(elemAnimated.classList.contains('au-enter')).toBe(false);
        expect(elemAnimated.classList.contains('au-enter-active')).toBe(false);
        done();
      });
    });

    it('should not add left class by default', (done) => {
      const elemAnimated = $('.animated-item').eq(0)[0];

      sut.enter(elemAnimated).then( () => {
        expect(elemAnimated.classList.contains('au-entered')).toBe(false);
        done();
      });
    });

    it('should add configured entered class', (done) => {
      sut.useAnimationDoneClasses = true;
      sut.animationEnteredClass = 'custom-entered';

      const elemAnimated = $('.animated-item').eq(0)[0];

      sut.enter(elemAnimated).then( () => {
        expect(elemAnimated.classList.contains('custom-entered')).toBe(true);
        done();
      });
    });

    it('should not add undefined done class', (done) => {
      sut.useAnimationDoneClasses = true;
      sut.animationEnteredClass = undefined;

      const elemAnimated = $('.animated-item').eq(0)[0];

      sut.enter(elemAnimated).then( () => {
        expect(elemAnimated.classList.contains('undefined')).toBe(false);
        done();
      });
    });

    it('should set isAnimating to active during animations', (done) => {
      sut.enter($('.animated-item').eq(0)[0]).then( () => {
        expect(sut.isAnimating).toBe(false);
        done();
      });

      setTimeout( () => {
        expect(sut.isAnimating).toBe(true);
      }, 70);
    });

    it('should publish expected events', (done) => {
      let elemAnimated = $('.animated-item').eq(0)[0];
      let enterBeginCalled = false;
      let enterActiveCalled = false;
      let enterDoneCalled = false;

      const l1 = document.addEventListener(animationEvent.enterBegin, (payload) => enterBeginCalled = true);
      const l2 = document.addEventListener(animationEvent.enterActive, (payload) => enterActiveCalled = true);
      const l3 = document.addEventListener(animationEvent.enterDone, () => enterDoneCalled = true);

      sut.enter(elemAnimated).then( () => {
        expect(enterBeginCalled).toBe(true);
        expect(enterActiveCalled).toBe(true);
        expect(enterDoneCalled).toBe(true);

        document.removeEventListener(animationEvent.enterBegin, l1, false);
        document.removeEventListener(animationEvent.enterActive, l2, false);
        document.removeEventListener(animationEvent.enterDone, l3, false);
        done();
      });
    });

    it('should publish timeout event', (done) => {
      let elemAnimated = $('.boring-item').eq(0)[0];
      let timeoutCalled = false;

      const listener = document.addEventListener(animationEvent.enterTimeout, () => {
        timeoutCalled = true;
      });

      sut.enter(elemAnimated).then( () => {
        expect(timeoutCalled).toBe(true);
        document.removeEventListener(animationEvent.enterTimeout, listener, false);
        done();
      });
    });
  });

  describe('leave animation', () => {
    let elem;
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('.au-animate').eq(0)[0];
    });

    it('should return a promise', () => {
      const result = sut.leave(elem);
      expect(result.then).toBeDefined();
    });

    it('should remove animation from stack after done', (done) => {
      sut.leave(elem).then( () => {
        expect(sut.isAnimating).toBe(false);
        done();
      });
    });

    it('should kick off animation', (done) => {
      const elemAnimated = $('.animated-item').eq(0)[0];

      sut.leave(elemAnimated).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(true);
        done();
      });
    });

    it('should not kick off animation on element without proper classes', (done) => {
      const elemAnimated = $('.boring-item').eq(0)[0];
      sut.leave(elemAnimated).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(false);
        done();
      });
    });

    it('should cleanup animation classes', (done) => {
      const elemAnimated = $('.animated-item').eq(0)[0];

      sut.enter(elemAnimated).then( () => {
        expect(elemAnimated.classList.contains('au-leave')).toBe(false);
        expect(elemAnimated.classList.contains('au-leave-active')).toBe(false);
        done();
      });
    });

    it('should not add left class by default', (done) => {
      const elemAnimated = $('.animated-item').eq(0)[0];

      sut.leave(elemAnimated).then( () => {
        expect(elemAnimated.classList.contains('au-left')).toBe(false);
        done();
      });
    });

    it('should add configured entered class', (done) => {
      sut.useAnimationDoneClasses = true;
      sut.animationLeftClass = 'custom-left';

      const elemAnimated = $('.animated-item').eq(0)[0];

      sut.leave(elemAnimated).then( () => {
        expect(elemAnimated.classList.contains('custom-left')).toBe(true);
        done();
      });
    });

    it('should not add undefined done class', (done) => {
      sut.useAnimationDoneClasses = true;
      sut.animationLeftClass = undefined;

      const elemAnimated = $('.animated-item').eq(0)[0];

      sut.leave(elemAnimated).then( () => {
        expect(elemAnimated.classList.contains('undefined')).toBe(false);
        done();
      });
    });

    it('should set isAnimating to active during animations', (done) => {
      sut.leave($('.animated-item').eq(0)[0]).then( () => {
        expect(sut.isAnimating).toBe(false);
        done();
      });

      setTimeout( () => {
        expect(sut.isAnimating).toBe(true);
      }, 70);
    });

    it('should publish expected events', (done) => {
      let elemPublish = $('.animated-item').eq(0)[0];
      let leaveBeginCalled = false;
      let leaveActiveCalled = false;
      let leaveDoneCalled = false;

      const l1 = document.addEventListener(animationEvent.leaveBegin, (payload) => leaveBeginCalled = true);
      const l2 = document.addEventListener(animationEvent.leaveActive, (payload) => leaveActiveCalled = true);
      const l3 = document.addEventListener(animationEvent.leaveDone, () => leaveDoneCalled = true);


      sut.leave(elemPublish).then( () => {
        expect(leaveBeginCalled).toBe(true);
        expect(leaveActiveCalled).toBe(true);
        expect(leaveDoneCalled).toBe(true);

        document.removeEventListener(animationEvent.leaveBegin, l1, false);
        document.removeEventListener(animationEvent.leaveActive, l2, false);
        document.removeEventListener(animationEvent.leaveDone, l3, false);

        done();
      });
    });

    it('should publish timeout event', (done) => {
      let elemTimeout = $('.boring-item').eq(0)[0];
      let timeoutCalled = false;

      const listener = document.addEventListener(animationEvent.leaveTimeout, () => {
        timeoutCalled = true;
      });

      sut.leave(elemTimeout).then( () => {
        expect(timeoutCalled).toBe(true);
        document.removeEventListener(animationEvent.leaveTimeout, listener, false);
        done();
      });
    });
  });

  describe('removeClass animation', () => {
    let elem;
    let testClass;

    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#goingToBeShown').eq(0)[0];
      testClass = 'hidden';
    });

    it('should return a promise', () => {
      const result = sut.removeClass(elem, testClass);
      expect(result.then).toBeDefined();
    });

    it('should remove animation from stack after done', (done) => {
      sut.removeClass(elem, testClass).then( () => {
        expect(sut.isAnimating).toBe(false);
        done();
      });
    });

    it('should kick off animation', (done) => {
      sut.removeClass(elem, testClass).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(true);
        done();
      });
    });

    it('should not kick off animation on element without proper classes', (done) => {
      sut.removeClass($('#removeClassWrong').eq(0)[0], testClass).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(false);
        done();
      });
    });

    it('should cleanup animation classes', (done) => {
      sut.removeClass(elem, testClass).then( () => {
        expect(elem.classList.contains(testClass)).toBe(false);
        expect(elem.classList.contains(testClass + '-remove')).toBe(false);
        done();
      });
    });

    it('should set isAnimating to active during animations', (done) => {
      sut.removeClass(elem, testClass).then( () => {
        expect(sut.isAnimating).toBe(false);
        done();
      });

      setTimeout( () => {
        expect(sut.isAnimating).toBe(true);
      }, 70);
    });

    it('should publish expected events', (done) => {
      let removeClassBeginCalled = false;
      let removeClassDoneCalled = false;

      let l1 = document.addEventListener(animationEvent.removeClassBegin, () => removeClassBeginCalled = true);
      let l2 = document.addEventListener(animationEvent.removeClassDone, () => removeClassDoneCalled = true);

      sut.removeClass(elem, testClass).then(() => {
        expect(removeClassBeginCalled).toBe(true);
        expect(removeClassDoneCalled).toBe(true);

        document.removeEventListener(animationEvent.removeClassBegin, l1, false);
        document.removeEventListener(animationEvent.removeClassDone, l2, false);
        done();
      });
    });

    it('should publish timeout event', (done) => {
      let elemTimeout = $('#removeClassNoAnim').eq(0)[0];
      let timeoutCalled = false;

      document.addEventListener(animationEvent.removeClassTimeout, () => {
        timeoutCalled = true;
      });

      sut.removeClass(elemTimeout, 'remove-non-anim').then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(false);
        expect(timeoutCalled).toBe(true);
        done();
      });
    });
  });

  describe('addClass animation', () => {
    let elem;
    let testClass;

    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#goingToBeIncreased').eq(0)[0];
      testClass = 'addMoreWidth';
    });

    it('should return a promise', () => {
      const result = sut.addClass(elem, testClass);
      expect(result.then).toBeDefined();
    });

    it('should remove animation from stack after done', (done) => {
      sut.addClass(elem, testClass).then( () => {
        expect(sut.isAnimating).toBe(false);
        done();
      });
    });

    it('should kick off animation', (done) => {
      sut.addClass(elem, testClass).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(true);
        expect($(elem).css('width')).toBe('40px');
        done();
      });
    });

    it('should not kick off animation on element without proper classes', (done) => {
      sut.addClass(elem, 'nonAnimatedWidth').then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(false);
        done();
      });
    });

    it('should cleanup animation classes', (done) => {
      sut.addClass(elem, testClass).then( (didRunAnimation) => {
        expect(elem.classList.contains(testClass)).toBe(true);
        expect(elem.classList.contains(testClass + '-add')).toBe(false);
        done();
      });
    });

    it('should set isAnimating to active during animations', (done) => {
      sut.addClass(elem, testClass).then( () => {
        expect(sut.isAnimating).toBe(false);
        done();
      });

      setTimeout( () => {
        expect(sut.isAnimating).toBe(true);
      }, 70);
    });

    it('should publish expected events', (done) => {
      let addClassBeginCalled = false;
      let addClassDoneCalled = false;

      let l1 = document.addEventListener(animationEvent.addClassBegin, () => addClassBeginCalled = true);
      let l2 = document.addEventListener(animationEvent.addClassDone, () => addClassDoneCalled = true);

      sut.addClass(elem, testClass).then( () => {
        expect(addClassBeginCalled).toBe(true);
        expect(addClassDoneCalled).toBe(true);

        document.removeEventListener(animationEvent.addClassBegin, l1, false);
        document.removeEventListener(animationEvent.addClassDone, l2, false);
        done();
      });
    });

    it('should publish timeout event', (done) => {
      const elemTimeout = $('#addClassNoAnim').eq(0)[0];
      let timeoutCalled = false;

      document.addEventListener(animationEvent.addClassTimeout, () => {
        timeoutCalled = true;
      });

      sut.addClass(elemTimeout, 'add-non-anim').then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(false);
        expect(timeoutCalled).toBe(true);
        done();
      });
    });
  });

  describe('add and removeClass', () => {
    let elem;
    let testClass;

    beforeEach(() => {
      loadFixtures('addremove.html');
      elem = $('#elem').eq(0)[0];
      testClass = 'aurelia-hide';
    });

    it('should handle quick add and remove cycle', (done) => {
      let ok = [];

      ok.push(sut.addClass(elem, testClass));

      setTimeout( () => {
        ok.push(sut.removeClass(elem, testClass));
      }, 49);

      setTimeout( () => {
        Promise.all(ok).then( () => {
          expect(elem.classList.contains(testClass)).toBe(false);
          done();
        });
      }, 500);
    });
  });

  describe('event listener cleanup', () => {
    let el;

    beforeEach(() => {
      loadFixtures('addremove.html');
      el = $('#overlap').eq(0)[0];
      sut.addClass(el, 'aurelia-hide');
    });

    it('should remove event listeners when no animation occurs', (done) => {
      expect(el.classList.contains('fade-in')).toBe(true);
      expect(el.classList.contains('aurelia-hide')).toBe(true);

      sut.removeClass(el, 'aurelia-hide');
      setTimeout(function() {
        expect(el.classList.contains('fade-in')).toBe(true);
        expect(el.classList.contains('aurelia-hide')).toBe(false);
        done();
      }, 2000);
    });
  });

  describe('staggering animations', () => {
    let elems;

    beforeEach(() => {
      sut.useAnimationDoneClasses = true;
      loadFixtures('animation.html');
      elems = $('.stagger');
      $(elems).removeClass('au-left');
    });

    it('should trigger stagger event', (done) => {
      let proms = [];
      let eventCalled = false;

      let listener = document.addEventListener(animationEvent.staggerNext, () => eventCalled = true);

      elems.each( (idx, elem) => {
        proms.push(sut.enter(elem));
      });

      Promise.all(proms).then( () => {
        expect(eventCalled).toBe(true);

        document.removeEventListener(animationEvent.staggerNext, listener);
        done();
      });
    });

    it('should animate enter elements staggered', (done) => {
      let proms = [];
      elems.each( (idx, elem) => {
        proms.push(sut.enter(elem));
      });

      let time = Date.now();
      Promise.all(proms).then( () => {
        let complete = (Date.now() - time) <= 1500 + 100 * elems.length;
        expect(complete).toBe(true);
        elems.each( (idx, elem) => {
          expect($(elem).css('opacity')).toBe('1');
        });
        done();
      });
    });

    it('should animate leave elements staggered', (done) => {
      let proms = [];
      elems.each( (idx, elem) => {
        proms.push(sut.leave(elem));
      });

      let time = Date.now();
      Promise.all(proms).then( () => {
        let complete = (Date.now() - time) <= 1500 + 100 * elems.length;
        expect(complete).toBe(true);
        elems.each( (idx, elem) => {
          expect($(elem).css('opacity')).toBe('0');
        });
        done();
      });
    });

    it('should animate enter element using stagger-enter', (done) => {
      let eelems = $('.stagger-enter-only');

      setTimeout( () => {
        expect($(eelems[0]).css('opacity')).not.toBe('0');
        expect($(eelems[eelems.length - 1]).css('opacity')).toBe('0');
      }, 100 );

      let proms = [];
      eelems.each( (idx, elem) => {
        proms.push(sut.enter(elem));
      });

      Promise.all(proms).then( () => {
        eelems.each( (idx, elem) => {
          expect($(elem).css('opacity')).toBe('1');
        });
        done();
      });
    });

    it('should animate leave element using stagger-leave', (done) => {
      let lelems = $('.stagger-leave-only');

      setTimeout( () => {
        expect($(lelems[0]).css('opacity')).not.toBe('1');
        expect($(lelems[lelems.length - 1]).css('opacity')).toBe('1');
      }, 100 );

      let proms = [];
      lelems.each( (idx, elem) => {
        proms.push(sut.leave(elem));
      });

      Promise.all(proms).then( () => {
        lelems.each( (idx, elem) => {
          expect($(elem).css('opacity')).toBe('0');
        });
        done();
      });
    });

    it('should ignore exising elements when calculating stagger delay', (done) => {
      elems = $('.stagger');

      let anim = (s, e, d) => {
        let proms = [];
        for ( let i = s; i < e; ++i ) {
          proms.push(sut[d](elems[i]));
        }

        return Promise.all(proms);
      };

      anim(0, 2, 'enter').then( () => {
        let time = Date.now();
        Promise.all([anim(3, 4, 'enter'), anim(0, 2, 'leave')]).then(() => {
          expect((Date.now() - time) <= 1500 + 200).toBe(true);
          done();
        });
      });
    });
  });
});
