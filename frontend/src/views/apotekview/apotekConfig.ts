import * as THREE from 'three'

export const DEBUG = {
  showCoordinates: true,
  showMeshPicker: false,
  showLilGui: false,
}

export const CUBOID_HALF_HEIGHT = 0.65;
export const CUBOID_RADIUS = 0.1;

export const INITIAL_CUSTOMER_POSITION = new THREE.Vector3(
  -4.8,
  CUBOID_HALF_HEIGHT + CUBOID_RADIUS,
  15.30,
)

export const INITIAL_CUSTOMER_LOOK_AT = new THREE.Vector3(
-4.47,
  1.62,
  14.38
)