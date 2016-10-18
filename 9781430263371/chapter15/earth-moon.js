var width = window.innerWidth, height = window.innerHeight;
var acc, force;
var t0, dt;
var animId;
var G = 1;
var M = 50000;
var m = 1;
var scene, camera, renderer;
var earth, moon;

window.onload = init; 

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();

	var angle = 45, aspect = width/height, near = 0.1, far = 10000;
	camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
	camera.position.set(0,100,1000);	
	scene.add(camera);
	
	var light = new THREE.DirectionalLight();
	light.position.set(-10,0,20);
	scene.add(light);

	var radius = 100, segments = 20, rings = 20;
	var sphereGeometry = new THREE.SphereGeometry(radius,segments,rings);
	var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x0099ff});
	//sphereMaterial.map = THREE.ImageUtils.loadTexture('images/Earth.jpg');
	earth = new THREE.Mesh(sphereGeometry,sphereMaterial);
	scene.add(earth);
	earth.mass = M;
	earth.pos = new Vector3D(0,0,0);
	earth.velo = new Vector3D(0,0,0);		
	positionObject(earth);
	
//	camera.position = earth.position;

	moon = new THREE.Mesh(new THREE.SphereGeometry(radius/4,segments,rings),new THREE.MeshLambertMaterial());
	scene.add(moon);
	moon.mass = m;
	moon.pos = new Vector3D(300,0,0);	
	moon.velo = new Vector3D(0,0,-12);	
	positionObject(moon);
		
	t0 = new Date().getTime(); 
	animFrame();
}

function animFrame(){
	requestAnimationFrame(animFrame);
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
	positionObject(moon);		
	moveObject(moon);
	calcForce(moon);
	updateAccel(moon);
	updateVelo(moon);	
}
function positionObject(obj){
	obj.position.set(obj.pos.x,obj.pos.y,obj.pos.z);
}
function moveObject(obj){	
	obj.pos = obj.pos.addScaled(obj.velo,dt);		
	positionObject(obj);
	earth.rotation.y += 0.001;
	renderer.render(scene, camera);	
	//camera.position = moon.position;	
}
function calcForce(obj){
	var r = obj.pos.subtract(earth.pos);
	force = Forces3D.gravity(G,M,m,r);
}	
function updateAccel(obj){
	acc = force.multiply(1/obj.mass);
}	
function updateVelo(obj){	
	obj.velo = obj.velo.addScaled(acc,dt);
}