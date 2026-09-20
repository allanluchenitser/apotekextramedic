import type * as THREE from "three";
import type { GUI } from 'lil-gui';

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
    // directionalLight.updateMatrixWorld();
    helper.update();
  };

  const updateTarget = () => {
    directionalLight.target.updateMatrixWorld();
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
    pointLight.updateMatrixWorld();
    helper.update();
  };

  const posFolder = gui.addFolder('position');

  posFolder.add(pointLight.position, 'x', -MAX, MAX).onChange(updatePos);
  posFolder.add(pointLight.position, 'y', -MAX, MAX).onChange(updatePos);
  posFolder.add(pointLight.position, 'z', 0, MAX).onChange(updatePos);

  const helperFolder = gui.addFolder('helper');
  helperFolder.add(helper, 'visible').onChange(() => helper.update());
}