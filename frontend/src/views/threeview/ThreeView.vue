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

const cameraInfo = ref<{ position: THREE.Vector3, rotation: RotationDegrees }>({
  position: new THREE.Vector3(0, 0, 0),
  rotation: { x: 0, y: 0, z: 0 }
})

const threeViewRef = ref<HTMLDivElement | null>(null)

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let hdrLoader: HDRLoader

const startingCameraPosition: [number, number, number] = [0, 2, 5] as const;
const startingCameraTarget: [number, number, number] = [0, 0, 0] as const;

onMounted(async () => {
  if (!threeViewRef.value) return

  // ------ SETUP
  const { width, height } = sizeInfo(threeViewRef.value);

  scene = new THREE.Scene()
  // scene.fog = new THREE.Fog('#ffffff', 1, 100);

  camera = new THREE.PerspectiveCamera(50, width / height, 1, 100)

  // target is set by OrbitControls, not here
  camera.position.set(...startingCameraPosition);

  renderer = new THREE.WebGLRenderer({
    // antialias: true,
    alpha: true
  })

  renderer.setSize(width, height, false)
  // renderer.setPixelRatio(window.devicePixelRatio)

  threeViewRef.value.appendChild(renderer.domElement);

  // ------ MATERIAL

  const testColor = "#ffffff";

  // const basicMaterial = new THREE.MeshBasicMaterial({
  //   color: testColor
  // });

  const lambertMaterial = new THREE.MeshLambertMaterial({
    color: testColor
  });

  const phongMaterial = new THREE.MeshPhongMaterial({
    color: testColor,
    // specular: 0xff0000, // color not quantity
    shininess: 50,
  });

  const standardMaterial = new THREE.MeshStandardMaterial({
    color: testColor,
    roughness: 0,
    metalness: 1,
  });

  const standardMaterial2 = new THREE.MeshStandardMaterial({
    color: testColor,
    roughness: 0,
    metalness: 0,
  });

  const boxMaterial = new THREE.MeshStandardMaterial({
    color: "yellow",
  });

  // ------ GEOMETRY

  const geometry = new THREE.SphereGeometry( 0.5, 16, 16 );
  const geometry_cube = new THREE.BoxGeometry( 1, 1, 1 );

  // ------ MESH
  const lambertMesh = new THREE.Mesh( geometry, lambertMaterial );
  const phongMesh = new THREE.Mesh( geometry, phongMaterial );
  const standardMesh = new THREE.Mesh( geometry, standardMaterial );
  const standardMesh2 = new THREE.Mesh( geometry, standardMaterial2 );

  const specialMesh = new THREE.Mesh( geometry_cube, boxMaterial );

  lambertMesh.position.set(-2.25, 0, 0);
  phongMesh.position.set(-0.75, 0, 0);
  standardMesh.position.set(0.75, 0, 0);
  standardMesh2.position.set(2.25, 0, 0);

  specialMesh.position.set(0, 2, -4);

  // ------ LIGHT SOURCE

  // const ambientLight = new THREE.AmbientLight(0xffffff, 1);

  // const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
  // directionalLight.position.set(1, 3, 2.25);

  // const pointLight = new THREE.PointLight(0xffffff, 1);
  // pointLight.position.set(5, 5, 5);

  // const spotLight = new THREE.SpotLight(0xffffff, 1);
  // spotLight.position.set(5, 10, 5);

  // const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  // hemisphereLight.position.set(0, 20, 0);

  // const light
    // = ambientLight;
    // = directionalLight;
    // = pointLight;
    // = hemisphereLight;
    // = spotLight;

  // const lightHelper
  //   = new THREE.DirectionalLightHelper(light);
    // = new THREE.PointLightHelper(light);
    // = new THREE.SpotLightHelper(light);
    // = new THREE.HemisphereLightHelper(light);

  scene.add(
    lambertMesh,
    phongMesh,
    standardMesh,
    standardMesh2,

    specialMesh,

    // light,
    // ambientLight,
  );

  // if (lightHelper) scene.add(lightHelper);

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
    // cube.rotation.x = time / 4000
    // cube.rotation.y = time / 2000

    // controls.update();
    renderer.render(scene, camera);

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
  // const envMap = await hdrLoader.loadAsync('/illovo_beach_balcony_1k.hdr');
  const envMap = await hdrLoader.loadAsync('/illovo_beach_balcony_1k.hdr');
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envMap;
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

  disposeThreeObjects(scene);

  if (renderer.domElement.parentElement) {
    renderer.domElement.parentElement.removeChild(renderer.domElement);
  }
})

</script>

<template>
<div class="three-view" ref="threeViewRef">
  <DisplayCoordinates :position="cameraInfo" />
  <button class="absolute top-2 left-2" @click="resetCamera">Reset Camera</button>
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