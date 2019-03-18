/**
 * Function run when page is ready
 */
$(function() {
  setInterval(blink, 4000);
  setInterval(changeLeds, 500);
  setInterval(cycleBoard, 5000);
  setInterval(cycleParticleDisplay, 5000);
  setInterval(flashBacklightEngineRoom, 5000);
  setInterval(flashWSULCD, 1000);
  setInterval(skillsDisplayCycle, 5000);
  blink();
  cycleParticleDisplay();
  skillsDisplayCycle();

  $('.teleporter-science').hide();
  $('.project-viewer-lightning').hide();
  cssPrefix($('.project'), 'transform', 'translate(-50%) scale(0.0)');
  $('.project').hide();

  updateScene();
  drawPieCharts();
  drawStarfield();
  changeProject(0);
});

/**
 * Draw the work experience pie charts
 */
function drawPieCharts() {
  var radius = 120;
  var context0 = $('.experience-panel>canvas')[0].getContext('2d');
  $('.experience-panel>canvas')[0].width = radius * 2;
  $('.experience-panel>canvas')[0].height = radius * 2;
  context0.strokeStyle = '#282828';
  context0.lineWidth = 2;
  context0.beginPath();
  context0.moveTo(radius, radius);
  context0.lineTo(radius * 2, radius);
  context0.moveTo(radius, radius);
  context0.lineTo(
      radius + radius * Math.cos(2 * Math.PI / 100 * 30),
      radius - radius * Math.sin(2 * Math.PI / 100 * 30));
  context0.moveTo(radius, radius);
  context0.lineTo(
      radius + radius * Math.cos(2 * Math.PI / 100 * 45),
      radius - radius * Math.sin(2 * Math.PI / 100 * 45));
  context0.moveTo(radius, radius);
  context0.lineTo(
      radius + radius * Math.cos(2 * Math.PI / 100 * 65),
      radius - radius * Math.sin(2 * Math.PI / 100 * 65));
  context0.moveTo(radius, radius);
  context0.stroke();
  var context1 = $('.experience-panel>canvas')[1].getContext('2d');
  $('.experience-panel>canvas')[1].width = radius * 2;
  $('.experience-panel>canvas')[1].height = radius * 2;
  context1.strokeStyle = '#282828';
  context1.lineWidth = 2;
  context1.beginPath();
  context1.moveTo(radius, radius);
  context1.lineTo(radius * 2, radius);
  context1.moveTo(radius, radius);
  context1.lineTo(
      radius + radius * Math.cos(2 * Math.PI / 100 * 10),
      radius - radius * Math.sin(2 * Math.PI / 100 * 10));
  context1.moveTo(radius, radius);
  context1.lineTo(
      radius + radius * Math.cos(2 * Math.PI / 100 * 25),
      radius - radius * Math.sin(2 * Math.PI / 100 * 25));
  context1.moveTo(radius, radius);
  context1.lineTo(
      radius + radius * Math.cos(2 * Math.PI / 100 * 55),
      radius - radius * Math.sin(2 * Math.PI / 100 * 55));
  context1.moveTo(radius, radius);
  context1.lineTo(
      radius + radius * Math.cos(2 * Math.PI / 100 * 90),
      radius - radius * Math.sin(2 * Math.PI / 100 * 90));
  context1.stroke();
}

/**
 * Draw the stars randomly
 */
function drawStarfield() {
  var contextSpace = $('.space-wrapper>canvas')[0].getContext('2d');
  contextSpace.fillStyle = '#FFFFFF';
  var x = 0;
  var y = 0;
  var radius = 1;
  for (var i = 0; i < 10000; i++) {
    x = Math.floor(Math.random() * 8000);
    y = Math.floor(Math.random() * 8000);
    radius = Math.floor(Math.random() * 3);
    contextSpace.beginPath();
    contextSpace.arc(x, y, radius, 0, Math.PI * 2, true);
    contextSpace.fill();
  }
}

/**
 * Update the scene when window is resized or scrolled
 */
$(window).resize(updateScene);
$(document).scroll(updateScene);

