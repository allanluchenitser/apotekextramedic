<script setup lang="ts">
import * as THREE from 'three'

import {
  INITIAL_CUSTOMER_POSITION,
  INITIAL_CUSTOMER_LOOK_AT
} from '@/views/apotekview/apotekConfig'

import {
  ref,
  watch,
  shallowRef,
} from 'vue'

import { Vector3 } from 'three'

import { useLoop, useTresContext } from '@tresjs/core'
import { useGLTF } from '@tresjs/cientos'

import {
  Physics,
  RigidBody,
} from '@tresjs/rapier'

import { useControls } from '@tresjs/leches';

import apotekGlbUrl from '@/assets/glb/apotek_elaborate.glb?url'

import WalkThroughController from '@/sharedComponents/WalkthroughController.vue'
import RealSun from '@/sharedComponents/RealSun.vue'


// ------ SETUP ------

const emit = defineEmits<{
  position: [data: { position: Vector3; rotation: Vector3; lookAt: Vector3 }]
}>()

const debugColliders = false;
const colliderMeshes = shallowRef<THREE.Mesh[]>([])

const { scene, camera } = useTresContext()
const { onBeforeRender } = useLoop()

const {
  state: apotekState,
  isLoading
} = useGLTF(apotekGlbUrl);

const outdoorDirectionalLightPosition = new Vector3(0, 8, 20);
const outdoorDirectionalLightLookAt = new Vector3(0, 8, 0);

const ceilingLightPosition = new Vector3(0, 2, 0);
const ceilingTargetPosition = new Vector3(0, 0, 0);

// ------ REFS ------

const ceilingLightRef = ref<THREE.DirectionalLight | null>(null);
const ceilingHelperRef = ref<THREE.DirectionalLightHelper | null>(null);

const outdoorDirectionalLightRef = ref<THREE.DirectionalLight | null>(null);

// ------ WATCHES, LIFECYCLE ------

let debugLines: THREE.Object3D | null = null

const _pos = new Vector3()
const _dir = new Vector3()
const _euler = new THREE.Euler()
const _quat = new THREE.Quaternion()

// ------ EMIT COORDINATES

onBeforeRender(() => {
  const cam = camera.activeCamera.value
  if (!cam) return

  cam.getWorldPosition(_pos)
  cam.getWorldDirection(_dir)
  cam.getWorldQuaternion(_quat)
  _euler.setFromQuaternion(_quat, 'YXZ')

  emit('position', {
    position: _pos.clone(),
    rotation: new Vector3(
      THREE.MathUtils.radToDeg(_euler.x),
      THREE.MathUtils.radToDeg(_euler.y),
      THREE.MathUtils.radToDeg(_euler.z)
    ),
    lookAt: _pos.clone().add(_dir),
  })
})

// ------ FIXES RAPIER DISAPPEARING DEBUG LINES
// Rapier's debug lines are culled by a stale bounding sphere.

onBeforeRender(() => {
  if (debugLines || isLoading.value) return

  scene.value.traverse((o) => {
    if (debugLines || !(o as THREE.LineSegments).isLineSegments) return

    // Skip lines that belong to the GLB itself.
    let p: THREE.Object3D | null = o
    while (p) {
      if (p === apotekState.value?.scene) return
      p = p.parent
    }

    o.frustumCulled = false
    debugLines = o
  })
})

// ------ ALL PURPOSE TRAVERSAL

watch(
  () => apotekState.value?.scene,
  (scene) => {
    if (!scene) return

    const tempArray: THREE.Mesh[] = []
    scene.traverse((obj) => {

      // Inspect objects here

      // if (obj.name.includes('wall')) {
        // console.log('found wall:', obj.name)
        // const box = new THREE.Box3().setFromObject(obj)
        // const size = new THREE.Vector3()
        // box.getSize(size)
        // console.log(
        //   'wall size:',
        //   size.toArray()
        // )
      // }

      // --- COLLIDERS

      if (obj.name.startsWith('COL_') && obj instanceof THREE.Mesh) {
        // console.log('found collider:', obj.name)

        tempArray.push(obj)
        obj.visible = debugColliders

        if (debugColliders) {
          const edgesGeometry = new THREE.EdgesGeometry(obj.geometry, 30);

          const outline = new THREE.LineSegments(
            edgesGeometry,
            new THREE.LineBasicMaterial({
              color: 0xff00ff,
              depthTest: false,
              depthWrite: false,
              transparent: true,
              opacity: 0.7,
            })
          )

          outline.renderOrder = 999
          obj.add(outline)

          obj.material = new THREE.MeshBasicMaterial({
            visible: false,
          })
        }
      }
    })

    colliderMeshes.value = tempArray
  },
  { immediate: true }
)

/* ------ LECH CONTROLS ------ */

const POS_MAX = 10

