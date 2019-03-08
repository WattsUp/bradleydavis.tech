/**
 * Function once page is fully loaded
 */
$(window).bind('load', function() {
  updateTileHeights();
  window.onresize = updateTileHeights;
});

var tileFronts = $('.columnar-tile-face.front');
var tileBacks = $('.columnar-tile-face.back');

function updateTileHeights() {
  tileFronts.css('height', 'unset');
  tileBacks.css('height', 'unset');

  for (var i = 0; i < tileFronts.length; i++) {
    var height = tileFronts.eq(i).height();
    height = Math.max(height, tileBacks.eq(i).height());
    tileFronts.eq(i).css('height', height + 'px');
    tileBacks.eq(i).css('height', height + 'px');
  }
}