/***************************** Interval Functions *****************************/
var bridgeLeds = $('.bridge-window>canvas')[0].getContext('2d');
var countdownText = $('.bridge-window>h1');
var engineRoom = $('.rocket>.background:eq(0)');
var eyesRight = $('.brad-eyes.right');
var eyesLeft = $('.brad-eyes.left');
var titleSign = $('.title-sign-wrapper');
var particles = $('.particle-viewer-particles');
var particleImages = $('.particle-viewer-image');
var particleLightning = $('.particle-viewer-lightning');
var skillsWrapper = $('.skills-wrapper');
var wsuLCD = $('.lcd-wsu-on');

var backlightEngineRoom = '#FF1C1C';
var engineRoomTimeout;
var movingRight = true;
var particleDisplayCurrent = 0;
var skillsClicked = false;
var skillsCurrent = 0;
var wsuLCDOff = true;

/**
 * Blink the eyes
 */
function blink() {
  if (movingRight) {
    eyesRight.show();
    eyesLeft.hide();
  } else {
    eyesRight.hide();
    eyesLeft.show();
  }
  setTimeout(function() {
    eyesRight.hide();
    eyesLeft.hide();
  }, 100);
}

/**
 * Redraws the bridge's leds
 */
function changeLeds() {
  for (var row = 0; row < 5; row++) {
    for (var col = 0; col < 4; col++) {
      switch (getRandomInt(0, 15)) {
        case 0:
          bridgeLeds.fillStyle = '#FF595E';
          break;
        case 1:
        case 2:
          bridgeLeds.fillStyle = '#F2C200';
          break;
        default:
          bridgeLeds.fillStyle = '#33FF33';
          break;
      }
      bridgeLeds.fillRect(col * 6 + 2, row * 6 + 2, 4, 4);
    }
  }
}

/**
 * Alternates the first title board
 */
function cycleBoard() {
  titleSign.toggleClass('transformYn50');
}

/**
 * Changes the particle display to the next image
 */
function cycleParticleDisplay() {
  particleDisplayCurrent = (particleDisplayCurrent + 1) % 3;
  particles.css('height', '0%');
  particleLightning.show();
  setTimeout(function() {
    particleImages.hide();
    particleImages.eq(particleDisplayCurrent).show();
    particles.css('height', '100%');
  }, 1000)
  setTimeout(function() {
    particleLightning.hide();
  }, 2000);
}

/**
 * Flashes the WSU LCD
 */
function flashWSULCD() {
  if (!wsuLCDOff) {
    wsuLCD.show();
    setTimeout(function() {
      wsuLCD.hide();
    }, 750);
  }
}

/**
 * Flashes the backlight of the engineroom
 */
function flashBacklightEngineRoom() {
  engineRoom.css('background-color', backlightEngineRoom);
  clearTimeout(engineRoomTimeout);
  engineRoomTimeout = setTimeout(function() {
    engineRoom.css('background-color', '#737373');
  }, 2000);
}

/**
 * Changes the skills display
 */
function skillsDisplayCycle() {
  if (!skillsClicked) {
    skillsCurrent = (skillsCurrent + 1) % 4;
    skillsWrapper.hide();
    skillsWrapper.eq(skillsCurrent).show();
  }
}

/**
 * Increment the count down timer
 * Launch the rocket when the timer reaches 0
 */
function updateCountdown() {
  if (countdownTime <= -10) {
    countdownText.text('T' + countdownTime);
  } else if (countdownTime <= -1) {
    countdownText.text('T-0' + (-countdownTime));
  } else if (countdownTime <= 9) {
    countdownText.text('T+0' + countdownTime);
  } else {
    countdownText.text('T+' + countdownTime);
  }
  if (countdownTime == 0) {
    setTimeout(launchRocket, 1);
  }
  countdownTime++;
}

/************************** User Activated Functions **************************/
var changingProject = false;
var countdownTime = -3;
var currentBox = -1;
var teleporting = false;
var skillsClickedTimeout;

