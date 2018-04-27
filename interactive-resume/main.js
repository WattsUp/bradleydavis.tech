$(function() {
	setInterval(blink, 4000);
	setInterval(cycleBoard, 5000);
	setInterval(cycleParticleDisplay, 5000);
	setInterval(flashWSULCD, 1000);
	setInterval(changeBacklightEngineRoom, 5000);
	setInterval(skillsDisplayCycle, 5000);
	setInterval(changeLeds, 500);
	$(document).scroll(updateScene);
	updateScene();
	$(".teleporter-science").hide();
	blink();
	cycleParticleDisplay();
	changeBacklightEngineRoom();
	skillsDisplayCycle();
	drawPieCharts();
	drawStarfield();
});

$(window).resize(updateScene);

function getSceneX() {
	return $(document).scrollTop();
}

var scenes = $(".scene");
var backgrounds = $(".scene-background");
var farBackgrounds = $(".scene-far-background");
var superFarBackgrounds = $(".scene-super-far-background");
var onTheGrounds = $(".on-the-ground");
var bradSprite = $("#brad");
var bradContainer = $("#brad-container");
var bradJumpContainer = $("#brad-jump-container");
var groundHeight = $(".ground").height();
var speedScene = 1 / 1;
var speedBackground = 1 / 2;
var speedFarBackground = 1 / 3;
var speedSuperFarBackground = 1 / 10;
var timingWalking = 200;
var timingBlink = 100;
var teleporting = false;
var moving = false;
var movingRight = true;
var currentWalkingFrame = 0;
var stopWalkingTimeout = 250;
var walkingIntervalID = null;
var stopWalkingTimeoutID = null;
var lastSceneX = getSceneX();
var lastPositionBrad = 0;
var disableWalking = false;
var engineRoomOff = true;
var skillsClicked = false;
var skillsCurrent = 0;
var particleDisplayCurrent = 0;
var backlightEngineRoom = "#FF1C1C";
var ledIndicators = $(".led-indicator");
var countdownTime = -5;
var countdownStarted = false;
var countdownTimer;
var starfieldFirstOnBottom = true;

function cycleBoard() {
	$(".title-sign-wrapper").toggleClass("title-sign-wrapper-transformed");
}

function cycleParticleDisplay() {
	particleDisplayCurrent = (particleDisplayCurrent + 1) % 3;
	$(".particle-viewer-particles").css("height", "0%");
	$(".particle-viewer-lightning").show();
	setTimeout(function() {
		$(".particle-viewer-image").hide();
		$(".particle-viewer-image:eq(" + particleDisplayCurrent + ")").show();
		$(".particle-viewer-particles").css("height", "100%");
	}, 1000)
	setTimeout(function() {
		$(".particle-viewer-lightning").hide();
	}, 2000);
}

function flashWSULCD() {
	$(".lcd-wsu-on").css("opacity", "0.0");
	setTimeout(function() {
		$(".lcd-wsu-on").css("opacity", "1.0");
	}, 250);
}

function changeBacklightEngineRoom() {
	$("#engine-room").css("background-color", backlightEngineRoom);
	setTimeout(function() {
		$("#engine-room").css("background-color", "#737373");
	}, 2000);
}

function changeLeds() {
	ledIndicators.each(function(index) {
		switch (Math.floor(Math.random() * 15)) {
		case 0:
			$(this).css("background-color", "#FF595E");
			break;
		case 1:
		case 2:
			$(this).css("background-color", "#F2C200");
			break;
		default:
			$(this).css("background-color", "#33FF33");
			break;
		}
	});
}

function updateCountdown() {
	if (countdownTime <= -10) {
		$(".background-rocket-bridge-window>h1").text("T" + countdownTime);
	} else if (countdownTime <= -1) {
		$(".background-rocket-bridge-window>h1").text("T-0" + (-countdownTime));
	} else if (countdownTime <= 9) {
		$(".background-rocket-bridge-window>h1").text("T+0" + countdownTime);
	} else {
		$(".background-rocket-bridge-window>h1").text("T+" + countdownTime);
	}
	if (countdownTime == 0) {
		setTimeout(launchRocket, 1);
	}
	countdownTime++;
}

function launchRocket() {
	$(".sky").css("transform", "translate(0px, 8000px");
	$(".container").addClass("shook");
	setTimeout(function() {
		$(".container").removeClass("shook");
	}, 4000);
}

