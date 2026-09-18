import * as THREE from 'three';
import { disposeThreeObjects } from '@/js/util';

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

  dispose() {
    disposeThreeObjects(this.scene);
    this.objects.clear();
  }
}