var projects = $('.project');
var projectBoxes = $('.project-viewer > .box')
var projectConveyor = $('.project-viewer-stand');
var projectLightning = $('.project-viewer-lightning');
var teleporterScience = $('.teleporter-science');

/**
 * Swaps current project to the selected one
 * @param {number} index
 */
function changeProject(index) {
  if (changingProject) {
    return;
  }
  changingProject = true;

  var time = 0;
  if (currentBox != -1) {
    var oldProject = projects.eq(currentBox);
    var oldBoxObj = projectBoxes.eq(currentBox);

    // Shrink current project down into its box
    projectLightning.show();
    cssPrefix(oldProject, 'transform', 'translate(-50%) scale(0.0)')
    oldProject.fadeOut(250);
    oldBoxObj.fadeIn(250);
    time += 500;

    var oldHeight = 20 + 40 * currentBox;
    var bottom = 65 + 40 * currentBox;

    // Stop shrinking, slide box onto conveyor
    setTimeout(function() {
      projectLightning.hide();
      oldBoxObj.css('left', '800px');
    }, time);
    time += 500;

    // Move box and conveyor to its shelf
    setTimeout(function() {
      projectConveyor.css('left', '992px');
      projectConveyor.css('height', oldHeight + 'px');
      oldBoxObj.css('bottom', bottom + 'px');
      oldBoxObj.css('left', '940px');
    }, time);
    time += 500;

    // Slide box into it shelf
    setTimeout(function() {
      oldBoxObj.css('left', '1053px');
    }, time);
    time += 500;
  }

  // Move conveyor to selected project's shelf
  var height = 20 + 40 * index;
  setTimeout(function() {
    projectConveyor.css('left', '992px');
    projectConveyor.css('height', height + 'px');
  }, time);
  time += 500;

  // Slide box onto conveyor
  var boxObj = projectBoxes.eq(index);
  setTimeout(function() {
    boxObj.css('left', '940px');
  }, time);
  time += 500;

  // Move box and conveyor to the platform
  setTimeout(function() {
    projectConveyor.css('left', '850px');
    projectConveyor.css('height', '3px');
    boxObj.css('left', '800px');
    boxObj.css('bottom', '47px');
  }, time);
  time += 500;

  // Slide box onto the platform
  setTimeout(function() {
    boxObj.css('left', '620px');
  }, time);
  time += 500;

  // Unshrink the project
  setTimeout(function() {
    projectLightning.show();
    var project = projects.eq(index);
    project.fadeIn(250);
    cssPrefix(project, 'transform', 'translate(-50%) scale(1.0)')
    boxObj.fadeOut(250);
  }, time);
  time += 500;

  // Stop growing the project
  setTimeout(function() {
    projectLightning.hide();
    changingProject = false;
  }, time);
  time += 500;

  currentBox = index;
}

/**
 * Use the teleporter to teleport to a section
 * @param {string} locationHash
 */
function teleporterChange(locationHash) {
  if (teleporting) {
    return;
  }
  teleporting = true;

  // Move background to the right
  scenes.addClass('transition-all-1s');
  backgrounds.addClass('transition-all-1s');
  farBackgrounds.addClass('transition-all-1s');
  cssPrefix(scenes, 'transform', 'translateX(0px)');
  cssPrefix(backgrounds, 'transform', 'translateX(0px)');
  cssPrefix(farBackgrounds, 'transform', 'translateX(0px)');

  // Walk Brad into the teleporter
  bradContainer.css('left', '175px');
  bradContainer.addClass('transition-all-1s');
  bradJumpContainer.addClass('jump-up');
  bradJumpContainer.removeClass('jump-down');
  movingRight = false;
  updateWalkingSprite();
  setTimeout(updateWalkingSprite, timingWalking);
  setTimeout(updateWalkingSprite, timingWalking * 2);
  setTimeout(updateWalkingSprite, timingWalking * 3);

  // Jump Brad into the teleporter
  setTimeout(function() {
    scenes.removeClass('transition-all-1s');
    backgrounds.removeClass('transition-all-1s');
    farBackgrounds.removeClass('transition-all-1s');
    bradContainer.removeClass('transition-all-1s');
    bradJumpContainer.css('bottom', '35px');
  }, 1000);

  // Start the teleportation
  setTimeout(function() {
    teleporterScience.show();
    bradContainer.fadeOut(600);
  }, 1400);

  // Finish the teleporting, make Brad disappear, and change the location
  setTimeout(function() {
    teleporterScience.hide();
    teleporting = false;
    location.hash = locationHash;
  }, 2000);

  // Make Brad appear
  setTimeout(function() {
    bradContainer.fadeIn(600);
    teleporting = false;
    bradContainer.css('left', '50%');
    bradJumpContainer.css('bottom', '0px');
    bradJumpContainer.removeClass('jump-up');
    updateScene();
  }, 2500);
}

