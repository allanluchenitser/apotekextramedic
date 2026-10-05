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
