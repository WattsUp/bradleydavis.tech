/**
 * Function once page is fully loaded
 */
$(window).bind('load', function() {
  lazyLoad();
  $(window).bind('scroll', lazyLoad);
  $(window).bind('resize', lazyLoad);
  $(window).bind('orientationChange', lazyLoad);
});

var images = $('.lazy');
var lazyLoadTimeout;

/**
 * Function to regulate calls to loadImages
 * Waits 50ms after scrolling stops
 */
function lazyLoad() {
  if (lazyLoadTimeout) {
    clearTimeout(lazyLoadTimeout);
  }
  lazyLoadTimeout = setTimeout(loadImages, 50);
}

/**
 * Replaces lazy images with preview if they are visible in the viewport
 */
function loadImages() {
  var pageTop = $(window).scrollTop();
  var pageBottom = pageTop + $(window).height();
  for (var i = 0; i < images.length; i++) {
    var img = images.eq(i);
    var top = img.offset().top;
    var bottom = top + img.height();
    if (bottom > pageTop && top < pageBottom) {
      var src = img.attr('src');
      src = src.replace('_lazy', '_preview');
      img.attr('src', src);
      img.removeClass('lazy');
    }
  }
  images = $('.lazy');
}