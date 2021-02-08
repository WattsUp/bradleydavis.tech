'use strict';

/**
 * Story elements including scroll position initiated element changes
 */
let story = {
  scenes: [],
  lastOffscreenSceneCheck: 0,
  distance: [],
  distanceSpace: null,
  lastX: 0,
  scrollEventEnqueued: false,
  scrollContainer: null,
  /**
   * Initialize the story, add listeners
   */
  init: function() {
    this.distance[0] = document.querySelectorAll('.distance.d0');
    this.distance[1] = document.querySelector('.distance.d1');
    this.distance[2] = document.querySelector('.distance.d2');
    this.distance[3] = document.querySelector('.distance.d3');
    this.distance[4] = document.querySelector('.distance.d4');
    this.distanceSpace = document.querySelector('.distance.space');
    this.scrollContainer = document.querySelector('#scroll-container');

    this.scenes = document.querySelectorAll('.scene');
    this.hideOffscreenScenes();

    this.lab.init();
    this.launchPad.init();
    this.rocketEngineering.init();
    this.rocketBridge.init();
    this.rocketStorage.init();
    this.shuttle.init();
    this.mars.init();

    window.addEventListener('scroll', function() {
      this.scrollListener(false);
    }.bind(this));
    window.addEventListener('resize', function() {
      this.scrollListener(true);
    }.bind(this));
  },
  /**
   * Process a scroll event
   * @param {bool} force a recalculate of all scenes
   */
  scrollListener: function(force) {
    if (this.lastSceneX == 0 || this.lastSceneX == null) force = true;
    let scrollX = window.scrollY;
    let centerX =
        Math.floor(scrollX + document.documentElement.offsetWidth / 2);

    // Move the backgrounds
    let backgroundOffset = this.setBackground(centerX);
    this.setBrad(centerX);

    this.scrollContainer.style.height =
        Math.floor(25000 - window.innerWidth / 2 + window.innerHeight) + 'px'

    // every 100px of movement, check and hide offscreen scenes
    if (Math.abs(scrollX - this.lastOffscreenSceneCheck) > 100) {
      this.hideOffscreenScenes(
          centerX, backgroundOffset[0], backgroundOffset[1]);
      this.lastOffscreenSceneCheck = scrollX;
      // force = true;
    }


    // Update story elements of each scene
    if ((centerX > 1900 && centerX < 6600) || force) this.lab.update(centerX);
    if ((centerX > 6200 && centerX < 8100) || force)
      this.launchPad.update(centerX);
    if ((centerX > 7000 && centerX < 10000) || force)
      this.rocketEngineering.update(centerX);
    if ((centerX > 13000 && centerX < 17000) || force)
      this.rocketBridge.update(centerX);
    if ((centerX > 17000) || force) this.shuttle.update(centerX);
    if ((centerX > 23000) || force) this.mars.update(centerX);
    // console.log(centerX);
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
        (x < 16270 && x > 15670) ||              // In the tube
        (x < 24200 && x > 18330);                // In the shuttle

    if (x > 24420) {
      brad.jump(false, 0);
    } else if (x > 24200) {
      brad.jump(true, 66);
    } else if (x > 21050) {
      brad.setTransform(0, -66);
    } else if (x > 20900) {
      brad.setTransform(0, -(66 + (20200 - 19800) - 100 - 2 * (x - 20900)));
    } else if (x > 20800) {
      brad.setTransform(0, -(66 + (20200 - 19800) - (x - 20800)));
    } else if (x > 20200) {
      brad.setTransform(0, -(66 + (20200 - 19800)));
    } else if (x > 19800) {
      brad.setTransform(0, -(66 + (x - 19800)));
    } else if (x > 19000) {
      brad.setTransform(0, -66);
    } else if (x > 18100) {
      brad.jump(true, 66);
    } else if (x > 17000) {
      brad.jump(false, 0);
    } else if (x > 13840) {  // End of tube 0
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

    if ((x > 13570 && x < 16270) || x > 22500) {  // Reverse walking
      brad.enqueueWalk(x < this.lastX);
    } else {
      brad.enqueueWalk(x > this.lastX);
    }

    brad.setMask(x > 24332);

    this.lastX = x;
  },
  /**
   * Hide the children of scenes that are off screen to reduce layout processing
   * @param {int} storyX
   * @param {int} x
   * @param {int} y
   */
  hideOffscreenScenes: function(storyX, x, y) {
    // Crosshairs
    x = -x + window.innerWidth / 2;
    // y = y;

    let margin = 200;
    let bottomMargin = Math.min(window.innerHeight * 0.15, 200) + margin;
    let topMargin = window.innerHeight - bottomMargin + margin;
    let horzMargin = window.innerWidth / 2 + margin;

    // Intro sign
    this.scenes[0].hidden = (x > 1910 + horzMargin);
    // Intro scene
    this.scenes[1].hidden = (x > 1910 + horzMargin);
    // Lab
    this.scenes[2].hidden = (x > 6170 + horzMargin || x < 1910 - horzMargin);
    // Launch pad
    this.scenes[3].hidden = (x > 6910 + horzMargin || x < 6110 - horzMargin);
    // Engines
    this.scenes[4].hidden = (y > 620 + bottomMargin || x < 6910 - horzMargin);
    // Engineering
    this.scenes[5].hidden = (y > 1520 + bottomMargin || x < 6880 - horzMargin);
    // XP 0
    this.scenes[6].hidden = (y > 2420 + bottomMargin || y < 1510 - topMargin);
    // XP 1
    this.scenes[7].hidden = (y > 3320 + bottomMargin || y < 2410 - topMargin);
    // XP 2
    this.scenes[8].hidden = (y > 4220 + bottomMargin || y < 3310 - topMargin);
    // Bridge
    this.scenes[9].hidden = (y > 4820 + bottomMargin || y < 4210 - topMargin);
    // Storage
    this.scenes[10].hidden = (x > 9300 + horzMargin || y < 4810 - topMargin);
    // Above storage
    this.scenes[11].hidden = (x > 9300 + horzMargin || y < 5720 - topMargin);
    // Above storage 2
    this.scenes[12].hidden = (x > 9300 + horzMargin || y < 6600 - topMargin);
    // Astroid belt
    this.scenes[13].hidden =
        (x > 12200 + horzMargin || x < 11000 - horzMargin || storyX > 24000);
    // Mars
    this.scenes[14].hidden = y > 4970 + bottomMargin;
  },
  /**
   * Set the position of the backgrounds based on the scroll state
   * @param {integer} centerX of the screen
   * @return {integer, integer} x and y offset of the backgrounds
   */
  setBackground: function(centerX) {
    let halfWidth = document.documentElement.offsetWidth / 2

    let y = 0;
    let backgroundShiftY = 0;
    let x = -(centerX - halfWidth);  // Reverse direction for backgrounds

    if (centerX > 12500) {
      backgroundShiftY = 6000;
    }

    if (centerX > 24200) {
      y = 820 + 13570 - 9970 + 16270 - 15670 + 250 - 700;
      x = -(9700 - halfWidth - 820 - 1830 + 23500 - 16270 - (centerX - 24200));
    } else if (centerX > 23500) {
      y = 820 + 13570 - 9970 + 16270 - 15670 + 250 - (centerX - 23500);
      x = -(9700 - halfWidth - 820 - 1830 + 23500 - 16270);
    } else if (centerX > 21050) {
      y = 820 + 13570 - 9970 + 16270 - 15670 + 250;
      x = -(9700 - halfWidth - 820 - 1830 + centerX - 16270);
    } else if (centerX > 20800) {
      y = 820 + 13570 - 9970 + 16270 - 15670 + (centerX - 20800);
      x = -(9700 - halfWidth - 820 - 1830 + centerX - 16270);
    } else if (centerX > 16270) {
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
    return [x, y];
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
      if (x > 17500) {
        this.sky.style.transform = 'translateY(6000px)';
        // this.sky.style.transition = 'none';
        this.time = 1;
      }
      if (x > 14500 && this.timerInterval == null) {
        this.incrementTimer();
        this.timerInterval = setInterval(this.incrementTimer.bind(this), 1000);
      } else if (x < 13500 && this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.time = -4;
        this.incrementTimer();
        // this.sky.style.transition = 'transform 5s ease-out';
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
        this.sky.style.transition = 'transform 5s ease-out';
        this.sky.style.transform = 'translateY(6000px)';
        this.world.style.animation = 'shake 1000ms infinite linear';
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
  },
  shuttle: {
    shuttle: null,
    thrust: null,
    shuttleForeground: null,
    doorTop: [],
    doorBottom: [],
    /**
     * Initialize the scene elements
     */
    init: function() {
      this.shuttle = document.getElementById('shuttle');
      this.thrust = document.getElementById('shuttle-thrust');
      this.shuttleForeground = document.getElementById('shuttle-foreground');
      this.doorTop = document.querySelectorAll('#shuttle>.door-top');
      this.doorBottom = document.querySelectorAll('#shuttle>.door-bottom');
    },
    /**
     * Update the scene
     * @param {int} x
     */
    update: function(x) {
      if (x > 18250 && x < 24208) {
        // Close door
        this.doorTop[0].style.transform = 'perspective(600px) rotateX(0)';
        this.doorTop[1].style.transform = 'perspective(600px) rotateX(0)';
        this.doorBottom[0].style.transform = 'perspective(600px) rotateX(0)';
        this.doorBottom[1].style.transform = 'perspective(600px) rotateX(0)';
      } else {
        // Open door
        this.doorTop[0].style.transform = 'perspective(600px) rotateX(180deg)';
        this.doorTop[1].style.transform = 'perspective(600px) rotateX(180deg)';
        this.doorBottom[0].style.transform =
            'perspective(600px) rotateX(-180deg)';
        this.doorBottom[1].style.transform =
            'perspective(600px) rotateX(-180deg)';
      }

      let shuttleX = 0;
      let shuttleY = 0;
      if (x > 24200) {
        shuttleX = 23500 - 18340;
        shuttleY = -(400 - 150 - 700);
        this.thrust.hidden = true;
      } else if (x > 23500) {
        shuttleX = 23500 - 18340;
        shuttleY = -(400 - 150 - (x - 23500));
      } else if (x > 21050) {
        shuttleX = x - 18340;
        shuttleY = -(400 - 150);
      } else if (x > 20900) {
        shuttleX = x - 18340;
        shuttleY = -(400 - (x - 20900));
      } else if (x > 20200) {
        shuttleX = x - 18340;
        shuttleY = -(400);
      } else if (x > 19800) {
        shuttleX = x - 18340;
        shuttleY = -(x - 19800);
      } else if (x > 18340) {
        shuttleX = x - 18340;
        shuttleY = 0;
        this.thrust.hidden = false;
      } else {
        this.thrust.hidden = true;
      }
      this.shuttle.style.transform =
          'translate(' + shuttleX + 'px, ' + shuttleY + 'px)';
      this.shuttleForeground.style.transform =
          'translate(' + shuttleX + 'px, ' + shuttleY + 'px)';
    }
  },
  mars: {
    mountains: null,
    mast: null,
    flag: null,
    form: null,
    /**
     * Initialize the scene elements
     */
    init: function() {
      this.mountains = document.getElementById('mars-mountains');
      this.mast = document.getElementById('lander-mast');
      this.flag = document.getElementById('lander-flag');
      this.form = document.getElementById('lander-form');
    },
    /**
     * Update the scene
     * @param {int} x
     */
    update: function(x) {
      this.mountains.style.transform =
          'translateX(' + Math.min(0, -(x - 24200) / 2) + 'px)';

      if (x > 24700) {
        this.mast.style.transform = 'scale(1.0)';
        setTimeout(function() {
          this.flag.style.transform = 'scaleX(1.0)';
          this.form.style.transform = 'scaleX(1.0)';
        }.bind(this), 1500);
      }
    }
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', story.init);
else
  story.init();