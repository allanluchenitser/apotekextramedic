import {
  onMounted,
  onUnmounted,
} from 'vue'

import { useTres } from '@tresjs/core'

import {
  Box3,
  Box3Helper,
  Color,
  type LineBasicMaterial,
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

  /*
   * useTres() must be called inside a component that is itself
   * rendered somewhere below <TresCanvas>.
   */
  const {
    scene,
    camera,
    renderer,
    invalidate,
  } = useTres()

  const raycaster = new Raycaster()
  const pointer = new Vector2()

  /*
   * Yellow world-space bounding box.
   */
  const hoverBox = new Box3Helper(
    new Box3(),
    new Color(boxColor),
  )

  hoverBox.name = 'MeshDebuggerBoundingBox'
  hoverBox.visible = false
  hoverBox.renderOrder = 10_000
  hoverBox.userData.meshDebuggerIgnore = true

  const hoverBoxMaterial = hoverBox.material as LineBasicMaterial
  hoverBoxMaterial.depthTest = false
  hoverBoxMaterial.transparent = true
  hoverBoxMaterial.opacity = 1

  /*
   * Red sphere marking the precise ray intersection.
   */
  const markerGeometry = new SphereGeometry(0.035, 12, 8)

  const markerMaterial = new MeshBasicMaterial({
    color: markerColor,
    depthTest: false,
    depthWrite: false,
  })

  const hitMarker = new Mesh(
    markerGeometry,
    markerMaterial,
  )

  hitMarker.name = 'MeshDebuggerHitMarker'
  hitMarker.visible = false
  hitMarker.renderOrder = 10_001
  hitMarker.userData.meshDebuggerIgnore = true

  /*
   * HTML debug display.
   */
  let panelEl: HTMLDivElement | null = null
  let statusElement: HTMLDivElement | null = null
  let outputElement: HTMLPreElement | null = null

  /*
   * When frozen, pointer movement no longer changes the selection.
   */
  let frozen = false
  let currentMesh: Mesh | null = null

  /*
   * Pointer movement can happen more often than browser frames.
   * This limits raycasting to once per animation frame.
   */
  let frameRequest: number | null = null
  let latestPointerEvent: PointerEvent | null = null

  function isMesh(object: Object3D): object is Mesh {
    return (object as Mesh).isMesh === true
  }

  function isEffectivelyVisible(object: Object3D) {
    let current: Object3D | null = object

    while (current) {
      if (!current.visible) return false
      current = current.parent
    }

    return true
  }

  function materialDescription(material: Material | Material[]) {
    const materials = Array.isArray(material)
      ? material
      : [material]

    return materials
      .map((item, index) => {
        const materialName = item.name || '(unnamed)'
        return `${index}: ${materialName} [${item.type}]`
      })
      .join('\n          ')
  }

  // function formatNumber(value: number | undefined) {
  //   if (value === undefined) return '—'
  //   return value.toFixed(3)
  // }

  function updatePanel(
    hit: Intersection<Object3D>,
    mesh: Mesh,
  ) {
    if (!outputElement) return

    const parentName =
      mesh.parent?.name ||
      mesh.parent?.type ||
      '(no parent)'

    // const worldPosition = mesh.getWorldPosition(
    //   hitMarker.position.clone(),
    // )

    // const uv = hit.uv

    outputElement.textContent = [
      `Parent:    ${parentName}`,
      `Name:      ${mesh.name || '(unnamed mesh)'}`,
      `Type:      ${mesh.type}`,
      // `UUID:      ${mesh.uuid}`,
      '',
      // `Geometry:  ${mesh.geometry.type}`,
      `Triangles: ${mesh.geometry.index
        ? mesh.geometry.index.count / 3
        : mesh.geometry.attributes.position.count / 3}`,
      `Face:      ${hit.faceIndex ?? '—'}`,
      '',
      `Material:  ${materialDescription(mesh.material)}`,
      '',
      // `Hit point: ${formatNumber(hit.point.x)}, ${formatNumber(hit.point.y)}, ${formatNumber(hit.point.z)}`,
      // `Mesh pos:  ${formatNumber(worldPosition.x)}, ${formatNumber(worldPosition.y)}, ${formatNumber(worldPosition.z)}`,
      // `UV:        ${uv
      //   ? `${formatNumber(uv.x)}, ${formatNumber(uv.y)}`
      //   : '—'}`,
      // `Distance:  ${formatNumber(hit.distance)}`,
    ].join('\n')

    updateStatus()
  }

  function updateStatus() {
    if (!statusElement) return

    if (frozen) {
      statusElement.textContent =
        'Selection frozen — click or press Escape to release'

      statusElement.style.color = '#ffcc55'
    }
    else {
      statusElement.textContent =
        'Hover a mesh — click to freeze'

      statusElement.style.color = '#8cff98'
    }
  }

  function setIntersection(
    hit: Intersection<Object3D> | null,
  ) {
    if (!hit || !isMesh(hit.object)) {
      clearSelection()
      return
    }

    const mesh = hit.object

    currentMesh = mesh

    /*
     * Ensure world matrices are current before calculating
     * the bounding box.
     */
    mesh.updateWorldMatrix(true, false)

    hoverBox.box.setFromObject(mesh)
    hoverBox.visible = true

    hitMarker.position.copy(hit.point)
    hitMarker.visible = true

    updatePanel(hit, mesh)
    invalidate()
  }

  function clearSelection() {
    currentMesh = null

    hoverBox.visible = false
    hitMarker.visible = false

    if (outputElement) {
      outputElement.textContent = 'No mesh selected'
    }

    updateStatus()
    invalidate()
  }

  function findMeshIntersection(
    event: PointerEvent,
  ): Intersection<Object3D> | null {
    const root = getRoot()
    const activeCamera = camera.value
    const canvas = renderer.domElement

    if (!root || !activeCamera || !canvas) {
      return null
    }

    const bounds = canvas.getBoundingClientRect()

    /*
     * Ignore pointer events outside the actual canvas.
     */
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      return null
    }

    /*
     * Convert browser coordinates into Three.js normalized
     * device coordinates: -1 to +1.
     */
    pointer.x =
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1

    pointer.y =
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1

    raycaster.setFromCamera(pointer, activeCamera)

    /*
     * true means recursively test all descendants of the
     * imported GLTF scene.
     */
    const intersections =
      raycaster.intersectObject(root, true)

    /*
     * A ray can also hit Lines, Points, invisible children,
     * or our own debug marker. Find the nearest valid mesh.
     */
    return intersections.find((hit) => {
      const object = hit.object

      return (
        isMesh(object) &&
        isEffectivelyVisible(object) &&
        object.userData.meshDebuggerIgnore !== true
      )
    }) ?? null
  }

  function performRaycast() {
    frameRequest = null

    if (
      frozen ||
      !latestPointerEvent
    ) {
      return
    }

    const hit = findMeshIntersection(
      latestPointerEvent,
    )

    setIntersection(hit)
  }

  function handlePointerMove(event: PointerEvent) {
    if (frozen) return

    latestPointerEvent = event

    if (frameRequest !== null) return

    frameRequest = requestAnimationFrame(
      performRaycast,
    )
  }

  function handlePointerLeave() {
    if (!frozen) {
      clearSelection()
    }
  }

  function handlePointerDown(event: PointerEvent) {
    /*
     * Only use the primary/left mouse button.
     */
    if (event.button !== 0) return

    if (frozen) {
      frozen = false

      /*
       * Immediately inspect whatever is currently under
       * the pointer after releasing.
       */
      const hit = findMeshIntersection(event)
      setIntersection(hit)
      return
    }

    if (currentMesh) {
      frozen = true
      updateStatus()
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return

    frozen = false
    clearSelection()
  }

  function createPanel() {
    panelEl = document.createElement('div')

    Object.assign(panelEl.style, {
      position: 'fixed',
      bottom: '12px',
      left: '12px',
      zIndex: '10000',
      width: '360px',
      maxWidth: 'calc(100vw - 24px)',
      padding: '12px',
      color: '#eeeeee',
      background: 'rgba(10, 12, 16, 0.92)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '6px',
      boxShadow: '0 5px 25px rgba(0, 0, 0, 0.4)',
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      pointerEvents: 'none',
    })

    const title = document.createElement('div')

    title.textContent = 'TresJS Mesh Debugger'

    Object.assign(title.style, {
      marginBottom: '6px',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: 'bold',
    })

    statusElement = document.createElement('div')

    Object.assign(statusElement.style, {
      marginBottom: '10px',
      fontSize: '11px',
    })

    outputElement = document.createElement('pre')

    outputElement.textContent = 'No mesh selected'

    Object.assign(outputElement.style, {
      margin: '0',
      overflowX: 'auto',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere',
      color: '#dddddd',
      fontSize: '11px',
      lineHeight: '1.45',
    })

    panelEl.append(
      title,
      statusElement,
      outputElement,
    )

    document.body.appendChild(panelEl)

    updateStatus()
  }

  onMounted(() => {
    if (!enabled) return

    const canvas = renderer.domElement

    scene.value.add(hoverBox)
    scene.value.add(hitMarker)

    createPanel()

    canvas.addEventListener(
      'pointermove',
      handlePointerMove,
    )

    canvas.addEventListener(
      'pointerleave',
      handlePointerLeave,
    )

    canvas.addEventListener(
      'pointerdown',
      handlePointerDown,
    )

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )
  })

  onUnmounted(() => {
    const canvas = renderer.domElement

    canvas.removeEventListener(
      'pointermove',
      handlePointerMove,
    )

    canvas.removeEventListener(
      'pointerleave',
      handlePointerLeave,
    )

    canvas.removeEventListener(
      'pointerdown',
      handlePointerDown,
    )

    window.removeEventListener(
      'keydown',
      handleKeyDown,
    )

    if (frameRequest !== null) {
      cancelAnimationFrame(frameRequest)
    }

    scene.value.remove(hoverBox)
    scene.value.remove(hitMarker)

    hoverBox.geometry.dispose()
    hoverBoxMaterial.dispose()

    markerGeometry.dispose()
    markerMaterial.dispose()

    panelEl?.remove()

    panelEl = null
    statusElement = null
    outputElement = null
  })
}