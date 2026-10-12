import * as THREE from 'three'

export const DEBUG = {
  showCoordinates: true,
  showMeshPicker: false,
  showLilGui: false,
}

export const HUMAN_HALF_HEIGHT = 0.65

export const INITIAL_CUSTOMER_POSITION = new THREE.Vector3(
  10.51,
  HUMAN_HALF_HEIGHT,
  15.16
)

export const INITIAL_CUSTOMER_LOOK_AT = new THREE.Vector3(
  0,
  HUMAN_HALF_HEIGHT + 5,
  0
)