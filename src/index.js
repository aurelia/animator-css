import {Animator} from 'aurelia-templating';
import {CssAnimator} from './animator';

export function configure(config: Object, callback?:(animator:CssAnimator) => void){
  var animator = config.container.get(CssAnimator);

  Animator.configureDefault(config.container, animator);

  if(typeof callback === 'function') {
    callback(animator);
  }
}
