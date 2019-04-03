/**
 * Function once page is fully loaded
 */
$(window).bind('load', function() {
  resizeMasonry();
});

window.onresize = resizeMasonry;

var roots = $('.masonry');
var rootBricks = [];

function findBricks() {
  roots = $('.masonry');
  for (var i = 0; i < roots.length; i++) {
    rootBricks.push(roots.eq(i).children());
  }
}

function resizeMasonry() {
  findBricks();

  for (var i = 0; i < roots.length; i++) {
    var root = roots.eq(i);
    var bricks = rootBricks[i];
    var rowGap = parseInt(root.css('grid-row-gap'), 10);
    var rowHeight = parseInt(root.css('grid-auto-rows'), 10);
    for (var ii = 0; ii < bricks.length; ii++) {
      var brick = bricks.eq(ii);
      var height = brick.children().eq(0).height();
      var rows = Math.ceil((height + rowGap) / (rowHeight + rowGap));
      brick.css('grid-row-end', 'span ' + rows);
    }
  }
}