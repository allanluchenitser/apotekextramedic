import * as THREE from 'three';
import type { ThreeSceneContext } from './threeContextUtils';

export default {
  setup(ctx: ThreeSceneContext) {
    const testColor = "#ffffff";

    // ------ MATERIALS

    const boxMaterial = new THREE.MeshStandardMaterial({
      color: "yellow",
    });

    // ------ GEOMETRY

    const geometry_cube = new THREE.BoxGeometry( 1, 1, 1 );

    const cube = new THREE.Mesh(geometry_cube, boxMaterial);
    ctx.addObject(cube);

    ctx.addObject(cube.clone(), { x: 2, randomColor: true });
    ctx.addObject(cube.clone(), { x: -2, randomColor: true });
    ctx.addObject(cube.clone(), { y: 2, randomColor: true });
    ctx.addObject(cube.clone(), { y: -2, randomColor: true });
  }
}