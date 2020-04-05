var masonry = {
  /**
   * Initial masonry resize, add listeners
   */
  init: function() {
    masonry.resize();
    window.addEventListener('load', masonry.resize);
    window.addEventListener('resize', masonry.resize);
    window.addEventListener('orientationChange', masonry.resize);
  },
  /**
   * For each masonry root, update its content with the appropriate number of
   * rows
   */
  resize: function() {
    document.querySelectorAll('.masonry').forEach(root => {
      var rootStyle = window.getComputedStyle(root);
      var rowGap = parseInt(rootStyle.gridRowGap, 10);
      var rowHeight = parseInt(rootStyle.gridAutoRows, 10);
      for (var i = 0; i < root.children.length; i++) {
        var child = root.children[i];
        var contentHeight = child.children[0].offsetHeight
        var rows = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
        child.style.gridRowEnd = 'span ' + rows;
      }
    });
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', masonry.init);
else
  masonry.init();