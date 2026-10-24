
<script setup lang="ts">
import * as THREE from 'three'
import { ref, onMounted, onUnmounted } from 'vue'
import { MathUtils, Vector3 } from 'three'
import * as SunCalc from 'suncalc'

// Central Jakarta coordinates
const LAT = -6.2088
const LNG = 106.8456

const DISTANCE = 100

const sunPosition = ref<Vector3>(new Vector3(0, 100, 0))
const sunIntensity = ref(0)

const outdorSunRef = ref<THREE.DirectionalLight | null>(null);

function updateSun() {
  const { altitude, azimuth } = SunCalc.getPosition(
    new Date(),
    LAT,
    LNG
  )

  const alt = MathUtils.degToRad(altitude)
  const az = MathUtils.degToRad(azimuth)

  // World coordinates:
  // +X = East, +Y = Up, +Z = North
  sunPosition.value.set(
    DISTANCE * Math.cos(alt) * Math.sin(az),
    DISTANCE * Math.sin(alt),
    DISTANCE * Math.cos(alt) * Math.cos(az)
  )

  // Disable direct sunlight below the horizon
  sunIntensity.value = altitude > 0
    ? 2 * Math.sin(alt)
    : 0
}

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  updateSun()
  timer = setInterval(updateSun, 60_000)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <TresDirectionalLight
    ref="outdorSunRef"
    :position="sunPosition"
    :intensity="sunIntensity"
  />

  <TresDirectionalLightHelper
    v-if="outdorSunRef"
    :args="[outdorSunRef]"
  />
</template>
