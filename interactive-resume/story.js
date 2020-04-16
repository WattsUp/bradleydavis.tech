"use strict";

/**
 * Story elements including scroll position initiated element changes
 */
var story = {
  masks: [],
  distance: [],
  distanceSpace: null,
  lastSceneX: 0,
  scrollEventEnqueued: false,
  /**
   * Initialize the story, add listeners
   */
  init: function() {
    story.masks[0] = document.querySelector('#brad .mask.right');
    story.masks[1] = document.querySelector('#brad .mask.left');

    story.distance[0] = document.querySelector('.distance.d0');
    story.distance[1] = document.querySelector('.distance.d1');
    story.distance[2] = document.querySelector('.distance.d2');
    story.distance[3] = document.querySelector('.distance.d3');
    story.distance[4] = document.querySelector('.distance.d4');
    story.distanceSpace = document.querySelector('.distance.space');

    story.masks[0].hidden = true;
    story.masks[1].hidden = true;

    window.addEventListener('scroll', function() {
      let sceneX = window.scrollY;
      story.setBackground(-sceneX, 0);
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
    story.distance[0].style.transform = 'translateX(' + x + 'px)';
    story.distance[1].style.transform = 'translateX(' + (x / 1.5) + 'px)';
    story.distance[2].style.transform = 'translateX(' + (x / 2) + 'px)';
    story.distance[3].style.transform = 'translateX(' + (x / 4) + 'px)';
    story.distance[4].style.transform = 'translateX(' + (x / 8) + 'px)';
    story.distanceSpace.style.transform = 'translateX(' + (x / 40) + 'px)';
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', story.init);
else
  story.init();