$(function() {
	setInterval(toggleSign, 1000);
	$(document).scroll(updateScene);
	$("#teleporter-science").hide();
});

function getSceneX() {
	return $(document).scrollTop();
}

var flashSign = true;
var scenes = $(".scene");
var backgrounds = $(".scene-background");
var speedScene = 1/3;
var speedBackground = 1/6;
var teleporting = false;

function toggleSign() {
	flashSign = !flashSign;
	$("#instructions").css("background-color",
			flashSign ? "#282828" : "#33FF33");
	$("#instructions").css("color", flashSign ? "#33FF33" : "#282828");
}

function teleporterChange(location) {
	if(!traveling){
		traveling = true;
		$("#teleporter-science").show();
		console.log(location);
		setTimeout(function() {
			$("#teleporter-science").hide();
			traveling = false;
		}, 1000);
	}
}

function updateScene() {
	var positionScene = -getSceneX() * speedScene;
	 //Backgrounds are moved forward by scene, move them backwards
	var positionBackground = getSceneX() * (speedScene - speedBackground);
	scenes.css("transform", "translateX(" + positionScene + "px)");
	backgrounds.css("transform", "translateX(" + positionBackground + "px)");
	
}