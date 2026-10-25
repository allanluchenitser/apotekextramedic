
<script setup lang="ts">
import * as THREE from 'three'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Vector3 } from 'three'
import * as SunCalc from 'suncalc'
import { useControls } from '@tresjs/leches'

// Central Jakarta coordinates
const LAT = -6.2088
const LNG = 106.8456

const DISTANCE = 100

const lechVariables = useControls({
  name: 'Real Sun',
  longitude: { value: LNG, min: -180, max: 180, step: 0.01 },
  latitude: { value: LAT, min: -90, max: 90, step: 0.01 },
  intensity: { value: 2, min: 0, max: 5, step: 0.1 },
})

const sunPosition = ref<Vector3>(new Vector3(0, 100, 0))
const sunIntensity = ref(0)

const sunRef = ref<THREE.DirectionalLight | null>(null);
const sunHelperRef = ref<THREE.DirectionalLightHelper | null>(null)

// compass
const sunAzimuth = ref(0)
const arrowPosition = new Vector3(0, 0.02, -0.2);
const conePosition = new Vector3(0, 0.02, -0.43);
const compassPosition = new Vector3(0, 0.02, 10);

function updateSun() {
  console.log('updateSun')

  const { altitude, azimuth } = SunCalc.getPosition(
    new Date(),
    lechVariables.latitude.value,
    lechVariables.longitude.value
  )
  sunAzimuth.value = azimuth

  // World coordinates:
  // +X = East, +Y = Up, +Z = North
  const nextPosition = new Vector3(
    -DISTANCE * Math.cos(altitude) * Math.sin(azimuth),
    DISTANCE * Math.sin(altitude),
    -DISTANCE * Math.cos(altitude) * Math.cos(azimuth)
  )

  sunPosition.value = nextPosition;

  // Disable direct sunlight below the horizon
  sunIntensity.value = altitude > 0
    ? lechVariables.intensity.value * Math.sin(altitude)
    : 0

  const light = sunRef.value
  if (!light) return

  light.position.copy(nextPosition)
  light.updateMatrixWorld(true)
  light.target.updateMatrixWorld(true)
  sunHelperRef.value?.update()
}

watch([
  lechVariables.latitude,
  lechVariables.longitude,
  lechVariables.intensity,
], updateSun)

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  updateSun()
  timer = setInterval(updateSun, 60_000)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <TresDirectionalLight
    ref="sunRef"
    :position="sunPosition"
    :intensity="sunIntensity"
  />

  <TresDirectionalLightHelper
    v-if="sunRef"
    ref="sunHelperRef"
    :args="[sunRef]"
  />

  <TresGroup :rotation-y="Math.PI" :position="compassPosition">
    <!-- Ring lies flat on the XZ ground plane. -->
    <TresMesh :rotation-x="Math.PI / 2">
      <TresTorusGeometry :args="[0.5, 0.01, 8, 48]" />
      <TresMeshBasicMaterial color="#ffffff" />
    </TresMesh>

    <!-- Arrow shaft points along local -Z. -->
    <TresMesh :position="arrowPosition" :rotation-x="Math.PI / 2">
      <TresCylinderGeometry :args="[0.012, 0.012, 0.4, 8]" />
      <TresMeshBasicMaterial color="#ff9f1c" />
    </TresMesh>

    <!-- Cone's tip points along local -Z. -->
    <TresMesh :position="conePosition" :rotation-x="-Math.PI / 2">
      <TresConeGeometry :args="[0.06, 0.16, 4]" />
      <TresMeshBasicMaterial color="#ff9f1c" />
    </TresMesh>
  </TresGroup>
</template>
