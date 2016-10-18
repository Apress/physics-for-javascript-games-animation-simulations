var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

//Satellite(radius,color,mass)
var satellite = new Satellite(10,'#0000ff',1);
satellite.x = 200;
satellite.y = 200;
satellite.draw(context);
