<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

import type GUI from 'lil-gui';

import { pCameraGui, oCameraGui } from './guiUtil';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import apotekGlbUrl from '@/assets/glb/apotek_tres.glb?url'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import DisplayCoordinates from '@/components/DisplayCoordinates.vue';

import type { RotationDegrees } from '@/js/localTypes';

// import sunExercise from './sunexercise/sunExercise';
// import spheresExercise from './spheresexercise/spheresExercise';
// import cubesExercise from './cubesexercise/cubesExercise';
// import textureExercise from './textureexercise/textureExercise';
import lightsExercise from './lightexercise/lightsExercise';

import { ThreeSceneContext } from './threeContextUtils';

// const cameraInfo = ref<{ position: THREE.Vector3, rotation: RotationDegrees }>({
//   position: new THREE.Vector3(0, 0, 0),
//   rotation: { x: 0, y: 0, z: 0 }
// })

const threeViewRef = ref<HTMLDivElement | null>(null)

// const leftViewRef = ref<HTMLDivElement | null>(null);
// const rightViewRef = ref<HTMLDivElement | null>(null);

let renderer: THREE.WebGLRenderer
let sceneContext: ThreeSceneContext

let PCam: THREE.PerspectiveCamera
// let PCam2: THREE.PerspectiveCamera
// let OCam: THREE.OrthographicCamera

let controls: OrbitControls

const PCamStartPos: [number, number, number] = [5, 10, 40] as const;
const PCamStartTarget: [number, number, number] = [0, 0, 0] as const;

// const PCam2StartPos: [number, number, number] = [0, 20, 40] as const;
// const PCam2StartTarget: [number, number, number] = [0, 0, 0] as const;

// const OCamStartPos: [number, number, number] = [5, 10, 40] as const;
// const OCamStartTarget: [number, number, number] = [0, 0, 0] as const;

let cam1gui: GUI | null = null;
// let cam2gui: GUI | null = null;
// let ocamgui: GUI | null = null;

