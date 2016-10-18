var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

context.strokeStyle = '#0000ff';
context.lineWidth = 2;
context.beginPath() ;
context.moveTo(50, 50);
context.lineTo(150, 50);
context.lineTo(150, 200);
context.lineTo(50, 200);
context.lineTo(50, 50);
context.stroke();
context.fillStyle = '#00ff00';
context.fill();

context.fillRect(250,50,150,100);