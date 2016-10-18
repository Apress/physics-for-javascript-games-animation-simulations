var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var g = 0.1;
var radius = 20;
var color = "#0000ff";
var ball;
 
window.onload = init; 
 
function init() {
  ball = new Ball(radius,color);
  ball.x = 50;
  ball.y = 50;
  ball.vx = 2;
  ball.vy = 0;
  ball.draw(context);
  setInterval(onEachStep, 1000/60); // 60 fps
};
 
function onEachStep() {
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
  context.clearRect(0, 0, canvas.width, canvas.height);  
  ball.draw(context); 
};
 