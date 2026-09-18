import * as THREE from 'three';
import type { ThreeSceneContext } from "./threeContextUtils";

export default {
  setup(ctx: ThreeSceneContext) {
    // ------ create solar system
    const solarSystem = new THREE.Object3D();
    ctx.scene.add(solarSystem);
    ctx.objects.add(solarSystem);

    // ------ add sun

    const sunGeometry = new THREE.SphereGeometry(1, 20, 20);

    const sunMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xFFFF00
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5); // make the sun large

    solarSystem.add(sunMesh);

    // ------ add light

    const pointLight = new THREE.PointLight("white", 20);
    ctx.scene.add(pointLight);

    // ------ add earth

    const earthGeometry = new THREE.SphereGeometry(1, 10, 10);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233FF,
      emissive: 0x112244
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.x = 10;
    solarSystem.add(earthMesh);
  }
}