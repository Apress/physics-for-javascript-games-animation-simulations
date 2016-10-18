var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var r = 50;  // ball radius
var w = 0.2;	// angular velocity in radians per second	
var dt = 30/1000; // timestep = 1/FPS
var fac = 1;	// slipping/sliding factor	

var ball = new Ball(r,'#0000ff',1,0,true,true);
ball.x = 100;
ball.y = 200;
ball.rotation = 0.6;
ball.draw(context);

var v = fac*r*w;	// v = r w		
var angDispl = 0;
setInterval(onTimer, 1/dt);

function onTimer(evt){
	ball.x += v*dt;	
	angDispl = w*dt;	
	ball.rotation = angDispl;	
	context.clearRect(0, 0, canvas.width, canvas.height);	
	ball.draw(context);
}