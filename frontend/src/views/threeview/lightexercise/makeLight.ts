import * as THREE from "three";

export function makeAmbient() {
  const color = 0xFFFFFF;
  const intensity = 5;
  const light = new THREE.AmbientLight(color, intensity);
  return light;
}

export function makeHemisphere() {
  const light = new THREE.HemisphereLight("#b1e1ff", "#B97A20", 1);
  return light;
}

export function makeDirectional(helper: true): [THREE.DirectionalLight, THREE.DirectionalLightHelper];
export function makeDirectional(helper: false): THREE.DirectionalLight;
export function makeDirectional(helper: boolean = false):
  THREE.DirectionalLight | [THREE.DirectionalLight, THREE.DirectionalLightHelper]
{
  const color = 0xFFFFFF;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 10, 0);
  light.target.position.set(-5, 0, 0);

  if (helper) {
    return [light, new THREE.DirectionalLightHelper(light)];
  }

  return light;
}

export function makePoint(helper: true): [THREE.PointLight, THREE.PointLightHelper];
export function makePoint(helper: false): THREE.PointLight;
export function makePoint(helper: boolean = false):
  THREE.PointLight | [THREE.PointLight, THREE.PointLightHelper]
{
  const color = 0xFFFFFF;
  const intensity = 150;
  const light = new THREE.PointLight(color, intensity);
  light.position.set(0, 10, 0);

  if (helper) {
    return [light, new THREE.PointLightHelper(light)];
  }

  return light;
}