function teleporterChange(locationHash) {
	if (!teleporting) {
		teleporting = true;
		bradContainer.css("left", "175px");
		bradContainer.css("transform", "translateX(-50%)");
		bradContainer.addClass("ease-left");
		bradJumpContainer.addClass("jump-up-small");
		bradJumpContainer.removeClass("jump-down-small");
		scenes.addClass("ease-transform");
		backgrounds.addClass("ease-transform");
		farBackgrounds.addClass("ease-transform");
		scenes.css("transform", "translateX(0px)");
		backgrounds.css("transform", "translateX(0px)");
		farBackgrounds.css("transform", "translateX(0px)");
		console.log(locationHash);
		movingRight = false;
		updateWalkingSprite();
		setTimeout(updateWalkingSprite, timingWalking);
		setTimeout(updateWalkingSprite, timingWalking * 2);
		setTimeout(updateWalkingSprite, timingWalking * 3);
		setTimeout(function() {
			scenes.removeClass("ease-transform");
			backgrounds.removeClass("ease-transform");
			farBackgrounds.removeClass("ease-transform");
			bradJumpContainer.css("bottom", "30px");
		}, 1000);
		setTimeout(function() {
			$(".teleporter-science").show();
		}, 1400);
		setTimeout(function() {
			$(".teleporter-science").hide();
			bradContainer.hide();
			teleporting = false;
			location.hash = locationHash;
		}, 2000);
		setTimeout(function() {
			bradContainer.show();
			teleporting = false;
			bradContainer.css("left", "50%");
			bradContainer.removeClass("ease-left");
			bradJumpContainer.css("bottom", "0px");
			bradJumpContainer.removeClass("jump-up-small");
			updateScene();
		}, 2500);
	}
}

function drawPieCharts() {
	var radius = 120;
	var context0 = $(".experience-pie")[0].getContext("2d");
	$(".experience-pie")[0].width = radius * 2;
	$(".experience-pie")[0].height = radius * 2;
	context0.strokeStyle = "#282828";
	context0.lineWidth = 2;
	context0.beginPath();
	context0.moveTo(radius, radius);
	context0.lineTo(radius * 2, radius);
	context0.moveTo(radius, radius);
	context0.lineTo(radius + radius * Math.cos(2 * Math.PI / 100 * 10), radius
			- radius * Math.sin(2 * Math.PI / 100 * 10));
	context0.moveTo(radius, radius);
	context0.lineTo(radius + radius * Math.cos(2 * Math.PI / 100 * 25), radius
			- radius * Math.sin(2 * Math.PI / 100 * 25));
	context0.moveTo(radius, radius);
	context0.lineTo(radius + radius * Math.cos(2 * Math.PI / 100 * 55), radius
			- radius * Math.sin(2 * Math.PI / 100 * 55));
	context0.moveTo(radius, radius);
	context0.lineTo(radius + radius * Math.cos(2 * Math.PI / 100 * 90), radius
			- radius * Math.sin(2 * Math.PI / 100 * 90));
	context0.stroke();
}

function drawStarfield() {
	var contextSpace = $(".space-canvas")[0].getContext("2d");
	contextSpace.fillStyle = "#FFFFFF";
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
	contextSpace = $(".space-canvas")[1].getContext("2d");
	contextSpace.fillStyle = "#FFFFFF";
	for (var i = 0; i < 10000; i++) {
		x = Math.floor(Math.random() * 8000);
		y = Math.floor(Math.random() * 8000);
		radius = Math.floor(Math.random() * 3);
		contextSpace.beginPath();
		contextSpace.arc(x, y, radius, 0, Math.PI * 2, true);
		contextSpace.fill();
	}
}

function skillsDisplay(currentDisplay) {
	skillsClicked = true;
	skillsCurrent = currentDisplay;
	$(".skills-wrapper").hide();
	$(".skills-wrapper:eq(" + skillsCurrent + ")").show();
	setTimeout(function() {
		skillsClicked = false;
	}, 10000);
}

function skillsDisplayCycle() {
	if (!skillsClicked) {
		skillsCurrent = (skillsCurrent + 1) % 4;
		$(".skills-wrapper").hide();
		$(".skills-wrapper:eq(" + skillsCurrent + ")").show();
	}
}

function blink() {
	if (movingRight) {
		$("#brad-eyes-right").show();
		$("#brad-eyes-left").hide();
	} else {
		$("#brad-eyes-right").hide();
		$("#brad-eyes-left").show();
	}
	setTimeout(function() {
		$("#brad-eyes-right").hide();
		$("#brad-eyes-left").hide();
	}, timingBlink);
}

