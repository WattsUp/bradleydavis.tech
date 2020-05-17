"use strict";

var lazy = {
  timeout: null,
  /**
   * Initialize listeners
   */
  init: function() {
    lazy.load();
    window.addEventListener('scroll', lazy.load);
    window.addEventListener('resize', lazy.load);
    window.addEventListener('orientationChange', lazy.load);
  },
  /**
   * Defer loading until a bit after event stop firing, prevents call spamming
   */
  load: function() {
    if (lazy.timeout) clearTimeout(lazy.timeout);
    lazy.timeout = setTimeout(lazy.loadImages, 50);
  },
  /**
   * Load images that are not yet loaded and are at least partially visible
   */
  loadImages: function() {
    var visbibleTop = window.pageYOffset;
    var visibleBottom = visbibleTop + window.innerHeight;
    document.querySelectorAll('.lazy').forEach(image => {
      var imageTop = image.offsetTop;
      var imageBottom = imageTop + image.offsetHeight;
      if (imageTop < visibleBottom && imageBottom > visbibleTop) {
        var src = image.getAttribute('src').replace('_lazy', '_preview');
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