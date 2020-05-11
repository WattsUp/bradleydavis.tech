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
    let displayXPs = document.querySelectorAll('.display-xp>canvas');
    this.font.init();

    setInterval(this.labChangeParticles.bind(this), 5000);
    this.labChangeParticles();
    this.labAddBubbles();
    this.font.onLoad('code-new-roman', function() {
      this.generateXPDisplay(
          displayXPs[0],
          {'Bug Fixing': 0.2, 'Code': 0.35, 'Circuits': 0.15, 'Testing': 0.3});
      this.generateXPDisplay(displayXPs[1], {
        'Animation': 0.35,
        'Code': 0.3,
        'Design': 0.15,
        'CAD': 0.1,
        'Teaching': 0.1
      });
      this.generateXPDisplay(displayXPs[2], {'Customer Service': 1.0});
    }.bind(this));
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
  },
  /**
   * Generate a pie chart for an XP display
   * @param {DOMElement} display to generate
   * @param {list} skills list of skills and their proportions
   */
  generateXPDisplay: function(display, skills) {
    let context = display.getContext('2d');
    let radius = 250;
    display.width = radius * 2;
    display.height = radius * 2;
    // let radius = context.width / 2;
    context.strokeStyle = '#282828';
    context.fillStyle = '#282828';
    context.font = '32px code-new-roman';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.lineWidth = 4;
    let currentPercent = 0.0;
    context.beginPath();
    let skillKeys = Object.keys(skills);
    if (skillKeys.length == 1) {
      context.fillText(skillKeys[0], radius, radius);
      context.fillText('100%', radius, radius + 32);
    } else {
      console.log(skillKeys)
      for (let skill in skills) {
        context.moveTo(radius, radius);
        context.lineTo(
            radius + radius * Math.cos(2 * Math.PI * currentPercent),
            radius - radius * Math.sin(2 * Math.PI * currentPercent));
        currentPercent = currentPercent + skills[skill];
        // TODO fill text with label and percent
      }
    }
    context.stroke();
  },
  /**
   * Font object to perform fontOnLoad callback
   */
  font: {
    testString: 'Test string to measure length;',
    initialWidth: null,
    testContext: null,
    attempts: 0,
    init: function() {
      let temp = document.createElement('canvas');
      // document.body.appendChild(temp);
      this.testContext = temp.getContext('2d');
      this.testContext.font = '20px Arial';
      this.initialWidth = this.testContext.measureText(this.testString).width;
      console.log(this.initialWidth)
      // temp.parentNode.removeChild(temp);
    },
    /**
     *
     * @param {string} fontFamily of the font to check for load status
     * @param {*} callback function once font is loaded, or timeout
     */
    onLoad: function(fontFamily, callback) {
      this.testContext.font =
          '20px ' + fontFamily + ', Arial';  // Use fallback font of Arial
      let width = this.testContext.measureText(this.testString).width;
      console.log(width)
      if (this.initialWidth == width) {
        this.attempts++;
        if (this.attempts > 50) {
          callback();
          console.error(fontFamily + ' failed to load, using fallback')
        } else {
          setTimeout(this.onLoad.bind(this), 50, fontFamily, callback);
        }
      }
      else {
        callback();
      }
    },
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', scene.init);
else
  scene.init();