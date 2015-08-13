import {Animator} from 'aurelia-templating';
import {CssAnimator} from './animator';

export function configure(config, cb){
  var animator = config.container.get(CssAnimator);
  Animator.configureDefault(config.container, animator);
  if(typeof cb === 'function') {
    cb(animator);
  }
}
