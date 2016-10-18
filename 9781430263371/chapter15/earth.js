var width = window.innerWidth, height = window.innerHeight;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var angle = 45, aspect = width/height, near = 0.1, far = 10000;
var camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
camera.position.set(100,0,500);
scene.add(camera);

var light = new THREE.DirectionalLight();
light.position.set(-10,0,20);
scene.add(light);

var radius = 100, segments = 20, rings = 20;
var sphereGeometry = new THREE.SphereGeometry(radius,segments,rings);
var sphereMaterial = new THREE.MeshLambertMaterial();
sphereMaterial.map = THREE.ImageUtils.loadTexture('images/earth.jpg');
var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
scene.add(sphere);

function animFrame(){
	requestAnimationFrame(animFrame);
	onEachStep();
}
function onEachStep() {
	sphere.rotation.y += 0.01;
	camera.position.z -= 0.1;
	renderer.render(scene, camera);
}
animFrame();
