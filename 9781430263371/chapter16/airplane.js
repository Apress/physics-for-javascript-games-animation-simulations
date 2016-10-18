var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var width = window.innerWidth, height = window.innerHeight;
var airplane;
var scene, camera, renderer;
var acc, force;
var alp, torque;
var t0, dt;
var animId;	
		
// airplane and its properties; values in SI units unless otherwise stated
var airplane;
var massAirplane = 30000;
var areaWing = 150;
var areaElevator = 10;
var areaRudder = 6;
var areaAileron = 10;	// area of each aileron 		
var distAlToCM = 9; 	// distance from each aileron to CM
var distTlToCM = 35;	// distance from tail to CM 

// moment of inertia matrix and its inverse
var Ixx = 20000, Iyy = 160000, Izz = 160000;
var I = new Matrix3D(new Vector3D(Ixx,0,0), new Vector3D(0,Iyy,0), new Vector3D(0,0,Izz));
var Iinv = new Matrix3D(new Vector3D(1/Ixx,0,0), new Vector3D(0,1/Iyy,0), new Vector3D(0,0,1/Izz));

// environmental parameters
var g = -10; // gravity
var rho = 1.0; // air density (in reality decreases with height; smaller constant value assumed here)

// drag and lift coefficients
var cDrag = 0.5;// drag coefficient (assumed constant)
var kDrag = 0.5*rho*areaWing*cDrag; // drag factor; for convenience
var cLift; // lift coefficient (depends on angles alpha and beta); actually computed through clift() function		
var dcLdalpha = 5;// derivative d(cLift)/d(alpha) (also assumed constant) 

// angles
var alphaWing = 10*Math.PI/180; // wing angle, fixed; the pitch of the wings w.r.t. the fuselage (ix axis)
var alpha = 0; // angle between velocity vector projected in xy plane and airplane axis (ix) 
var beta = 0; // angle between velocity vector projected in xz plane and airplane axis (ix)

// angular displacements of control surfaces
var alphaAl = 0.0; // user-controlled angular displacement of ailerons
var alphaAlMax = 10*Math.PI/180;	// maximum magnitude
var alphaAlInc = 0.1*Math.PI/180; // increment

var alphaEl = 0.0;	// user-controlled angular displacement of elevators (horizontal tail) 
var alphaElMax = 20*Math.PI/180;	// maximum magnitude
var alphaElInc = 0.5*Math.PI/180; 	// increment
		
var alphaRd = 0.0;	// user-controlled angular displacement of rudder (vertical tail) 
var alphaRdMax = 20*Math.PI/180;	// maximum magnitude
var alphaRdInc = 0.5*Math.PI/180; 	// increment				

// thrust
var thrustMag = 300000;	// thrust is user-controllable
var thrustMax = 500000; // maximum thrust magnitude
var thrustInc = 10000; // thrust increment	
					
var groundLevel = -200;	// location of ground

var followAirplane = false; // camera setting

var ix, iy, iz; // airplane frame unit vectors

window.onload = init; 

