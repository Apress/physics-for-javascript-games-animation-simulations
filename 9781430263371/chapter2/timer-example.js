var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var ball;
 
window.onload = init; 
 
function init() {
  ball = new Ball(20,"#0000ff");
  ball.x = 50; ball.y = 250;
  ball.vx = 2;
  ball.draw(context);
  setInterval(onEachStep, 1000/60); // 60 fps
};
 
function onEachStep() {
  ball.x += ball.vx; 
  context.clearRect(0, 0, canvas.width, canvas.height);  
  ball.draw(context); 
};
 