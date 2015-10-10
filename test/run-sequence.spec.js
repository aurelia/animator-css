import {CssAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-css', () => {
  var sut;

  beforeAll(() => initialize());
  beforeEach(() => {
    sut = new CssAnimator();
  });

  describe('runSequence function', () => {
    var elems;

    beforeEach(() => {
      loadFixtures('run-sequence.html');
      elems = $('.sequenced-items li');
    });

    it('should run multiple animations one after another', (done) => {
      var testClass = 'animate-test';

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
      var beginFired = false
        , doneFired = false
        , listenerBegin = document.addEventListener(animationEvent.sequenceBegin, () => beginFired = true)
        , listenerDone   = document.addEventListener(animationEvent.sequenceDone, () => doneFired = true);

      var testClass = 'animate-test';

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