/**
 * Change the skills display then resume cycling
 * @param {number} currentDisplay
 */
function skillsDisplay(currentDisplay) {
  skillsClicked = true;
  skillsCurrent = currentDisplay;
  skillsWrapper.hide();
  skillsWrapper.eq(skillsCurrent).show();
  clearTimeout(skillsClickedTimeout);
  skillsClickedTimeout = setTimeout(function() {
    skillsClicked = false;
  }, 10000);
}

/****************************** Scene Functions *******************************/
var animateLaunch = true;
var countdownStarted = false;
var countdownTimer;
var disableWalking = false;
var currentWalkingFrame = 0;
var groundHeight = 0;
var landerMastDeployed = false;
var lastPositionBrad = 0;
var lastAdjustedSceneX = $(document).scrollTop();
var moving = false;
var rocketLaunched = false;
var screenHeight = 0;
var speedScene = 1 / 1;
var speedBackground = 1 / 2;
var speedFarBackground = 1 / 3;
var speedSuperFarBackground = 1 / 10;
var stopWalkingTimeout;
var timingWalking = 200;

var backgrounds = $('.scene-background');
var bradSprite = $('.brad');
var bradContainer = $('.brad-container');
var bradJumpContainer = $('.brad-container>div');
var elevator = $('.elevator-cargo');
var elevatorThruster = $('.thruster-on');
var emailForm = $('.mars-lander-mast>form');
var engineRoomWire = $('.engine-room-wire');
var farBackgrounds = $('.scene-background.far');
var fluidElectronics = $('#fluid-electronics');
var fluidSoftware = $('#fluid-software');
var fluidHardware = $('#fluid-hardware');
var fluidArt = $('#fluid-art');
var foregrounds = $('.scene-foreground');
var ground = $('.ground');
var lab = $('.scene.lab');
var landerMast = $('.mars-lander-mast');
var landerFlag = $('.mars-lander-flag');
var lcdBattery = $('#battery');
var mask = $('.brad-mask');
var maskRight = $('.brad-mask>.right');
var maskLeft = $('.brad-mask>.left');
var onTheGrounds = $('.on-the-ground');
var pageContainer = $('.page-container');
var rocket = $('.scene.rocket');
var rocketHatch = $('.rocket-hatch');
var rocketPowerStatus = $('#rocket-power-status');
var rover = $('.rover');
var roverTracorBeam = $('.rover-tractor-beam');
var roverWheels = $('.rover-wheel');
var scenes = $('#scenes');
var scrollContainer = $('#scroll-container');
var sky = $('.sky');
var stars = $('.space-wrapper');
var shuttle = $('.shuttle');
var shuttleForeground = $('.shuttle-foreground');
var shuttleDoorTop = $('.shuttle-door-top');
var shuttleDoorBottom = $('.shuttle-door-bottom');
var shuttleThrust = $('.shuttle-thrust');
var superFarBackgrounds = $('.scene-background.super-far');
var tubeBackground = $('.tube-station-background');
var tubeForeground = $('.tube-station-foreground');

/**
 * Transform the components in the scene
 */
