/**
 * Creation of dynamic scene elements, movement of the scene
 */
var scene = {
  labParticles: null,
  labParticleMasks: [],
  labParticleLightning: null,
  labParticleCurrent: 0,
  /**
   * Initialize the scene, add listeners
   */
  init: function() {
    scene.labParticles = document.getElementById('lab-particles')
    scene.labParticleMasks =
        document.querySelectorAll('#lab-particle-image>.mask');
    scene.labParticleLightning =
        document.getElementById('lab-particle-lightning')
    setInterval(scene.changeLabParticles, 5000);
    scene.changeLabParticles();

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
  },
  /**
   * Change the current lab particle viewer mask
   */
  changeLabParticles: function() {
    scene.labParticleLightning.hidden = false;
    scene.labParticles.style.height = '0';

    setTimeout(function() {
      for (var i = 0; i < scene.labParticleMasks.length; i++)
        scene.labParticleMasks[i].hidden = (i != scene.labParticleCurrent);
      scene.labParticleCurrent =
          (scene.labParticleCurrent + 1) % scene.labParticleMasks.length;
      scene.labParticles.style.height = '100%';
    }, 1500);
    setTimeout(function() {
      scene.labParticleLightning.hidden = true;
    }, 2500);
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', scene.init);
else
  scene.init();