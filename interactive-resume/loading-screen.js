$(window).bind("load", function() {
	$("#loading-screen").css("transform", "translateY(-100%)");
	setTimeout(function() {
		clearInterval(interval);
		$("#loading-screen").hide();
	}, 1000);
	setTimeout(function() {
//	    $(document).scrollTop(0);
	}, 10);
});

var context;
var nodesX = 3.2;
var nodesY = 5.1;
var height = 780;
var width = 780;
var startPoint = {
	x : width / 2,
	y : height / 2
};
var index = 0;
var cycleCount = 200;
var step = 2 * Math.PI / cycleCount;
var x = 0;
var y = 0;
var startCount = 20;
var count = startCount;
var interval;

$(function setupLissajous() {
	$("#loading-canvas").attr("width", height + "px");
	$("#loading-canvas").attr("height", width + "px");
	var canvas = document.getElementById("loading-canvas");
	context = canvas.getContext("2d");
	context.strokeStyle = "rgb(51, 255, 51)";
	context.fillStyle = "rgba(0, 0, 0, 0.07)";
	interval = setInterval(updateLissajous, 10);
});

function updateLissajous() {
	context.beginPath();
	context.moveTo(startPoint.x + x, startPoint.y - y);
	index += step;
	x = height * Math.sin(nodesX * index) / 2;
	y = width * Math.sin(nodesY * index) / 2;
	context.lineTo(startPoint.x + x, startPoint.y - y);
	count--;
	if (count <= 0) {
		count = startCount;
		context.fillRect(0, 0, width, height);
	}
	context.stroke();
}