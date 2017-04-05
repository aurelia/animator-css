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

  describe('runSequence function', () => {
    let elems;

    beforeEach(() => {
      loadFixtures('run-sequence.html');
      elems = $('.sequenced-items li');
    });

    it('should run multiple animations one after another', (done) => {
      const testClass = 'animate-test';

      sut.runSequence([
        { element: elems.eq(0)[0], className: testClass },
        { element: elems.eq(1)[0], className: testClass },
        { element: elems.eq(2)[0], className: testClass }
      ]).then( () => {
        expect(elems.eq(0).css('opacity')).toBe('1');
        expect(elems.eq(1).css('opacity')).toBe('1');
        expect(elems.eq(2).css('opacity')).toBe('1');
        done();
      });
    });

    it('should fire sequence DOM events', () => {
      let beginFired = false;
      let doneFired = false;
      const listenerBegin = document.addEventListener(animationEvent.sequenceBegin, () => beginFired = true);
      const listenerDone = document.addEventListener(animationEvent.sequenceDone, () => doneFired = true);

      const testClass = 'animate-test';

      sut.runSequence([
        { element: elems.eq(0)[0], className: testClass },
        { element: elems.eq(1)[0], className: testClass },
        { element: elems.eq(2)[0], className: testClass }
      ]).then( () => {
        document.removeEventListener(animationEvent.sequenceBegin, listenerBegin);
        document.removeEventListener(animationEvent.sequenceDone, listenerDone);

        expect(beginFired).toBe(true);
        expect(doneFired).toBe(true);
      });
    });
  });
});
