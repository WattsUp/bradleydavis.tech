var footer = {
  brad: null,
  sprite: null,
  interval: null,
  footer: null,
  lastPosition: 0,
  moving: false,
  movingRight: true,
  frameTime: 200,
  currentFrame: 0,
  init: function() {
    this.brad = document.getElementById('footer-brad');
    this.sprite = this.brad.children[0];
    this.footer = document.getElementsByTagName('footer')[0];

    this.brad.addEventListener('click', this.moveManual, false);
    this.moveManual();
  },
  moveManual: function() {
    clearInterval(footer.interval);
    footer.interval = setInterval(footer.move, 4000);
    footer.move();
  },
  move: function() {
    var width = footer.brad.offsetWidth;
    var change = Math.floor((Math.random() * 1.5 + 0.5) * width);
    var position = footer.brad.offsetLeft;
    if (position - change < 0) {
      position = position + change;
    } else if (position + change > (footer.footer.offsetWidth - width)) {
      position = position - change;
    } else if (Math.random() > 0.5) {
      position = position + change;
    } else {
      position = position - change;
    }
    footer.brad.style.left = position + 'px';
    if (!footer.moving) {
      footer.movingRight = footer.lastPosition < position;
      footer.moving = true;
      setTimeout(footer.walk, footer.frameTime);
      setTimeout(footer.walk, footer.frameTime * 2);
      setTimeout(footer.walk, footer.frameTime * 3);
      setTimeout(footer.walk, footer.frameTime * 4);
      setTimeout(footer.walk, footer.frameTime * 5);
      setTimeout(footer.walk, footer.frameTime * 6);
      setTimeout(footer.walk, footer.frameTime * 7);
      setTimeout(footer.walk, footer.frameTime * 8);
    }
    footer.lastPosition = position;
  },
  walk: function() {
    footer.sprite.style.bottom = (footer.movingRight * -7) + 'rem';
    footer.currentFrame = (footer.currentFrame + 1) % 4;
    switch (footer.currentFrame) {
      case 0:
      case 2:
        footer.sprite.style.left = '0rem';
        footer.moving = false;
        break;
      case 1:
        footer.sprite.style.left = '-7rem';
        break;
      case 3:
        footer.sprite.style.left = '-14rem';
        break;
    }
  }
};

/**
 * Function once page is fully loaded
 */
function onLoad() {
  document.getElementById('copyright-date').innerHTML =
      (new Date()).getFullYear();
  // When a spoiler is clicked, reduce its background to 10% opacity
  document.querySelectorAll('.spoiler')
      .forEach(item => {item.addEventListener('click', event => {
                 item.style.background =
                     window.getComputedStyle(item)
                         .backgroundColor.replace('rgb', 'rgba')
                         .replace(')', ',0.1)');
               })})
  footer.init();
}

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', onLoad);
else
  onLoad();