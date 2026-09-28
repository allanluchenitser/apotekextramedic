import {
  onMounted,
  onUnmounted,
} from 'vue'

import { useTres } from '@tresjs/core'

import {
  Box3,
  Box3Helper,
  Color,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  SphereGeometry,
  Vector2,
  type Intersection,
  type Material,
  type Object3D,
} from 'three'

type RootGetter = () => Object3D | null | undefined

interface MeshDebuggerOptions {
  enabled?: boolean
  boxColor?: string | number
  markerColor?: string | number
}

export function useMeshDebugger(
  getRoot: RootGetter,
  options: MeshDebuggerOptions = {},
) {
  const {
    enabled = true,
    boxColor = 0xffff00,
    markerColor = 0xff3333,
  } = options

}