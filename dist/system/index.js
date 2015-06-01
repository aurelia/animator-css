System.register(['aurelia-templating', './animator'], function (_export) {
  var Animator, CssAnimator;

  _export('configure', configure);

  function configure(aurelia, cb) {
    var animator = new CssAnimator();
    Animator.configureDefault(aurelia.container, animator);
    cb(aurelia.container.get(CssAnimator));
  }

  return {
    setters: [function (_aureliaTemplating) {
      Animator = _aureliaTemplating.Animator;
    }, function (_animator) {
      CssAnimator = _animator.CssAnimator;

      _export('CssAnimator', _animator.CssAnimator);
    }],
    execute: function () {
      'use strict';
    }
  };
});