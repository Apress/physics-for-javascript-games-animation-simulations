var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var p1 = new Vector2D(100,200);
var p2 = new Vector2D(250,400);
//Wall(p1,p2)
var wall = new Wall(p1,p2);
wall.draw(context);

console.log(wall.dir.x,wall.dir.y);
console.log(wall.normal.x,wall.normal.y);