onMounted(async () => {
  if (!threeViewRef.value) return

  // ------ SETUP
  const { width, height } = sizeInfo(threeViewRef.value);

  PCam = new THREE.PerspectiveCamera(25, width / height, 1, 500)
  // OCam = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 500)

  // PCam2 = new THREE.PerspectiveCamera(25, width / 2 / height, 1, 500)

  // camer.lookAt replaced by controls below
  PCam.position.set(...PCamStartPos);
  // PCam2.position.set(...PCam2StartPos);
  // OCam.position.set(...OCamStartPos);

  // PCam.up.set(0, 0, 1);

  cam1gui = pCameraGui({ cam: PCam, container: threeViewRef.value!, className: 'top-left' });
  // cam2gui = pCameraGui({ cam: PCam2, container: rightViewRef.value!, className: 'top-left' });
  // ocamgui = oCameraGui({ cam: OCam, container: threeViewRef.value!, className: 'top-left' });

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })

  RectAreaLightUniformsLib.init();

  renderer.setSize(width, height, false);
  threeViewRef.value.appendChild(renderer.domElement);

  // ------ SCENE

  sceneContext = new ThreeSceneContext();

  // spheresExercise.setup(sceneContext);
  // cubesExercise.setup(sceneContext);
  // sunExercise.setup(sceneContext);
  // textureExercise.setup(sceneContext);
  lightsExercise.setup(sceneContext);
  // sceneContext.scene.fog = new THREE.Fog('#ffffff', 1, 100);

  // ------ EXTERNAL MESH

  // const loader = new GLTFLoader();
  // loader.load(apotekGlbUrl, (gltf) => {
  //   scene.add(gltf.scene);
  // });

  // ------ ANIMATION, CONTROLS

  controls = new OrbitControls( PCam, renderer.domElement );
  controls.target.set(...PCamStartTarget);
  controls.update();

  // const controls2 = new OrbitControls( PCam2, rightViewRef.value! );
  // controls2.target.set(...PCam2StartTarget);
  // controls2.update();

  function animate(time: number) {
    if (!threeViewRef.value) return
    // ------ timers

    const seconds = time * 0.0003;
    void seconds;

    // ------ track PCam for data readout

    // const pos = PCam.position.clone();

    // const rot: RotationDegrees = {
    //   x: THREE.MathUtils.radToDeg(PCam.rotation.x),
    //   y: THREE.MathUtils.radToDeg(PCam.rotation.y),
    //   z: THREE.MathUtils.radToDeg(PCam.rotation.z)
    // };

    // cameraInfo.value = {
    //   position: pos,
    //   rotation: rot
    // };

    // ------ animation

    // sceneContext.objects.forEach(obj => {
    //   obj.rotation.y = seconds;
    // });

    // ------ render scene
    // const { width: fullWidth, height: fullHeight } = sizeInfo(threeViewRef.value);

    // renderer.setViewport(
    //   0,
    //   0,
    //   fullWidth / 2,
    //   fullHeight
    // );

    // renderer.setScissor(0, 0, fullWidth / 2, fullHeight);
    // renderer.setScissorTest(true);

    renderer.render(sceneContext.scene, PCam);

    // renderer.setViewport(
    //   fullWidth / 2,
    //   0,
    //   fullWidth / 2,
    //   fullHeight
    // );
    // renderer.setScissor(fullWidth / 2, 0, fullWidth / 2, fullHeight);
    // renderer.setScissorTest(true);
    // renderer.render(sceneContext.scene, PCam2);
  };

  // ------ start animation loop

  renderer.setAnimationLoop( animate );

  // ------ add any additional setup after starting the animation loop

  window.addEventListener('resize', () => handleResize(PCam));

  const axes = new THREE.AxesHelper(25);
  sceneContext.scene.add(axes); // x: red, y: green, z: blue

  // const camera1helper = new THREE.CameraHelper(PCam);
  // sceneContext.scene.add(camera1helper);

  // const PCam2helper = new THREE.CameraHelper(PCam2);
  // sceneContext.scene.add(PCam2helper);

  // await sceneContext.loadEnvironmentMap('/illovo_beach_balcony_1k.hdr', true);

  sceneContext.buildTree('___Scene Hierarchy___');
})

// function resetCamera() {
//   PCam.position.set(...PCamStartPos);
//   controls.target.set(...PCamStartTarget);
//   controls.update();
// }

function sizeInfo(el: HTMLElement) {
  const pixelRatio = window.devicePixelRatio || 1;

  const width = el.clientWidth * pixelRatio;
  const height = el.clientHeight * pixelRatio;

  return { width, height };
}

function handleResize(cam: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
  if (!threeViewRef.value) return

  const { width, height } = sizeInfo(threeViewRef.value);

  if (cam instanceof THREE.PerspectiveCamera) cam.aspect = width / height;

  renderer.setSize(width, height, false);

  cam.updateProjectionMatrix();
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => handleResize(PCam))

  controls?.dispose();
  renderer?.dispose();
  sceneContext.gui?.destroy();

  cam1gui?.destroy();
  // cam2gui?.destroy();
  // ocamgui?.destroy();

  sceneContext.dispose();

  if (renderer.domElement.parentElement) {
    renderer.domElement.parentElement.removeChild(renderer.domElement);
  }
})

</script>

<template>
<div class="three-view" ref="threeViewRef">
  <!-- <DisplayCoordinates :position="cameraInfo" /> -->
  <!-- <button class="absolute top-2 left-2 py-0.5 px-1 border rounded text-sm cursor-pointer" @click="resetCamera">
    center
  </button> -->
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

  .lil-gui {
    position: absolute;

    &.top-left {
      top: 0;
      left: 0;
    }

    &.bottom-left {
      bottom: 0;
      left: 0;
    }
  }
}
</style>