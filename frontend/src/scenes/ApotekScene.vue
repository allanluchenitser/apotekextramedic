<script setup lang="ts">
import { nextTick, onMounted, ref, watch, computed } from 'vue'

import apotekGlbUrl from '@/assets/glb/apotek_tres.glb?url'

import { OrbitControls, useGLTF } from '@tresjs/cientos'
import { useLoop, useTresContext } from '@tresjs/core'
import { Vector3, Mesh, MeshStandardMaterial, type Color } from 'three'

import { toFixed, tresObjectInfo } from '@/js/util'

// ------ SETUP ------

const emit = defineEmits<{
  position: [position: Vector3]
}>();

const { camera } = useTresContext();
const { onBeforeRender } = useLoop();
const { state: apotekState, nodes: apotekNodes, isLoading } = useGLTF(apotekGlbUrl)

const controls = ref<any>(null)
// const originalColors = new WeakMap<Mesh, Color>()

const initialCameraPosition = new Vector3(-7.26, 5.09, 15.05);
const initialLookAtPosition = new Vector3(0, 5, 0);

// ------ FUNCTIONS

// function handlePointerEnter(event: any) {
//   const object = event.object as Mesh
//   const material = object.material as MeshStandardMaterial

//   originalColors.set(object, material.color.clone())
//   material.color.set('red')

//   tresObjectInfo(object)
// }

// function handlePointerLeave(event: any) {
//   const object = event.object as Mesh
//   const material = object.material as MeshStandardMaterial

//   material.color.copy(originalColors.get(object)!)
// }

// ------ LIFECYCLE & WATCHERS

onBeforeRender(() => {
  const pos = camera.activeCamera.value?.position;

  if (!pos) return;

  const x = toFixed(pos.x, 2)
  const y = toFixed(pos.y, 2)
  const z = toFixed(pos.z, 2)

  emit('position', new Vector3(x, y, z));
});

onMounted(async () => {
  await nextTick();
  controls.value?.instance.update();

  const worldPosition = new Vector3()
  apotekState.value?.scene.getWorldPosition(worldPosition)
  console.log('world position:', worldPosition.toArray().join(', '))
})

// const interactiveMeshes = computed(() => {
//   const meshes = Object.values(apotekNodes.value).filter(
//     object => object instanceof Mesh
//   )

//   console.log(meshes.map(mesh => { return `${mesh.name}, ${mesh.parent?.name}` }))

//   return meshes
// })

watch(isLoading, (loading) => {
  if (loading) return;

  apotekState.value?.scene.traverse((obj) => {
    // make each object have its own material
    if (obj instanceof Mesh) {
      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map((mat) => mat.clone())

        console.log('material array:')
        for (const mat of obj.material) {
          tresObjectInfo({ material: mat } as Mesh)
        }
      }
      else {
        obj.material = obj.material.clone()
        tresObjectInfo(obj)
      }
    }
  })
})
</script>

<template>
  <TresPerspectiveCamera
    :position="initialCameraPosition"
  />

  <TresAmbientLight
    :intensity=".1"
    color="white"
  />
  <TresPointLight
    :position="new Vector3(5, 1, 10)"
    :intensity="100"
  />
<!--
  <primitive
    v-for="mesh in interactiveMeshes"
    :key="mesh.uuid"
    :object="mesh"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  />  -->

  <primitive v-if="!isLoading" :object="apotekState?.scene" />

  <TresDirectionalLight
    :position="new Vector3(0, 2, 5)"
    :lookAt="initialLookAtPosition"
    :intensity="1"
  />
  <!-- <TresDirectionalLight
    :position="new Vector3(0, 10, 10)"
    :lookAt="initialLookAtPosition"
    :intensity="1"
  /> -->

  <TresAxesHelper />
  <TresGridHelper :args="[10, 10]" />

  <OrbitControls
    ref="controls"
    :enableDamping="false"
    :target="initialLookAtPosition"
  />
</template>
