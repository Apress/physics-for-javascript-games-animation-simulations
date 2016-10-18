var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var ball = new Ball(50,'#0000ff');
ball.x = 100;
ball.y = 100;
ball.draw(context);
