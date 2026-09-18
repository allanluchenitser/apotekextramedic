import * as THREE from 'three';
import type { ThreeSceneContext } from './threeContextUtils';

export default {
  setup(ctx: ThreeSceneContext) {
    const testColor = "#ffffff";

    const lambertMaterial = new THREE.MeshLambertMaterial({
      color: testColor
    });

    const phongMaterial = new THREE.MeshPhongMaterial({
      color: testColor,
      shininess: 50,
    });

    const standardMaterial = new THREE.MeshStandardMaterial({
      color: testColor,
      roughness: 0,
      metalness: 1,
    });

    const standardMaterial2 = new THREE.MeshStandardMaterial({
      color: testColor,
      roughness: 0,
      metalness: 0,
    });

    const boxMaterial = new THREE.MeshStandardMaterial({
      color: "yellow",
    });

    // ------ GEOMETRY

    const geometry = new THREE.SphereGeometry( 0.5, 16, 16 );
    const geometry_cube = new THREE.BoxGeometry( 1, 1, 1 );

    // ------ MESH
    const lambertMesh = new THREE.Mesh( geometry, lambertMaterial );
    const phongMesh = new THREE.Mesh( geometry, phongMaterial );
    const standardMesh = new THREE.Mesh( geometry, standardMaterial );
    const standardMesh2 = new THREE.Mesh( geometry, standardMaterial2 );

    const specialMesh = new THREE.Mesh( geometry_cube, boxMaterial );

    ctx.addObject(lambertMesh, { x: -2.25, y: 0 });
    ctx.addObject(phongMesh, { x: -0.75, y: 0 });
    ctx.addObject(standardMesh, { x: 0.75, y: 0 });
    ctx.addObject(standardMesh2, { x: 2.25, y: 0 });

    ctx.addObject(specialMesh, { x: 0, y: 2, z: -4 });

    // ------ LIGHT SOURCE

    // const ambientLight = new THREE.AmbientLight(0xffffff, 1);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
    // directionalLight.position.set(1, 3, 2.25);

    // const pointLight = new THREE.PointLight(0xffffff, 1);
    // pointLight.position.set(5, 5, 5);

    // const spotLight = new THREE.SpotLight(0xffffff, 1);
    // spotLight.position.set(5, 10, 5);

    // const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    // hemisphereLight.position.set(0, 20, 0);

    // const light
      // = ambientLight;
      // = directionalLight;
      // = pointLight;
      // = hemisphereLight;
      // = spotLight;

    // const lightHelper
    //   = new THREE.DirectionalLightHelper(light);
      // = new THREE.PointLightHelper(light);
      // = new THREE.SpotLightHelper(light);
      // = new THREE.HemisphereLightHelper(light);
  }
}