import * as THREE from 'three'

export default function createSceneObjects() {
  // --- cube

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshStandardMaterial( {
    color: 0x3a1af1
  } );
  const cubeStandard = new THREE.Mesh( geometry, material );

  return {
    cubeStandard,
  };
}