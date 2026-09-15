<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

import * as THREE from 'three';
import type { RotationDegrees } from '@/js/localTypes';

import apotekGlbUrl from '@/assets/glb/apotek_tres.glb?url'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import DisplayCoordinates from '@/components/DisplayCoordinates.vue';

const displayPosition = ref<{ position: THREE.Vector3, rotation: RotationDegrees }>({
  position: new THREE.Vector3(0, 0, 0),
  rotation: { x: 0, y: 0, z: 0 }
})

const threeView = ref<HTMLDivElement | null>(null)

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: OrbitControls

onMounted(() => {
  if (!threeView.value) return

  // ------ SETUP

  const width = threeView.value.clientWidth
  const height = threeView.value.clientHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)

  camera.position.set(2, 2, 10);

  renderer = new THREE.WebGLRenderer({
    // antialias: true,
    alpha: true
  })

  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  threeView.value.appendChild(renderer.domElement);

  // ------ OBJECTS

  // const geometry = new THREE.BoxGeometry( 1, 1, 1 );

  // const material = new THREE.MeshBasicMaterial({
  //   color: 0x3a1af1
  // });

  // const material = new THREE.MeshStandardMaterial({
  //   color: 0x3a1af1
  // });

  // const cube = new THREE.Mesh( geometry, material );

  const loader = new GLTFLoader();
  loader.load(apotekGlbUrl, (gltf) => {
    scene.add(gltf.scene);
  });

  // scene.add( cube );

  // ------ ANIMATION, CONTROLS

  controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set(0, 0, 0);
  controls.update();
  // const loader = new GLTFLoader();

  function animate() {
    // cube.rotation.x = time / 4000
    // cube.rotation.y = time / 2000

    controls.update();
    renderer.render(scene, camera);

    const pos = camera.position.clone();

    const rot: RotationDegrees = {
      x: THREE.MathUtils.radToDeg(camera.rotation.x),
      y: THREE.MathUtils.radToDeg(camera.rotation.y),
      z: THREE.MathUtils.radToDeg(camera.rotation.z)
    };

    displayPosition.value = {
      position: pos,
      rotation: rot
    };
  };

  renderer.setAnimationLoop( animate );
  window.addEventListener('resize', handleResize);
})

function handleResize() {
  if (!threeView.value) return

  const width = threeView.value.clientWidth
  const height = threeView.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)

  controls?.dispose();
  renderer?.dispose();

  if (renderer.domElement.parentElement) {
    renderer.domElement.parentElement.removeChild(renderer.domElement);
  }
})

</script>

<template>
<div class="three-view" ref="threeView">
  <DisplayCoordinates :position="displayPosition" />
</div>
</template>

<style>
.three-view {
  width: 100%;
  height: 100vh;

  background: linear-gradient(to top, white, rgb(144, 192, 255));
}
</style>