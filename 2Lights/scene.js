import * as THREE from "./three.module.js"

let lerp = (a, amt, b)=> a + (b-a) * amt;

export class Lights{
  constructor(scene){
    this.spotlights = [];
    this.spotlights.push(new THREE.SpotLight(0xfaeacd, 1.0));
    this.spotlights[0].position.set(2, 1.5, 8);
    this.spotlights.push(new THREE.SpotLight(0xfaeacd, 1.0));
    this.spotlights[1].position.set(-2, 1.5, 8);
    this.spotlights.push(new THREE.SpotLight(0xfaeacd, 1.0));
    this.spotlights[2].position.set(-8, 4.0, 0);
    this.spotlights.push(new THREE.SpotLight(0xfaeacd, 1.0));
    this.spotlights[3].position.set(8, 4.0, 0);
    this.spotlights.push(new THREE.SpotLight(0xfaeacd, 1.0));
    this.spotlights[4].position.set(0, 8.0, 0);
    
    this.spotlights.forEach((x)=>{
      x.castShadow = true;
      x.angle = 0.3;
      x.shadow.bias = -0.001;
      scene.add(x);
      // scene.add( new THREE.SpotLightHelper(x));
    });
    this.hemisphereLight = new THREE.HemisphereLight(0xfaeacd, 0x291D13, 2.0);
    this.hemisphereLight.position.set(0, 2, 2);
    scene.add(this.hemisphereLight);
  }
  turnOn(){
    this.spotlights.forEach((x)=>{
      x.intensity = 250.0;
    });
  }
}

const textureLoader = new THREE.TextureLoader();
const curtainBaseCol = textureLoader.load("./textures/curtains/basecolor.jpg");
const curtainAO = textureLoader.load("./textures/curtains/ambientOcclusion.jpg");
const curtainHeight = textureLoader.load("./textures/curtains/height.png");
const curtainNormal = textureLoader.load("./textures/curtains/normal.jpg");
const curtainRoughness = textureLoader.load("./textures/curtains/roughness.jpg");

const ground = []
ground.push(textureLoader.load("./textures/ground/basecolor.jpg"));
ground.push(textureLoader.load("./textures/ground/ambientOcclusion.jpg"));
ground.push(textureLoader.load("./textures/ground/height.jpg"));
ground.push(textureLoader.load("./textures/ground/normal.jpg"));
ground.push(textureLoader.load("./textures/ground/roughness.jpg"));
ground.push(textureLoader.load("./textures/ground/metallic.jpg"));
ground.forEach((x)=>{
  x.wrapS = THREE.RepeatWrapping;
  x.wrapT = THREE.RepeatWrapping;
  x.repeat.set(30, 20);
});
export class Scene{
  constructor(scene){
    this.animationDurations = [10.0];
    
    //GROUND
    this.groundGeo = new THREE.BoxGeometry(30, 1, 20, 256, 256, 256);
    this.groundMat = new THREE.MeshStandardMaterial({
      color:0x8e7c69,
      side:THREE.DoubleSide,
      map:ground[0],
      normalMap:ground[3],
      displacementMap:ground[2],
      displacementScale:0.15,
      roughnessMap:ground[4],
      roughness:0.5,
      metalnessMap:ground[5],
      aoMap:ground[1]
    });
    this.ground = new THREE.Mesh(this.groundGeo, this.groundMat);
    this.ground.position.set(0, -3.5, 0);
    scene.add(this.ground);

    //CURTAINS
    this.curtainGeo = new THREE.PlaneGeometry(12, 12, 256, 256);
    let count = this.curtainGeo.attributes.position.count;
    for (let i = 0; i < count; i++){
      let x = this.curtainGeo.attributes.position.getX(i);
      this.curtainGeo.attributes.position.setZ(i, Math.sin(x*3));
    }
    this.curtainGeo.computeVertexNormals();
    this.curtainMat = new THREE.MeshStandardMaterial({
      color:0x900000,
      side:THREE.DoubleSide,
      map:curtainBaseCol,
      normalMap:curtainNormal,
      displacementMap:curtainHeight,
      displacementScale:0.1,
      roughnessMap:curtainRoughness,
      aoMap:curtainAO
    });
    this.curtainGeo.attributes.uv2 = this.curtainGeo.attributes.uv;
    this.leftCurtain = new THREE.Mesh(this.curtainGeo, this.curtainMat);
    this.leftCurtain.position.set(-6, 2.5, 3);
    scene.add(this.leftCurtain);

    this.rightCurtain = new THREE.Mesh(this.curtainGeo, this.curtainMat);
    this.rightCurtain.position.set(6, 2.5, 3);
    scene.add(this.rightCurtain);

    this.backCurtainGeo = new THREE.PlaneGeometry(50, 16, 256, 256);
    count = this.backCurtainGeo.attributes.position.count;
    for (let i = 0; i < count; i++){
      let x = this.backCurtainGeo.attributes.position.getX(i);
      this.backCurtainGeo.attributes.position.setZ(i, Math.sin(x*3));
    }
    this.backCurtainGeo.computeVertexNormals();
    this.backCurtain = new THREE.Mesh(this.backCurtainGeo, this.curtainMat);
    this.backCurtain.position.set(0, 5.5, -5)
    scene.add(this.backCurtain);

    //shadows
    [this.ground, this.backCurtain, this.leftCurtain, this.rightCurtain].forEach((x)=>{
      x.castShadow = true;
      x.receiveShadow = true;
    });
    this.fog = new THREE.FogExp2(0x111111, 0.1);
    scene.fog = this.fog;
  }
  animateCurtains(delta){
    this.leftCurtain.position.setX(lerp(this.leftCurtain.position.x, delta*0.2, -12));
    this.rightCurtain.position.setX(lerp(this.rightCurtain.position.x, delta*0.2, 12));
  }
}