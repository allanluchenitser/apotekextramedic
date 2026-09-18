<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import apotekGlbUrl from '@/assets/glb/apotek_tres.glb?url'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import DisplayCoordinates from '@/components/DisplayCoordinates.vue';

import type { RotationDegrees } from '@/js/localTypes';

import { disposeThreeObjects } from '@/js/util';

import spheresExercise from './spheresExercise';
import cubesExercise from './cubesExercise';

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
let hdrLoader: HDRLoader

const startingCameraPosition: [number, number, number] = [0, 2, 5] as const;
const startingCameraTarget: [number, number, number] = [0, 0, 0] as const;

onMounted(async () => {
  if (!threeViewRef.value) return

  // ------ SETUP
  const { width, height } = sizeInfo(threeViewRef.value);

  camera = new THREE.PerspectiveCamera(50, width / height, 1, 100)

  // note: not using "lookAt" here because its handled by OrbitControls below
  camera.position.set(...startingCameraPosition);

  renderer = new THREE.WebGLRenderer({
    // antialias: true,
    alpha: true
  })

  renderer.setSize(width, height, false)

  threeViewRef.value.appendChild(renderer.domElement);

  // ------ SCENE

  sceneContext = new ThreeSceneContext();
  // spheresExercise.setup(sceneContext);
  cubesExercise.setup(sceneContext);

  sceneContext.scene.fog = new THREE.Fog('#ffffff', 1, 100);

  // ------ EXTERNAL MESH

  // const loader = new GLTFLoader();
  // loader.load(apotekGlbUrl, (gltf) => {
  //   scene.add(gltf.scene);
  // });

  // ------ ANIMATION, CONTROLS

  controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set(...startingCameraTarget);
  controls.update();
  // const loader = new GLTFLoader();

  function animate() {
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
  };

  renderer.setAnimationLoop( animate );
  window.addEventListener('resize', handleResize);

  hdrLoader = new HDRLoader();
  const envMap = await hdrLoader.loadAsync('/illovo_beach_balcony_1k.hdr');
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  sceneContext.scene.environment = envMap;
  // scene.background = envMap;
})

function resetCamera() {
  camera.position.set(...startingCameraPosition);
  // camera.lookAt(...startingCameraTarget); // redundant, or worse
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