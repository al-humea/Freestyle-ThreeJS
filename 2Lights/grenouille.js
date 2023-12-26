import {GLTFLoader} from "../gltf/GLTFLoader.js"
import * as THREE from "./three.module.js"

export class FroggyFrog {
  constructor(scene, lights){
    this.loaded = false;
    this.loader = new GLTFLoader();
    this.loader.load("./gltf/froggyfrog.gltf",
      (gltf)=>{
        gltf.scene.traverse((node)=>{
          if (node.isMesh){
            node.castShadow = true;
            node.receiveShadow = true;
            node.depthPacking = THREE.RGBADepthPacking;
            node.material.roughness = 1.0;
            node.material.metalness = 1.0;
          }
        });
        this.model = gltf.scene;
        this.loaded = true;
        scene.add(this.model);
    });
  }
}