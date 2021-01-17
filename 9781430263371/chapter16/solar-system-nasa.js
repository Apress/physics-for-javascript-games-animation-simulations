// rendering
var width = window.innerWidth,
  height = window.innerHeight;
var scene, camera, renderer;

// time-keeping variables
var dt = 1 / 24; // simulation time unit is 1 day; time-step is 1 hr
var numSteps = 8784; // 366 days; 366*24
var animFreq = numSteps; // just once at the end of the simulation
var t = 0;

// gravitational constant
var G;

// sun variables
var center;
var massSun;
var radiusSun = 30;

// velocity and position vectors for all planets
var v;
var s;

// visual objects
var sun;
var planets;
var numPlanets = 4;

// planets' properties
var colors;
var radiuses;
var masses;

// scaling factors
var scaleTime;
var scaleDist;
var scaleMass;
var scaleVelo;

window.onload = init;

function init() {
  setupScaling();
  setupPlanetData();
  setInitialConditions();
  setupObjects();
  simulate();
  compareNASA();
  renderer.render(scene, camera);
}

function setupScaling() {
  scaleMass = Astro.EARTH_MASS;
  scaleTime = Astro.EARTH_DAY;
  scaleDist = 1e9; // 1 million km or 1 billion meters
  scaleVelo = scaleDist / scaleTime; // million km per day

  massSun = Astro.SUN_MASS / scaleMass;

  G = Phys.GRAVITATIONAL_CONSTANT;
  G *=
    (scaleMass * scaleTime * scaleTime) / (scaleDist * scaleDist * scaleDist);
}

function setupPlanetData() {
  radiuses = [1.9, 4.7, 5, 2.7];
  colors = [0xffffcc, 0xffcc00, 0x0099ff, 0xff6600];

  masses = new Array();
  masses[0] = Astro.MERCURY_MASS / scaleMass;
  masses[1] = Astro.VENUS_MASS / scaleMass;
  masses[2] = Astro.EARTH_MASS / scaleMass;
  masses[3] = Astro.MARS_MASS / scaleMass;
}

function setInitialConditions() {
  center = new Vector3D(0, 0, 0);

  s = new Array();
  s[0] = new Vector3D(
    -5.673486551269988e7,
    -2.90580777647288e7,
    2.831471548856726e6
  ); // mercury
  s[1] = new Vector3D(
    1.083622101258184e8,
    5.186812728386815e6,
    -6.182877404899519e6
  ); // venus
  s[2] = new Vector3D(
    -2.501567084587771e7,
    1.449614303354543e8,
    -4.572052182107447e3
  ); // earth
  s[3] = new Vector3D(
    -1.77944181154557e8,
    1.720857121437973e8,
    7.974975344806875e6
  ); // mars
  for (var i = 0; i < s.length; i++) {
    s[i] = center.addScaled(s[i], 1000 / scaleDist); // distances in NASA data are in km
  }

  v = new Array();
  v[0] = new Vector3D(
    1.216453506755825e1,
    -4.123145442643666e1,
    -4.484987038755303
  ); // mercury
  v[1] = new Vector3D(
    -1.818140449649583,
    3.482184715827766e1,
    5.820179514330701e-1
  ); // venus
  v[2] = new Vector3D(
    -2.983875373861814e1,
    -5.188096364047718,
    6.015483423878356e-4
  ); // earth
  v[3] = new Vector3D(
    -1.592816222793181e1,
    -1.535286664845714e1,
    6.941063066996438e-2
  ); // mars
  for (var j = 0; j < v.length; j++) {
    v[j].scaleBy(1000 / scaleVelo); // velocities in NASA data are in km/s
  }
}

