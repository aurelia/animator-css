<a name="1.0.4"></a>
## [1.0.4](https://github.com/aurelia/animator-css/compare/1.0.3...v1.0.4) (2017-10-23)

### Bug Fixes

* Resolve a race condition with addClass/removeClass
  * Prematurely ends animations if their opposite is triggered

<a name="1.0.3"></a>
## [1.0.3](https://github.com/aurelia/animator-css/compare/1.0.2...v1.0.3) (2017-10-02)


### Bug Fixes

* **events:** start and end events capture bubbles ([bb85e90](https://github.com/aurelia/animator-css/commit/bb85e90))
* **stagger:** add leave animation stagger ([#62](https://github.com/aurelia/animator-css/issues/62)) ([74904c4](https://github.com/aurelia/animator-css/commit/74904c4))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/aurelia/animator-css/compare/1.0.1...v1.0.2) (2017-04-05)


### Bug Fixes

* **lint:** fixes linting issues ([80ce3d1](https://github.com/aurelia/animator-css/commit/80ce3d1))
* **stagger:** delay calculation ([6112d34](https://github.com/aurelia/animator-css/commit/6112d34)), closes [#55](https://github.com/aurelia/animator-css/issues/55)
* **types:** switch to Element interface ([de66cf0](https://github.com/aurelia/animator-css/commit/de66cf0))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/aurelia/animator-css/compare/1.0.0...v1.0.1) (2016-09-05)


### Bug Fixes

* **CssAnimator:** clear event handlers when there's no animation ([7683336](https://github.com/aurelia/animator-css/commit/7683336)), closes [#47](https://github.com/aurelia/animator-css/issues/47)
* **cssRules:** add additional try/catch ([4e21ea8](https://github.com/aurelia/animator-css/commit/4e21ea8)), closes [#40](https://github.com/aurelia/animator-css/issues/40)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/animator-css/compare/1.0.0-rc.1.0.0...v1.0.0) (2016-07-27)



<a name="1.0.0-rc.1.0.0"></a>
# [1.0.0-rc.1.0.0](https://github.com/aurelia/animator-css/compare/1.0.0-beta.2.0.1...v1.0.0-rc.1.0.0) (2016-06-22)



### 1.0.0-beta.1.2.1 (2016-05-10)


### 1.0.0-beta.1.2.0 (2016-03-22)


#### Bug Fixes

* **cssRules:** add try catch ([d66df21c](https://github.com/aurelia/animator-css/commit/d66df21c84a889d6867a20fad9639920109b5af6))


### 1.0.0-beta.1.1.2 (2016-03-01)


#### Bug Fixes

* **CssAnimator:** stagger only child elements ([219b5c79](https://github.com/aurelia/animator-css/commit/219b5c791209c70b78e287dc7654eb174f1e00d2))


### 1.0.0-beta.1.1.1 (2016-02-08)


### 1.0.0-beta.1.1.0 (2016-01-29)


#### Features

* **all:** update jspm meta; core-js; aurelia deps ([b6f0a247](https://github.com/aurelia/animator-css/commit/b6f0a247f73264d21f2d23f960fe7c3263bab121))


### 1.0.0-beta.1.0.3 (2016-01-08)


#### Bug Fixes

* **cssRule:** fix cssrule null ([d26e0bd8](https://github.com/aurelia/animator-css/commit/d26e0bd8755bce93b5a349c3e8fb120e0551b2d3))


### 1.0.0-beta.1.0.2 (2015-12-16)


#### Bug Fixes

* **npm-convention:** npm test works ([d44f2ca5](https://github.com/aurelia/animator-css/commit/d44f2ca513ce3a87ff17dbeae191c4ab0c4f28e0))
* **race-condition:**
  * fix for missing animationend event under stress ([f7963e3e](https://github.com/aurelia/animator-css/commit/f7963e3e76871704822408b32bd0caa5f111cd93))
  * test for animation occurring without timeout ([3eefc533](https://github.com/aurelia/animator-css/commit/3eefc5334556403adb9284b9051187ba27f72939))
* **tests:** Fixed ReferenceError in two tests ([f976e0b0](https://github.com/aurelia/animator-css/commit/f976e0b09a98136d702144747b4475547c349cb8))


## 1.0.0-beta.1.0.1 (2015-11-17)


#### Bug Fixes

* **classes:** fix timing issue of add and remove class ([4e756c34](https://github.com/aurelia/animator-css/commit/4e756c346e5945d75ecbe9122e8035e63edbfc8c))
* **typing:** add testcase for timing issue ([893059a8](https://github.com/aurelia/animator-css/commit/893059a868fab7cace7f805bf265c78d3d8fcfff))


### 1.0.0-beta.1 (2015-11-16)


## 0.18.0 (2015-11-10)


#### Bug Fixes

* **all:** update to use TemplatingEngine to install animator ([a06a44e9](https://github.com/aurelia/animator-css/commit/a06a44e94f1bff4546e7ad50f119fcc0c5daf5d1))
* **animator:** remove unneeded move method ([2eac6407](https://github.com/aurelia/animator-css/commit/2eac6407ad92f72997f6566e3c3011963733dc82))


## 0.17.0 (2015-10-13)


#### Bug Fixes

* **CssAnimation:** add export to interface ([8fbea194](https://github.com/aurelia/animator-css/commit/8fbea194e4ea8bf070b02dd969ed0a80042b0f53))
* **all:**
  * update to latest plugin api ([3a5210c0](https://github.com/aurelia/animator-css/commit/3a5210c0289dc3d65460b6b61f71fa88bb32c138))
  * update compiler ([982f6f60](https://github.com/aurelia/animator-css/commit/982f6f60513e801672213be31a6aed2f39458fe3))
* **build:**
  * update linting, testing and tools ([8a14252d](https://github.com/aurelia/animator-css/commit/8a14252db8dcd28cde743f33f291a03949e5e1d7))
  * add built files for jspm registry ([a136d93c](https://github.com/aurelia/animator-css/commit/a136d93c384d5674db7a51fa3d9979a4dbf3cd18))
* **deps:**
  * Checkin missing build ([87504049](https://github.com/aurelia/animator-css/commit/87504049e2535ad74c40526327b2942b74e3ab90))
  * Update dependency, fix CssAnimator import ([a0f9ebf3](https://github.com/aurelia/animator-css/commit/a0f9ebf3c23a5b1929d67147d74be97ecd5addb9))
* **index:** update to new framework configuration api ([8930d386](https://github.com/aurelia/animator-css/commit/8930d3864a10b63d4680f1be316a124a2d4b4fdc))
* **instance:**
  * fix instance passing ([9236153b](https://github.com/aurelia/animator-css/commit/9236153b45e61a9e400680ef3aa2623ca1d40f1d))
  * ensure callback returns DI instance ([06b20691](https://github.com/aurelia/animator-css/commit/06b20691a4ef06517671e4e6eb6035510621b322))
* **package:**
  * add metadata dependency ([2328ea2f](https://github.com/aurelia/animator-css/commit/2328ea2f4e9142d4f8ee5c1c6727213ea13964f3))
  * update dependencies ([17e4eb9e](https://github.com/aurelia/animator-css/commit/17e4eb9efbee0cf08a753b26c751a4b390311aed))
* **stagger:** check for null/undefined on stagger parent ([cb5dfa33](https://github.com/aurelia/animator-css/commit/cb5dfa3305bd5c330690d76db65cb0ac4be549a4))
* **test:** Fixes tests and updates dependencies ([fd0bf514](https://github.com/aurelia/animator-css/commit/fd0bf514c9cd1086ead7f9ad6eb40d765b6ab58d))
* **tests:**
  * split up unit tests ([ba524a6d](https://github.com/aurelia/animator-css/commit/ba524a6d4dfc112d6dc20b9cbeb062249f691894))
  * Fix tests and remove JSPM jquery ([22fe4de8](https://github.com/aurelia/animator-css/commit/22fe4de88e66d8b3188fd3dd7abb4078857c6088))
* **timeout:** fixes timeouts for animation triggers ([9fb1ffa6](https://github.com/aurelia/animator-css/commit/9fb1ffa60fb4d926d4e4e587529693be8ea005ce))
* **typing:** add type information ([f28fdba9](https://github.com/aurelia/animator-css/commit/f28fdba95b77fb8a162af3ea58d55ad4741b1ff9))


#### Features

* **all:**
  * incorporate pal ([ede4dfc0](https://github.com/aurelia/animator-css/commit/ede4dfc04fd1f3b980d790062e25785528f114b6))
  * add more type info ([8fd02a8f](https://github.com/aurelia/animator-css/commit/8fd02a8fa7ce5211efd1e83b1d22f1710a99e8df))
  * add plugin api support ([19f4f740](https://github.com/aurelia/animator-css/commit/19f4f74054da97177e13d3e55333a5f7deddab15))
* **anim:** implements animator-css service ([83f23e16](https://github.com/aurelia/animator-css/commit/83f23e16c2cf080cc79c0434e60e6173ddb3d8a9))
* **anim-delay:** respect set animation delay ([f54e624a](https://github.com/aurelia/animator-css/commit/f54e624af40bc22526106a9617ce24cb73a000a7))
* **anim-done:** indicate when animation is done via classes ([6779c9ff](https://github.com/aurelia/animator-css/commit/6779c9ffc02d9083fd8f1bbc8da60989713ab008))
* **beta:** new methods, events and refactoring ([1bb61d76](https://github.com/aurelia/animator-css/commit/1bb61d7650aaaa62a556b80e572656e9491c08f2))
* **events:** trigger animation events ([affc3710](https://github.com/aurelia/animator-css/commit/affc3710b96fbf4d165e58cec81bbf33e3b099cf))
* **isAnimating:** indicator for whether an animation is active ([277f81bf](https://github.com/aurelia/animator-css/commit/277f81bf97d5193487c6da24ce2fd1273823cd53))
* **stagger:**
  * add split stagger feature ([eb27d3e6](https://github.com/aurelia/animator-css/commit/eb27d3e6e8e54bf176abbb5a04ec6734c8e81aff))
  * add staggering animations ([d57d22b6](https://github.com/aurelia/animator-css/commit/d57d22b6dd6f4653c8463e27b41cedd38f7c7df3))


## 0.16.0 (2015-09-05)


#### Bug Fixes

* **CssAnimation:** add export to interface ([8fbea194](https://github.com/aurelia/animator-css/commit/8fbea194e4ea8bf070b02dd969ed0a80042b0f53))
* **build:** update linting, testing and tools ([8a14252d](https://github.com/aurelia/animator-css/commit/8a14252db8dcd28cde743f33f291a03949e5e1d7))


## 0.15.0 (2015-08-14)


#### Bug Fixes

* **index:** update to new framework configuration api ([8930d386](https://github.com/aurelia/animator-css/commit/8930d3864a10b63d4680f1be316a124a2d4b4fdc))
* **typing:** add type information ([f28fdba9](https://github.com/aurelia/animator-css/commit/f28fdba95b77fb8a162af3ea58d55ad4741b1ff9))


#### Features

* **all:** add more type info ([8fd02a8f](https://github.com/aurelia/animator-css/commit/8fd02a8fa7ce5211efd1e83b1d22f1710a99e8df))


### 0.14.1 (2015-07-29)


#### Bug Fixes

* **package:** add metadata dependency ([2328ea2f](https://github.com/aurelia/animator-css/commit/2328ea2f4e9142d4f8ee5c1c6727213ea13964f3))
* **tests:** split up unit tests ([ba524a6d](https://github.com/aurelia/animator-css/commit/ba524a6d4dfc112d6dc20b9cbeb062249f691894))


#### Features

* **stagger:** add split stagger feature ([eb27d3e6](https://github.com/aurelia/animator-css/commit/eb27d3e6e8e54bf176abbb5a04ec6734c8e81aff))


## 0.4.0 (2015-07-02)


#### Features

* **beta:** new methods, events and refactoring ([1bb61d76](https://github.com/aurelia/animator-css/commit/1bb61d7650aaaa62a556b80e572656e9491c08f2))
* **events:** trigger animation events ([affc3710](https://github.com/aurelia/animator-css/commit/affc3710b96fbf4d165e58cec81bbf33e3b099cf))


### 0.3.2 (2015-06-09)


#### Bug Fixes

* **timeout:** fixes timeouts for animation triggers ([9fb1ffa6](https://github.com/aurelia/animator-css/commit/9fb1ffa60fb4d926d4e4e587529693be8ea005ce))


### 0.3.1 (2015-06-09)


#### Bug Fixes

* **instance:**
  * fix instance passing ([9236153b](https://github.com/aurelia/animator-css/commit/9236153b45e61a9e400680ef3aa2623ca1d40f1d))
  * ensure callback returns DI instance ([06b20691](https://github.com/aurelia/animator-css/commit/06b20691a4ef06517671e4e6eb6035510621b322))


#### Features

* **anim-done:** indicate when animation is done via classes ([6779c9ff](https://github.com/aurelia/animator-css/commit/6779c9ffc02d9083fd8f1bbc8da60989713ab008))


## 0.3.0 (2015-06-08)


#### Bug Fixes

* **stagger:** check for null/undefined on stagger parent ([cb5dfa33](https://github.com/aurelia/animator-css/commit/cb5dfa3305bd5c330690d76db65cb0ac4be549a4))


#### Features

* **isAnimating:** indicator for whether an animation is active ([277f81bf](https://github.com/aurelia/animator-css/commit/277f81bf97d5193487c6da24ce2fd1273823cd53))


## 0.2.0 (2015-05-01)


#### Bug Fixes

* **all:** update to latest plugin api ([3a5210c0](https://github.com/aurelia/animator-css/commit/3a5210c0289dc3d65460b6b61f71fa88bb32c138))


#### Features

* **stagger:** add staggering animations ([d57d22b6](https://github.com/aurelia/animator-css/commit/d57d22b6dd6f4653c8463e27b41cedd38f7c7df3))


### 0.1.0 (2015-04-13)


#### Bug Fixes

* **all:** update compiler ([982f6f60](https://github.com/aurelia/animator-css/commit/982f6f60513e801672213be31a6aed2f39458fe3))
* **build:** add built files for jspm registry ([a136d93c](https://github.com/aurelia/animator-css/commit/a136d93c384d5674db7a51fa3d9979a4dbf3cd18))
* **deps:**
  * Checkin missing build ([87504049](https://github.com/aurelia/animator-css/commit/87504049e2535ad74c40526327b2942b74e3ab90))
  * Update dependency, fix CssAnimator import ([a0f9ebf3](https://github.com/aurelia/animator-css/commit/a0f9ebf3c23a5b1929d67147d74be97ecd5addb9))
* **package:** update dependencies ([17e4eb9e](https://github.com/aurelia/animator-css/commit/17e4eb9efbee0cf08a753b26c751a4b390311aed))
* **test:** Fixes tests and updates dependencies ([fd0bf514](https://github.com/aurelia/animator-css/commit/fd0bf514c9cd1086ead7f9ad6eb40d765b6ab58d))
* **tests:** Fix tests and remove JSPM jquery ([22fe4de8](https://github.com/aurelia/animator-css/commit/22fe4de88e66d8b3188fd3dd7abb4078857c6088))


#### Features

* **all:** add plugin api support ([19f4f740](https://github.com/aurelia/animator-css/commit/19f4f74054da97177e13d3e55333a5f7deddab15))
* **anim:** implements animator-css service ([83f23e16](https://github.com/aurelia/animator-css/commit/83f23e16c2cf080cc79c0434e60e6173ddb3d8a9))
* **anim-delay:** respect set animation delay ([f54e624a](https://github.com/aurelia/animator-css/commit/f54e624af40bc22526106a9617ce24cb73a000a7))
