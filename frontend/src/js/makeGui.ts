import type * as THREE from "three";
import type { GUI } from 'lil-gui';
import type { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

export function makeAmbientGui(gui: GUI, ambientLight: THREE.AmbientLight) {
  gui.add(ambientLight, 'intensity', 0, 5, 0.01);
}

export function makeHemisphereGui(gui: GUI, hemisphereLight: THREE.HemisphereLight) {
  gui.addColor(hemisphereLight, 'color').name('skyColor');
  gui.addColor(hemisphereLight, 'groundColor').name('groundColor');
  gui.add(hemisphereLight, 'intensity', 0, 5, 0.01);
}

export function makeDirectionalGui(
  gui: GUI,
  directionalLight: THREE.DirectionalLight,
  helper: THREE.DirectionalLightHelper
) {
  const MAX = 20;

  gui.add(directionalLight, 'intensity', 0, 5, 0.01);

  const updatePos = () => {
    helper.update();
  };

  const updateTarget = () => {
    directionalLight.target.updateMatrixWorld(); // possibly moot because of render loop elsewhere
    helper.update();
  };

  const posFolder = gui.addFolder('position');

  posFolder.add(directionalLight.position, 'x', -MAX, MAX).onChange(updatePos);
  posFolder.add(directionalLight.position, 'y', -MAX, MAX).onChange(updatePos);
  posFolder.add(directionalLight.position, 'z', 0, MAX).onChange(updatePos);

  const targetFolder = gui.addFolder('target');

  targetFolder.add(directionalLight.target.position, 'x', -MAX, MAX).onChange(updateTarget);
  targetFolder.add(directionalLight.target.position, 'y', -MAX, MAX).onChange(updateTarget);
  targetFolder.add(directionalLight.target.position, 'z', 0, MAX).onChange(updateTarget);

  const helperFolder = gui.addFolder('helper');
  helperFolder.add(helper, 'visible').onChange(() => helper.update());
}

export function makePointGui(
  gui: GUI,
  pointLight: THREE.PointLight,
  helper: THREE.PointLightHelper
) {
  const MAX = 20;

  gui.addColor(pointLight, 'color').name('color');
  gui.add(pointLight, 'intensity', 0, 250, 1);
  gui.add(pointLight, 'distance', 0, 40);

  const updatePos = () => {
    helper.update();
  };

  const posFolder = gui.addFolder('position');

  posFolder.add(pointLight.position, 'x', -MAX, MAX).onChange(updatePos);
  posFolder.add(pointLight.position, 'y', -MAX, MAX).onChange(updatePos);
  posFolder.add(pointLight.position, 'z', 0, MAX).onChange(updatePos);

  const helperFolder = gui.addFolder('helper');
  helperFolder.add(helper, 'visible').onChange(() => helper.update());
}

export function makeSpotGui(
  gui: GUI,
  spotLight: THREE.SpotLight,
  helper: THREE.SpotLightHelper
) {
  const MAX = 20;

  gui.addColor(spotLight, 'color').name('color');
  gui.add(spotLight, 'intensity', 0, 1000, 1);
  gui.add(spotLight, 'penumbra', 0, 1, 0.01).onChange(() => helper.update());
  gui.add(spotLight, 'distance', 0, 40).onChange(() => helper.update());

  const updatePos = () => {
    helper.update();
  };

  const updateTarget = () => {
    spotLight.target.updateMatrixWorld();
    helper.update();
  };

  gui.add(spotLight, 'angle', 0, Math.PI / 2).name('angle').onChange(updatePos);

  const posFolder = gui.addFolder('position');

  posFolder.add(spotLight.position, 'x', -MAX, MAX).onChange(updatePos);
  posFolder.add(spotLight.position, 'y', -MAX, MAX).onChange(updatePos);
  posFolder.add(spotLight.position, 'z', 0, MAX).onChange(updatePos);

  const targetFolder = gui.addFolder('target');

  targetFolder.add(spotLight.target.position, 'x', -MAX, MAX).onChange(updateTarget);
  targetFolder.add(spotLight.target.position, 'y', -MAX, MAX).onChange(updateTarget);
  targetFolder.add(spotLight.target.position, 'z', 0, MAX).onChange(updateTarget);

  const helperFolder = gui.addFolder('helper');
  helperFolder.add(helper, 'visible').onChange(() => helper.update());
}

export function makeRectAreaGui(
  gui: GUI,
  rectAreaLight: THREE.RectAreaLight,
  helper: RectAreaLightHelper
) {
  const MAX = 20;

  gui.addColor(rectAreaLight, 'color').name('color');
  gui.add(rectAreaLight, 'intensity', 0, 500, 1);
  gui.add(rectAreaLight, 'width', 0, 20);
  gui.add(rectAreaLight, 'height', 0, 20);

  const rotFolder = gui.addFolder('rotation');

  rotFolder.add(rectAreaLight.rotation, 'x', -Math.PI, Math.PI).name('x rotation');
  rotFolder.add(rectAreaLight.rotation, 'y', -Math.PI, Math.PI).name('y rotation');
  rotFolder.add(rectAreaLight.rotation, 'z', -Math.PI, Math.PI).name('z rotation');

  const posFolder = gui.addFolder('position');

  posFolder.add(rectAreaLight.position, 'x', -MAX, MAX);
  posFolder.add(rectAreaLight.position, 'y', -MAX, MAX);
  posFolder.add(rectAreaLight.position, 'z', 0, MAX);

  const helperFolder = gui.addFolder('helper');
  helperFolder.add(helper, 'visible');
}