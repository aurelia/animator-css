import {DOM} from 'aurelia-pal';

export const util = {
  dom: {animation: 'animation', transition:'transition', transform:'transform'},
  css: {animation: 'animation', transition:'transition', transform:'transform'},
  keyframesPrefix: 'keyframes'
};

(function (){
  getVendorPrefix();
  let properties = {
    animation: ['Name', 'Delay', 'Fill-Mode', 'Duration', 'Direction', 'Play-State', 'Iteration-Count', 'Timing-Function'],
    transition:['Delay', 'Duration', 'Property', 'Timing-Function'],
    transform: ['Box', 'Style', 'Origin'],
  };

  for (let name in properties) {
    let props = properties[name];
    for (let index in props) {
      let propValue = props[index].replace(/\-/g, '');
      let cssValue =  '-' + props[index].toLowerCase();
      let propName = name + propValue;
      let cssName  = name + cssValue;
      util.dom[propName] = util.dom[name] + propValue;
      util.css[propName] = util.css[name] + cssValue;
      // Add Extra Css syntax lookup
      util.css[cssName]  = util.css[propName];
    }
  }
}())

function getVendorPrefix() {
  var domPrefixes = ['webkit', 'Webkit', 'Moz', 'O', 'ms', 'Khtml'];
  var pfx  = '';
  var node = document.createElement('div');

  for (let prop in util.dom) {
    if (node.style[prop] === undefined) {
      addPrefix(prop);
    }
  }

  if (util.css.prefix) {
    util.keyframesPrefix = util.css.prefix + 'keyframes';
  }

  function addPrefix(prop) {
    var name = prop[0].toUpperCase() + prop.slice(1);
    for (var i in domPrefixes) {
      var pfx = domPrefixes[i];
      if ( node.style[ pfx + name ] !== undefined ) {
        util.dom.prefix = pfx;
        util.dom[prop] = util.dom.prefix + name;
        util.css.prefix = '-' + pfx.toLowerCase() + '-';
        util.css[prop] = util.css.prefix + prop;
        util.isVendor = true;
        util.vendor = pfx;
        break;
      }
    }
  }
  node.remove();
  return util;
}

