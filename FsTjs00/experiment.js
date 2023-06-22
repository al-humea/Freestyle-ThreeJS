import * as THREE from 'three';
import * as SHDR from './shaders.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const cubeNum = 15;
//scene, camera et renderer, noms invariables
const scene = new THREE.Scene();
//degré d'ouverture de la cam, ratio, near, far
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.z = 7;
controls.update();
//SET UP RENDERER AND ADD IT TO DOM
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x333333);
document.body.appendChild(renderer.domElement);


// LIGHTS
const dLight = new THREE.DirectionalLight(0xFFFFFF, 1);
dLight.rotation.x = 1;
dLight.position.z = 3;
scene.add(dLight);

// Clock
const clock = new THREE.Clock();
let time = {value:clock.getElapsedTime()};
//CUBES MATTER
const geoCube = new THREE.TorusGeometry(1);
const matCube = new THREE.ShaderMaterial({
    uniforms:{
    },
    vertexShader:SHDR.glassV,
    fragmentShader:SHDR.glassF
});

const cube = new THREE.Mesh(geoCube, matCube);
//CUBES INSTANTIATION
var list = [];
// for (let i=1; i <= cubeNum; i++){
//     let clonedCube = cube.clone();
//     list.push(clonedCube);
//     scene.add(clonedCube);
// }

// PLANE INSTANTIATION
const geoPln = new THREE.PlaneGeometry(50, 30, 30, 30);
const matPln = new THREE.ShaderMaterial({
    uniforms:{
        time,
        res:{value:new THREE.Vector2(window.innerWidth, window.innerHeight)}
    },
    vertexShader:SHDR.planeV,
    fragmentShader:SHDR.planeF
})
const plane = new THREE.Mesh(geoPln, matPln);
plane.position.z -= 10;
scene.add(plane);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
    let y = clock.getDelta();
    //here apply transformation on each item
    for (let i = 0; i < list.length; i++) {
        let angle = (i + time.value) / cubeNum * Math.PI * 2;
        list[i].position.x = (16*(Math.pow(Math.sin(angle), 3)))*0.25;
        list[i].position.y = (13 * Math.cos(angle) - 5* Math.cos(2*angle) - 2*Math.cos(3*angle) - Math.cos(4*angle))*0.25;
        if (i%2)list[i].rotation.x += y;
        else list[i].rotation.x -= y;
        if (i%2)list[i].rotation.y += y;
        else list[i].rotation.y -= y;
    }
    time.value = clock.getElapsedTime();
    console.log(window.innerHeight, window.innerWidth);
}
animate();

//responsive canvas
window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    matPln.uniforms.res = renderer.getSize();
});
