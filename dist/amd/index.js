define(['exports', 'aurelia-templating', './animator'], function (exports, _aureliaTemplating, _animator) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.install = install;
  Object.defineProperty(exports, 'CssAnimator', {
    enumerable: true,
    get: function get() {
      return _animator.CssAnimator;
    }
  });

  function install(aurelia) {
    _aureliaTemplating.Animator.configureDefault(aurelia.container, new _animator.CssAnimator());
  }
});