function updateScene() {
  var sceneX = $(document).scrollTop();
  // Elevator @ 5500
  // Tubes @ 8890 and 14350
  var sceneY = Math.max(0, Math.min(950, sceneX - 5500)) +
      Math.max(0, Math.min(3410, sceneX - 8890)) +
      Math.max(0, Math.min(650, sceneX - 14350)) +
      Math.max(0, Math.min((sceneX - 19600) / 2, 350)) -
      Math.max(0, Math.min(sceneX - 23400, 800));
  sceneY = Math.floor(sceneY);
  // console.log('sceneX: ' + sceneX + ' sceneY: ' + sceneY);
  updateMovement(sceneX, sceneY);
  updateStory(sceneX, sceneY);
  updateHidden(sceneX);
  if (groundHeight != ground.height()) {
    groundHeight = ground.height();
    onTheGrounds.css('bottom', groundHeight + 'px');
  }
  if (screenHeight != window.innerHeight) {
    screenHeight = window.innerHeight;
    scrollContainer.css('height', (25000 + screenHeight) + 'px');
  }
}

/**
 * Launch the rocket into orbit
 */
function launchRocket() {
  if (animateLaunch) {
    sky.addClass('transition-all-7s');
    stars.addClass('transition-all-7s');
    pageContainer.addClass('shook');
    setTimeout(function() {
      pageContainer.removeClass('shook');
    }, 4000);
  } else {
    sky.removeClass('transition-all-7s');
    stars.removeClass('transition-all-7s');
  }
  cssPrefix(sky, 'transform', 'translateY(8000px)');
  cssPrefix(stars, 'transform', 'translateY(1000px)');
  rocketLaunched = true;
}

/**
 * Change the sprite to the next walking frame
 */
function updateWalkingSprite() {
  bradSprite.css('bottom', (movingRight * -200) + 'px');
  currentWalkingFrame = (currentWalkingFrame + 1) % 4;
  switch (currentWalkingFrame) {
    case 0:
    case 2:
      bradSprite.css('left', '0px');
      moving = false;
      break;
    case 1:
      bradSprite.css('left', '-200px');
      break;
    case 3:
      bradSprite.css('left', '-400px');
      break;
  }
  if (movingRight) {
    maskRight.show();
    maskLeft.hide();
  } else {
    maskRight.hide();
    maskLeft.show();
  }
}

/**
 * Hide scenes that are not visible
 * @param {number} sceneX
 */
function updateHidden(sceneX) {
  if (sceneX < 7500) {
    lab.show();
  } else {
    lab.hide();
  }
  if (sceneX > 3700) {
    rocket.show();
  } else {
    rocket.hide();
  }
}

/**
 * Update story components
 * @param {number} sceneX
 * @param {number} sceneY
 */
