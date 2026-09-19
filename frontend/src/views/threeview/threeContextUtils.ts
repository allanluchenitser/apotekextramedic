import * as THREE from 'three';
import { disposeThreeObjects } from '@/js/util';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';

type AddObjectOptions = Partial<{
  x?: number,
  y?: number,
  z?: number,
  randomColor?: boolean,
}>;

export class ThreeSceneContext {
  scene = new THREE.Scene();
  objects = new Set<THREE.Object3D>();

  addObject(object: THREE.Object3D, options?: AddObjectOptions) {
    const { x, y, z, randomColor } = options ?? {};

    const target = this.objects.has(object)
      ? object.clone()
      : object;

    target.position.set(
      x ?? target.position.x,
      y ?? target.position.y,
      z ?? target.position.z
    );

    if (randomColor && target instanceof THREE.Mesh) {
      const material = new THREE.MeshStandardMaterial();
      material.color.setHSL(Math.random(), 1, 0.5);
      target.material = material;
    }

    this.scene.add(target);
    this.objects.add(target);
  }

  async loadEnvironmentMap(url: string) {
    const hdrLoader = new HDRLoader();
    const envMap = await hdrLoader.loadAsync(url);
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.environment = envMap;
  }

  buildTree() {
    const makeTree = (obj: THREE.Object3D): Record<string, any> => {
      return Object.fromEntries(
        obj.children.map(child => [
          child.name || child.type,
          makeTree(child)
        ])
      );
    };

    console.log(makeTree(this.scene));
  }

  dispose() {
    disposeThreeObjects(this.scene);
    this.objects.clear();
  }
}

export class AxisGridHelper {
  grid: THREE.GridHelper;
  axes: THREE.AxesHelper;
  #_visible: boolean = false;

  constructor(node: THREE.Object3D, units = 10) {
    const axes = new THREE.AxesHelper();

    if (!Array.isArray(axes.material)) axes.material.depthTest = false;

    axes.renderOrder = 2;  // after the grid
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible() {
    return this.#_visible;
  }
  set visible(v) {
    this.#_visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}