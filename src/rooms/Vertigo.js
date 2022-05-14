import * as THREE from "three";
import { StandardNodeMaterial } from "three/examples/jsm/nodes/materials/StandardNodeMaterial";

var scene, doorMaterial, door;
let videoPlaying, video1;

function createDoorMaterial(ctx) {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      selected: { value: 0 },
      tex: { value: ctx.assets["doorfx_tex"] }
    },
    vertexShader: ctx.shaders.basic_vert,
    fragmentShader: ctx.shaders.door_frag
  });
}

export function setup(ctx) {
  scene = new THREE.Scene();
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0.5, 1, 1).normalize();
  scene.add(light);

  addVideo();
  addSphere();
  addDoor(ctx);
 }

 function addVideo(){
   const geometry = new THREE.BoxGeometry( 500, 500, 1 );
   geometry.scale( - 1, 1, 1 );
   video1 = document.getElementById("video1");
   video1.addEventListener('click', ()=> {
     videoStartStop();
   })
   const texture = new THREE.VideoTexture(video1);
   const material = new THREE.MeshLambertMaterial({map: texture });
   const mesh = new THREE.Mesh(geometry, material);
   mesh.position.z = 500;
   mesh.position.x = 3;
   scene.add(mesh);
 }

 function addSphere(){
   const sphereGeometry = new THREE.SphereGeometry();
   const material = new THREE.MeshBasicMaterial({
     color: 0x00ff00,
     wireframe: true,
   });
   const mesh = new THREE.Mesh(sphereGeometry, material)
   mesh.position.x = -5
   mesh.position.z = 5
   scene.add(mesh);
 }

 function addDoor(ctx){
   const doorGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
   doorMaterial = createDoorMaterial(ctx);
   door = new THREE.Mesh(doorGeometry, doorMaterial);
   scene.add(door);
 }

function videoStartStop(){
  if (videoPlaying) {
    videoStop();
  } else {
    videoStart();
  }
}

function videoStart(){
  video1.play();
  videoPlaying = true;
}

function videoStop(){
  video1.pause();
  video1.currentTime = 0;
  videoPlaying = false;
}

export function enter(ctx) {
  console.log('enter vertigo');
  videoStart();
  ctx.renderer.setClearColor(0x677FA7);
  ctx.scene.add(scene);
  // ctx.scene.parent.fog = new THREE.FogExp2(0x677FA7, 0.004);
  ctx.raycontrol.activateState('teleportVertigo');
  ctx.raycontrol.activateState('doorVertigo');
}

export function exit(ctx) {
  videoStop();
  ctx.scene.remove(scene);
  ctx.scene.parent.fog = null;

  ctx.raycontrol.deactivateState('teleportVertigo');
  ctx.raycontrol.deactivateState('doorVertigo');
}

export function execute(ctx, delta, time) {
  doorMaterial.uniforms.time.value = time;

  if (door.scale.z > 0.2) {
    door.scale.z = Math.max(door.scale.z - delta * door.scale.z, 0.2);
  }
}

