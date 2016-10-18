var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var g = 0.1;
var radius = 20;
var color = "#0000ff";
var ball;
var isDragging = false;
 
window.onload = init; 
 
function init() {
  ball = new Ball(radius,color);
  ball.x = 50;
  ball.y = canvas.height - radius;
  ball.vx = 0;
  ball.vy = 0;
  ball.draw(context);
  
  canvas.addEventListener('mousedown', function () {
	canvas.addEventListener('mousemove',onDrag,false);
	canvas.addEventListener('mouseup',onDrop,false);
  }, false);
  setInterval(onEachStep, 1000/60); 
};
 
function onDrag(evt){
	isDragging = true;
	ball.x = evt.clientX;
	ball.y = evt.clientY;	
}

function onDrop(){
	isDragging = false;
	canvas.removeEventListener('mousemove',onDrag,false);
	canvas.removeEventListener('mouseup',onDrop,false);	
}

function onEachStep() {
	if (isDragging==false){
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
	}
	context.clearRect(0, 0, canvas.width, canvas.height);  
	ball.draw(context); 
};
 