var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

//Rocket(width,height,color,mass)
var rocket = new Rocket(50,100,'#666666',1);
rocket.x = 100;
rocket.y = 200;
rocket.draw(context,true);
//rocket.draw(context,false);
