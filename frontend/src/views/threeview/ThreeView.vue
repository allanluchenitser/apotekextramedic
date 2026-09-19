<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import apotekGlbUrl from '@/assets/glb/apotek_tres.glb?url'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import DisplayCoordinates from '@/components/DisplayCoordinates.vue';

import type { RotationDegrees } from '@/js/localTypes';

import { disposeThreeObjects } from '@/js/util';

// import sunExercise from './sunExercise';
// import spheresExercise from './spheresExercise';
// import cubesExercise from './cubesExercise';
import textureExercise from './textureExercise';

import { ThreeSceneContext } from './threeContextUtils';

const cameraInfo = ref<{ position: THREE.Vector3, rotation: RotationDegrees }>({
  position: new THREE.Vector3(0, 0, 0),
  rotation: { x: 0, y: 0, z: 0 }
})

const threeViewRef = ref<HTMLDivElement | null>(null)

let renderer: THREE.WebGLRenderer
let sceneContext: ThreeSceneContext
let camera: THREE.PerspectiveCamera
let controls: OrbitControls

const startingCameraPosition: [number, number, number] = [0, 0, 10] as const;
const startingCameraTarget: [number, number, number] = [0, 0, 0] as const;

onMounted(async () => {
  if (!threeViewRef.value) return

  // ------ SETUP
  const { width, height } = sizeInfo(threeViewRef.value);
  camera = new THREE.PerspectiveCamera(25, width / height, 1, 200)

  // camer.lookAt replaced by controls below
  camera.position.set(...startingCameraPosition);
  // camera.up.set(0, 0, 1);

  renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setSize(width, height, false)

  threeViewRef.value.appendChild(renderer.domElement);

  // ------ SCENE

  sceneContext = new ThreeSceneContext();
  // spheresExercise.setup(sceneContext);
  // cubesExercise.setup(sceneContext);
  // sunExercise.setup(sceneContext);
  textureExercise.setup(sceneContext);
  // sceneContext.scene.fog = new THREE.Fog('#ffffff', 1, 100);

  // ------ EXTERNAL MESH

  // const loader = new GLTFLoader();
  // loader.load(apotekGlbUrl, (gltf) => {
  //   scene.add(gltf.scene);
  // });

  // ------ ANIMATION, CONTROLS

  controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set(...startingCameraTarget);
  controls.update();

  function animate(time: number) {
    renderer.render(sceneContext.scene, camera);

    const pos = camera.position.clone();

    const rot: RotationDegrees = {
      x: THREE.MathUtils.radToDeg(camera.rotation.x),
      y: THREE.MathUtils.radToDeg(camera.rotation.y),
      z: THREE.MathUtils.radToDeg(camera.rotation.z)
    };

    cameraInfo.value = {
      position: pos,
      rotation: rot
    };

    const seconds = time * 0.0003;

    sceneContext.objects.forEach(obj => {
      obj.rotation.y = seconds;
    });
  };

  renderer.setAnimationLoop( animate );
  window.addEventListener('resize', handleResize);

  const axes = new THREE.AxesHelper(25);
  // axes.setColors("red", "blue", "black")
  sceneContext.scene.add(axes);

  // await sceneContext.loadEnvironmentMap('/illovo_beach_balcony_1k.hdr');

  sceneContext.buildTree();
})

function resetCamera() {
  camera.position.set(...startingCameraPosition);
  controls.target.set(...startingCameraTarget);
  controls.update();
}

function sizeInfo(el: HTMLElement) {
  const pixelRatio = window.devicePixelRatio || 1;

  const width = el.clientWidth * pixelRatio;
  const height = el.clientHeight * pixelRatio;

  return { width, height };
}

function handleResize() {
  if (!threeViewRef.value) return

  const { width, height } = sizeInfo(threeViewRef.value);

  camera.aspect = width / height;

  renderer.setSize(width, height, false);
  camera.updateProjectionMatrix();
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)

  controls?.dispose();
  renderer?.dispose();

  sceneContext.dispose();

  if (renderer.domElement.parentElement) {
    renderer.domElement.parentElement.removeChild(renderer.domElement);
  }
})

</script>

<template>
<div class="three-view" ref="threeViewRef">
  <DisplayCoordinates :position="cameraInfo" />
  <button class="absolute top-2 left-2 py-0.5 px-1 border rounded text-sm cursor-pointer" @click="resetCamera">
    center
  </button>
</div>
</template>

<style>
.three-view {
  width: 100%;
  height: 100vh;

  background: linear-gradient(to top, white, rgb(144, 192, 255));

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>