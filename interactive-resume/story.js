/**
 * Story elements including scroll position initiated element changes
 */
var story = {
  masks: [],
  distanceClose: null,
  distanceMid: null,
  distanceFar: null,
  distanceSpace: null,
  lastSceneX: 0,
  /**
   * Initialize the story, add listeners
   */
  init: function() {
    story.masks[0] = document.querySelector('#brad>.mask.right');
    story.masks[1] = document.querySelector('#brad>.mask.left');

    story.distanceClose = document.querySelector('.distance.close');
    story.distanceMid = document.querySelector('.distance.mid');
    story.distanceFar = document.querySelector('.distance.far');
    story.distanceSpace = document.querySelector('.distance.space');

    story.masks[0].hidden = true;
    story.masks[1].hidden = true;

    window.addEventListener('scroll', function() {
      let sceneX = window.scrollY;
      story.setBackground(sceneX, 0);
      brad.enqueueWalk(sceneX > story.lastSceneX);
      story.lastSceneX = sceneX;
    });
  },
  /**
   *
   * @param {integer} x offset of close distance
   * @param {integer} y offset of close distance
   */
  setBackground: function(x, y) {
    story.distanceClose.style.left = -x + 'px';
    story.distanceMid.style.left = Math.floor(-x / 2) + 'px';
    story.distanceFar.style.left = Math.floor(-x / 5) + 'px';
    story.distanceSpace.style.left = Math.floor(-x / 20) + 'px';
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', story.init);
else
  story.init();