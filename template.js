'use strict';

let footer = {
  brad: null,
  sprite: null,
  interval: null,
  footer: null,
  lastPosition: 0,
  moving: false,
  movingRight: true,
  frameTime: 200,
  currentFrame: 0,
  /**
   * Initialize elements and listeners
   */
  init: function() {
    this.brad = document.getElementById('footer-brad');
    this.sprite = this.brad.children[0];
    this.footer = document.getElementsByTagName('footer')[0];

    this.brad.addEventListener('click', this.moveManual.bind(this), false);
    this.moveManual();
  },
  /**
   * Reset interval to now and execute a walk
   */
  moveManual: function() {
    clearInterval(this.interval);
    this.interval = setInterval(this.move.bind(this), 4000);
    this.move();
  },
  /**
   * Random walk within the bottom area, enqueue frames
   */
  move: function() {
    let width = this.brad.offsetWidth;
    let change = Math.floor((Math.random() * 1.5 + 0.5) * width);
    let position = this.brad.offsetLeft;
    if (position - change < 0) {
      position = position + change;
    } else if (position + change > (this.footer.offsetWidth - width)) {
      position = position - change;
    } else if (Math.random() > 0.5) {
      position = position + change;
    } else {
      position = position - change;
    }
    this.brad.style.left = position + 'px';
    if (!this.moving) {
      this.movingRight = this.lastPosition < position;
      this.moving = true;
      setTimeout(this.walk.bind(this), this.frameTime);
      setTimeout(this.walk.bind(this), this.frameTime * 2);
      setTimeout(this.walk.bind(this), this.frameTime * 3);
      setTimeout(this.walk.bind(this), this.frameTime * 4);
      setTimeout(this.walk.bind(this), this.frameTime * 5);
      setTimeout(this.walk.bind(this), this.frameTime * 6);
      setTimeout(this.walk.bind(this), this.frameTime * 7);
      setTimeout(this.walk.bind(this), this.frameTime * 8);
    }
    this.lastPosition = position;
  },
  /**
   * Animate the sprite by swapping frames
   */
  walk: function() {
    this.sprite.style.bottom = (this.movingRight * -7) + 'rem';
    this.currentFrame = (this.currentFrame + 1) % 4;
    switch (this.currentFrame) {
      case 0:
      case 2:
        this.sprite.style.left = '0rem';
        this.moving = false;
        break;
      case 1:
        this.sprite.style.left = '-7rem';
        break;
      case 3:
        this.sprite.style.left = '-14rem';
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
  document.querySelectorAll('.spoiler').forEach(item => {
    item.addEventListener('click', function() {
      item.style.background = window.getComputedStyle(item)
                                  .backgroundColor.replace('rgb', 'rgba')
                                  .replace(')', ',0.05)');
      item.classList.add('visible')
    });
  });
  footer.init();
}

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', onLoad);
else
  onLoad();