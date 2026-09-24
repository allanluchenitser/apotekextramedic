<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

import { oCameraGui, sCamGui } from '@/js/cameraGuiHelp';

import { makeDirectionalGui } from '@/js/lightGuiHelp';

const orthoViewRef = ref<HTMLDivElement | null>(null);

let ocamgui: GUI | null = null;
let scamgui: GUI | null = null;
let directionalGui: GUI | null = null;

const ORTHO_SCALE = 20;

const camStartPos: [number, number, number] = [0, 0, 10];
const camStartTarget: [number, number, number] = [0, 0, 0];

onMounted(() => {
  if (!orthoViewRef.value) return;

  directionalGui = new GUI({
    container: orthoViewRef.value!,
    title: 'Directional Light',
  });

  const { width, height } = sizeInfo(orthoViewRef.value);
  const aspect = width / height;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -ORTHO_SCALE * aspect,
    ORTHO_SCALE * aspect,
    ORTHO_SCALE,
    -ORTHO_SCALE,
    0.1,
    500
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height, false);
  renderer.shadowMap.enabled = true;

  orthoViewRef.value.appendChild(renderer.domElement);

  camera.position.set(...camStartPos);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);

  const buildingColors = [0x4f46e5, 0x0891b2, 0x16a34a, 0xea580c, 0xdc2626];
  const buildingPositions: [number, number][] = [
    [-4, -3], [-1, -3], [2, -3], [4, -1],
    [-4, 0], [-1, 0], [2, 0], [4, 3],
    [-2, 3], [1, 4],
  ];

  buildingPositions.forEach(([x, z], index) => {
    const height = 2 + ((index * 3) % 9);
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, height, 1.5),
      new THREE.MeshPhongMaterial({
        color: buildingColors[index % buildingColors.length],
      })
    );
    building.castShadow = true;

    // Center each building at half its height so its base rests at y = 0.
    building.position.set(x, height / 2, z);
    scene.add(building);
  });

  scene.add(new THREE.AmbientLight(0xffffff, 1.5));

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 10, 7);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const directionalHelper = new THREE.DirectionalLightHelper(directionalLight);
  scene.add(directionalHelper);

  const planeMesh = new THREE.PlaneGeometry(20, 20);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false });
  const plane = new THREE.Mesh(planeMesh, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -2;
  plane.receiveShadow = true;
  scene.add(plane);

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set(...camStartTarget);
  controls.update();

  const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  scene.add(shadowCameraHelper);

  ocamgui = oCameraGui({
    cam: camera,
    container: orthoViewRef.value!,
    className: 'top-left',
    scale: ORTHO_SCALE,
  });

  scamgui = sCamGui(directionalLight, {
    container: orthoViewRef.value!,
    className: 'bottom-left',
    scale: ORTHO_SCALE,
    helper: shadowCameraHelper,
    title: 'Directional Light Shadow Camera',
  });

  makeDirectionalGui(
    directionalGui,
    directionalLight,
    directionalHelper,
    'top-right'
  );

  function sizeInfo(el: HTMLElement) {
    const pixelRatio = window.devicePixelRatio || 1;

    const width = el.clientWidth * pixelRatio;
    const height = el.clientHeight * pixelRatio;

    return { width, height };
  }

  function handleResize(cam: THREE.OrthographicCamera) {
    if (!orthoViewRef.value) return

    const { width, height } = sizeInfo(orthoViewRef.value);

    const aspect = width / height;

    cam.left = -ORTHO_SCALE * aspect;
    cam.right = ORTHO_SCALE * aspect;
    cam.top = ORTHO_SCALE;
    cam.bottom = -ORTHO_SCALE;

    renderer.setSize(width, height, false);

    cam.updateProjectionMatrix();
  }

  const animate = function () {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  };

  // RUN
  animate();
  window.addEventListener('resize', () => handleResize(camera));
});

onBeforeUnmount(() => {
  if (orthoViewRef.value) {
    ocamgui?.destroy();
    scamgui?.destroy();
    directionalGui?.destroy();
  }
});
</script>

<template>
<div class="ortho-view" ref="orthoViewRef">
  <!-- <DisplayCoordinates :position="cameraInfo" /> -->
  <!-- <button class="absolute top-2 left-2 py-0.5 px-1 border rounded text-sm cursor-pointer" @click="resetCamera">
    center
  </button> -->
</div>
</template>

<style>
.ortho-view {
  width: 100%;
  height: 100vh;

  background: linear-gradient(to top, white, rgb(144, 192, 255));
  position: relative;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  .lil-root {
    position: absolute;

    &.top-left {
      top: 0;
      left: 0;
    }

    &.bottom-left {
      bottom: 0;
      left: 0;
    }

    &.bottom-right {
      bottom: 0;
      right: 0;
    }

    &.top-right {
      top: 0;
      right: 0;
    }
  }
}
</style>