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
    this.labParticles = document.getElementById('lab-particles');
    this.labParticleMasks =
        document.querySelectorAll('#lab-particle-image>.mask');
    this.labParticleLightning =
        document.getElementById('lab-particle-lightning');
    setInterval(this.labChangeParticles.bind(this), 5000);
    this.labChangeParticles();
    this.labAddBubbles();
  },
  /**
   * Actions to perform once the page is first scrolled
   */
  onFirstScroll: function() {
    window.removeEventListener('scroll', scene.onFirstScroll);
    var scrollDown = document.getElementById('scroll-down');
    scrollDown.parentNode.removeChild(scrollDown);
  },
  /**
   * Change the current lab particle viewer mask
   */
  labChangeParticles: function() {
    this.labParticleLightning.hidden = false;
    this.labParticles.style.height = '0';

    setTimeout(function() {
      for (var i = 0; i < this.labParticleMasks.length; i++)
        this.labParticleMasks[i].hidden = (i != this.labParticleCurrent);
      this.labParticleCurrent =
          (this.labParticleCurrent + 1) % this.labParticleMasks.length;
      this.labParticles.style.height = '100%';
    }.bind(this), 1500);
    setTimeout(function() {
      this.labParticleLightning.hidden = true;
    }.bind(this), 2500);
  },
  /**
   * Add floating bubbles randomly to the tank fluid
   */
  labAddBubbles: function() {
    document.querySelectorAll('.fluid').forEach(fluid => {
      var bubbleSpaceWidth =
          parseInt(window.getComputedStyle(fluid).width) - 10 - 20;
      for (var i = 0; i < 5; i++) {
        var bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.style.animationDuration =
            (Math.random() * 3 + 3).toFixed(1) + 's';
        bubble.style.animationDelay = -(Math.random() * 3).toFixed(1) + 's';
        bubble.style.left =
            Math.round(Math.random() * bubbleSpaceWidth + 20) + 'px';
        fluid.appendChild(bubble);
      }
    });
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', scene.init);
else
  scene.init();