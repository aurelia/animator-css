import {TemplatingEngine} from 'aurelia-templating';
import {CssAnimator} from './animator';

export function configure(config: Object, callback?:(animator:CssAnimator) => void) {
  let animator = config.container.get(CssAnimator);
  config.container.get(TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') { callback(animator); }
}
