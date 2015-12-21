import {DOM} from 'aurelia-pal';
import {createProperties, createEvents} from './instruction';

const keyframestype = window.CSSRule.KEYFRAMES_RULE ||
                      window.CSSRule.MOZ_KEYFRAMES_RULE  ||
                      window.CSSRule.WEBKIT_KEYFRAMES_RULE;

class KeyframesProperty  {

  constructor(property) {
    this.name    = 'keyframes';
    this.cssName = '@'+property.keyframesPrefix;
  }

  /**
   * Returns true if there is a new animation with valid keyframes
   * @param animationNames the current animation style.
   * @param prevAnimationNames the previous animation style
   * @private
   */
  validateKeyFrames(verifyKeyframesExist:Boolean, animationNames: Array<string>, prevAnimationNames: Array<string>): bool {
    let newAnimationNames = animationNames.filter(name => prevAnimationNames.indexOf(name) === -1);
    return newAnimationNames.length === 0 ? false
           : !verifyKeyframesExist ? true
           : this.getKeyframeByAnimationNames(newAnimationNames);
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
}

class BaseProperty {

  constructor(instruction: Object) {
    createProperties(this);
    createEvents(this);
    this.keyframes = new KeyframesProperty(this);
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
      if (propName in this.dom) {
        vendorName = this.dom[propName];
      }
      node.style[propName] = propValue;
      node.style[vendorName] = propValue;
      return node;
    }
    return Promise.reject(new Error('Property.prototype.setStyle requires an Element'));
  }

  assignStyle(node: Node, styles: Object): Node {
    if (node instanceof Element) {
      for(let propName in styles) {
        this.setStyle(node, propName, styles[propValue]);
      }
      return node;
    }
    return Promise.reject(new Error('Property.prototype.assignStyle requires an Element'));
  }

  getPropertyValue(node: Node, propName: String): String {
    if (node instanceof Element) {
      var computed = DOM.getComputedStyle(node);
      var vendorName;
      var propValue;
      if (propName in this.css) {
        vendorName = this.css[propName];
        propValue = computed.getPropertyValue(vendorName);
      }
      propValue = propValue || computed.getPropertyValue(propName);
      if (/duration|delay/ig.test(propName)) {
        propValue = this._parseTimingValue(propValue);
      }
      return propValue;
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

  subscribe(element: DOM.Element, eventName: String, callback: Function, bubbles: Boolean): Object {
    let event;
    let handler;
    let bound = true;
    let triggered = false;

    eventName = eventName in this.events ? this.events[eventName] : eventName;

    event = {
      callback, eventName, element, triggered, bound,
      dispose() {
        element.removeEventListener(eventName, handler, bubbles);
        event.bound = false;
      }
    };

    element.addEventListener(eventName, handler = (evt) => {
      event.triggered = true;
      return callback(evt);
    }, bubbles);

    return event;
  }
}

export const Property = new BaseProperty();