function updateWalkingSprite() {
	bradSprite.css("bottom", (movingRight * -200) + "px");
	currentWalkingFrame = (currentWalkingFrame + 1) % 4;
	switch (currentWalkingFrame) {
	case 0:
	case 2:
		bradSprite.css("left", "0px");
		moving = false;
		break;
	case 1:
		bradSprite.css("left", "-200px");
		break;
	case 3:
		bradSprite.css("left", "-400px");
		break;
	}
}

function updateScene() {
	var sceneX = getSceneX();
	console.log("sceneX: " + sceneX);
	updateMovement(sceneX);
	updateStory(sceneX);
	updateHidden(sceneX);
	groundHeight = $(".ground").height();
	onTheGrounds.css("bottom", groundHeight + "px");
}

function updateHidden(sceneX) {
	if (sceneX < 6500) {
		$(".discipline-label").show();
		$(".particle-viewer").show();
	} else {
		$(".discipline-label").hide();
		$(".particle-viewer").hide();
	}
	if (sceneX > 3700) {
		$(".rocket").show();
	} else {
		$(".rocket").hide();
	}

}

function updateStory(sceneX) {
	if ((sceneX > 480 && sceneX < 6500) || (sceneX > 8890 && sceneX < 12300)
			|| (sceneX > 14350 && sceneX < 15000)) {
		disableWalking = true;
	} else {
		disableWalking = false;
	}
	if (sceneX > 480 && sceneX < 6500) {
		bradJumpContainer.addClass("jump-up-small");
		bradJumpContainer.removeClass("jump-down-small");
		bradJumpContainer.css("bottom", "55px");
	} else {
		bradJumpContainer.addClass("jump-down-small");
		bradJumpContainer.removeClass("jump-up-small");
		bradJumpContainer.css("bottom", "0px");
	}
	if (sceneX > 850 && sceneX < 3998) {
		$(".rover-tractor-beam").css("display", "block");
	} else {
		$(".rover-tractor-beam").css("display", "none");
	}
	if (sceneX > 1150) {
		$("#fluid-electronics").removeClass("discipline-tank-fluid-hidden");
		setTimeout(function() {
			$("#fluid-software").removeClass("discipline-tank-fluid-hidden");
		}, 250);
		setTimeout(function() {
			$("#fluid-hardware").removeClass("discipline-tank-fluid-hidden");
		}, 500);
		setTimeout(function() {
			$("#fluid-art").removeClass("discipline-tank-fluid-hidden");
		}, 750);
	} else if (sceneX < 1100) {
		$("#fluid-electronics").addClass("discipline-tank-fluid-hidden");
		setTimeout(function() {
			$("#fluid-software").addClass("discipline-tank-fluid-hidden");
		}, 250);
		setTimeout(function() {
			$("#fluid-hardware").addClass("discipline-tank-fluid-hidden");
		}, 500);
		setTimeout(function() {
			$("#fluid-art").addClass("discipline-tank-fluid-hidden");
		}, 750);
	}
	if (sceneX > 3998) {
		$(".lcd-wsu-on").show();
	} else {
		$(".lcd-wsu-on").hide();
	}
	if (sceneX > 5500) {
		$(".thruster-small-on").css("display", "block");
	} else {
		$(".thruster-small-on").css("display", "none");
	}
	if (sceneX > 7000) {
		$(".rocket-hatch").addClass("rocket-hatch-close");
		$(".rocket-hatch").removeClass("rocket-hatch-open");
	} else {
		$(".rocket-hatch").removeClass("rocket-hatch-close");
		$(".rocket-hatch").addClass("rocket-hatch-open");
	}
	if ((sceneX > 8890 && sceneX < 12300) || sceneX > 14350) {
		$(".tube-station-background").hide();
		$(".tube-station-foreground").show();
	} else {
		$(".tube-station-background").show();
		$(".tube-station-foreground").hide();
	}
	if (sceneX > 12300 && countdownStarted == false) {
		countdownTimer = setInterval(updateCountdown, 1000);
		countdownStarted = true;
	} else if (sceneX <= 12300 && countdownStarted == true) {
		clearInterval(countdownTimer);
		countdownStarted = false;
		countdownTime = -6;
		updateCountdown();
		$(".sky").css("transform", "translate(0px, 0px");
		$(".space").css("transform", "translate(0px, 0px");
	}
	var engineWireLength = Math.max(20, Math.min(1380, sceneX - 6900
			- (movingRight ? 0 : 70)));
	if (engineWireLength == 1380) {
		backlightEngineRoom = "#33FF33";
		changeBacklightEngineRoom();
		$("#rocket-power-status").css("color", "#33FF33");
	} else {
		backlightEngineRoom = "#FF1C1C";
		changeBacklightEngineRoom();
		$("#rocket-power-status").css("color", "#FF1C1C");
	}
	var sceneY = Math.max(0, Math.min(950, sceneX - 5500));
	var roverPosition = Math.min(5000, Math.max(-500 + sceneX * speedScene, 0));
	var roverY = -sceneY + Math.max(0, Math.min(950, (sceneX - 6800) / 2));
	var elevatorCargoY = -sceneY
			+ Math.max(0, Math.min(950, (sceneX - 6800) / 2)) + 20;
	var roverRotate = roverPosition / (Math.PI * 60) * 360;
	var batteryLCDWSULeft = 2000 + Math.max(0, Math.min(3148, sceneX - 850));
	var batteryLCDWSUBottom = -Math.max(0, Math.min(88, sceneX - 850));
	var roverTractorAngle = Math.atan((147 + batteryLCDWSUBottom - 30) / 170);
	$("#rover").css("transform",
			"translate(" + roverPosition + "px" + ", " + roverY + "px)");
	$(".rover-wheel").css("transform", "rotate(" + roverRotate + "deg)");
	$(".rover-tractor-beam").css("transform",
			"rotate(" + roverTractorAngle + "rad)");
	$("#battery-lcd-wsu").css("left", batteryLCDWSULeft + "px");
	$("#battery-lcd-wsu").css("transform",
			"translateY(" + batteryLCDWSUBottom + "px)");
	$("#elevator-cargo").css("transform",
			"translateY(" + elevatorCargoY + "px)");
	$(".engine-room-wire").css("width", engineWireLength + "px");
}

