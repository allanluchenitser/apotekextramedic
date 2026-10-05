import { onMounted, onUnmounted, reactive } from 'vue'

export function useWASDKeys() {
  const keys = reactive({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false,
  })

  function keyDown(e: KeyboardEvent) {
    // console.log('keydown', e.code)
    switch (e.code) {
      case 'KeyW':
        keys.forward = true
        break
      case 'KeyS':
        keys.backward = true
        break
      case 'KeyA':
        keys.left = true
        break
      case 'KeyD':
        keys.right = true
        break
      case 'ShiftLeft':
      case 'ShiftRight':
        keys.shift = true
        break
    }
  }

  function keyUp(e: KeyboardEvent) {
    // console.log('keyup', e.code)
    switch (e.code) {
      case 'KeyW':
        keys.forward = false
        break
      case 'KeyS':
        keys.backward = false
        break
      case 'KeyA':
        keys.left = false
        break
      case 'KeyD':
        keys.right = false
        break
      case 'ShiftLeft':
      case 'ShiftRight':
        keys.shift = false
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', keyDown)
    window.removeEventListener('keyup', keyUp)
  })

  return {
    keys,
  }
}