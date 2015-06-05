import {Animator} from 'aurelia-templating';
import {CssAnimator} from './animator';

export {CssAnimator} from './animator';

export function configure(aurelia, cb){
  var animator = aurelia.container.get(CssAnimator);
  Animator.configureDefault(aurelia.container, animator);
  if(cb !== undefined && typeof(cb) === 'function') {
    cb(animator);
  }
}
