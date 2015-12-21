import {DOM} from 'aurelia-pal';

const initProps = _initProperties();
const initEventTypes = _initEventTypes();

export function createProperties(instance) {
  return Object.assign(instance, initProps);
}

export function createEvents(instance) {
  instance.events = instance.events || {};
  return Object.assign(instance.events, initEventTypes);
}

function _initProperties() {
  var result = getVendorPrefix();
  var properties = {
    animation: ['Name', 'Delay', 'Fill-Mode', 'Duration', 'Direction', 'Play-State', 'Iteration-Count', 'Timing-Function'],
    transition:['Delay', 'Duration', 'Property', 'Timing-Function'],
    transform: ['Box', 'Style', 'Origin'],
  };

  for (var name in properties) {
    var props = properties[name];
    for (var index in props) {
      var propValue = props[index].replace(/\-/g, '');
      var cssValue =  '-' + props[index].toLowerCase();
      var propName = name + propValue;
      var cssName  = name + cssValue;
      result.dom[propName] = result.dom[name] + propValue;
      result.css[propName] = result.css[name] + cssValue;
      // Add Extra Css syntax lookup
      result.css[cssName]  = result.css[propName];
    }
  }
  return result;
}

function getVendorPrefix() {
  var domPrefixes = ['webkit', 'Webkit', 'Moz', 'O', 'ms', 'Khtml'];
  var pfx  = '';
  var node = document.createElement('div');
  var result = {
    dom: {animation: 'animation', transition:'transition', transform:'transform'},
    css: {animation: 'animation', transition:'transition', transform:'transform'},
    keyframesPrefix: 'keyframes'
  };

  for (let prop in result.dom) {
    if (node.style[prop] === undefined) {
      addPrefix(prop);
    }
  }

  if (result.css.prefix) {
    result.keyframesPrefix = result.css.prefix + 'keyframes';
  }

  function addPrefix(prop) {
    var name = prop[0].toUpperCase() + prop.slice(1);
    for (var i in domPrefixes) {
      var pfx = domPrefixes[i];
      if ( node.style[ pfx + name ] !== undefined ) {
        result.dom.prefix = pfx;
        result.dom[prop] = result.dom.prefix + name;
        result.css.prefix = '-' + pfx.toLowerCase() + '-';
        result.css[prop] = result.css.prefix + prop;
        result.isVendor = true;
        result.vendor = pfx;
        break;
      }
    }
  }
  node.remove();
  return result;
}

function _initEventTypes() {
  var result = {};
  var vendorPrefix = ['', 'webkit', 'Moz', 'moz', 'MS', 'o'];
  var eventTypes = {
    animation: ['AnimationStart', 'AnimationIteration', 'AnimationEnd'],
    transition: ['TransitionEnd']
  };


  for (var evType in eventTypes) {
    var events = eventTypes[evType];
    while(events.length) {
      var name = events.pop();
      var evtName = name.toLowerCase();
      result[evtName] = applyPrefix(name, evtName);
    }
  }
  function applyPrefix(evt, evtName) {
    for (var index in vendorPrefix) {
      var pfx = vendorPrefix[index];
      var pfxName = pfx ? (pfx + evt) : evtName;
      if (('on' + pfxName) in window) {
        return pfxName;
      }
    }
  }
  return result;
}
