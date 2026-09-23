import * as THREE from 'three';
import type { ThreeSceneContext } from '../threeContextUtils'
import { makePlaneMesh, makeCubeMesh, makeSphereMesh } from '@/js/makeMesh';

import roundShadowPng from './roundshadow.png'


export let sphereShadowBases: { base: THREE.Object3D,
    sphereMesh: THREE.Mesh,
    shadowMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>,
    y: number
  }[] = [];

export default {
  setup(ctx: ThreeSceneContext) {
    // ctx.scene.background = new THREE.Color('white');

    const planeMesh = makePlaneMesh("basic");
    ctx.scene.add(planeMesh);

    const shadowTexture = new THREE.TextureLoader().load(roundShadowPng);

    const sphereRadius = 1;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);

    const planeSize = 1;
    const shadowGeo = new THREE.PlaneGeometry(planeSize, planeSize);

    const numSpheres = 15;

    for (let i = 0; i < numSpheres; i++) {
      const base = new THREE.Object3D();
      ctx.scene.add(base);

      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
      });

      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);

      shadowMesh.position.y = 0.001;  // so we're above the ground slightly
      shadowMesh.rotation.x = Math.PI * -.5;

      const shadowSize = sphereRadius * 4;
      shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
      base.add(shadowMesh);

      // add the sphere to the base
      const u = i / numSpheres;   // goes from 0 to 1 as we iterate the spheres.
      const sphereMat = new THREE.MeshPhongMaterial();
      sphereMat.color.setHSL(u, 1, .75);
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(0, sphereRadius + 2, 0);
      base.add(sphereMesh);

      // remember all 3 plus the y position
      sphereShadowBases.push({
        base,
        sphereMesh,
        shadowMesh,
        y: sphereMesh.position.y
      });
    }

    // ------ LIGHTS

    {
      const skyColor = 0xB1E1FF;  // light blue
      const groundColor = 0xB97A20;  // brownish orange
      const intensity = 2;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      ctx.scene.add(light);
    }

    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 10, 5);
      light.target.position.set(-5, 0, 0);

      ctx.scene.add(light);
      ctx.scene.add(light.target);
    }
  }
}