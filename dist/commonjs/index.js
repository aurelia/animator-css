'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaAnimatorCss = require('./aurelia-animator-css');

Object.keys(_aureliaAnimatorCss).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaAnimatorCss[key];
    }
  });
});