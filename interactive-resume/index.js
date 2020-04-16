'use strict';

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
    setInterval(scene.labChangeParticles, 5000);
    scene.labChangeParticles();
    scene.labAddBubbles();

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
  labChangeParticles: function() {
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
  },
  /**
   * Add floating bubbles randomly to the tank fluid
   */
  labAddBubbles: function() {
    document.querySelectorAll('.fluid').forEach(fluid => {
      var bubbleSpaceWidth = fluid.clientWidth - 10 - 20;
      for (var i = 0; i < 10; i++) {
        var bubble = document.createElement('div');
        bubble.classList.add("bubble");
        bubble.style.animationDuration = (Math.random() * 3 + 3).toFixed(1) + "s";
        bubble.style.animationDelay = -(Math.random() * 3).toFixed(1) + "s";
        bubble.style.left = Math.round(Math.random() * bubbleSpaceWidth + 20) + "px";
        fluid.appendChild(bubble);
      }
    });
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', scene.init);
else
  scene.init();