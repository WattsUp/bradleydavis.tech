/**
 * Creation of dynamic scene elements, movement of the scene
 */
var scene = {
  /**
   * Initialize the scene, add listeners
   */
  init: function() {
    window.addEventListener('scroll', scene.onFirstScroll);
  },
  /**
   * Actions to perform once the page is first scrolled
   */
  onFirstScroll: function() {
    window.removeEventListener('scroll', scene.onFirstScroll);
    document.getElementById('scroll-down').hidden = true;
    setTimeout(function() {
      document.getElementById('scroll-down').hidden = true;
    }, 5000);
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', scene.init);
else
  scene.init();