function init() {
	setupObjects();
	setupOrientation();	
	setupText();
	renderer.render(scene,camera);
	window.addEventListener('keydown',startControl,false);		
	t0 = new Date().getTime(); 
	animFrame();
}	
function setupObjects(){
	renderer = new THREE.WebGLRenderer({clearColor: 0xff0000, clearAlpha: 1});
	renderer.setClearColor( 0x82caff, 1);
    renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);
	
    scene = new THREE.Scene();

    var angle = 45, aspect = width/height, near = 0.1, far = 10000;
    camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
    camera.position.set(100,0,1000);
    scene.add(camera);

    var light = new THREE.DirectionalLight();
    light.position.set(30,0,30);
    scene.add(light);

	// create the ground
	var geom = new THREE.PlaneGeometry(5000, 100000, 50, 500);
    var wireframeMat = new THREE.MeshBasicMaterial();
    wireframeMat.wireframe = true;
	var ground = new THREE.Mesh(geom, wireframeMat);
	ground.rotation.x = -Math.PI/2;
	ground.position.set(0,groundLevel,0);
    scene.add(ground);		
	
    airplane = new THREE.Mesh(new THREE.CubeGeometry(400, 100, 100), new THREE.MeshNormalMaterial());
    airplane.overdraw = true;
    scene.add(airplane);
	airplane.mass = massAirplane;
	airplane.pos = new Vector3D(0,200,0);		
	airplane.velo = new Vector3D(0,0,0);		
	airplane.angVelo = new Vector3D(0,0,0); 
}
function setupText(){
	context.font = "12pt Arial";
	context.textAlign = "left";
	context.textBaseline = "top";
}
function setupOrientation(){
	// initialize airplane orientation
	var qRotate = new THREE.Quaternion();	
	qRotate.setFromAxisAngle(new THREE.Vector3( 0, 1, 0 ), Math.PI/2);
	airplane.quaternion.multiply(qRotate);

	// airplane local axes
	ix = new Vector3D(1,0,0);
	iy = new Vector3D(0,1,0);
	iz = new Vector3D(0,0,1);
}
function startControl(evt){
	// Aileron control: roll	
	if (evt.keyCode==37){ // left arrow: roll pozive wrt x axis, roll to the left
			if (alphaAl < alphaAlMax){ // maximum aileron angle 
			alphaAl += alphaAlInc;
		}
	}			
	if (evt.keyCode==39){ // right :roll negative wrt x axix, roll to the right
		if (alphaAl > -alphaAlMax){ // minimum aileron angle 
			alphaAl += -alphaAlInc;
		}
	}
	// Horizontal tail (elevators) control: pitch  
	if (evt.keyCode==40){ // down arrow; nose down
		if (alphaEl > -alphaElMax){ // minimum elevator angle
			alphaEl += -alphaElInc;
         
		}
	}	
	if (evt.keyCode==38){ // up arrow, nose up
		if (alphaEl < alphaElMax){ // maximum elevator angle
			alphaEl += alphaElInc;
		}
	}						
	// Vertical tail (rudder) control: yaw
	if (evt.keyCode == 88){	// x key : airplane nose to right
		if (alphaRd > -alphaRdMax){ // minimum rudder angle
			alphaRd += -alphaRdInc;
		}
	}
	if (evt.keyCode == 90){ // z key ; airplane nose to left
		if (alphaRd < alphaRdMax){ // maximum rudder angle
			alphaRd += alphaRdInc;
		}
	}
	// thrust control
	if (evt.keyCode == 32){ // space bar
		if (thrustMag < thrustMax){
			thrustMag += thrustInc; 
		}
	}	
	if (evt.keyCode == 13){ // enter key
		if (thrustMag > 0){
			thrustMag += -thrustInc;
		}
	}	
	// control camera position
	if (evt.keyCode == 65){ // a key 
		followAirplane = true;
	}	
	if (evt.keyCode == 87){ // w key
		followAirplane = false;
	}	
	// stop the simulation
	if (evt.keyCode == 27){ // escape key
		stop();
	}	
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
	updateInfo();
}
function move(){			
	moveObject(airplane);
	calcForce(airplane);
	updateAccel(airplane);
	updateVelo(airplane);	
	controlRotation(airplane);
}
function positionObject(obj){
	obj.position.set(obj.pos.x,obj.pos.y,obj.pos.z);	
}
function moveObject(obj){
	var p = new THREE.Quaternion;
	p.set(obj.angVelo.x*dt/2,obj.angVelo.y*dt/2,obj.angVelo.z*dt/2,1);
	obj.quaternion.multiply(p);	
	obj.quaternion.normalize();
	obj.pos = obj.pos.addScaled(obj.velo,dt);
	positionObject(obj);		
	positionCamera(obj);   
  	renderer.render(scene,camera);
}
function positionCamera(obj){
	if (followAirplane){
		camera.position.set(obj.position.x,obj.position.y-100,obj.position.z+1000);
	}else{
	    camera.position.set(100,0,1000);
	}
}
function rotateVector(v,q){ // rotate v (a Vector3D object) by quaternion q and return rotated Vector3D
	var vec3 = v3(v); // vector v in THREE.Vector3 format
	vec3.applyQuaternion(q); // rotated vector
	return v3D(vec3); // convert back to Vector3D and return
}
function v3D(vec3){ // takes a THREE Vector3 and returns a Vector3D version
	return new Vector3D(vec3.x,vec3.y,vec3.z);
}
function v3(vec3D){ // takes a Vector3D and returns a THREE Vector3 version
	return new THREE.Vector3(vec3D.x,vec3D.y,vec3D.z);
}
function calcForce(obj){
	// first need to rotate airplane velocity vector to airplane's frame
	var q = new THREE.Quaternion;
	q.copy(airplane.quaternion);
	var rvelo = rotateVector(obj.velo,q); 

	// *** forces on whole plane ***
	force = new Vector3D(0,0,0);
	// add drag force
	var drag = Forces3D.drag(kDrag,rvelo); // a simplification; assumes plane is moving forward
	force = force.add(drag);
	// add thrust
	var thrust = new Vector3D(-thrustMag,0,0); // thrust is assumed along roll axis
	force = force.add(thrust); 
						
	// *** torques on whole plane ***
	torque = new Vector3D(0,0,0); // gravity, drag and thrust don't have torques
	
// *** Now we consider the lift forces and torques on wings and control surfaces ***
	if (rvelo.length() > 0){ // no lift if velocity is zero 
		var viXY = new Vector3D(rvelo.x,rvelo.y,0); // velocity of the airplane in the airplane xy plane 
		var viZX = new Vector3D(rvelo.x,0,rvelo.z); // velocity of the airplane in the airplane xz plane 
				
		// calculate angle of attack and lateral angle
		calcAlphaBeta(rvelo);

		// *** Wing ***
		// force: lift on the Wing
		var liftW = liftforce(viXY,iz,areaWing,clift(alphaWing+alpha));
		force = force.add(liftW);
		// assume no overall torque generated by lift on main wings
						
		
		// *** lift forces and torques on control surfaces ***

		// *** Ailerons ***
		// force: ailerons; form a couple, so no net force  
		// torque: ailerons
		var liftAl = liftforce(viXY,iz,areaAileron,clift(alphaAl));
		var torqueAl = (iz.multiply(distAlToCM*2)).crossProduct(liftAl);// T = r x F, r is in the direction of iz, along the wing; factor of 2 because two ailerons contribute twice the torque
		torque = torque.add(torqueAl);	
	
		// *** Elevators ***
		// force: horizontal tail (elevators); same formula as for the wing 
		var liftEl = liftforce(viXY,iz,areaElevator,clift(alphaEl));		
		// torque: horizontal tail
		torqueEl = (ix.multiply(-distTlToCM)).crossProduct(liftEl); // T = r x liftHt; r being in the direction of ix axis; note negative distance along ix axis, ie. towards the rear of airplane
		force = force.add(liftEl);
		torque = torque.add(torqueEl);
	
		// *** Rudder ***
		// force: vertical tail (rudder); same formula as for the wing;	
		var liftRd = liftforce(viZX,iy.multiply(-1),areaRudder,clift(alphaRd+beta));
		// torque: vertical tail
		torqueRd = (ix.multiply(-distTlToCM)).crossProduct(liftRd);// T = r x liftVt ; note that r is in the direction of ix 
		force = force.add(liftRd);
		torque = torque.add(torqueRd);	
	}		
	
	// rotate force back to world frame
	force = rotateVector(force,q.conjugate()); 
		
	// add gravity
	var gravity = Forces3D.constantGravity(massAirplane,g);	// gravity
	force = force.add(gravity);
}
function calcAlphaBeta(velo){
		alpha = Math.atan2(-velo.y,-velo.x); // angle of attack
		if ((velo.y==0) && (velo.x==0)){
			alpha = 0;
		}
		beta = Math.atan2(-velo.z,-velo.x);// lateral angle
		if ((velo.z==0) && (velo.x==0)){
			beta = 0;
		} 
}
function clift(angle){
	var cl;
	if (Math.abs(angle) > 20*Math.PI/180){
		cl = 1.2*(angle)/Math.abs(angle)  // impose limit on cLift
	}else if(Math.abs(angle) > 20*Math.PI/180){
		cl=0;
	}else{
		cl = dcLdalpha*(angle); 
	}
	return cl;
}
function liftforce(velo,dir,area,clift){
	var vel = velo.crossProduct(dir);
	var lift = vel.multiply(0.5*rho*area*clift*velo.length());
	return lift;
}	
function updateAccel(obj){
	acc = force.multiply(1/obj.mass);
	var omega = obj.angVelo;
	alp = Iinv.multiply(torque.subtract(omega.crossProduct(I.multiply(omega))));
}	
function updateVelo(obj){	
	obj.velo = obj.velo.addScaled(acc,dt);
	obj.angVelo = obj.angVelo.addScaled(alp,dt);	 	
}
function controlRotation(obj){ // hack to impose stability
	obj.angVelo.scaleBy(0.2); // damping factor
}
function updateInfo(){
	var altitude = Math.round(airplane.position.y - groundLevel);
	var velhor = new Vector2D(airplane.velo.x,airplane.velo.z);
	var veloHor = Math.round(velhor.length());
	var veloVer = Math.round(airplane.velo.y);
	var alpAl = Math.round(alphaAl*180/Math.PI);
	var alpEl = Math.round(alphaEl*180/Math.PI);
	var alpRd = Math.round(alphaRd*180/Math.PI);	
	var txtAlt = "Altitude = ";
	var txtVelV = "Vertical velocity = ";
	var txtVelH = "Horizontal velocity = ";	
	var txtAlphaAl = "Aileron angle = "; 
	var txtAlphaEl = "Elevator angle = "; 
	var txtAlphaRd = "Rudder angle = "; 	
	txtAlt = txtAlt.concat(altitude.toString()); 
	txtVelV = txtVelV.concat(veloVer.toString());	
	txtVelH = txtVelH.concat(veloHor.toString()); 	
	txtAlphaAl = txtAlphaAl.concat(alpAl.toString()); 		
	txtAlphaEl = txtAlphaEl.concat(alpEl.toString()); 		
	txtAlphaRd = txtAlphaRd.concat(alpRd.toString()); 			
	context.clearRect(0,0,canvas.width,canvas.height);
	context.fillText(txtAlt,20,20);
	context.fillText(txtVelV,20,60);	
	context.fillText(txtVelH,20,100);	
	context.fillText(txtAlphaAl,20,140);	
	context.fillText(txtAlphaEl,20,180);	
	context.fillText(txtAlphaRd,20,220);		
}
function stop(){
	cancelAnimationFrame(animId);
}
