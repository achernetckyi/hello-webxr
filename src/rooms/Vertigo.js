import * as THREE from "three";
import { StandardNodeMaterial } from "three/examples/jsm/nodes/materials/StandardNodeMaterial";

var scene, doorMaterial, door;
let videoPlaying;

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
  //const assets = ctx.assets;
  //var texture = assets["checkboard_tex"];
  // const xgrid = 20, ygrid = 10;
  // const xsize = 480 / xgrid;
  // const ysize = 204 / ygrid;

  const video1Geometry = new THREE.BoxGeometry( window.innerWidth/8, window.innerHeight/8, window.innerWidth/8 );
  video1Geometry.scale( - 1, 1, 1 );
  const video1 = document.getElementById("video1");
  video1.addEventListener('click', ()=> {
    videoStartStop();
  })
  //video1.play();
  const video1Texture = new THREE.VideoTexture(video1);
  const video1Material = new THREE.MeshLambertMaterial({map: video1Texture });
  const video1Mesh = new THREE.Mesh(video1Geometry, video1Material);
  scene = new THREE.Scene();
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0.5, 1, 1).normalize();
  scene.add(light);
  // video1Mesh.position.z = 0;
  // video1Mesh.scale.x = video1Mesh.scale.y = video1Mesh.scale.z = 1;
  scene.add(video1Mesh);

  // mesh.position.x = (0 - xgrid / 2) * xsize;
  // mesh.position.y = (0 - ygrid / 2) * ysize;


  // var lightmap = assets['vertigo_lm_tex'];
  //const material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture, lightMap: lightmap} );

  //scene = assets['vertigo_model'].scene;
  //scene.getObjectByName('city').material = material;


  //scene.getObjectByName('teleport').visible = false;

  const doorGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
  // const doorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: assets["pg_flare_tex"] });
  // scene.getObjectByName("door_frame").material =
  //   new THREE.MeshBasicMaterial({ map: assets["vertigo_door_lm_tex"] });
  doorMaterial = createDoorMaterial(ctx);
  door = new THREE.Mesh(doorGeometry, doorMaterial);
  scene.add(door);
  // door = scene.getObjectByName("door");
  // door.material = doorMaterial;
  //
  // ctx.raycontrol.addState("doorVertigo", {
  //   colliderMesh: scene.getObjectByName("door"),
  //   onHover: (intersection, active) => {
  //     //teleport.onHover(intersection.point, active);
  //     const scale = intersection.object.scale;
  //     scale.z = Math.min(scale.z + 0.02 * (2 - door.scale.z), 0.8);
  //   },
  //   onHoverLeave: () => {
  //     //teleport.onHoverLeave();
  //   },
  //   onSelectStart: (intersection, e) => {
  //     ctx.goto = 0;
  //     //teleport.onSelectStart(e);
  //   },
  //   onSelectEnd: (intersection) => {
  //     //teleport.onSelectEnd(intersection.point);
  //   }
  // });

  // let teleport = scene.getObjectByName('teleport');
  // teleport.visible = true;
  // teleport.material.visible = false;
  // ctx.raycontrol.addState('teleportVertigo', {
  //   colliderMesh: teleport,
  //   onHover: (intersection, active) => {
  //   onHover: (intersection, active) => {
  //     ctx.teleport.onHover(intersection.point, active);
  //   },
  //   onHoverLeave: () => {
  //     ctx.teleport.onHoverLeave();
  //   },
  //   onSelectStart: (intersection, e) => {
  //     ctx.teleport.onSelectStart(e);
  //   },
  //   onSelectEnd: (intersection) => {
  //     ctx.teleport.onSelectEnd(intersection.point);
  //   }
  // });
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
  videoStart();
  ctx.renderer.setClearColor(0x677FA7);
  ctx.scene.add(scene);
  ctx.scene.parent.fog = new THREE.FogExp2(0x677FA7, 0.004);
  //ctx.cameraRig.position.set(0,0,0);
  //video1.play();
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