function setupObjects() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  var angle = 45,
    aspect = width / height,
    near = 0.1,
    far = 10000;
  camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
  camera.position.set(0, 0, 1000);
  scene.add(camera);

  var light = new THREE.DirectionalLight();
  light.position.set(-10, 0, 20);
  scene.add(light);

  var sphereGeometry = new THREE.SphereGeometry(radiusSun, 10, 10);
  var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
  sun = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sun);
  sun.mass = massSun;
  sun.pos = center;
  positionObject(sun);

  planets = new Array();

  for (var n = 0; n < numPlanets; n++) {
    sphereGeometry = new THREE.SphereGeometry(radiuses[n], 10, 10);
    sphereMaterial = new THREE.MeshLambertMaterial({ color: colors[n] });
    var planet = new THREE.Mesh(sphereGeometry, sphereMaterial);
    planets.push(planet);
    scene.add(planet);
    planet.mass = masses[n];
    planet.pos = s[n];
    planet.velo = v[n];
    positionObject(planet);
  }
}
function positionObject(obj) {
  obj.position.set(obj.pos.x, obj.pos.y, obj.pos.z);
}

function simulate() {
  for (var i = 0; i < numSteps; i++) {
    t += dt;
    for (var n = 0; n < numPlanets; n++) {
      RK4(n);
      if ((i + 1) % animFreq == 0) {
        movePlanet(n);
      }
    }
  }
}
function movePlanet(n) {
  var planet = planets[n];
  planet.pos = s[n];
  positionObject(planet);
}
function getAcc(ppos, pvel, pn) {
  var massPlanet = planets[pn].mass;
  var r = ppos.subtract(center);
  // force exerted by sun
  var force = Forces3D.gravity(G, massSun, massPlanet, r);
  // forces exerted by other planets
  for (var n = 0; n < numPlanets; n++) {
    if (n != pn) {
      // exclude the current planet itself!
      r = ppos.subtract(s[n]);
      var gravity = Forces3D.gravity(G, masses[n], massPlanet, r);
      force = Forces3D.add([force, gravity]);
    }
  }
  // acceleration
  return force.multiply(1 / massPlanet);
}

function RK4(n) {
  // step 1
  var pos1 = s[n];
  var vel1 = v[n];
  var acc1 = getAcc(pos1, vel1, n);
  // step 2
  var pos2 = pos1.addScaled(vel1, dt / 2);
  var vel2 = vel1.addScaled(acc1, dt / 2);
  var acc2 = getAcc(pos2, vel2, n);
  // step 3
  var pos3 = pos1.addScaled(vel2, dt / 2);
  var vel3 = vel1.addScaled(acc2, dt / 2);
  var acc3 = getAcc(pos3, vel3, n);
  // step 4
  var pos4 = pos1.addScaled(vel3, dt);
  var vel4 = vel1.addScaled(acc3, dt);
  var acc4 = getAcc(pos4, vel4, n);
  // sum vel and acc
  var velsum = vel1.addScaled(vel2, 2).addScaled(vel3, 2).addScaled(vel4, 1);
  var accsum = acc1.addScaled(acc2, 2).addScaled(acc3, 2).addScaled(acc4, 1);
  // update pos and velo
  s[n] = pos1.addScaled(velsum, dt / 6);
  v[n] = vel1.addScaled(accsum, dt / 6);
}

function compareNASA() {
  var sN = new Array();
  sN[0] = new Vector3D(
    -2.5230590488744e7,
    -6.48131880364782e7,
    -2.98064874580402e6
  ); // mercury
  sN[1] = new Vector3D(
    -6.88632918148365e7,
    -8.35567307141699e7,
    2.82940298141186e6
  ); // venus
  sN[2] = new Vector3D(
    -2.6930992133975e7,
    1.44612510698672e8,
    -3.95571686978874e3
  ); // earth
  sN[3] = new Vector3D(1.615753e8, -1.296287e8, -6.683049e6); // mars
  for (var i = 0; i < sN.length; i++) {
    sN[i] = center.addScaled(sN[i], 1000 / scaleDist); // distances in NASA data are in km
    var planet = planets[i];
    var p = planet.clone();
    scene.add(p);
    p.pos = sN[i];
    //p.pos = sN[i].multiply(2);
    positionObject(p);
  }
}
