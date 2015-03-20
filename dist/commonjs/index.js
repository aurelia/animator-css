"use strict";

exports.install = install;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var Animator = require("aurelia-templating").Animator;

exports.CssAnimator = require("./animator").CssAnimator;

function install(aurelia) {
  Animator.configureDefault(aurelia.container, new CssAnimator());
}