function updateMovement(sceneX) {
	var sceneY = Math.max(0, Math.min(950, sceneX - 5500))
			+ Math.max(0, Math.min(3410, sceneX - 8890))
			+ Math.max(0, Math.min(650, sceneX - 14350));
	// Ride elevator @ 5500 for 950
	// Ride turbolift @ 8880 for 4000
	// Walk backwards though bridge @ 12300 for 2000
	var adjustedSceneX = sceneX
			- Math.max(0, Math.min(950, sceneX - 5500))
			- Math.max(0, Math.min(3410 + $(document).width() / 4, sceneX
					- 8890 + $(document).width() / 8))
			- ($(document).width() / 2 - 900)
			- Math.max(0, Math.min(2050 - $(document).width() / 8, sceneX
					- 12300 - $(document).width() / 8)) * 2
			- Math.max(0, Math.min(650, sceneX - 14350));
	var positionScene = -adjustedSceneX * speedScene;
	var positionBrad = (-bradContainer.width() / 2)
			- Math.max(positionScene, 0)
			+ Math.max(0, Math.min(sceneX - 8890 + $(document).width() / 8, $(
					document).width() / 8))
			- Math.max(0, Math.min(sceneX - 12300, $(document).width() / 8));
	var positionBackground = -adjustedSceneX * speedBackground;
	var positionFarBackground = -adjustedSceneX * speedFarBackground;
	var positionSuperFarBackground = -adjustedSceneX * speedSuperFarBackground;
	scenes.css("transform", "translate(" + Math.min(positionScene, 0) + "px"
			+ ", " + sceneY + "px)");
	backgrounds.css("transform", "translate(" + Math.min(positionBackground, 0)
			+ "px, " + sceneY + "px)");
	farBackgrounds.css("transform", "translate("
			+ Math.min(positionFarBackground, 0) + "px, " + sceneY
			* speedFarBackground + "px)");
	superFarBackgrounds.css("transform", "translate("
			+ Math.min(positionSuperFarBackground, 0) + "px, " + sceneY
			* speedSuperFarBackground + "px)");
	bradContainer.css("transform", "translateX(" + positionBrad + "px)");
	if (adjustedSceneX < lastSceneX || lastPositionBrad > positionBrad) {
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
	clearTimeout(stopWalkingTimeoutID);
	stopWalkingTimeoutID = setTimeout(function() {
		moving = false;
	}, stopWalkingTimeout);
	lastSceneX = adjustedSceneX;
	lastPositionBrad = positionBrad;
}