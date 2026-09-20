import * as THREE from "three";
import type { ThreeSceneContext } from "../threeContextUtils";
import { GUI } from 'lil-gui';

import { makePlaneMesh, makeCubeMesh, makeSphereMesh } from './makeMesh';
import { makeAmbient, makeHemisphere, makeDirectional, makePoint } from './makeLight';
import { makeAmbientGui, makeHemisphereGui, makeDirectionalGui, makePointGui } from './makeGui';

export default {
  setup(ctx: ThreeSceneContext) {
    const gui = new GUI();
    ctx.gui = gui;

    const planeMesh = makePlaneMesh();
    const cubeMesh = makeCubeMesh();
    const sphereMesh = makeSphereMesh();

    ctx.scene
      .add(planeMesh)
      .add(cubeMesh)
      .add(sphereMesh)

    // const ambientLight = makeAmbient();
    // makeAmbientGui(gui, ambientLight);

    // const hemisphereLight = makeHemisphere();
    // makeHemisphereGui(gui, hemisphereLight);

    const [directionalLight, directionalHelper] = makeDirectional(true);
    makeDirectionalGui(gui, directionalLight, directionalHelper);

    // const [pointLight, pointHelper] = makePoint(true);
    // makePointGui(gui, pointLight, pointHelper);

    ctx.scene
      // .add(ambientLight)
      // .add(hemisphereLight)

      .add(directionalLight)
      .add(directionalLight.target)
      .add(directionalHelper)

      // .add(pointLight)
      // .add(pointHelper)
  }
}