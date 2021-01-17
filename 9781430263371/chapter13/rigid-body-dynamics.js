﻿var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var rigidBody;
var acc, force;
var alp, torque;
var t0, dt;
var animId;
var kLin = 0.05; // linear damping factor
var kAng = 0.5; // // angular damping factor

window.onload = init;

function init() {
  var v1 = new Vector2D(-100, 100);
  var v2 = new Vector2D(100, 100);
  var v3 = new Vector2D(100, -100);
  var v4 = new Vector2D(-100, -100);
  var vertices = new Array(v1, v2, v3, v4);
  rigidBody = new PolygonRB(vertices);
  rigidBody.mass = 1;
  rigidBody.im = 5;
  rigidBody.pos2D = new Vector2D(200, 200);
  rigidBody.velo2D = new Vector2D(10, 0);
  rigidBody.angVelo = 0;
  rigidBody.draw(context);
  t0 = new Date().getTime();
  animFrame();
}

function animFrame() {
  animId = requestAnimationFrame(animFrame, canvas);
  onTimer();
}
function onTimer() {
  var t1 = new Date().getTime();
  dt = 0.001 * (t1 - t0);
  t0 = t1;
  if (dt > 0.2) {
    dt = 0;
  }
  move();
}
function move() {
  moveObject(rigidBody);
  calcForce(rigidBody);
  updateAccel(rigidBody);
  updateVelo(rigidBody);
}
function moveObject(obj) {
  obj.pos2D = obj.pos2D.addScaled(obj.velo2D, dt);
  obj.rotation = obj.angVelo * dt;
  context.clearRect(0, 0, canvas.width, canvas.height);
  obj.draw(context);
}
function calcForce(obj) {
  force = Forces.zeroForce();
  force = force.addScaled(obj.velo2D, -kLin); // linear damping
  torque = 1;
  torque += -kAng * obj.angVelo; // angular damping
}
function updateAccel(obj) {
  acc = force.multiply(1 / obj.mass);
  alp = torque / obj.im;
}
function updateVelo(obj) {
  obj.velo2D = obj.velo2D.addScaled(acc, dt);
  obj.angVelo += alp * dt;
}
