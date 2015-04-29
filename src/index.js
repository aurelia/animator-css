import {Animator} from 'aurelia-templating';
import {CssAnimator} from './animator';

export {CssAnimator} from './animator';

export function configure(aurelia){
  Animator.configureDefault(aurelia.container, new CssAnimator());
}
