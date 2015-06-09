'use strict';

exports.__esModule = true;
exports.configure = configure;

var _aureliaTemplating = require('aurelia-templating');

var _animator = require('./animator');

exports.CssAnimator = _animator.CssAnimator;

function configure(aurelia) {
  _aureliaTemplating.Animator.configureDefault(aurelia.container, new _animator.CssAnimator());
}