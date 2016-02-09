import {DOM} from 'aurelia-pal';
import {util} from './support-util';

const keyframestype = window.CSSRule.KEYFRAMES_RULE ||
                      window.CSSRule.MOZ_KEYFRAMES_RULE  ||
                      window.CSSRule.WEBKIT_KEYFRAMES_RULE;

export class AnimatorSupport {

  /**
   * Returns true if there is a new animation with valid keyframes
   * @param animationNames the current animation style.
   * @param prevAnimationNames the previous animation style
   * @private
   */
  validateKeyFrames(verifyKeyframesExist:Boolean, animationNames: Array<string> = [], prevAnimationNames: Array<string>): bool {
    animationNames = Array.isArray(animationNames) ? animationNames : [animationNames];
    let newAnimationNames = animationNames.filter(name => prevAnimationNames.indexOf(name) === -1);

    if (newAnimationNames.length === 0)
      return false;

    if (!verifyKeyframesExist) {
      return true;
    }
    let result = this.getKeyframeByAnimationNames(newAnimationNames);
    return result;
  }

  getKeyframeByAnimationNames(animNames: String): Boolean {
    let styleSheets = document.styleSheets;
    // loop through the stylesheets searching for the keyframes. no cache is
    // used in case of dynamic changes to the stylesheets.
    for (let sheetIndex in styleSheets) {
      let cssRules = styleSheets[sheetIndex].cssRules;

      for (let ruleIndex in cssRules) {
        let cssRule = cssRules[ruleIndex];
        let isType  = cssRule.type === keyframestype;

        if (isType && animNames.indexOf(cssRule.name) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  _parseTimingValue(value) {
    if (value || value !== 'none') {
      value = Number(value.replace(/[^\d\.]/g, ''));
      return (value * 1000);
    }
    return 0;
  }

  setStyle(node: Node, propName: String, propValue: String): Node {
    if (node instanceof Element) {
      let vendorName;
      if (propName in util.dom) {
        vendorName = util.dom[propName] || propName;
      }

      if (propName in pxPropertyPostFix) {
        propName = pxPropertyPostFix[propName];
        propValue = propValue + 'px';
      }

      node.style[vendorName || propName] = propValue;
      return node;
    }
    return Promise.reject(new Error('Property.prototype.setStyle requires an Element'));
  }

  getPropertyValue(node: Node, propOrOptions: String|Object|Array): String {
    if (node instanceof Element) {
      let computed = DOM.getComputedStyle(node);
      let result   = {};
      let isarray  = Array.isArray(propOrOptions);
      let isstring = typeof propOrOptions === 'string';
      let isobject = typeof propOrOptions === 'object';
      let getPropertyValue;

      getPropertyValue = (propName)=> {
        var vendorName;
        var propValue;
        if (propName in util.css) {
          vendorName = util.css[propName];
          propValue = computed.getPropertyValue(vendorName);
        }
        propValue = propValue || computed.getPropertyValue(propName);
        if (/duration|delay/ig.test(propName)) {
          propValue = this._parseTimingValue(propValue);
        }
        return propValue;
      }

      if (isstring) {
        return getPropertyValue(propOrOptions);
      }
      else for (let key in propOrOptions) {
        let propName = isarray ? propOrOptions[index] : key;
        result[propName] = getPropertyValue( isarray ? propName : propOrOptions[key]);
      }
      return result;
    }
    return Promise.reject(new Error('Property.prototype.getPropertyValue requires an Element'));
  }

  getAnimationNames(node: Node): Array<String> {
    let names = this.getPropertyValue(node, 'animation-name');
    let result = names ? names.split(/\s/) : names;
    if (result.length === 1 && result[0] === 'none') {
      result.pop();
    }
    return result;
  }
}

