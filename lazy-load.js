'use strict';

let lazy = {
  timeout: null,
  /**
   * Initialize listeners
   */
  init: function() {
    this.load();
    window.addEventListener('scroll', this.load.bind(this));
    window.addEventListener('resize', this.load.bind(this));
    window.addEventListener('orientationChange', this.load.bind(this));
  },
  /**
   * Defer loading until a bit after event stop firing, prevents call spamming
   */
  load: function() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(this.loadImages.bind(this), 50);
  },
  /**
   * Load images that are not yet loaded and are at least partially visible
   */
  loadImages: function() {
    let visibleTop = window.pageYOffset;
    let visibleBottom = visibleTop + window.innerHeight;
    document.querySelectorAll('.lazy').forEach(image => {
      let imageTop = image.offsetTop;
      let imageBottom = imageTop + image.offsetHeight;
      if (imageTop < visibleBottom && imageBottom > visibleTop) {
        let src = ''
        if (image.classList.contains('full')) src =
            image.getAttribute('src').replace('_lazy', '');
        else src = image.getAttribute('src').replace('_lazy', '_preview');
        image.setAttribute('src', src);
        image.classList.remove('lazy');
      }
    });
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', lazy.init);
else
  lazy.init();