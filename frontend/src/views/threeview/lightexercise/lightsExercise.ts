import * as THREE from "three";
import type { ThreeSceneContext } from "../threeContextUtils";
import { GUI } from 'lil-gui';

import { makePlaneMesh, makeCubeMesh, makeSphereMesh } from '@/js/makeMesh';
import { makeAmbient, makeHemisphere, makeDirectional, makePoint, makeSpot, makeRectArea } from '@/js/makeLight';
import { makeAmbientGui, makeHemisphereGui, makeDirectionalGui, makePointGui, makeSpotGui, makeRectAreaGui } from '@/js/makeGui';

export default {
  setup(ctx: ThreeSceneContext) {
    // const gui = new GUI();
    // ctx.gui = gui;

    const floorPlaneMesh = makePlaneMesh();
    const cubeMesh = makeCubeMesh();
    const sphereMesh = makeSphereMesh();

    sphereMesh.position.set(0, 15, 0);

    const ceilingPlaneMesh = makePlaneMesh();
    ceilingPlaneMesh.position.set(0, 25, 0);

    ctx.scene
      .add(floorPlaneMesh)
      .add(cubeMesh)
      .add(sphereMesh)
      .add(ceilingPlaneMesh)

    // const ambientLight = makeAmbient();
    // makeAmbientGui(gui, ambientLight);

    // const hemisphereLight = makeHemisphere();
    // makeHemisphereGui(gui, hemisphereLight);

    // const [directionalLight, directionalHelper] = makeDirectional(true);
    // makeDirectionalGui(gui, directionalLight, directionalHelper);

    const pointLight = makePoint(false);
    // makePointGui(gui, pointLight, pointHelper);

    // const [spotLight, spotHelper] = makeSpot(true);
    // makeSpotGui(gui, spotLight, spotHelper);

    // const [rectAreaLight, rectAreaHelper] = makeRectArea(true);
    // makeRectAreaGui(gui, rectAreaLight, rectAreaHelper);

    ctx.scene
      // .add(ambientLight)
      // .add(hemisphereLight)

      // .add(directionalLight)
      // .add(directionalLight.target)
      // .add(directionalHelper)

      .add(pointLight)
      // .add(pointHelper)

      // .add(spotLight)
      // .add(spotLight.target)
      // .add(spotHelper)

      // .add(rectAreaLight)
      // .add(rectAreaHelper)
  }
}