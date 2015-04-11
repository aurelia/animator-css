'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.install = install;

var _Animator = require('aurelia-templating');

var _CssAnimator = require('./animator');

Object.defineProperty(exports, 'CssAnimator', {
  enumerable: true,
  get: function get() {
    return _CssAnimator.CssAnimator;
  }
});

function install(aurelia) {
  _Animator.Animator.configureDefault(aurelia.container, new _CssAnimator.CssAnimator());
}