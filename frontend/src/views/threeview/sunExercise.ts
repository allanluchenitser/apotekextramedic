import * as THREE from 'three';
import type { ThreeSceneContext } from "./threeContextUtils";
import { objectScale } from 'three/tsl';
import { AxisGridHelper } from "./threeContextUtils";
import GUI from 'lil-gui';

export default {
  setup(ctx: ThreeSceneContext) {
    const gui = new GUI();

    // ------ create solar system

    const solarSystem = new THREE.Object3D();
    ctx.scene.add(solarSystem);

    // ------ add sun

    const sphereGeometry = new THREE.SphereGeometry(1, 12, 12);

    const sunMaterial = new THREE.MeshPhongMaterial({
      // emissive: 0xFFFF00
    });

    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5); // make the sun large

    solarSystem.add(sunMesh);

    // ------ add light

    const pointLight = new THREE.PointLight("white", 500);
    ctx.scene.add(pointLight);

    const pointLight2 = new THREE.PointLight("white", 500);
    pointLight2.position.set(0, 10, 0);
    ctx.scene.add(pointLight2);

    // ------ add earth
    const earthOrbit = new THREE.Object3D;
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233FF,
      emissive: 0x112244
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);

    earthOrbit.add(earthMesh);

    // add moon

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({ color: "#888888", emissive: "#222222" });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);

    // add to rotation
    ctx.objects
      .add(solarSystem)
      .add(earthOrbit)
      .add(moonOrbit);

    function makeAxisGrid(node: THREE.Object3D, label: string, units?: number) {
      const helper = new AxisGridHelper(node, units);
      gui.add(helper, 'visible').name(label);
    }

    makeAxisGrid(solarSystem, 'solarSystem', 25);
    // makeAxisGrid(sunMesh, 'sunMesh');
    makeAxisGrid(earthOrbit, 'earthOrbit');
    // makeAxisGrid(earthMesh, 'earthMesh');
    makeAxisGrid(moonOrbit, 'moonOrbit');
    // makeAxisGrid(moonMesh, 'moonMesh');
  }
}