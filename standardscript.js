/**
 * Function once page is fully loaded
 */
$(window).bind('load', function() {
  requestAnimationFrame(animateMenuWheels);
  $('#copyright-date').text((new Date()).getFullYear());
  brad.click(moveFooterBradManual);
  moveFooterBradManual();
});

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

/**
 * Reset the interval timer and manually move the brad
 */
function moveFooterBradManual() {
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

/******************************* Scroll Button ********************************/
$(window).bind('scroll', scrollUpdate);
$(window).bind('resize', scrollUpdate);
$(window).bind('orientationChange', scrollUpdate);

var buttonUp = $('.button-up');

/**
 * Shows or hides the scrollUp button
 */
function scrollUpdate() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    cssPrefix(buttonUp, 'transform', 'translateX(0rem)');
  } else {
    cssPrefix(buttonUp, 'transform', 'translateX(-5rem)');
  }
}

/**
 * Scrolls to the top of the page
 */
function buttonScrollUp() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}