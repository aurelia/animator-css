System.register(['aurelia-templating', './animator'], function (_export) {
  'use strict';

  var Animator, CssAnimator;

  _export('configure', configure);

  function configure(aurelia, cb) {
    var animator = aurelia.container.get(CssAnimator);
    Animator.configureDefault(aurelia.container, animator);
    if (cb !== undefined && typeof cb === 'function') {
      cb(animator);
    }
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