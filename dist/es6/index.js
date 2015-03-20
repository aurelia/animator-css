import {Animator} from 'aurelia-templating';
export {CssAnimator} from './animator';

export function install(aurelia){
  Animator.configureDefault(aurelia.container, new CssAnimator());
}
