var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var r = 50;  // outer radius
var w = 1;	// angular velocity in radians per second	
var dt = 30/1000; // timestep = 1/FPS
var fac = 1;	// slipping/sliding factor	

var wheel = new Wheel(r-10,r,12);
wheel.x = 100;
wheel.y = 200;
wheel.draw(context);

var v = fac*r*w;	// v = r w		
var angle = 0;
setInterval(onTimer, 1/dt);

function onTimer(evt){
	wheel.x += v*dt;	
	angle += w*dt;	
	context.clearRect(0, 0, canvas.width, canvas.height);	
	context.save();
	context.translate(wheel.x,wheel.y);
	context.rotate(angle);
	context.translate(-wheel.x,-wheel.y);
	wheel.draw(context);
	context.restore();
}