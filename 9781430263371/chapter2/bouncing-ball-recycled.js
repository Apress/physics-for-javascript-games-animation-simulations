var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var radius = 20;
var color = "#0000ff";
var g = 0.1; // acceleration due to gravity
var x, y;
var vx, vy;

window.onload = init; 
 
function init() {
  setInitialConditions();
  setInterval(onEachStep, 1000/60); // 60 fps
};

function setInitialConditions() {
  x = 50;  // initial horizontal position
  y = 50;  // initial vertical position
  vx = Math.random()*5;  // initial horizontal speed
  vy = (Math.random()-0.5)*4;  // initial vertical speed
}  
 
function onEachStep() {
  vy += g; // gravity increases the vertical speed
  x += vx; // horizontal speed increases horizontal position 
  y += vy; // vertical speed increases vertical position
 
  if (y > canvas.height - radius){ // if ball hits the ground
    y = canvas.height - radius; // reposition it at the ground
    vy *= -0.8; // then reverse and reduce its vertical speed
  }
  if (x > canvas.width + radius){ // if ball goes beyond canvas
   setInitialConditions(); // recycle ball
  }
  drawBall(); // draw the ball
};
 
function drawBall() {
    with (context){
        clearRect(0, 0, canvas.width, canvas.height); 
        fillStyle = color;
        beginPath();
        arc(x, y, radius, 0, 2*Math.PI, true);
        closePath();
        fill();
    };
};