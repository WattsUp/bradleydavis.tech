$(function() {
	setInterval(toggleSign, 1000);
	setInterval(blink, 4000);
	$(document).scroll(updateScene);
	updateScene();
	$("#teleporter-science").hide();
	blink();
});

function getSceneX() {
	return $(document).scrollTop();
}

var flashSign = true;
var scenes = $(".scene");
var backgrounds = $(".scene-background");
var bradSprite = $("#brad");
var bradContainer = $("#brad-container");
var speedScene = 1 / 1;
var speedBackground = 1 / 2;
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
var disableWalking = false;

function toggleSign() {
	flashSign = !flashSign;
	$("#instructions").css("background-color",
			flashSign ? "#282828" : "#33FF33");
	$("#instructions").css("color", flashSign ? "#33FF33" : "#282828");
}

function teleporterChange(locationHash) {
	if (!teleporting) {
		teleporting = true;
		bradContainer.css("left", "175px");
		bradContainer.css("bottom", "235px");
		bradContainer.css("transform", "translateX(-50%)");
		bradContainer.addClass("jump-up-small");
		bradContainer.removeClass("jump-down-small");
		$("#teleporter-science").show();
		console.log(locationHash);
		setTimeout(function() {
			$("#teleporter-science").hide();
			bradContainer.hide();
			teleporting = false;
		}, 1000);
		setTimeout(function() {
			location.hash = locationHash;
			bradContainer.show();
			teleporting = false;
			bradContainer.css("left", "50%");
			bradContainer.css("bottom", "200px");
			bradContainer.addClass("jump-down-small");
			bradContainer.removeClass("jump-up-small");
			updateScene();
		}, 1500);
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
	console.log(currentWalkingFrame);
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
}

function updateStory(sceneX) {
	if (sceneX > 480) {
		bradContainer.addClass("jump-up-small");
		bradContainer.removeClass("jump-down-small");
		bradContainer.css("bottom", "255px");
		disableWalking = true;
	} else {
		bradContainer.addClass("jump-down-small");
		bradContainer.removeClass("jump-up-small");
		bradContainer.css("bottom", "200px");
		disableWalking = false;
	}
	var roverPosition = Math.max(-500 + sceneX * speedScene, 0);
	var roverRotate = roverPosition / (Math.PI * 60) * 360;
	$("#rover").css("transform", "translateX(" + roverPosition + "px)");
	$(".rover-wheel").css("transform", "rotate(" + roverRotate + "deg)");
}

function updateMovement(sceneX) {
	var adjustedSceneX = sceneX - ($(document).width() / 2 - 900);
	var positionScene = -adjustedSceneX * speedScene;
	var positionBrad = -bradContainer.width() / 2 - Math.max(positionScene, 0);
	// Backgrounds are moved forward by scene, move them backwards
	var positionBackground = adjustedSceneX * (speedScene - speedBackground);
	scenes.css("transform", "translateX(" + Math.min(positionScene, 0) + "px)");
	backgrounds.css("transform", "translateX("
			+ Math.max(positionBackground, 0) + "px)");
	bradContainer.css("transform", "translateX(" + Math.min(positionBrad, 0)
			+ "px)");
	if (sceneX < lastSceneX) {
		movingRight = false;
		if (!moving && !disableWalking) {
			moving = true;
			setTimeout(updateWalkingSprite, timingWalking);
			setTimeout(updateWalkingSprite, timingWalking * 2);
		}
	} else {
		movingRight = true;
		if (!moving && !disableWalking) {
			moving = true;
			setTimeout(updateWalkingSprite, timingWalking);
			setTimeout(updateWalkingSprite, timingWalking * 2);
		}
	}
	clearTimeout(stopWalkingTimeoutID);
	stopWalkingTimeoutID = setTimeout(function() {
		moving = false;
	}, stopWalkingTimeout);
	lastSceneX = sceneX;
}