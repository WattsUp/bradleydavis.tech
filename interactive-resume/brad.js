'use strict';

/**
 * The Brad sprite: movement, animation
 */
var brad = {
  container: null,
  sprite: null,
  eyeLids: [],
  teleporterScience: null,
  movingRight: true,
  frameTime: 200,
  currentFrame: 0,
  moving: false,
  standStill: false,
  masks: [],
  /**
   * Initialize the sprite, add listeners
   */
  init: function() {
    this.container = document.getElementById('brad');
    this.sprite = document.getElementById('brad-sprite');
    this.eyeLids[0] = document.querySelector('#brad .eyes.right');
    this.eyeLids[1] = document.querySelector('#brad .eyes.left');
    this.teleporterScience = document.getElementById('teleporter-science');
    this.masks[0] = document.querySelector('#brad .mask.right');
    this.masks[1] = document.querySelector('#brad .mask.left');

    this.eyeLids[0].hidden = false;
    this.eyeLids[1].hidden = true;

    this.setMask(false);
  },
  /**
   * Enqueue frames to animate walking, set the walking direction
   * @param {bool} movingRight
   */
  enqueueWalk: function(movingRight) {
    if (this.standStill) return;
    this.movingRight = movingRight;
    if (!this.moving) {
      this.moving = true;
      this.walk();
      setTimeout(this.walk.bind(this), this.frameTime);
      setTimeout(function() {
        this.moving = false;
      }.bind(this), this.frameTime * 2);
    }
  },
  /**
   * Animate the sprite by swapping frames
   */
  walk: function() {
    this.eyeLids[0].hidden = !this.movingRight;
    this.eyeLids[1].hidden = this.movingRight;
    this.masks[0].hidden = !this.movingRight;
    this.masks[1].hidden = this.movingRight;
    if (this.movingRight)
      this.sprite.style.backgroundPositionY = 'top';
    else
      this.sprite.style.backgroundPositionY = 'bottom';

    this.currentFrame = (this.currentFrame + 1) % 4;
    switch (this.currentFrame) {
      case 0:
      case 2:
        this.sprite.style.backgroundPositionX = 'left';
        break;
      case 1:
        this.sprite.style.backgroundPositionX = 'center';
        break;
      case 3:
        this.sprite.style.backgroundPositionX = 'right';
        break;
    }
  },
  /**
   * Perform teleport manuever
   * @param {bool} materializing 'landing' when true, 'leaving' when false
   */
  teleport: function(materializing) {
    this.teleporterScience.style.opacity = 1.0;
    if (materializing) {
      this.sprite.style.opacity = 1.0;
    } else {
      this.sprite.style.opacity = 0.0;
    }
    setTimeout(function() {
      this.teleporterScience.style.opacity = 0.0;
    }.bind(this), 1100);
  },
  /**
   * Perform jump animation
   * @param {bool} jumpUp true to jump up onto something, false for down
   * @param {int} height of object to jump onto
   */
  jump: function(jumpUp, height) {
    if (jumpUp) {
      this.container.classList.add('jump-up');
      this.container.classList.remove('jump-down');
    } else {
      this.container.classList.remove('jump-up');
      this.container.classList.add('jump-down');
    }
    this.container.style.transform = 'translate(-50%, -' + height + 'px)';
  },
  /**
   * Transform brad from the default center position
   * @param {int} x pixels to transform brad from the center
   * @param {int} y pixels to transform brad from the center
   */
  setTransform: function(x, y) {
    this.container.classList.remove('jump-up');
    this.container.classList.remove('jump-down');
    this.container.style.transform =
        'translate(-50%, 0) translate(' + x + 'px, ' + y + 'px)';
  },
  /**
   * Put on or take off the oxygen mask
   * @param {boolean} on true puts mask on, false otherwise
   */
  setMask: function(on) {
    this.masks[0].style.opacity = on ? 1 : 0;
    this.masks[1].style.opacity = on ? 1 : 0;
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', brad.init);
else
  brad.init();
