/**
 * Creation of dynamic scene elements, movement of the scene
 */
var scene = {
  /**
   * Initialize the scene, add listeners
   */
  init: function() {

  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', scene.init);
else
  scene.init();