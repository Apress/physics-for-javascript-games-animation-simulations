var width = window.innerWidth, height = window.innerHeight;
var scene, camera, renderer;
var ball;
var t0, dt;
var g = -20;
var fac = 0.9;
var radius = 20;
var x0 = -100, y0 = -100, z0 = -100;

window.onload = init; 

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();

	var angle = 45, aspect = width/height, near = 0.1, far = 10000;
	camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
	camera.position.set(100,0,400);	
	scene.add(camera);
	
	var light = new THREE.DirectionalLight();
	light.position.set(-10,0,20);
	scene.add(light);

	var sphereGeometry = new THREE.SphereGeometry(radius,20,20);
	var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x006666});
	ball = new THREE.Mesh(sphereGeometry,sphereMaterial);
	scene.add(ball);
	ball.pos = new Vector3D(100,0,0);
	ball.velo = new Vector3D(-20,0,-20);		
	positionObject(ball);
	
	var plane1 = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshNormalMaterial());
	plane1.rotation.x = -Math.PI/2;
	plane1.position.set(0,y0,0);
    scene.add(plane1);

	var plane2 = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshNormalMaterial());
	plane2.position.set(0,0,z0);
    scene.add(plane2);	

	var plane3 = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshNormalMaterial());
	plane3.rotation.y = Math.PI/2;	
	plane3.position.set(x0,0,0);
    scene.add(plane3);	
	
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
	moveObject(ball);	
}
function positionObject(obj){
	obj.position.set(obj.pos.x,obj.pos.y,obj.pos.z);
}
function moveObject(obj){
	obj.velo.y += g*dt; 
	obj.pos = obj.pos.addScaled(obj.velo,dt);	
	if (obj.pos.x < x0 + radius){
		obj.pos.x = x0 + radius;
		obj.velo.x *= -fac;
	}	
	if (obj.pos.y < y0 + radius){
		obj.pos.y = y0 + radius;
		obj.velo.y *= -fac;
	}
	if (obj.pos.z < z0 + radius){
		obj.pos.z = z0 + radius;
		obj.velo.z *= -fac;
	}	
	positionObject(obj);
	renderer.render(scene, camera);	
}
