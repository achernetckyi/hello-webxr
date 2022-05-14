import * as THREE from 'three';
var scene, listener, timeout, mixer, door, doorMaterial;

const soundNames = [
  'bells',
  'horn',
  'cowbell',
  'guiro',
  'mandolin',
  'squeaker',
  'train',
  'whistle',
  'motorhorn',
  'surdo',
  'trumpet',
];

let videoSound;

function createDoorMaterial(ctx) {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: {value: 0},
      selected: {value: 0},
      tex: {value: ctx.assets['doorfx_tex']}
    },
    vertexShader: ctx.shaders.basic_vert,
    fragmentShader: ctx.shaders.door_frag
  });
}

export function setup(ctx) {
  const assets = ctx.assets;
  scene = assets['sound_model'].scene;
  door = assets['sound_door_model'].scene;

  door.getObjectByName('door_frame').material =
    new THREE.MeshBasicMaterial({map: assets['sound_door_lm_tex']});

  doorMaterial = createDoorMaterial(ctx);
  door.getObjectByName('door').material = doorMaterial;

  door.scale.set(0.5, 0.5, 0.5);
  door.position.set(0.4, 0.6, 1);
  door.rotation.set(0, 0.4, 0);

  addVideoSound();
  ctx.raycontrol.addState('sound', {
    colliderMesh: door.getObjectByName('door'),
    onHover: (intersection, active) => {
      //teleport.onHover(intersection.point, active);
      const scale = intersection.object.scale;
      scale.z = Math.min(scale.z + 0.05 * (2 - door.scale.z), 1.5);
    },
    onHoverLeave: () => {
      //teleport.onHoverLeave();
    },
    onSelectStart: (intersection, e) => {
      ctx.goto = 0;
      //teleport.onSelectStart(e);
    },
    onSelectEnd: (intersection) => {
      //teleport.onSelectEnd(intersection.point);
    }
  });
}

function addVideoSound(){
  const geometry = new THREE.SphereGeometry( 500, 60, 40);
  geometry.scale( - 1, 1, 1 );
  videoSound = document.getElementById("video1");
  const texture = new THREE.VideoTexture(videoSound);
  const material = new THREE.MeshBasicMaterial({map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 50;
  mesh.position.x = 3;
  scene.add(mesh);
}

export function enter(ctx) {
  console.log('enter sound');
  videoSound.play();
  ctx.renderer.setClearColor(0x000000);
  ctx.scene.add(scene);
  ctx.scene.add(door);
//  ctx.camera.add(listener);

  ctx.raycontrol.activateState('teleportSound');
  ctx.raycontrol.activateState('sound');
}

export function exit(ctx) {
  videoSound.pause();
  ctx.scene.remove(scene);
  ctx.scene.remove(door);
//  ctx.camera.remove(listener);
  ctx.raycontrol.deactivateState('teleportSound');
  ctx.raycontrol.deactivateState('sound');
}

export function execute(ctx, delta, time) {
  doorMaterial.uniforms.time.value = time;

  if (door.scale.z > 0.5) {
    door.scale.z = Math.max(door.scale.z - delta * door.scale.z, 0.5);
  }
}
