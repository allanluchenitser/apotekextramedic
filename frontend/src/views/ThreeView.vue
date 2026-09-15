<script setup lang="ts">
import { ref, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const threeView = ref<HTMLDivElement| null>(null)

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let animationId: number

onMounted(() => {
  if (!threeView.value) return

  const width = threeView.value.clientWidth
  const height = threeView.value.clientHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })

  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  threeView.value.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0x3a1af1 } );

  const cube = new THREE.Mesh( geometry, material );

  scene.add( cube );

  camera.position.z = 5;

  controls = new OrbitControls( camera, renderer.domElement );
  const loader = new GLTFLoader();

  function animate( time: number ) {
    cube.rotation.x = time / 2000
    cube.rotation.y = time / 1000

    controls.update()
    renderer.render(scene, camera)
  }

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
<div class="three-view" ref="threeView"></div>
</template>

<style>
.three-view {
  width: 100%;
  height: 100vh;

  background: linear-gradient(to top, white, rgb(144, 192, 255));
}
</style>