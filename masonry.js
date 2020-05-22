"use strict";

let masonry = {
  /**
   * Initial masonry resize, add listeners
   */
  init: function() {
    this.resize();
    window.addEventListener('load', this.resize);
    window.addEventListener('resize', this.resize);
    window.addEventListener('orientationChange', this.resize);
  },
  /**
   * For each masonry root, update its content with the appropriate number of
   * rows
   */
  resize: function() {
    document.querySelectorAll('.masonry').forEach(root => {
      let rootStyle = window.getComputedStyle(root);
      let rowGap = parseInt(rootStyle.gridRowGap, 10);
      let rowHeight = parseInt(rootStyle.gridAutoRows, 10);
      for (let i = 0; i < root.children.length; i++) {
        let child = root.children[i];
        let contentHeight = child.children[0].offsetHeight
        let rows = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
        child.style.gridRowEnd = 'span ' + rows;
      }
    });
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', masonry.init);
else
  masonry.init();