'use strict';

/**
 * Story elements including scroll position initiated element changes
 */
var story = {
  scenes: [],
  lastOffscreenSceneCheck: 0,
  masks: [],
  distance: [],
  distanceSpace: null,
  lastSceneX: 0,
  scrollEventEnqueued: false,
  /**
   * Initialize the story, add listeners
   */
  init: function() {
    this.masks[0] = document.querySelector('#brad .mask.right');
    this.masks[1] = document.querySelector('#brad .mask.left');

    this.distance[0] = document.querySelector('.distance.d0');
    this.distance[1] = document.querySelector('.distance.d1');
    this.distance[2] = document.querySelector('.distance.d2');
    this.distance[3] = document.querySelector('.distance.d3');
    this.distance[4] = document.querySelector('.distance.d4');
    this.distanceSpace = document.querySelector('.distance.space');

    this.scenes = document.querySelectorAll('.scene');
    this.hideOffscreenScenes();

    this.masks[0].hidden = true;
    this.masks[1].hidden = true;

    this.lab.init();

    window.addEventListener('scroll', function() {
      story.scrollListener(false);
    }.bind(this));
    window.addEventListener('resize', function() {
      story.scrollListener(true);
    }.bind(this));
  },
  /**
   * Process a scroll event
   * @param {bool} force a recalculate of all scenes
   */
  scrollListener: function(force) {
    if (this.lastSceneX == 0) force = true;
    let sceneX = window.scrollY;
    this.setBackground(-sceneX, 0);
    brad.enqueueWalk(sceneX > this.lastSceneX);
    this.lastSceneX = sceneX;
    // every 500px of movement, check and hide offscreen scenes
    if (Math.abs(sceneX - this.lastOffscreenSceneCheck) > 500) {
      this.hideOffscreenScenes();
      this.lastOffscreenSceneCheck = sceneX;
    }
    sceneX = sceneX + document.documentElement.offsetWidth / 2;
    if ((sceneX > 1900 && sceneX < 6100) || force) this.lab.update(sceneX);
    console.log(sceneX);
  },
  /**
   * Hide the children of scenes that are off screen to reduce layout processing
   */
  hideOffscreenScenes: function() {
    var bottomThreshold = window.innerHeight + 500;
    var leftThreshold = window.innerWidth + 500;
    this.scenes.forEach(scene => {
      var rect = scene.getBoundingClientRect();
      var hidden = (rect.left > leftThreshold || rect.right < -500);
      for (var i = 0; i < scene.children.length; i++) {
        scene.children[i].hidden = hidden;
      }
    });
  },
  /**
   *
   * @param {integer} x offset of close distance
   * @param {integer} y offset of close distance
   */
  setBackground: function(x, y) {
    this.distance[0].style.transform = 'translateX(' + x + 'px)';
    this.distance[1].style.transform = 'translateX(' + (x / 1.5) + 'px)';
    this.distance[2].style.transform = 'translateX(' + (x / 2) + 'px)';
    this.distance[3].style.transform = 'translateX(' + (x / 4) + 'px)';
    this.distance[4].style.transform = 'translateX(' + (x / 8) + 'px)';
    this.distanceSpace.style.transform = 'translateX(' + (x / 40) + 'px)';
  },
  /**
   * Perform a teleport animation to the location of the hash
   * @param {String} hash
   */
  teleport: function(hash) {
    window.scroll(
        {top: 2095 - window.innerWidth / 2, left: 0, behavior: 'smooth'});
    setTimeout(function() {
      brad.jump(true, 35);
    }, 1000);
    setTimeout(function() {
      brad.teleport(false);
    }, 1500);
    setTimeout(function() {
      location.hash = hash;
      brad.jump(false, 0);
    }, 3000);
    setTimeout(function() {
      brad.teleport(true);
    }, 3500);
  },
  /**
   * Lab scene
   */
  lab: {
    rover: null,
    wheels: [],
    beam: null,
    tanks: [],
    battery: null,
    lcd: null,
    /**
     * Initialize the lab scene elements
     */
    init: function() {
      this.rover = document.getElementById('lab-rover');
      this.wheels = document.querySelectorAll('#lab-rover>.wheel');
      this.beam = document.querySelector('#lab-rover>.beam');
      this.tanks = document.querySelectorAll('#lab-tanks>.fluid');
      this.battery = document.getElementById('lab-battery');
      this.lcd = document.querySelector('#lab-wsu>div');
    },
    /**
     * Update the lab scene
     * @param {int} x
     */
    update: function(x) {
      // Jump onto the rover
      if (x > 6050) {
        brad.standStill = false;
        brad.jump(false, 0);
        this.rover.style.transform = 'translateX(3340px)';
        let rotation = 3340 / (Math.PI * 60) * 360;
        this.wheels[0].style.transform = 'rotateZ(' + rotation + 'deg)';
        this.wheels[1].style.transform = 'rotateZ(' + rotation + 'deg)';
      } else if (x > 2710) {
        brad.standStill = true;
        brad.jump(true, 55);
        this.rover.style.transform = 'translateX(' + (x - 2710) + 'px)';
        let rotation = (x - 2710) / (Math.PI * 60) * 360;
        this.wheels[0].style.transform = 'rotateZ(' + rotation + 'deg)';
        this.wheels[1].style.transform = 'rotateZ(' + rotation + 'deg)';
      } else {
        brad.standStill = false;
        brad.jump(false, 0);
        this.rover.style.transform = 'translateX(0)';
        this.wheels[0].style.transform = 'rotateZ(0)';
        this.wheels[1].style.transform = 'rotateZ(0)';
      }

      // Fill tank
      if (x > 2800)
        this.tanks.forEach(tank => {tank.style.transform = 'scaleY(1)'});
      else
        this.tanks.forEach(tank => {tank.style.transform = 'scaleY(0.01)'});

      // Grab battery
      if (x > 5590) {
        this.battery.style.transform = 'translate(733px,-88px)';
        this.beam.hidden = true;
        this.lcd.hidden = false;
      } else if (x > 4857) {
        let batteryX = x - 4857;
        this.lcd.hidden = true;
        this.beam.hidden = false;
        let batteryY = -Math.min(88, batteryX);
        this.battery.style.transform =
            'translate(' + batteryX + 'px,' + batteryY + 'px)';
        let beamAngle = Math.atan((147 + batteryY - 30) / 170);
        this.beam.style.transform = 'rotateZ(' + beamAngle + 'rad)';
      } else {
        this.lcd.hidden = true;
        this.beam.hidden = true;
        this.battery.style.transform = 'translate(0,0)';
      }
    }
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', story.init);
else
  story.init();