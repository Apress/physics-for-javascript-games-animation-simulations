var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

//Triangle(x,y,width,height,color,alpha,empty)
var triangle1 = new Triangle(100,200,100,150,'#00ff00',0.5,false);
triangle1.draw(context);

var triangle2 = new Triangle(300,200,50,40,'#000000',1.0,false);
triangle2.draw(context);