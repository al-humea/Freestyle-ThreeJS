<template>
    <div ref="canvas"></div>
</template>

<script setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import * as THREE from 'three';
  import * as TWEEN from '@tweenjs/tween.js'

  let scene, camera, renderer, cube;
  let speed, velocity, time, deltaTime;

  const canvas = ref(); // reference to the div

  onMounted(() => {
    // create a scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();

    // set size of the renderer and append it to the div
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.value.appendChild(renderer.domElement); // append to the div

    // create a cube
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const material = new THREE.MeshBasicMaterial({ color: 0xb92020 });
    cube = new THREE.Mesh(geometry, material);

    // add the cube to the scene
    scene.add(cube);

    // position the camera
    camera.position.z = 5;

    speed = 0.0;
    velocity = 0.0;
    time = new THREE.Clock();
    time.start();


    // start the animation loop
    animate();

    // listen for window resize events
    window.addEventListener('resize', onWindowResize);
  });

  onUnmounted(() => {
    // stop the animation loop when the component is unmounted
    stop();

    // remove the event listener when the component is unmounted
    window.removeEventListener('resize', onWindowResize);
  });

  function animate() {
    TWEEN.update(time);
    requestAnimationFrame(animate);
    deltaTime = time.getDelta();
    velocity += speed * deltaTime;
    // rotate the cube
    cube.rotation.x += velocity * deltaTime;
    cube.rotation.y += velocity * deltaTime;
    // render the scene
    renderer.render(scene, camera);
    velocity *= 0.5;
    speed *= 0.99;
    if (speed <= 0.1)
        speed = 0;
  }

  function stop() {
    cancelAnimationFrame(animate);
  }

  function spin(){
    speed += 100.0;
  }
  function blob(){
    console.log("Blob");
  }
  function change(){
    console.log("Change");
  }
  function onWindowResize() {
    // update the camera's aspect ratio and the renderer's size
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  defineExpose({
    spin,
    blob,
    change
  });
  </script>

  <style scoped>
  </style>
