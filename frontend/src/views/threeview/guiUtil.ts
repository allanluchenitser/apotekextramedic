import GUI from 'lil-gui';
import type * as THREE from 'three';

type PCameraGuiOptions = {
  cam: THREE.PerspectiveCamera,
  container: HTMLDivElement,
  className?: string,
  title?: string,
}

type OCameraGuiOptions = {
  cam: THREE.OrthographicCamera,
  container: HTMLDivElement,
  className?: string,
  title?: string,
}

export function pCameraGui({
  cam,
  container,
  className = 'top-left',
  title,
}: PCameraGuiOptions) {
  const gui = new GUI({
    title: title ?? `Cam`,
    container,
  });

  gui.domElement.classList.add(className);

  gui.add(cam, 'fov', 1, 180).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'near', 0.1, 500, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'far', 0.1, 500, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'aspect', 0.1, 5, 0.01).onChange(() => cam.updateProjectionMatrix());

  return gui;
}

export function oCameraGui({
  cam,
  container,
  className = 'top-left',
  title,
}: OCameraGuiOptions) {
  const gui = new GUI({
    title: title ?? `Ortho Cam`,
    container,
  });

  gui.domElement.classList.add(className);

  gui.add(cam, 'left', -500, 500, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'right', -500, 500, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'top', -500, 500, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'bottom', -500, 500, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'near', 0.1, 500, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'far', 0.1, 500, 1).onChange(() => cam.updateProjectionMatrix());

  return gui;
}
