import {CssAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-css', () => {
  let sut;
  beforeAll(() => initialize());
  beforeEach(() => {
    sut = new CssAnimator();
  });
  describe('animate function', () => {
    let elem;
    let testClass;

    describe('with valid keyframes', () => {
      beforeEach(() => {
        loadFixtures('animate.html');
        elem      = $('#animateAddAndRemove').eq(0)[0];
        testClass = 'animate-test';
      });

      it('should add and remove a class automatically', (done) => {
        sut.animate(elem, testClass).then(() => {
          expect(sut.isAnimating).toBe(false);
          expect($('#animateAddAndRemove').eq(0).css('opacity')).toBe('0');
          done();
        });
      });

      it('should animate multiple elements', (done) => {
        let elements = $('.sequenced-items li');

        sut.animate([elements.eq(0)[0], elements.eq(1)[0], elements.eq(2)[0]], testClass).then(() => {
          expect(sut.isAnimating).toBe(false);
          expect(elements.eq(0).css('opacity')).toBe('1');
          expect(elements.eq(1).css('opacity')).toBe('1');
          expect(elements.eq(2).css('opacity')).toBe('1');
          done();
        });
      });

      it('should not fire add/remove events', (done) => {
        let eventCalled = false;
        const listenerAdd = document.addEventListener(animationEvent.addClassBegin, () => eventCalled = true);
        const listenerRemove = document.addEventListener(animationEvent.removeClassBegin, () => eventCalled = true);

        sut.animate(elem, testClass).then(() => {
          expect(eventCalled).toBe(false);

          document.removeEventListener(animationEvent.addClassBegin, listenerAdd);
          document.removeEventListener(animationEvent.removeClassBegin, listenerRemove);
          done();
        });
      });
    });

    // missing keyframes currently break the promise animator
    describe('without valid keyframes', () => {
      beforeEach(() => {
        loadFixtures('animate-missing-keyframes.html');
        elem      = $('#animateAddAndRemove').eq(0)[0];
        testClass = 'animate-test';
      });

      it('should add and remove a class automatically', (done) => {
        sut.animate(elem, testClass).then(() => {
          expect(sut.isAnimating).toBe(false);
          expect($('#animateAddAndRemove').eq(0).css('opacity')).toBe('0');
          done();
        });
      });
    });
  });
});
