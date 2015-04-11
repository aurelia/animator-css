import {CssAnimator} from '../src/animator';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-css', () => {
  var sut;
  beforeEach( () => {
    sut = new CssAnimator();
  });

  describe('enter animation', () => {
    var elem;
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('.au-animate').eq(0)[0];
    });

    it('should return a promise', () => {
      var result = sut.enter(elem);
      expect(result.then).toBeDefined();
    });

    it('should remove animation from stack after done', (done) => {
      var elem = $('.animated-item').eq(0)[0];

      sut.enter(elem).then( () => {
        expect(sut.animationStack.length).toBe(0);
        done();
      });
    });

    it('should kick off animation', (done) => {
      var elem = $('.animated-item').eq(0)[0];

      sut.enter(elem).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(true);
        done();
      });
    });

    it('should not kick off animation on element without proper classes', (done) => {
      var elem = $('.boring-item').eq(0)[0];
      sut.enter(elem).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(false);
        done();
      });
    });

    it('should cleanup animation classes', (done) => {
      var elem = $('.animated-item').eq(0)[0];

      sut.enter(elem).then( (didRunAnimation) => {
        expect(elem.classList.contains("au-enter")).toBe(false);
        expect(elem.classList.contains("au-enter-active")).toBe(false);
        done();
      });
    });
  });

  describe('leave animation', () => {
    var elem;
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('.au-animate').eq(0)[0];
    });

    it('should return a promise', () => {
      var result = sut.leave(elem);
      expect(result.then).toBeDefined();
    });

    it('should remove animation from stack after done', (done) => {
      var result = sut.leave(elem).then( () => {
        expect(sut.animationStack.length).toBe(0);
        done();
      });
    });

    it('should kick off animation', (done) => {
      var elem = $('.animated-item').eq(0)[0];

      sut.leave(elem).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(true);
        done();
      });
    });

    it('should not kick off animation on element without proper classes', (done) => {
      var elem = $('.boring-item').eq(0)[0];
      sut.leave(elem).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(false);
        done();
      });
    });

    it('should cleanup animation classes', (done) => {
      var elem = $('.animated-item').eq(0)[0];

      sut.enter(elem).then( (didRunAnimation) => {
        expect(elem.classList.contains("au-leave")).toBe(false);
        expect(elem.classList.contains("au-leave-active")).toBe(false);
        done();
      });
    });
  });

  describe('removeClass animation', () => {
    var elem,
        testClass;

    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#goingToBeShown').eq(0)[0];
      testClass = 'hidden';
    });

    it('should return a promise', () => {
      var result = sut.removeClass(elem, testClass);
      expect(result.then).toBeDefined();
    });

    it('should remove animation from stack after done', (done) => {
      var result = sut.removeClass(elem, testClass).then( () => {
        expect(sut.animationStack.length).toBe(0);
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
      var elem = $('#removeClassWrong').eq(0)[0];
      sut.removeClass(elem, testClass).then( (didRunAnimation) => {
        expect(didRunAnimation).toBe(false);
        done();
      });
    });

    it('should cleanup animation classes', (done) => {
      sut.removeClass(elem, testClass).then( (didRunAnimation) => {
        expect(elem.classList.contains(testClass)).toBe(false);
        expect(elem.classList.contains(testClass + "-remove")).toBe(false);
        done();
      });
    });
  });

  describe('addClass animation', () => {
    var elem,
      testClass;

    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#goingToBeIncreased').eq(0)[0];
      testClass = 'addMoreWidth';
    });

    it('should return a promise', () => {
      var result = sut.addClass(elem, testClass);
      expect(result.then).toBeDefined();
    });

    it('should remove animation from stack after done', (done) => {
      var result = sut.addClass(elem, testClass).then( () => {
        expect(sut.animationStack.length).toBe(0);
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
        expect(elem.classList.contains(testClass + "-add")).toBe(false);
        done();
      });
    });
  });
});
