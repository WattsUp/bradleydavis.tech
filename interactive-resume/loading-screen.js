'use strict';

/**
 * Temporary shield protecting against FOUC
 */
let loading = {
  context: null,
  startPoint: null,
  interval: null,
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  nodesX: 3.2,
  nodesY: 5.1,
  index: 0,
  count: 40,
  step: 2 * Math.PI / 400,
  /**
   * Initialize listeners
   */
  init: function() {
    window.addEventListener('load', this.hide.bind(this));
    this.context =
        document.getElementById('loading-screen').children[0].getContext('2d');
    this.height = this.context.canvas.clientHeight;
    this.width = this.context.canvas.clientWidth;
    this.startPoint = {x: this.width / 2, y: this.height / 2};
    this.context.strokeStyle = '#33FF33';
    this.context.fillStyle = '#282828';
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.fillStyle = 'rgba(40, 40, 40, 0.07)';
    this.interval = setInterval(this.update.bind(this), 5);
  },
  /**
   * Slide the screen up then stop rendering and delete it
   */
  hide: function() {
    document.getElementById('loading-screen').style.transform =
        'translateY(-100%)';
    document.getElementById('scroll-container').hidden = false;
    setTimeout(function() {
      clearInterval(this.interval);
      document.body.removeChild(document.getElementById('loading-screen'));
      window.addEventListener('scroll', scene.onFirstScroll);
      brad.teleport(true);
    }, 1000);
  },
  /**
   * Redraw the lissajous adding the next point. Painting a slightly opaque
   * color simulates persistance
   */
  update: function() {
    this.context.beginPath();
    this.context.moveTo(this.startPoint.x + this.x, this.startPoint.y - this.y);
    this.index += this.step;
    this.x = this.height * Math.sin(this.nodesX * this.index) / 2;
    this.y = this.width * Math.sin(this.nodesY * this.index) / 2;
    this.context.lineTo(this.startPoint.x + this.x, this.startPoint.y - this.y);
    this.count--;
    if (this.count <= 0) {
      this.count = 20;
      this.context.fillRect(
          0, 0, this.context.canvas.width, this.context.canvas.height);
    }
    this.context.stroke();
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', loading.init);
else
  loading.init();