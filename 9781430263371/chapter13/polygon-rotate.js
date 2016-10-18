var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var v = 10;	// linear velocity in pixels per second	
var w = 1;	// angular velocity in radians per second	
var angDispl = 0; // initial angular displacement in radians
var dt = 30/1000; // time step in seconds = 1/FPS

// create a polygon
v1 = new Vector2D(-100,100);
v2 = new Vector2D(100,100);
v3 = new Vector2D(150,0);
v4 = new Vector2D(100,-100);
v5 = new Vector2D(-100,-100);
var vertices = new Array(v1,v2,v3,v4,v5);
var polygon = new Polygon(vertices);
polygon.x = 300;
polygon.y = 300;
polygon.draw(context);

setInterval(onTimer, 1/dt);

function onTimer(evt){
	polygon.x += v*dt;	
	angDispl = w*dt;
	polygon.rotation = angDispl;
	context.clearRect(0, 0, canvas.width, canvas.height);	
	polygon.draw(context);
}