
<script setup lang="ts">
import * as THREE from 'three'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Vector3 } from 'three'
import * as SunCalc from 'suncalc'
import { useControls } from '@tresjs/leches'

const props = withDefaults(defineProps<{
  gui?: boolean,

  latitude?: number,
  longitude?: number,
  distance?: number,

  date?: Date,

  intensity?: number,
}>(), {
  gui: false, // requires parent to provide treslech

  // default is Central Jakarta coordinates
  latitude: -6.21,
  longitude: 106.05,
  distance: 100,
  intensity: 2,
  date: () => new Date(),
})

const DISTANCE = props.distance

const dayStart = new Date(props.date)
dayStart.setHours(0, 0, 0, 0)
const timeInitMs = dayStart.getTime()

let liveVariables: any;

const options = {
    name: 'Real Sun',

    latitude: {
      value: props.latitude,
      min: -12,
      max: 0,
      step: 0.01
    },

    longitude: {
      value: props.longitude,
      min: 102,
      max: 110,
      step: 0.01
    },

    date: {
      min: 0,
      max: 1439,
      step: 10,
      value: Math.floor((props.date.getTime() - timeInitMs) / 60000)
    },

    intensity: {
      value: props.intensity,
      min: 0,
      max: 5,
      step: 0.1
    },
}

liveVariables = props.gui
  ? useControls(options)
  : options;

const sunPosition = ref<Vector3 | null>(null)
const sunIntensity = ref(0)

const sunRef = ref<THREE.DirectionalLight | null>(null);
const sunHelperRef = ref<THREE.DirectionalLightHelper | null>(null)

// compass
const sunAzimuth = ref(0)
const arrowPosition = new Vector3(0, 0.02, -0.2);
const conePosition = new Vector3(0, 0.02, -0.43);
const compassPosition = new Vector3(0, 0.02, 0);

function updateSun() {
  console.log('updateSun')

  const { altitude, azimuth } = SunCalc.getPosition(
    new Date(timeInitMs + liveVariables.date.value * 60000),
    liveVariables.latitude.value,
    liveVariables.longitude.value
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
    ? liveVariables.intensity.value * Math.sin(altitude)
    : 0

  const light = sunRef.value
  if (!light) return

  light.position.copy(nextPosition)
  light.updateMatrixWorld(true)
  light.target.updateMatrixWorld(true)
  sunHelperRef.value?.update()
}

if (props.gui) {
  watch([
    liveVariables.latitude,
    liveVariables.longitude,
    liveVariables.date,
    liveVariables.intensity,
  ], updateSun)
}

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  updateSun()
  timer = setInterval(() => {
    console.log('Updating sun position')
    updateSun()
  }, 60_000)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <TresDirectionalLight
    v-if="sunPosition"
    ref="sunRef"
    :position="sunPosition"
    :intensity="sunIntensity"
  />

  <TresDirectionalLightHelper
    v-if="sunRef"
    ref="sunHelperRef"
    :args="[sunRef]"
  />

  <!-- Compass for indicating direction -->

  <TresGroup :rotation-y="Math.PI" :position="compassPosition">

    <!-- Ring -->
    <TresMesh :rotation-x="Math.PI / 2">
      <TresTorusGeometry :args="[0.5, 0.01, 8, 48]" />
      <TresMeshBasicMaterial color="#ffffff" />
    </TresMesh>

    <!-- Arrow -->
    <TresMesh :position="arrowPosition" :rotation-x="Math.PI / 2">
      <TresCylinderGeometry :args="[0.012, 0.012, 0.4, 8]" />
      <TresMeshBasicMaterial color="#ff9f1c" />
    </TresMesh>

    <!-- Cone -->
    <TresMesh :position="conePosition" :rotation-x="-Math.PI / 2">
      <TresConeGeometry :args="[0.06, 0.16, 4]" />
      <TresMeshBasicMaterial color="#ff9f1c" />
    </TresMesh>

  </TresGroup>
</template>
