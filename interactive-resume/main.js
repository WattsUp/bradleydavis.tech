$(function() {
	setInterval(blink, 4000);
	$(document).scroll(updateScene);
	updateScene();
	$("#teleporter-science").hide();
	blink();
});

$(window).resize(updateScene);

function getSceneX() {
	return $(document).scrollTop();
}

var scenes = $(".scene");
var backgrounds = $(".scene-background");
var farBackgrounds = $(".scene-far-background");
var onTheGrounds = $(".on-the-ground");
var bradSprite = $("#brad");
var bradContainer = $("#brad-container");
var bradJumpContainer = $("#brad-jump-container");
var groundHeight = $(".ground").height();
var speedScene = 1 / 1;
var speedBackground = 1 / 2;
var speedFarBackground = 1 / 3;
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
			$("#teleporter-science").show();
		}, 1400);
		setTimeout(function() {
			$("#teleporter-science").hide();
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
	groundHeight = $(".ground").height();
	onTheGrounds.css("bottom", groundHeight + "px");
}

function updateStory(sceneX) {
	if (sceneX > 480) {
		bradJumpContainer.addClass("jump-up-small");
		bradJumpContainer.removeClass("jump-down-small");
		bradJumpContainer.css("bottom", "55px");
		disableWalking = true;
	} else {
		bradJumpContainer.addClass("jump-down-small");
		bradJumpContainer.removeClass("jump-up-small");
		bradJumpContainer.css("bottom", "0px");
		disableWalking = false;
	}
	if (sceneX > 1150) {
		$("#fluid-electronics").removeClass("discipline-tank-fluid-hidden");
		setTimeout(function(){
			$("#fluid-software").removeClass("discipline-tank-fluid-hidden");
		}, 250);
		setTimeout(function(){
			$("#fluid-hardware").removeClass("discipline-tank-fluid-hidden");
		}, 500);
		setTimeout(function(){
			$("#fluid-art").removeClass("discipline-tank-fluid-hidden");
		}, 750);
	} else if (sceneX < 1100){
		$("#fluid-electronics").addClass("discipline-tank-fluid-hidden");
		setTimeout(function(){
			$("#fluid-software").addClass("discipline-tank-fluid-hidden");
		}, 250);
		setTimeout(function(){
			$("#fluid-hardware").addClass("discipline-tank-fluid-hidden");
		}, 500);
		setTimeout(function(){
			$("#fluid-art").addClass("discipline-tank-fluid-hidden");
		}, 750);
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
	var positionFarBackground = adjustedSceneX
			* (speedScene - speedFarBackground);
	scenes.css("transform", "translateX(" + Math.min(positionScene, 0) + "px)");
	backgrounds.css("transform", "translateX("
			+ Math.max(positionBackground, 0) + "px)");
	farBackgrounds.css("transform", "translateX("
			+ Math.max(positionFarBackground, 0) + "px)");
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