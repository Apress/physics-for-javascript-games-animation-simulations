var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

gradient = context.createLinearGradient(0,0,0,500);
gradient.addColorStop(0,'ffffff');
gradient.addColorStop(1,'0000ff');
context.fillStyle = gradient;
context.fillRect(0,0,700,500);

gradient1 = context.createRadialGradient(350,250,5,350,250,50);
gradient1.addColorStop(0,'ffffff');
gradient1.addColorStop(1,'ff0000');
context.fillStyle = gradient1;
context.arc(350,250,50,0,2*Math.PI,true);
context.fill();

//context.clearRect(100,100,50,100);
//context.clearRect(0,0,canvas.width,canvas.height);