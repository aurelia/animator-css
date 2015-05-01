define(['exports', 'aurelia-templating', './animator'], function (exports, _aureliaTemplating, _animator) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;
  exports.CssAnimator = _animator.CssAnimator;

  function configure(aurelia) {
    _aureliaTemplating.Animator.configureDefault(aurelia.container, new _animator.CssAnimator());
  }
});