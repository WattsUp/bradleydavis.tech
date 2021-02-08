'use strict';

/**
 * Creation of dynamic scene elements, movement of the scene
 */
let scene = {
  labParticles: null,
  labParticleMasks: [],
  labParticleLightning: null,
  labParticleCurrent: 0,
  rocketBridgeConsole: null,
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
    this.rocketBridgeConsole =
        document.getElementById('rocket-bridge-console').getContext('2d');
    this.font.init();

    this.generateStars();

    setInterval(this.labChangeParticles.bind(this), 5000);
    this.labChangeParticles();
    this.labAddBubbles();

    this.font.onLoad('code-new-roman', function() {
      this.generateXPDisplay(
          displayXPs[0],
          {'Code': 0.25, 'Testing': 0.35, 'Bug Fixing': 0.2, 'Circuits': 0.2});
      this.generateXPDisplay(displayXPs[1], {
        'Animation': 0.35,
        'Code': 0.3,
        'Design': 0.15,
        'CAD': 0.1,
        'Teaching': 0.1
      });
      this.generateXPDisplay(displayXPs[2], {'Customer Service': 1.0});
    }.bind(this));

    setInterval(this.rocketChangeLEDs.bind(this), 1000);
    this.rocketChangeLEDs();

    this.setAsteroidAnimations();
  },
  /**
   * Draw stars randomly on the stars canvas
   */
  generateStars: function() {
    let context = document.getElementById('stars').getContext('2d');
    context.fillStyle = '#FFFFFF';
    for (let i = 0; i < 3000; i++) {
      let x = Math.random() * 5000;
      let y = Math.random() * 2500;
      let r = Math.random() * 2 + 0.5;
      context.beginPath();
      context.arc(x, y, r, 0, 2 * Math.PI);
      context.fill();
    }
  },
  /**
   * Actions to perform once the page is first scrolled
   */
  onFirstScroll: function() {
    // Needs to be scene. bind messes up references
    window.removeEventListener('scroll', scene.onFirstScroll);
    let scrollDown = document.getElementById('scroll-down');
    scrollDown.parentNode.removeChild(scrollDown);
  },
  /**
   * Change the current lab particle viewer mask
   */
  labChangeParticles: function() {
    this.labParticleLightning.hidden = false;
    this.labParticles.style.height = '0';

    setTimeout(function() {
      for (let i = 0; i < this.labParticleMasks.length; i++)
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
      let bubbleSpaceWidth =
          parseInt(window.getComputedStyle(fluid).width) - 10 - 20;
      for (let i = 0; i < 5; i++) {
        let bubble = document.createElement('div');
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
    context.translate(radius, radius)

    let currentPercent = 0.0;
    context.beginPath();
    let skillKeys = Object.keys(skills);
    if (skillKeys.length == 1) {
      context.fillText(skillKeys[0], 0, -15);
      context.fillText('100%', 0, 15);
    } else {
      for (let skill in skills) {
        context.moveTo(0, 0);
        context.lineTo(
            radius * Math.cos(2 * Math.PI * currentPercent),
            -radius * Math.sin(2 * Math.PI * currentPercent));

        let textRadius = radius * 0.8 * (1 - skills[skill])
        let x = textRadius *
            Math.cos(2 * Math.PI * (currentPercent + skills[skill] / 2))
        let y = -textRadius *
            Math.sin(2 * Math.PI * (currentPercent + skills[skill] / 2))
        context.fillText(skill, x, y - 15);
        context.fillText(skills[skill] * 100 + '%', x, y + 15);

        currentPercent = currentPercent + skills[skill];
        // TODO fill text with label and percent
      }
    }
    context.stroke();
  },
  rocketChangeLEDs: function() {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 6; y++) {
        switch (Math.round(Math.random() * 10)) {
          case 0:
            this.rocketBridgeConsole.fillStyle = '#FF595E';
            break;
          case 1:
          case 2:
            this.rocketBridgeConsole.fillStyle = '#F2C200';
            break;
          default:
            this.rocketBridgeConsole.fillStyle = '#30F230';
            break;
        }
        this.rocketBridgeConsole.fillRect(x * 6, y * 6, 4, 4);
      }
    }
  },
  setAsteroidAnimations: function() {
    document.querySelectorAll('#scene-asteroid-belt .background')
        .forEach(asteroid => {
          asteroid.style.animationDuration =
              (Math.random() * 10 + 10).toFixed(1) + 's';
          asteroid.style.animationDelay =
              -(Math.random() * 10).toFixed(1) + 's';
        });
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
      if (this.initialWidth == width) {
        this.attempts++;
        if (this.attempts > 50) {
          callback();
          console.error(fontFamily + ' failed to load, using fallback')
        } else {
          setTimeout(this.onLoad.bind(this), 50, fontFamily, callback);
        }
      } else {
        callback();
      }
    },
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', scene.init);
else
  scene.init();