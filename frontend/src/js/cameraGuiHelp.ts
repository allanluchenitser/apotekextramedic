import GUI from 'lil-gui';
import * as THREE from 'three';

type PCameraGuiOptions = {
  container: HTMLDivElement,
  className?: string,
  title?: string,
}

export function pCameraGui(cam: THREE.PerspectiveCamera, {
  container,
  className = 'top-left',
  title = 'Perspective Camera'
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

type OCameraGuiOptions = {
  cam: THREE.OrthographicCamera,
  container: HTMLDivElement,
  className?: string,
  title?: string,
  scale?: number,
}

export function oCameraGui({
  cam,
  container,
  className = 'top-left',
  title,
  scale = 10,
}: OCameraGuiOptions) {
  const gui = new GUI({
    title: title ?? `Ortho Cam`,
    container,
  });

  gui.domElement.classList.add(className);

  gui.add(cam, 'left', -scale, scale, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'right', -scale, scale, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'top', -scale, scale, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'bottom', -scale, scale, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'near', 0.1, 500, 1).onChange(() => cam.updateProjectionMatrix());
  gui.add(cam, 'far', 0.1, 500, 1).onChange(() => cam.updateProjectionMatrix());

  return gui;
}

type SCamGuiOptions = {
  container: HTMLElement;
  className: string;
  scale: number;
  helper?: THREE.CameraHelper;
  title?: string;
};

export const sCamGui = (
  light: THREE.DirectionalLight | THREE.PointLight | THREE.SpotLight,
  {
    container,
    className,
    scale,
    helper,
    title = 'Shadow Camera'
  }: SCamGuiOptions ) =>
{
  const gui = new GUI({ container, title });
  gui.domElement.classList.add(className);

  // Example GUI controls for the orthographic camera
  gui.addColor(light, 'color').name('Light Color');

  const updateCam = (shadowCam: THREE.PerspectiveCamera | THREE.OrthographicCamera) => {
    shadowCam.updateProjectionMatrix();
    if (helper) {
      helper.update();
    }
  };

  if (light instanceof THREE.DirectionalLight) {
    const shadowCam = light.shadow.camera as THREE.OrthographicCamera;

    gui.add(shadowCam, 'left', -scale, scale).name('Shadow Left').onChange(() => updateCam(shadowCam))
    gui.add(shadowCam, 'right', -scale, scale).name('Shadow Right').onChange(() => updateCam(shadowCam))
    gui.add(shadowCam, 'top', -scale, scale).name('Shadow Top').onChange(() => updateCam(shadowCam))
    gui.add(shadowCam, 'bottom', -scale, scale).name('Shadow Bottom').onChange(() => updateCam(shadowCam))
    gui.add(shadowCam, 'near', -scale, scale).name('Shadow Near').onChange(() => updateCam(shadowCam))
    gui.add(shadowCam, 'far', -scale, scale).name('Shadow Far').onChange(() => updateCam(shadowCam))
    gui.add(shadowCam, 'zoom', 0.01, 1.5, 0.01).onChange(() => updateCam(shadowCam));
  }

  else if (light instanceof THREE.PointLight) {
    // Add GUI controls specific to PointLight shadow camera if needed
  }

  else if (light instanceof THREE.SpotLight) {
    // Add GUI controls specific to SpotLight shadow camera if needed
  }

  return gui;
};