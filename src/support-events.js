export const animation = {
  end: 'animationend',
  start: 'animationstart',
  iteration: 'animationiteration'
};

const TEST_CSS = `
  test-element {
    position:fixed;
    opacity: 0;
    height: 0;
    width: 0;
    -webkit-animation-name: test-animation;
       -moz-animation-name: test-animation;
        -ms-animation-name: test-animation;
         -o-animation-name: test-animation;
            animation-name: test-animation;
    -webkit-animation-duration: 0s;
       -moz-animation-duration: 0s;
        -ms-animation-duration: 0s;
         -o-animation-duration: 0s;
            animation-duration: 0s;
  }
  @keyframes test-animation {
    from {opacity: 0}
    to {opacity: 1}
  }
  @-webkit-keyframes test-animation {
    from {opacity: 0}
    to {opacity: 1}
  }
  @-moz-keyframes test-animation {
    from {opacity: 0}
    to {opacity: 1}
  }
  @-ms-keyframes test-animation {
    from {opacity: 0}
    to {opacity: 1}
  }
  @-o-keyframes test-animation {
    from {opacity: 0}
    to {opacity: 1}
  }
`;

(function(){
  let names = ['', 'webkit', 'moz', 'o', 'ms'];
  let events = ['start', 'end', 'iteration'];
  let node = document.createElement('test-element');
  let sheet = document.createElement('style');
  let prefix = '';
  sheet.type = 'text/css';
  sheet.innerHTML = TEST_CSS;
  names.forEach(pre => {
    let handler;
    let name = pre ? (pre + 'AnimationEnd') : 'animationend';
    node.addEventListener(name, handler = (e)=> {
      createEvents(prefix);
    });
  });
  function createEvents(prefix) {
    if (prefix) {
      animation.end = prefix+'AnimationEnd';
      animation.start = prefix+'AnimationStart';
      animation.iteration = prefix+'AnimationIteration';
    }
    node.remove();
    sheet.remove();
  }
  document.head.appendChild(sheet);
  document.body.appendChild(node);
}());
