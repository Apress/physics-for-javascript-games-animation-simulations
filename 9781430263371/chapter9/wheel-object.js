var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

//Wheel(innerRadius,outerRadius,numSpokes)
var wheel = new Wheel(40,50,10);
wheel.x = 200;
wheel.y = 200;
wheel.draw(context);
