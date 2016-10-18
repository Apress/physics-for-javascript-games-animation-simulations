var width = window.innerWidth, height = window.innerHeight;
var t0, dt;
var cube;
var scene, camera, renderer;
var alp, torque;
var t0, dt;
var animId;
var k = 0.5; // angular damping factor	
var tqMax = new Vector3D(1,1,1);
var tq = new Vector3D(0,0,0);

window.onload = init; 

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    var angle = 45, aspect = width/height, near = 0.1, far = 10000;
    camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
    camera.position.set(100,0,500);
    scene.add(camera);

    var light = new THREE.DirectionalLight();
    light.position.set(30,0,30);
    scene.add(light);

    cube = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), new THREE.MeshNormalMaterial());
    cube.overdraw = true;
    scene.add(cube);
	cube.im = new Vector3D(1,1,1);
	cube.angVelo = new Vector3D(0,0,0); 

	addEventListener('mousedown',onDown,false);	
	t0 = new Date().getTime(); 
	animFrame();
}
function onDown(evt){
	tq = tqMax;
	addEventListener('mouseup',onUp,false);						
}
function onUp(evt){
	tq = new Vector3D(0,0,0);
	removeEventListener('mouseup',onUp,false);
}		
function animFrame(){
	animId = requestAnimationFrame(animFrame);
	onTimer(); 
}
function onTimer(){
	var t1 = new Date().getTime(); 
	dt = 0.001*(t1-t0); 
	t0 = t1;
	if (dt>0.2) {dt=0;};	
	move();
}
function move(){			
	moveObject(cube);
	calcForce(cube);
	updateAccel(cube);
	updateVelo(cube);	
}
function moveObject(obj){
	var p = new THREE.Quaternion;
	p.set(obj.angVelo.x*dt/2,obj.angVelo.y*dt/2,obj.angVelo.z*dt/2,1);
	obj.quaternion.multiply(p);	
	obj.quaternion.normalize();
  	renderer.render(scene,camera);
}
function calcForce(obj){
	torque = tq;
	torque = torque.addScaled(obj.angVelo,-k);	
}	
function updateAccel(obj){
	alp = torque.div(obj.im);
}	
function updateVelo(obj){	
	obj.angVelo = obj.angVelo.addScaled(alp,dt);	
}