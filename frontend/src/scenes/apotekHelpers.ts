import * as THREE from 'three'
import { toFixedNumber } from '@/js/util'
import type { RotationDegrees } from '@/js/localTypes'


export function giveAllMeshesOwnMaterial(scene: THREE.Object3D) {
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {

      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map((mat) => mat.clone())
      } else {
        obj.material = obj.material.clone()
      }
    }
  })
}

export function displayMeshObject(object: THREE.Object3D) {
  if (object instanceof THREE.Mesh) {
    console.log(`Mesh found: ${object.name}, parent: ${object.parent?.name}`);
    console.log('  uuid:', object.uuid);
    console.log('  position:', object.position);
    console.log('  rotation:', object.rotation);
    console.log('  scale:', object.scale);
    console.log('  visible:', object.visible);
    console.log('  castShadow:', object.castShadow);
    console.log('  receiveShadow:', object.receiveShadow);
    console.log('  geometry:', object.geometry?.type);
    console.log('  material:', object.material);
    console.log('  matrixWorld:', object.matrixWorld);
  }
}

// function cameraPosRotLookat(camera: Camera, orbitControlsRef: any): {
//   position: Vector3;
//   rotation: RotationDegrees;
//   lookAt: Vector3;
// } | undefined {
//   const position = camera.position;
//   const rotation = camera.rotation;

//   if (!position) return;

//   const px = toFixedNumber(position.x, 2)
//   const py = toFixedNumber(position.y, 2)
//   const pz = toFixedNumber(position.z, 2)

//   const ex = toFixedNumber(180 * rotation.x / Math.PI, 2)
//   const ey = toFixedNumber(180 * rotation.y / Math.PI, 2)
//   const ez = toFixedNumber(180 * rotation.z / Math.PI, 2)

//   const pos = new Vector3(px, py, pz);
//   const rot: RotationDegrees = { x: ex, y: ey, z: ez };
//   const look = orbitControlsRef.value?.instance?.target;

//   return {
//     position: pos,
//     rotation: rot,
//     lookAt: look,
//   };
// }

// const interactiveMeshes = computed(() => {
//   const meshes = Object.values(apotekNodes.value).filter(
//     object => object instanceof Mesh
//   )

//   console.log(meshes.map(mesh => { return `${mesh.name}, ${mesh.parent?.name}` }))

//   return meshes
// })