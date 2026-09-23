import * as THREE from "three";
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

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
  light.target.position.set(0, 0, 0);

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

  if (helper) {
    return [light, new THREE.PointLightHelper(light)];
  }

  return light;
}

export function makeSpot(helper: true): [THREE.SpotLight, THREE.SpotLightHelper];
export function makeSpot(helper: false): THREE.SpotLight;
export function makeSpot(helper: boolean = false):
  THREE.SpotLight | [THREE.SpotLight, THREE.SpotLightHelper]
{
  const color = 0xFFFFFF;
  const intensity = 50;
  const light = new THREE.SpotLight(color, intensity);
  light.position.set(0, 10, 0);
  light.target.position.set(-5, 0, 0);

  if (helper) {
    return [light, new THREE.SpotLightHelper(light)];
  }

  return light;
}

export function makeRectArea(helper: true): [THREE.RectAreaLight, RectAreaLightHelper];
export function makeRectArea(helper: false): THREE.RectAreaLight;
export function makeRectArea(helper: boolean = false):
  THREE.RectAreaLight | [THREE.RectAreaLight, RectAreaLightHelper]
{
  const color = 0xFFFFFF;
  const intensity = 50;
  const width = 12;
  const height = 4;
  const light = new THREE.RectAreaLight(color, intensity, width, height);
  light.position.set(0, 10, 0);
  light.rotation.x = Math.PI / 2;

  if (helper) {
    return [light, new RectAreaLightHelper(light)];
  }

  return light;
}
