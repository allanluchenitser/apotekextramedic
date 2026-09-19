import * as THREE from 'three';
import type { ThreeSceneContext } from "./threeContextUtils";
import { objectScale } from 'three/tsl';

export default {
  setup(ctx: ThreeSceneContext) {
    // ------ create solar system

    const solarSystem = new THREE.Object3D();
    ctx.scene.add(solarSystem);
    ctx.objects.add(solarSystem);

    // ------ add sun

    const sphereGeometry = new THREE.SphereGeometry(1, 10, 10);

    const sunMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xFFFF00
    });

    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5); // make the sun large

    solarSystem.add(sunMesh);

    // ------ add light

    const pointLight = new THREE.PointLight("white", 500);
    ctx.scene.add(pointLight);

    // ------ add earth
    const earthOrbit = new THREE.Object3D();

    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    ctx.objects.add(earthOrbit);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233FF,
      emissive: 0x112244
    });

    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthOrbit.add(earthMesh);

    // ------ add earth orbit

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222
    });

    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonOrbit.add(moonMesh);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    ctx.objects.add(moonMesh)
  }
}