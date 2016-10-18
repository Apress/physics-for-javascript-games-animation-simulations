var width = window.innerWidth, height = window.innerHeight;
var t0, dt;
var cube;
var scene, camera, renderer;
var acc, force;
var alp, torque;
var t0, dt;
var animId;
var k = 0.5; // angular damping factor	
var kSpring = 0.2;
var tq = new Vector3D(1,0,0);
var center = new Vector3D(0,0,-500);

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
	cube.mass = 1;
	cube.im = new Vector3D(1,1,1);
	cube.pos = new Vector3D(0,0,0);	
	cube.velo = new Vector3D(0,0,0);
	cube.eulerAngles = new Vector3D(0,0,0);
	cube.angVelo = new Vector3D(0,0,0);

	t0 = new Date().getTime(); 
	animFrame();
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
	positionObject(cube);		
	moveObject(cube);
	calcForce(cube);
	updateAccel(cube);
	updateVelo(cube);	
}
function positionObject(obj){
	obj.position.set(obj.pos.x,obj.pos.y,obj.pos.z);
	obj.rotation.set(obj.eulerAngles.x,obj.eulerAngles.y,obj.eulerAngles.z);	
}
function moveObject(obj){		
	obj.pos = obj.pos.addScaled(obj.velo,dt);	
	obj.eulerAngles = obj.eulerAngles.addScaled(obj.angVelo,dt);	
	positionObject(obj);
  	renderer.render(scene, camera);
}
function calcForce(obj){
	var r = obj.pos.subtract(center);
	force = Forces3D.spring(kSpring,r);
	torque = tq;
	torque = torque.addScaled(obj.angVelo,-k);	
}	
function updateAccel(obj){
	acc = force.multiply(1/obj.mass);
	alp = torque.div(obj.im);
}	
function updateVelo(obj){	
	obj.velo = obj.velo.addScaled(acc,dt);
	obj.angVelo = obj.angVelo.addScaled(alp,dt);	
}