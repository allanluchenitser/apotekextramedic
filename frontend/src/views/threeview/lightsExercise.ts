import * as THREE from "three";
import type { ThreeSceneContext } from "./threeContextUtils";
import { GUI } from 'lil-gui';

function buildPlaneMesh() {
  const planeSize = 40;
  const loader = new THREE.TextureLoader();
  const texture = loader.load('/tinychecker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  const repeats = planeSize / 4;
  texture.repeat.set(repeats, repeats);

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide })
  const mesh = new THREE.Mesh(planeGeo, planeMat);

  mesh.rotation.x = Math.PI * -.5;

  return mesh;
}

function buildCubeMesh() {
  const cubeSize = 4;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);

  mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
  mesh.rotation.x = Math.PI * -.5;

  return mesh;
}

function buildSphereMesh() {
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);

  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  mesh.rotation.x = Math.PI * -.5;

  return mesh;
}

function buildAmbientLight() {
  const color = 0xFFFFFF;
  const intensity = 5;
  const light = new THREE.AmbientLight(color, intensity);
  return light;
}

function buildHemisphereLight() {
  const light = new THREE.HemisphereLight("#b1e1ff", "#B97A20", 1);
  return light;
}

export default {
  setup(ctx: ThreeSceneContext) {

    const gui = new GUI();

    const planeMesh = buildPlaneMesh();
    const cubeMesh = buildCubeMesh();
    const sphereMesh = buildSphereMesh();

    ctx.scene
      .add(planeMesh)
      .add(cubeMesh)
      .add(sphereMesh)

    const ambientLight = buildAmbientLight();
    const hemisphereLight = buildHemisphereLight();

    ctx.scene
      // .add(ambientLight)
      .add(hemisphereLight);

    // gui.addColor(ambientLight, 'color').name('color');
    gui.addColor(hemisphereLight, 'color').name('skyColor');
    gui.addColor(hemisphereLight, 'groundColor').name('groundColor');
    gui.add(hemisphereLight, 'intensity', 0, 5, 0.01)

  }
}