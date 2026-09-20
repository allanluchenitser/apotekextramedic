import type { Mesh, Object3D } from "node_modules/@types/three/build/three.cjs";
import * as THREE from "three";

/**
 * Converts a position within a range to a saturated rainbow CSS hex colour.
 *
 * @param value Position within the range.
 * @param max Maximum value in the range.
 * @param offset Optional spectrum offset, expressed as a fraction of a full cycle.
 */
export function toRainbow(value: number, max: number, offset = 0): string {
	if (!Number.isFinite(value) || !Number.isFinite(max) || max === 0) {
		throw new RangeError("value and max must be finite numbers, and max cannot be zero");
	}

	const hue = ((((value / max) + offset) % 1) + 1) % 1;
	const sector = hue * 6;
	const chroma = 1;
	const secondary = chroma * (1 - Math.abs((sector % 2) - 1));

	let red = 0;
	let green = 0;
	let blue = 0;

	if (sector < 1) [red, green] = [chroma, secondary];
	else if (sector < 2) [red, green] = [secondary, chroma];
	else if (sector < 3) [green, blue] = [chroma, secondary];
	else if (sector < 4) [green, blue] = [secondary, chroma];
	else if (sector < 5) [red, blue] = [secondary, chroma];
	else [red, blue] = [chroma, secondary];

	return `#${[red, green, blue]
		.map((channel) => Math.round(channel * 255).toString(16).padStart(2, "0"))
		.join("")}`;
}

export function toFixedNumber(value: number, digits: number): number {
	return Number(value.toFixed(digits));
}

export function tresObjectInfo(obj: Object3D) {
  const mesh = obj as Mesh

  console.log({
    name: obj.name,
    type: obj.type,

    position: obj.position,
    rotation: obj.rotation,
    scale: obj.scale,

    parent: obj.parent,
    children: obj.children,

    visible: obj.visible,

    geometry: mesh.geometry,
    material: mesh.material,

    castShadow: mesh.castShadow,
    receiveShadow: mesh.receiveShadow,
  })
}

export function disposeThreeObjects(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;

    object.geometry?.dispose();

    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];

    for (const material of materials) {
      material.dispose();
    }
  });
}

// ------ GEOMETRY UTILITIES

type AddCubeFrameOptions = {
  size?: number
  thickness?: number
  color?: string
}

export function addCubeFrame(parent: THREE.Mesh, { size = 1, thickness = 0.03, color = "blue" }: AddCubeFrameOptions = {}) {
  const half = size / 2;

  const material = new THREE.MeshBasicMaterial({ color });

  // Edges parallel to X
  for (const y of [-half, half]) {
    for (const z of [-half, half]) {
      const edge = new THREE.Mesh(
        new THREE.BoxGeometry(size, thickness, thickness),
        material
      );

      edge.position.set(0, y, z);
      parent.add(edge);
    }
  }

  // Edges parallel to Y
  for (const x of [-half, half]) {
    for (const z of [-half, half]) {
      const edge = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, size, thickness),
        material
      );

      edge.position.set(x, 0, z);
      parent.add(edge);
    }
  }

  // Edges parallel to Z
  for (const x of [-half, half]) {
    for (const y of [-half, half]) {
      const edge = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, thickness, size),
        material
      );

      edge.position.set(x, y, 0);
      parent.add(edge);
    }
  }
}