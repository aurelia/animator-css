"use strict";

exports.install = install;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var Animator = require("aurelia-templating").Animator;

var _animator = require("./animator");

var CssAnimator = _animator.CssAnimator;
exports.CssAnimator = _animator.CssAnimator;

function install(aurelia) {
  Animator.configureDefault(aurelia.container, new CssAnimator());
}