/**
 * Story elements including scroll position initiated element changes
 */
var story = {
  /**
   * Initialize the story, add listeners
   */
  init: function() {

  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', story.init);
else
  story.init();