var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

//Plane(width,height,color,mass)
var plane = new Plane(100,20,'#333399',1);
plane.x = 40;
plane.y = 160;
plane.draw(context,true);
//plane.draw(context,false);
