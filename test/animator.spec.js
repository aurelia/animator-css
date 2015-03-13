import {Animator} from '../src/animator';
import $ from 'jquery';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-css', () => {
  var sut;
  beforeEach( () => {
    sut = new Animator();
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
      var result = sut.enter(elem).then( () => {
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
});
