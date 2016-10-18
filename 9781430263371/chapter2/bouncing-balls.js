var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var g = 0.1;
var radius = 20;
var color = "#0000ff";
var balls;
var numBalls = 5;
 
window.onload = init; 
 
function init() {
	balls = new Array();
	for (var i=0; i<numBalls; i++){
		var ball = new Ball(radius,color);	
		ball.x = 50;
		ball.y = 75;
		ball.vx = Math.random()*5;
		ball.vy = (Math.random()-0.5)*4;
		ball.draw(context);
		balls.push(ball);
	}  
	setInterval(onEachStep, 1000/60); // 60 fps
};
 
function onEachStep() {
	context.clearRect(0, 0, canvas.width, canvas.height); 
	for (var i=0; i<numBalls; i++){
		var ball = balls[i];
		ball.vy += g;     
			
		ball.x += ball.vx; 
		ball.y += ball.vy; 
			
		if (ball.y > canvas.height - radius){ 
			ball.y = canvas.height - radius; 
			ball.vy *= -0.8; 
		}
		if (ball.x > canvas.width + radius){ 
			ball.x = -radius; 
		}
		ball.draw(context); 
	} 
};
 