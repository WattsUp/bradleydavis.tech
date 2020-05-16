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
  lastX: 0,
  scrollEventEnqueued: false,
  /**
   * Initialize the story, add listeners
   */
  init: function() {
    this.masks[0] = document.querySelector('#brad .mask.right');
    this.masks[1] = document.querySelector('#brad .mask.left');

    this.distance[0] = document.querySelectorAll('.distance.d0');
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
    this.launchPad.init();
    this.rocketEngineering.init();
    this.rocketBridge.init();
    this.rocketStorage.init();

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
    let scrollX = window.scrollY;
    let centerX = scrollX + document.documentElement.offsetWidth / 2;

    // every 500px of movement, check and hide offscreen scenes
    if (Math.abs(scrollX - this.lastOffscreenSceneCheck) > 500) {
      this.hideOffscreenScenes();
      this.lastOffscreenSceneCheck = scrollX;
      force = true;
    }

    // Move the backgrounds
    this.setBackground(centerX);
    this.setBrad(centerX);

    // Update story elements of each scene
    if ((centerX > 1900 && centerX < 6600) || force) this.lab.update(centerX);
    if ((centerX > 6200 && centerX < 8100) || force)
      this.launchPad.update(centerX);
    if ((centerX > 7000 && centerX < 10000) || force)
      this.rocketEngineering.update(centerX);
    if ((centerX > 13000 && centerX < 21000) || force)
      this.rocketBridge.update(centerX);
    console.log(centerX);
  },
  /**
   * Set the brad sprite globally to reduce glitches. Standing and jumping
   * @param {integer} x
   */
  setBrad: function(x) {
    // Stand still while:
    brad.standStill = (x < 6050 && x > 2710) ||  // On the rover
        (x < 7560 && x > 6740) ||                // On the elevator
        (x < 13570 && x > 9970) ||               // In the tube
        (x < 16270 && x > 15670);                // In the tube

    if (x > 13840) {  // End of tube 0
      brad.setTransform(0, 0)
    } else if (x > 13570) {
      brad.setTransform(13570 - x + 270, 0)
    } else if (x > 9970) {
      brad.setTransform(270, 0)
    } else if (x > 9700) {  // Start of tube 0
      brad.setTransform(x - 9700, 0)
    } else if (x > 6500) {
      brad.setTransform(0, 0)
    } else if (x > 6050) {  // Rover end
      brad.jump(false, 0)
    } else if (x > 2710) {  // Rover start
      brad.jump(true, 55)
    } else {
      brad.jump(false, 0)
    }

    if (x > 13570 && x < 16270) {  // Reverse walking
      brad.enqueueWalk(x < this.lastX);
    } else {
      brad.enqueueWalk(x > this.lastX);
    }
    this.lastX = x;
  },
  /**
   * Hide the children of scenes that are off screen to reduce layout processing
   */
  hideOffscreenScenes: function() {
    // var bottomThreshold = window.innerHeight + 500;
    // var leftThreshold = window.innerWidth + 500;
    // this.scenes.forEach(scene => {
    //   var rect = scene.getBoundingClientRect();
    //   var hidden =
    //       (rect.left > leftThreshold || rect.right < -500 ||
    //        rect.top > bottomThreshold || rect.bottom < -500);
    //   if (hidden) console.log(scene);
    //   for (var i = 0; i < scene.children.length; i++) {
    //     scene.children[i].hidden = hidden;
    //   }
    // });
  },
  /**
   * Set the position of the backgrounds based on the scroll state
   * @param {integer} centerX of the screen
   */
  setBackground: function(centerX) {
    let halfWidth = document.documentElement.offsetWidth / 2

    let y = 0;
    let backgroundShiftY = 0;
    let x = -(centerX - halfWidth);  // Reverse direction for backgrounds

    if (centerX > 14500) {
      backgroundShiftY = 6000;
    }

    if (centerX > 16270) {
      y = 820 + 13570 - 9970 + 16270 - 15670;
      x = -(9700 - halfWidth - 820 - 1830 + centerX - 16270);
    } else if (centerX > 15670) {
      y = 820 + 13570 - 9970 + centerX - 15670;
      x = -(9700 - halfWidth - 820 - 1830);
    } else if (centerX > 13840) {
      y = 820 + 13570 - 9970;
      x = (centerX - 13840) - (9700 - halfWidth - 820);
    } else if (centerX > 13570) {  // End of experience tube
      y = 820 + 13570 - 9970;
      x = -(9700 - halfWidth - 820);
    } else if (centerX > 9970) {  // Experience tube
      y = 820 + centerX - 9970;
      x = -(9700 - halfWidth - 820);
    } else if (centerX > 9700) {
      y = 820;
      x = -(9700 - halfWidth - 820);
    } else if (centerX > 7560) {  // End of launch pad elevator
      y = 820;
      x = -(centerX - halfWidth - 820);
    } else if (centerX > 6740) {  // Launch pad elevator
      y = centerX - 6740;
      x = -(6740 - halfWidth);
    }

    this.distance[0].forEach(distance => {
      distance.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    this.distance[1].style.transform =
        'translate(' + (x / 1.5) + 'px,' + (y / 3 + backgroundShiftY) + 'px)';
    this.distance[2].style.transform =
        'translate(' + (x / 2) + 'px,' + (y / 4 + backgroundShiftY) + 'px)';
    this.distance[3].style.transform =
        'translate(' + (x / 4) + 'px,' + (y / 8 + backgroundShiftY) + 'px)';
    this.distance[4].style.transform =
        'translate(' + (x / 8) + 'px,' + (y / 16 + backgroundShiftY) + 'px)';
    this.distanceSpace.style.transform =
        'translate(' + (x / 40) + 'px,' + (y / 80) + 'px)';
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
      this.scrollListener();
    }.bind(this), 3500);
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
     * Initialize the scene elements
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
     * Update the scene
     * @param {int} x
     */
    update: function(x) {
      // Jump onto the rover
      if (x > 6050) {
        this.rover.style.transform = 'translateX(3340px)';
        let rotation = 3340 / (Math.PI * 60) * 360;
        this.wheels[0].style.transform = 'rotateZ(' + rotation + 'deg)';
        this.wheels[1].style.transform = 'rotateZ(' + rotation + 'deg)';
      } else if (x > 2710) {
        this.rover.style.transform = 'translateX(' + (x - 2710) + 'px)';
        let rotation = (x - 2710) / (Math.PI * 60) * 360;
        this.wheels[0].style.transform = 'rotateZ(' + rotation + 'deg)';
        this.wheels[1].style.transform = 'rotateZ(' + rotation + 'deg)';
      } else {
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
  },
  /**
   * Launch pad scene
   */
  launchPad: {
    elevator: null,
    thrusters: [],
    /**
     * Initialize the scene elements
     */
    init: function() {
      this.elevator = document.getElementById('elevator');
      this.thrusters = document.querySelectorAll('#elevator>.thruster');
    },
    /**
     * Update the scene
     * @param {int} x
     */
    update: function(x) {
      // Use the elevator
      if (x > 6740) {
        this.thrusters[0].style.height = 'unset';
        this.thrusters[1].style.height = 'unset';
      } else {
        this.thrusters[0].style.height = 0;
        this.thrusters[1].style.height = 0;
      }

      if (x > 7850) {
        this.elevator.style.transform =
            'translateY(' + -(7850 - x + 820) + 'px)';
      } else if (x > 7560) {
        this.elevator.style.transform = 'translateY(-820px)';
      } else if (x > 6740) {
        this.elevator.style.transform = 'translateY(' + -(x - 6740) + 'px)';
      } else {
        this.elevator.style.transform = 'translateY(0)';
      }
    }
  },
  /**
   * Launch pad scene
   */
  rocketEngineering: {
    door: null,
    skillSets: [],
    currentSkillSet: -1,
    skillSetInterval: null,
    manualSkillSetTimeout: null,
    powerCable: null,
    status: null,
    tube: [],
    /**
     * Initialize the scene elements
     */
    init: function() {
      this.door = document.getElementById('rocket-door-engineering');
      this.skillSets =
          document.querySelectorAll('#scene-rocket-engineering .skill-set');
      this.skillSetInterval = setInterval(this.selectSkillSet.bind(this), 5000);
      this.powerCable = document.getElementById('rocket-power-cable');
      this.status = document.getElementById('rocket-status');
      this.tube[0] = document.getElementById('tube-front-0');
      this.tube[1] = document.getElementById('tube-rear-0');

      this.selectSkillSet();
    },
    /**
     * Update the scene
     * @param {int} x
     */
    update: function(x) {
      // Open and close the door
      if (x < 8000 && x > 7400) {
        this.door.classList.add('open');
      } else {
        this.door.classList.remove('open');
      }

      // Connect the cable
      if (!brad.movingRight) x = x - 65;
      if (x > 9387) {
        this.powerCable.style.width = '1077px';
        this.status.style.color = 'unset';
      } else if (x > 8310) {
        this.powerCable.style.width = (x - 8310) + 'px';
        this.status.style.color = '#FF1C1C';
      } else {
        this.powerCable.style.width = 0;
        this.status.style.color = '#FF1C1C';
      }

      // Switch the tube layering
      if (x > 9970) {
        this.tube[0].hidden = false;
        this.tube[1].classList.add('inside');
      } else {
        this.tube[0].hidden = true;
        this.tube[1].classList.remove('inside');
      }
    },
    /**
     *
     * @param {int} index of skill set to display
     * @param {boolean} manual true if skill set manually selected (delay before
     *     resume cycling)
     */
    selectSkillSet: function(index = -1) {
      if (index == -1)
        index = (this.currentSkillSet + 1) % 4;
      else {
        clearInterval(this.skillSetInterval);
        clearTimeout(this.manualSkillSetTimeout);
        this.manualSkillSetTimeout = setTimeout(function() {
          this.selectSkillSet();
          this.skillSetInterval =
              setInterval(this.selectSkillSet.bind(this), 5000);
        }.bind(this), 10000);
      }
      this.currentSkillSet = index;
      for (let i = 0; i < this.skillSets.length; i++)
        this.skillSets[i].hidden = i != index;
    }
  },
  rocketBridge: {
    time: -3,
    timer: null,
    timerInterval: null,
    sky: null,
    world: null,
    tube: [],
    /**
     * Initialize the scene elements
     */
    init: function() {
      this.timer = document.getElementById('rocket-timer');
      this.sky = document.getElementById('sky');
      this.world = document.getElementById('world');
      this.tube[0] = document.getElementById('tube-front-1');
      this.tube[1] = document.getElementById('tube-rear-1');
    },
    /**
     * Update the scene
     * @param {int} x
     */
    update: function(x) {
      if (x > 14500 && this.timerInterval == null) {
        this.incrementTimer();
        this.timerInterval = setInterval(this.incrementTimer.bind(this), 1000);
      } else if (x < 13500 && this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.time = -4;
        this.incrementTimer();
        this.sky.style.transform = 'translateY(0)';
      }

      // Switch the tube layering
      if (x > 15670) {
        this.tube[0].hidden = false;
        this.tube[1].classList.add('inside');
      } else {
        this.tube[0].hidden = true;
        this.tube[1].classList.remove('inside');
      }
    },
    /**
     * Increment the launch timer
     */
    incrementTimer: function() {
      this.time++;
      let string = Math.abs(this.time) > 9 ? Math.abs(this.time) :
                                             '0' + Math.abs(this.time);
      if (this.time < 0)
        this.timer.innerHTML = 'T-' + string;
      else
        this.timer.innerHTML = 'T+' + string;

      if (this.time == 0) {
        this.sky.style.transform = 'translateY(6000px)';
        this.world.style.animation = 'shake 300ms infinite linear';
        setTimeout(function() {
          this.world.style.animation = '';
        }, 3000);
      }
    }
  },
  rocketStorage: {
    projects: [],
    projectBoxes: [],
    currentProject: -1,
    lightning: null,
    busy: false,
    stand: null,
    /**
     * Initialize the scene elements
     */
    init: function() {
      this.projects = document.getElementsByClassName('project');
      this.projectBoxes = document.getElementsByClassName('project-box');
      this.lightning = document.getElementById('project-storage-lightning');
      this.stand = document.getElementById('project-storage-stand');

      for (let i = 0; i < this.projects.length; i++) {
        this.projects[i].style.transform = 'translateX(-50%) scale(0.0)';
        this.projects[i].style.opacity = 0.0;
      }
      this.lightning.hidden = true;

      this.setProject(0);
    },
    /**
     * Update the scene
     * @param {int} x
     */
    update: function(x) {},
    /**
     *
     * @param {integer} index of project to switch to
     */
    setProject: function(index) {
      if (this.busy) {
        return;
      }
      this.busy = true;

      let time = 0;
      if (this.currentProject != -1) {
        // Return current project to storage
        let project = this.projects[this.currentProject];
        let box = this.projectBoxes[this.currentProject];

        // Deflate current project into its box
        this.lightning.hidden = false;
        project.style.transform = 'translateX(-50%) scale(0.0)';
        project.style.opacity = 0.0;
        box.style.opacity = 1.0;
        this.stand.style.transform = 'translateX(-44px)';
        this.stand.style.height = '3px';
        time += 500;

        let standHeight = 21 + 40 * this.currentProject;
        let boxY = -(40 * this.currentProject);

        // Move box onto conveyor
        setTimeout(function() {
          this.lightning.hidden = true;
          box.style.transform = 'translate(-250px, 18px)';
        }.bind(this), time);
        time += 500;

        // Move box and conveyor to box slot
        setTimeout(function() {
          this.stand.style.transform = 'translateX(93px)';
          this.stand.style.height = standHeight + 'px';
          box.style.transform = 'translate(-113px, ' + boxY + 'px)';
        }.bind(this), time);
        time += 500;

        // Mox box into slot
        setTimeout(function() {
          box.style.transform = 'translate(0, ' + boxY + 'px)';
        }.bind(this), time);
        time += 500;
      }

      // Move conveyor to box slot
      let standHeight = 21 + 40 * index;
      setTimeout(function() {
        this.stand.style.transform = 'translateX(93px)';
        this.stand.style.height = standHeight + 'px';
      }.bind(this), time);
      time += 500;

      // Move box onto conveyor
      let box = this.projectBoxes[index];
      let boxY = -(40 * index);
      setTimeout(function() {
        box.style.transform = 'translate(-113px, ' + boxY + 'px)';
      }.bind(this), time);
      time += 500;

      // Move box and conveyor to the platform
      setTimeout(function() {
        this.stand.style.transform = 'translateX(-44px)';
        this.stand.style.height = '3px';
        box.style.transform = 'translate(-250px, 18px)';
      }.bind(this), time);
      time += 500;

      // Move box onto platform
      setTimeout(function() {
        box.style.transform = 'translate(-430px, 18px)';
      }.bind(this), time);
      time += 500;

      // Inflate the project
      let project = this.projects[index];
      setTimeout(function() {
        this.lightning.hidden = false;
        project.style.opacity = 1.0;
        project.style.transform = 'translateX(-50%) scale(1.0)';
        box.style.opacity = 0.0;
        this.stand.style.transform = 'translateX(0)';
        this.stand.style.height = '21px';
      }.bind(this), time);
      time += 500;

      // Turn off lightning, allow changes
      setTimeout(function() {
        this.lightning.hidden = true;
        this.busy = false;
      }.bind(this), time);
      time += 500;

      this.currentProject = index;
    }
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', story.init);
else
  story.init();