// ------ OUTDOOR LIGHT ------

// const lechVariables = useControls({
//   x: { value: outdoorDirectionalLightPosition.x, min: -30, max: 30 },
//   y: { value: outdoorDirectionalLightPosition.y, min: -30, max: 30 },
//   z: { value: outdoorDirectionalLightPosition.z, min: -30, max: 30 },

//   lx: { value: outdoorDirectionalLightLookAt.x, min: -30, max: 30 },
//   ly: { value: outdoorDirectionalLightLookAt.y, min: -30, max: 30 },
//   lz: { value: outdoorDirectionalLightLookAt.z, min: -30, max: 30 }
// })

// watch([lechVariables.x, lechVariables.y, lechVariables.z], ([newX, newY, newZ]) => {
//   outdoorDirectionalLightPosition.set(newX, newY, newZ)
//   outdoorDirectionalLightRef.value?.position.set(newX, newY, newZ)
// })

// watch([lechVariables.lx, lechVariables.ly, lechVariables.lz], ([newLX, newLY, newLZ]) => {
//   outdoorDirectionalLightLookAt.set(newLX, newLY, newLZ)
//   outdoorDirectionalLightRef.value?.lookAt(newLX, newLY, newLZ)
// })

// ------ CEILING LIGHT ------

// const lechVariablesCeilingLight = useControls({
//   name: "Ceiling Light",

//   x: { value: ceilingLightPosition.x, min: -POS_MAX, max: POS_MAX },
//   y: { value: ceilingLightPosition.y, min: -POS_MAX, max: POS_MAX },
//   z: { value: ceilingLightPosition.z, min: -POS_MAX, max: POS_MAX },

//   lx: { value: ceilingTargetPosition.x, min: -POS_MAX, max: POS_MAX },
//   ly: { value: ceilingTargetPosition.y, min: -POS_MAX, max: POS_MAX },
//   lz: { value: ceilingTargetPosition.z, min: -POS_MAX, max: POS_MAX }
// })

// watch([lechVariablesCeilingLight.x, lechVariablesCeilingLight.y, lechVariablesCeilingLight.z], ([newX, newY, newZ]) => {
//   ceilingLightPosition.set(newX, newY, newZ)
//   const light = ceilingLightRef.value
//   if (!light) return

//   light.position.set(newX, newY, newZ)
//   light.updateMatrixWorld()
//   ceilingHelperRef.value?.update()
// })

// watch([lechVariablesCeilingLight.lx, lechVariablesCeilingLight.ly, lechVariablesCeilingLight.lz], ([newLX, newLY, newLZ]) => {
//   ceilingTargetPosition.set(newLX, newLY, newLZ)
//   const light = ceilingLightRef.value
//   if (!light) return

//   light.target.position.set(newLX, newLY, newLZ)
//   light.target.updateMatrixWorld()
//   ceilingHelperRef.value?.update()
// })
</script>

<template>
  <Suspense>
    <Physics>
      <!-- ------ CAMERA ------ -->
      <WalkThroughController
        :initialPosition="INITIAL_CUSTOMER_POSITION"
        :initialLookAt="INITIAL_CUSTOMER_LOOK_AT"
        :allowVerticalMovement="true"
      />

      <!-- ------ LOAD GLB ------ -->

      <!-- <primitive
        v-for="mesh in interactiveMeshes"
        :key="mesh.uuid"
        :object="mesh"
      /> -->

      <primitive
        v-if="!isLoading && apotekState?.scene"
        :object="apotekState.scene"
      />

      <RigidBody
        v-for="colMesh in colliderMeshes"
        :key="colMesh.uuid"
        type="fixed"
        collider="trimesh"
      >
        <primitive :object="colMesh" />
      </RigidBody>

      <!-- ------ LIGHTS ------ -->

      <TresHemisphereLight :args="['#d1edff', '#8a8272', 0.6]" />

      <RealSun
        gui
        :latitude="-6.21"
        :longitude="106.65"
      />


      <!-- <TresDirectionalLight
        ref="outdoorDirectionalLightRef"
        :position="outdoorDirectionalLightPosition"
        :intensity="3"
      />

      <TresDirectionalLightHelper
        v-if="outdoorDirectionalLightRef"
        :args="[outdoorDirectionalLightRef]"
      /> -->

      <!-- <TresDirectionalLight
        ref="ceilingLightRef"
        :position="ceilingLightPosition"
        :intensity="3"
      />

      <TresDirectionalLightHelper
        v-if="ceilingLightRef"
        ref="ceilingHelperRef"
        :args="[ceilingLightRef]"
      /> -->


      <!-- ------ ANCILLARY HELPERS ------ -->

      <!-- <TresAxesHelper /> -->
      <!-- <TresGridHelper :args="[10, 10]" /> -->
    </Physics>
  </Suspense>
</template>
