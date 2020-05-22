'use strict';

let banner = {
  img: null,
  banner: null,
  /**
   * Initialize the banner, add listeners
   */
  init: function() {
    document.addEventListener('scroll', this.update.bind(this));
    window.addEventListener('resize', this.update.bind(this));
    window.addEventListener('orientationChange', this.update.bind(this));

    this.img = document.querySelector('banner img');
    this.banner = document.querySelector('banner');
    this.img.style.top = 0;

    this.update()
  },
  /**
   * Update the banner image shift
   */
  update: function() {
    let hiddenHeight = this.img.clientHeight - this.banner.clientHeight;
    let min = -hiddenHeight / 2;
    let max = 0;
    let y = (max - min) / 600 * window.scrollY + min;
    y = Math.min(max, Math.max(min, y));
    this.img.style.transform = 'translateY(' + y + 'px)';
  }
}

if (document.readyState == 'Loading')
window.addEventListener('DOMContentLoaded', banner.init);
else banner.init();