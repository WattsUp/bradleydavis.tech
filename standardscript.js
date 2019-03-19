/**
 * Function once page is fully loaded
 */
$(window).bind('load', function() {
  requestAnimationFrame(animateMenuWheels);
  $('#copyright-date').text((new Date()).getFullYear());
  brad.click(moveFooterBradManual);
  moveFooterBradManual();
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

/**
 * Roll out menu wheels when they are hovered over
 */
function animateMenuWheels() {
  // Only run intensive scripts when needed
  if (menuWheelsHovered) {
    // Relating angle to circumference
    var iconMargin = parseInt(menuWheelIcons.css('margin-left'))
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

/****************************** Footer Functions ******************************/
var brad = $('.footer-brad');
var bradSprite = $('.footer-brad-sprite');
var footer = $('footer').eq(0);

var bradInterval = 0;
var currentWalkingFrame = 0;
var lastBradPosition = 0;
var moving = false;
var movingRight = true;
var timingWalking = 200;

function moveFooterBradManual(){
  clearInterval(bradInterval);
  bradInterval = setInterval(moveFooterBrad, 4000);
  moveFooterBrad();
}

/**
 * Randomly move brad in the footer
 */
function moveFooterBrad() {
  var bradWidth = brad.width();
  var range = footer.width() - bradWidth;
  var change = Math.floor((Math.random() * 1.5 + 0.5) * bradWidth);
  var position = brad.position().left;
  if (position - change < 0) {
    position = position + change;
  } else if (position + change > range) {
    position = position - change;
  } else if (Math.random() > 0.5) {
    position = position + change;
  } else {
    position = position - change;
  }
  brad.css('left', position + 'px');
  // Animate sprite when walking
  if (lastBradPosition > position) {
    if (!moving) {
      movingRight = false;
      moving = true;
      setTimeout(updateWalkingSprite, timingWalking);
      setTimeout(updateWalkingSprite, timingWalking * 2);
      setTimeout(updateWalkingSprite, timingWalking * 3);
      setTimeout(updateWalkingSprite, timingWalking * 4);
      setTimeout(updateWalkingSprite, timingWalking * 5);
      setTimeout(updateWalkingSprite, timingWalking * 6);
      setTimeout(updateWalkingSprite, timingWalking * 7);
      setTimeout(updateWalkingSprite, timingWalking * 8);
    }
  } else {
    if (!moving) {
      movingRight = true;
      moving = true;
      setTimeout(updateWalkingSprite, timingWalking);
      setTimeout(updateWalkingSprite, timingWalking * 2);
      setTimeout(updateWalkingSprite, timingWalking * 3);
      setTimeout(updateWalkingSprite, timingWalking * 4);
      setTimeout(updateWalkingSprite, timingWalking * 5);
      setTimeout(updateWalkingSprite, timingWalking * 6);
      setTimeout(updateWalkingSprite, timingWalking * 7);
      setTimeout(updateWalkingSprite, timingWalking * 8);
    }
  }
  lastBradPosition = position;
}

/**
 * Change the sprite to the next walking frame
 */
function updateWalkingSprite() {
  bradSprite.css('bottom', (movingRight * -7) + 'rem');
  currentWalkingFrame = (currentWalkingFrame + 1) % 4;
  switch (currentWalkingFrame) {
    case 0:
    case 2:
      bradSprite.css('left', '0rem');
      moving = false;
      break;
    case 1:
      bradSprite.css('left', '-7rem');
      break;
    case 3:
      bradSprite.css('left', '-14rem');
      break;
  }
}