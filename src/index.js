import {TemplatingEngine} from 'aurelia-templating';
import {CssAnimator} from './animator';

/**
 * Configuires the CssAnimator as the default animator for Aurelia.
 * @param config The FrameworkConfiguration instance.
 * @param callback A configuration callback provided by the plugin consumer.
 */
export function configure(config: Object, callback?:(animator:CssAnimator) => void): void {
  let animator = config.container.get(CssAnimator);
  config.container.get(TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') { callback(animator); }
}
