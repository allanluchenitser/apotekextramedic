<script setup lang="ts">
import { nextTick, onMounted, ref, watch, computed } from 'vue'

import apotekGlbUrl from '@/assets/glb/apotekScene.glb?url'

import { OrbitControls, useGLTF } from '@tresjs/cientos'
import { useLoop, useTresContext } from '@tresjs/core'
import { Vector3, Mesh, MeshStandardMaterial, Color } from 'three'

import { toFixed } from '@/js/util'

// ------ SETUP ------

const { camera } = useTresContext();
const { onBeforeRender } = useLoop();

const controls = ref<any>(null)

const {
  state: apotekState,
  nodes: apotekNodes,
  isLoading,
} = useGLTF(apotekGlbUrl)

const originalColors = new WeakMap<Mesh, Color>()

// Initial camera position
const initialCameraPosition = new Vector3(-3.43, 9.43, 26.8);
const initialLookAtPosition = new Vector3(0, 5, 0);

const emit = defineEmits<{
  position: [position: Vector3]
}>();

// ------ FUNCTIONS

function handlePointerEnter(event: any) {
  const object = event.object as Mesh
  const material = object.material as MeshStandardMaterial

  console.log('object:', object)

  originalColors.set(object, material.color.clone())
  material.color.set('red')
}

function handlePointerLeave(event: any) {
  const object = event.object as Mesh
  const material = object.material as MeshStandardMaterial

  material.color.copy(originalColors.get(object)!)
}


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
})

const interactiveMeshes = computed(() =>
  Object.values(apotekNodes.value).filter(
    object => object instanceof Mesh
  )
)

watch(isLoading, (loading) => {
  if (loading) return;

  apotekState.value?.scene.traverse((obj) => {
    if (obj instanceof Mesh) {
      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map((mat) => mat.clone())
      } else {
        obj.material = obj.material.clone()
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
    :intensity="0.5"
    color="white"
  />

  <TresPointLight
    :position="new Vector3(0, 1, 0)"
    :intensity="100"
  />

  <primitive
    v-for="mesh in interactiveMeshes"
    :key="mesh.uuid"
    :object="mesh"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  />

  <TresDirectionalLight
    :position="new Vector3(0, 10, 10)"
    :lookAt="initialLookAtPosition"
    :intensity="1"
  />
  <TresDirectionalLight
    :position="new Vector3(0, 10, 10)"
    :lookAt="initialLookAtPosition"
    :intensity="1"
  />

  <TresAxesHelper />
  <TresGridHelper :args="[10, 10]" />

  <OrbitControls
    ref="controls"
    :enableDamping="false"
    :target="initialLookAtPosition"
  />
</template>
