var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

context.strokeStyle = '#0000ff';
context.lineWidth = 2;
context.beginPath() ;
context.moveTo(50, 100);
context.lineTo(250, 400);
context.stroke();