function updateStory(sceneX, sceneY) {
  // Don't walk on the rover, in the tubes, or in the shuttle
  if ((sceneX > 480 && sceneX < 6500) || (sceneX > 8890 && sceneX < 12300) ||
      (sceneX > 14350 && sceneX < 15000) ||
      (sceneX > 16950 && sceneX < 24200)) {
    disableWalking = true;
  } else {
    disableWalking = false;
  }

  if (sceneX > 480 && sceneX < 6500) {
    // Jump onto the rover
    bradJumpContainer.addClass('jump-up');
    bradJumpContainer.removeClass('jump-down');
    bradJumpContainer.css('bottom', '55px');
  } else if (sceneX > 16800 && sceneX < 24450) {
    // Jump into the shuttle
    bradJumpContainer.addClass('jump-up');
    bradJumpContainer.removeClass('jump-down');
    bradJumpContainer.css('bottom', '66px');
  } else {
    bradJumpContainer.addClass('jump-down');
    bradJumpContainer.removeClass('jump-up');
    bradJumpContainer.css('bottom', '0px');
  }

  // Turn on the rover's tractor beam
  if (sceneX > 850 && sceneX < 3998) {
    roverTracorBeam.show();
  } else {
    roverTracorBeam.hide();
  }

  // Fill up the fluid tanks
  if (sceneX > 1150) {
    fluidElectronics.removeClass('transformYp100');
    setTimeout(function() {
      fluidSoftware.removeClass('transformYp100');
    }, 250);
    setTimeout(function() {
      fluidHardware.removeClass('transformYp100');
    }, 500);
    setTimeout(function() {
      fluidArt.removeClass('transformYp100');
    }, 750);
  } else if (sceneX < 1100) {
    fluidElectronics.addClass('transformYp100');
    setTimeout(function() {
      fluidSoftware.addClass('transformYp100');
    }, 250);
    setTimeout(function() {
      fluidHardware.addClass('transformYp100');
    }, 500);
    setTimeout(function() {
      fluidArt.addClass('transformYp100');
    }, 750);
  }

  // Turn on the WSU LCD
  if (sceneX > 3998) {
    wsuLCDOff = false;
  } else {
    wsuLCDOff = true;
    wsuLCD.hide();
  }

  // Turn on the elevator's thrusters
  if (sceneX > 5500) {
    elevatorThruster.show();
  } else {
    elevatorThruster.hide();
  }

  // Close the hatches for launch
  if (sceneX > 7000 && sceneX < 17000) {
    rocketHatch.addClass('rocket-hatch-close');
    rocketHatch.removeClass('rocket-hatch-open');
    rocketHatch.eq(0).css('left', '0px');
    rocketHatch.eq(1).css('left', '2390px');
  } else {
    rocketHatch.removeClass('rocket-hatch-close');
    rocketHatch.addClass('rocket-hatch-open');
    rocketHatch.eq(0).css('left', '30px');
    rocketHatch.eq(1).css('left', '2420px');
  }

  // Swap foreground and background tubes to put Brad inside it
  if ((sceneX > 8890 && sceneX < 12300) || sceneX > 14350) {
    tubeBackground.hide();
    tubeForeground.show();
  } else {
    tubeBackground.show();
    tubeForeground.hide();
  }

  // Start the countdown timer to launch the rocket
  if (sceneX > 15000 && !rocketLaunched) {
    // Skip to space
    if (!countdownStarted) {
      countdownTimer = setInterval(updateCountdown, 1000);
      countdownStarted = true;
    }
    animateLaunch = false;
    launchRocket();
  } else if (sceneX > 12300 && countdownStarted == false && !rocketLaunched) {
    countdownTimer = setInterval(updateCountdown, 1000);
    countdownStarted = true;
  } else if (sceneX < 12000 && countdownStarted == true && rocketLaunched) {
    animateLaunch = true;
    clearInterval(countdownTimer);
    countdownStarted = false;
    countdownTime = -4;
    updateCountdown();
    sky.addClass('transition-all-7s');
    stars.addClass('transition-all-7s');
    cssPrefix(sky, 'transform', 'translateY(0px)');
    cssPrefix(stars, 'transform', 'translateY(0px)');
    setTimeout(function() {
      rocketLaunched = false;
    }, 7000);
  }
  if (sceneX < 8000 && rocketLaunched) {
    // Skip to ground
    clearInterval(countdownTimer);
    countdownStarted = false;
    countdownTime = -4;
    updateCountdown();
    sky.removeClass('transition-all-7s');
    stars.removeClass('transition-all-7s');
    cssPrefix(sky, 'transform', 'translateY(0px)');
    cssPrefix(stars, 'transform', 'translateY(0px)');
    rocketLaunched = false;
  }

  // Operate the shuttle doors
  if ((sceneX > 16400 && sceneX < 16950) ||
      (sceneX > 24250 && sceneX < 24700)) {
    cssPrefix(
        shuttleDoorTop, 'transform', 'rotateX(180deg) perspective(600px)');
    cssPrefix(
        shuttleDoorBottom, 'transform', 'rotateX(-180deg) perspective(600px)');
  } else {
    cssPrefix(shuttleDoorTop, 'transform', 'rotateX(0deg) perspective(600px)');
    cssPrefix(shuttleDoorBottom, 'transform', 'rotateX(0deg) perspective(600px)');
  }

  // Turn on the shuttle's thrust
  if (sceneX > 16950 && sceneX < 24200) {
    shuttleThrust.show();
  } else {
    shuttleThrust.hide();
  }

  // Move the engine room wire
  var engineWireLength =
      Math.max(20, Math.min(1380, sceneX - 6900 - (movingRight ? 0 : 70)));
  engineRoomWire.css('width', engineWireLength + 'px');
  if (engineWireLength == 1380) {
    backlightEngineRoom = '#33FF33';
    flashBacklightEngineRoom();
    rocketPowerStatus.css('color', '#33FF33');
  } else {
    backlightEngineRoom = '#FF1C1C';
    flashBacklightEngineRoom();
    rocketPowerStatus.css('color', '#FF1C1C');
  }

  // Put on oxygen mask
  if (sceneX > 24320) {
    mask.show();
  } else {
    mask.hide();
  }

  // Deploy the lander's deployables
  if (sceneX > 24900 && !landerMastDeployed) {
    landerMastDeployed = true;
    cssPrefix(landerMast, 'transform', 'scale(1.0, 1.0)');
    setTimeout(function() {
      cssPrefix(emailForm, 'transform', 'scaleX(1.0)');
    }, 1000);
    setTimeout(function() {
      cssPrefix(landerFlag, 'transform', 'scaleX(1.0)');
    }, 2000);
  }

  // Move the rover
  var roverX = Math.min(5000, Math.max(-500 + sceneX * speedScene, 0));
  var roverY = -sceneY + Math.max(0, Math.min(950, (sceneX - 6800) / 2));
  var roverRotate = roverX / (Math.PI * 60) * 360;
  cssPrefix(
      rover, 'transform',
      'translate(' + roverX + 'px' +
          ', ' + roverY + 'px)');
  cssPrefix(roverWheels, 'transform', 'rotate(' + roverRotate + 'deg)');

  // Move the elevator
  var elevatorY =
      -sceneY + Math.max(0, Math.min(950, (sceneX - 6800) / 2)) + 20;
  cssPrefix(elevator, 'transform', 'translateY(' + elevatorY + 'px)');

  // Move the LCD's batttery
  var batteryLCDWSULeft = 2000 + Math.max(0, Math.min(3148, sceneX - 850));
  var batteryLCDWSUBottom = -Math.max(0, Math.min(88, sceneX - 850));
  var roverTractorAngle = Math.atan((147 + batteryLCDWSUBottom - 30) / 170);
  lcdBattery.css('left', batteryLCDWSULeft + 'px');
  cssPrefix(
      lcdBattery, 'transform', 'translateY(' + batteryLCDWSUBottom + 'px)');
  cssPrefix(
      roverTracorBeam, 'transform', 'rotate(' + roverTractorAngle + 'rad)');

  // Move the shuttle
  var shuttlePosition = Math.max(0, Math.min(sceneX - 17020, 6380));
  var shuttleY = Math.max(0, Math.min((sceneX - 18650) / 2, 350));
  shuttleY -= Math.max(0, Math.min((sceneX - 20000) / 2, 100));
  shuttleY += Math.max(0, Math.min((sceneX - 20900) / 2, 100));
  shuttleY -= Math.max(0, Math.min(sceneX - 23400, 800));
  shuttleY = Math.floor(shuttleY);
  shuttle.css('left', (1899 + shuttlePosition) + 'px');
  shuttle.css('bottom', (5010 + shuttleY) + 'px');
  shuttleForeground.css('left', (8660 + shuttlePosition) + 'px');
  shuttleForeground.css('bottom', (5010 + shuttleY) + 'px');
}

