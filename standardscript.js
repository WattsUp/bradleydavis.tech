/**
 * Function once page is fully loaded
 */
$(window).bind('load', function() {
  requestAnimationFrame(animateMenuWheels);
});

/****************************** Header Functions ******************************/
var header = $('header').eq(0);
var menuWheels = $('.menu-wheel');
var menuWheelsHovered = false;
var menuWheelsTimeout = 0;
var menuWheelIcons = $('.menu-wheel-icon');
var menuWheelIconRolls = [];

// Roll the menu wheels only when hovered
menuWheels.hover(
    function() {
      menuWheelsHovered = true;
      clearTimeout(menuWheelsTimeout);
    },
    function() {
      // Timeout to wait for transition to finish
      menuWheelsTimeout = setTimeout(function() {
        menuWheelsHovered = false;
      }, 1200);
    });

function animateMenuWheels() {
  // Only run intensive scripts when needed
  if (menuWheelsHovered) {
    // Relating angle to circumference
    var iconMargin = parseInt(menuWheelIcons.css("margin-left"))
    var iconWidth = menuWheelIcons.width();
    var angleFactor = 360 / (3.14 * iconWidth);
    var headerWidth = header.width();
    for (var i = 0; i < menuWheels.length; i++) {
      // Rolled distance = current left from resting left
      var translateX = headerWidth - menuWheels.eq(i).position().left -
          (iconWidth + iconMargin * 2) * (menuWheels.length - i) - iconMargin;
      var angle = -translateX * angleFactor;
      if (angle != menuWheelIconRolls[i]) {
        menuWheelIconRolls[i] = angle;
        // Roll the wheel the appropriate amount
        cssPrefix(
            menuWheelIcons.eq(i), 'transform', 'rotate(' + angle + 'deg)');
      }
    }
  }
  requestAnimationFrame(animateMenuWheels);
}