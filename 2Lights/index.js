import * as THREE from "./three.module.js"
const debug = document.getElementById("debug");
const cnv = document.getElementById("screen");
cnv.width = window.innerWidth;
cnv.height = window.innerHeight*0.8;
//scene cam et renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 8);
const renderer = new THREE.WebGLRenderer( { canvas : cnv, antialias: true } );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.outputColorSpace = THREE.SRGBColorSpace;no longer needed its default
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

import * as SL from "./scene.js"
let lights = new SL.Lights(scene);
let stage = new SL.Scene(scene);
import {FroggyFrog} from "./grenouille.js"
let froggyfrog = new FroggyFrog(scene, lights);

const lightSwitch = new Howl({
  src: ['assets/light_switch.mp3']
})
const bigLightSwitch = new Howl({
  src: ['assets/big_light_switch.mp3']
});
const partyRelief = new Howl({
  src: ['assets/partyrelief.mp3']
});

let animate = false;
let spinAround = false;
let delta = 0.0;
let last_time = 0.0;
let timer = 0.0;

const title = document.getElementsByTagName("h1")[0];
const button = document.getElementById("button");
button.addEventListener("click", (e)=>{
  button.classList.add("disappear");
  title.classList.add("upper");
  lightSwitch.play();
  lights.directionalLight.intensity = 0.0;
  setTimeout(()=>{
    animate = true;
    timer = 0.0;
    partyRelief.play();
  }, 1000);
  setTimeout(()=>{
    bigLightSwitch.play();
    lights.turnOn();
    spinAround = true;
  }, 5400)
});
function render(time){
  delta = (time - last_time)* 0.001;
  timer += delta;
  last_time = time;
  renderer.render(scene, camera);
  if (animate && timer < 4.0)
    stage.animateCurtains(delta);
  if (spinAround)
    froggyfrog.model.rotation.y += delta;
  requestAnimationFrame(render);
}
requestAnimationFrame(render);