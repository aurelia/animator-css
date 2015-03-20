define(["exports", "aurelia-templating", "./animator"], function (exports, _aureliaTemplating, _animator) {
  "use strict";

  exports.install = install;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Animator = _aureliaTemplating.Animator;
  exports.CssAnimator = _animator.CssAnimator;

  function install(aurelia) {
    Animator.configureDefault(aurelia.container, new CssAnimator());
  }
});