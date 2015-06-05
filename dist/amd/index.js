define(['exports', 'aurelia-templating', './animator'], function (exports, _aureliaTemplating, _animator) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;
  exports.CssAnimator = _animator.CssAnimator;

  function configure(aurelia, cb) {
    var animator = aurelia.container.get(_animator.CssAnimator);
    _aureliaTemplating.Animator.configureDefault(aurelia.container, animator);
    if (cb !== undefined && typeof cb === 'function') {
      cb(animator);
    }
  }
});