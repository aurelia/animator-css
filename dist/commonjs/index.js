'use strict';

exports.__esModule = true;
exports.configure = configure;

var _Animator = require('aurelia-templating');

var _CssAnimator = require('./animator');

exports.CssAnimator = _CssAnimator.CssAnimator;

function configure(aurelia, cb) {
  var animator = new _CssAnimator.CssAnimator();
  _Animator.Animator.configureDefault(aurelia.container, animator);
  cb(animator);
}