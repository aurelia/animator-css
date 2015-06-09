System.register(['aurelia-templating', './animator'], function (_export) {
  'use strict';

  var Animator, CssAnimator;

  _export('configure', configure);

  function configure(aurelia) {
    Animator.configureDefault(aurelia.container, new CssAnimator());
  }

  return {
    setters: [function (_aureliaTemplating) {
      Animator = _aureliaTemplating.Animator;
    }, function (_animator) {
      CssAnimator = _animator.CssAnimator;

      _export('CssAnimator', _animator.CssAnimator);
    }],
    execute: function () {}
  };
});