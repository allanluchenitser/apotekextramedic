import * as THREE from "three";
import type { ThreeSceneContext } from "../threeContextUtils";
import { GUI } from 'lil-gui';

import { makePlaneMesh, makeCubeMesh, makeSphereMesh } from '@/js/makeMesh';
import { makeAmbient, makeHemisphere, makeDirectional, makePoint, makeSpot, makeRectArea } from '@/js/makeLight';
import { makeAmbientGui, makeHemisphereGui, makeDirectionalGui, makePointGui, makeSpotGui, makeRectAreaGui } from '@/js/makeGui';

export default {
  setup(ctx: ThreeSceneContext) {
    const gui = new GUI();
    ctx.gui = gui;

    const floorPlaneMesh = makePlaneMesh();
    floorPlaneMesh.position.set(0, -4, 0);
    floorPlaneMesh.receiveShadow = true;

    const cubeMesh = makeCubeMesh();
    cubeMesh.position.set(0, 0, 0);
    cubeMesh.castShadow = true;

    const sphereMesh = makeSphereMesh();
    sphereMesh.position.set(0, 15, 0);
    sphereMesh.castShadow = true;

    const ceilingPlaneMesh = makePlaneMesh();
    ceilingPlaneMesh.position.set(0, 25, 0);
    ceilingPlaneMesh.receiveShadow = true;

    ctx.scene
      .add(floorPlaneMesh)
      .add(cubeMesh)
      .add(sphereMesh)
      .add(ceilingPlaneMesh)

    // const ambientLight = makeAmbient();
    // makeAmbientGui(gui, ambientLight);

    // const hemisphereLight = makeHemisphere();
    // makeHemisphereGui(gui, hemisphereLight);

    const [directionalLight, directionalHelper] = makeDirectional(true);
    directionalLight.castShadow = true;
    makeDirectionalGui(gui, directionalLight, directionalHelper);
    const directionalCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);

    // const [pointLight, pointHelper] = makePoint(true);
    // pointLight.position.set(0, 10, 0);
    // pointLight.castShadow = true;
    // makePointGui(gui, pointLight, pointHelper);
    // const cameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);

    // makePointGui(gui, pointLight, pointHelper);

    // const [spotLight, spotHelper] = makeSpot(true);
    // makeSpotGui(gui, spotLight, spotHelper);

    // const [rectAreaLight, rectAreaHelper] = makeRectArea(true);
    // makeRectAreaGui(gui, rectAreaLight, rectAreaHelper);

    ctx.scene
      // .add(ambientLight)
      // .add(hemisphereLight)

      .add(directionalLight)
      .add(directionalLight.target)
      .add(directionalHelper)
      .add(directionalCameraHelper)

      // .add(pointLight)
      // .add(pointHelper)
      // .add(cameraHelper)

      // .add(spotLight)
      // .add(spotLight.target)
      // .add(spotHelper)

      // .add(rectAreaLight)
      // .add(rectAreaHelper)
  }
}