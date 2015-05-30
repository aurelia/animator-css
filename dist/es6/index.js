import {Animator} from 'aurelia-templating';
import {CssAnimator} from './animator';

export {CssAnimator} from './animator';

export function configure(aurelia, cb){
  var animator = new CssAnimator();
  Animator.configureDefault(aurelia.container, animator);
  cb(animator);
}
