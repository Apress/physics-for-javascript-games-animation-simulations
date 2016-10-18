var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var ball;
var t0; // time at last call
var dt; // elapsed time between calls
 
window.onload = init; 
 
function init() {
  ball = new Ball(20,"#0000ff");
  ball.x = 50; ball.y = 250;
  ball.vx = 200;
  ball.draw(context);
  t0 = new Date().getTime(); // initialize value of t0  
  animFrame();
};

function animFrame(){
  requestAnimationFrame(animFrame,canvas);
  onEachStep();
}
 
function onEachStep() {
  var t1 = new Date().getTime(); // current time in milliseconds since midnight on 1 Jan 1970	
  dt = 0.001*(t1-t0); // time elapsed in seconds since last call
  t0 = t1; // reset t0
  ball.x += ball.vx * dt; 
  context.clearRect(0, 0, canvas.width, canvas.height);  
  ball.draw(context); 
};
 