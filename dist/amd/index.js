define(['exports', 'aurelia-templating', './animator'], function (exports, _aureliaTemplating, _animator) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;
  exports.CssAnimator = _animator.CssAnimator;

  function configure(aurelia, cb) {
    var animator = new _animator.CssAnimator();
    _aureliaTemplating.Animator.configureDefault(aurelia.container, animator);
    cb(aurelia.container.get(_animator.CssAnimator));
  }
});