/**
 * Move Brad and the backgrounds
 * @param {number} sceneX
 * @param {number} sceneY
 */
function updateMovement(sceneX, sceneY) {
  var adjustedSceneX = sceneX;
  var screenWidth = window.innerWidth;

  // Center the scene
  adjustedSceneX -= (screenWidth / 2 - 900);

  // Ride elevator @ 5500 for 950
  adjustedSceneX -= Math.max(0, Math.min(950, sceneX - 5500));

  // Ride turbolift @ 8890 for 3410
  adjustedSceneX -= Math.max(
      0, Math.min(3410 + screenWidth / 4, sceneX - 8890 + screenWidth / 8));

  // Walk backwards though bridge @ 12300 for 2050
  adjustedSceneX -=
      Math.max(
          0,
          Math.min(2050 - screenWidth / 8, sceneX - 12300 - screenWidth / 8)) *
      2;

  // Ride turbolift @ 14350 for 650
  adjustedSceneX -= Math.max(0, Math.min(650, sceneX - 14350));

  // Land the shuttle on Mars
  adjustedSceneX -= Math.max(0, Math.min(sceneX - 23400, 800));

  // Walk backwards to radio system
  adjustedSceneX -= Math.max(0, Math.min(sceneX - 24200, 800)) * 2;

  // Move the scenes and foregrounds
  var positionScene = -adjustedSceneX * speedScene;
  positionScene = Math.floor(positionScene);
  cssPrefix(
      scenes, 'transform',
      'translate(' + Math.min(positionScene, 0) + 'px' +
          ', ' + sceneY + 'px)');
  cssPrefix(
      foregrounds, 'transform',
      'translate(' + Math.min(positionScene, 0) + 'px' +
          ', ' + sceneY + 'px)');

  // Move Brad
  var positionBrad = (-bradContainer.width() / 2) - Math.max(positionScene, 0);
  positionBrad +=
      Math.max(0, Math.min(sceneX - 8890 + screenWidth / 8, screenWidth / 8))
  positionBrad -= Math.max(0, Math.min(sceneX - 12300, screenWidth / 8));
  positionBrad = Math.floor(positionBrad);
  var positionBradY = Math.max(0, Math.min((sceneX - 18650) / 2, 350));
  positionBradY -= Math.max(0, Math.min((sceneX - 19600) / 2, 350));
  positionBradY -= Math.max(0, Math.min((sceneX - 20000) / 2, 100));
  positionBradY += Math.max(0, Math.min((sceneX - 20900) / 2, 100));
  positionBradY = -Math.floor(positionBradY);
  cssPrefix(
      bradContainer, 'transform',
      'translate(' + positionBrad + 'px, ' + positionBradY + 'px)');

  // Move backgrounds
  var positionBackground = -adjustedSceneX * speedBackground;
  var positionFarBackground = -adjustedSceneX * speedFarBackground;
  var positionSuperFarBackground = -adjustedSceneX * speedSuperFarBackground;
  positionBackground = Math.min(0, Math.floor(positionBackground));
  positionFarBackground = Math.min(0, Math.floor(positionFarBackground));
  positionSuperFarBackground =
      Math.min(0, Math.floor(positionSuperFarBackground));
  cssPrefix(
      backgrounds, 'transform',
      'translate(' + positionBackground + 'px, ' + sceneY + 'px)');
  cssPrefix(
      farBackgrounds, 'transform',
      'translate(' + positionFarBackground + 'px, ' +
          sceneY * speedFarBackground + 'px)');
  cssPrefix(
      superFarBackgrounds, 'transform',
      'translate(' + positionSuperFarBackground + 'px, ' +
          sceneY * speedSuperFarBackground + 'px)');

  // Animate sprite when walking
  if (adjustedSceneX < lastAdjustedSceneX || lastPositionBrad > positionBrad) {
    if (!moving && !disableWalking) {
      movingRight = false;
      moving = true;
      setTimeout(updateWalkingSprite, timingWalking);
      setTimeout(updateWalkingSprite, timingWalking * 2);
    }
  } else {
    if (!moving && !disableWalking) {
      movingRight = true;
      moving = true;
      setTimeout(updateWalkingSprite, timingWalking);
      setTimeout(updateWalkingSprite, timingWalking * 2);
    }
  }

  // Stop walking when it is time to stop
  clearTimeout(stopWalkingTimeout);
  stopWalkingTimeout = setTimeout(function() {
    moving = false;
  }, 250);
  lastAdjustedSceneX = adjustedSceneX;
  lastPositionBrad = positionBrad;
}