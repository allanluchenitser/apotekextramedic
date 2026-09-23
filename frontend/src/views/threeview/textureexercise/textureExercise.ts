import * as THREE from 'three'
import type { ThreeSceneContext } from "@/views/threeview/threeContextUtils"

import { addCubeFrame } from '@/js/util';

export default {
  setup(ctx: ThreeSceneContext) {
    const scene = ctx.scene;
    console.log(scene);

    const loader = new THREE.TextureLoader();

    const material = new THREE.MeshBasicMaterial({
      // color: "#ff8844",
      map: loadColorTexture('/george/georgeTexture1.webp')
    })

    // const materials = [
    //   new THREE.MeshBasicMaterial({ color: "ff8844", map: loadColorTexture('/george/georgeTexture1.webp') }),
    //   new THREE.MeshBasicMaterial({ color: "ff8844", map: loadColorTexture('/george/georgeTexture2.webp') }),
    //   new THREE.MeshBasicMaterial({ color: "ff8844", map: loadColorTexture('/george/georgeTexture3.webp') }),
    //   new THREE.MeshBasicMaterial({ color: "ff8844", map: loadColorTexture('/george/georgeTexture4.webp') }),
    //   new THREE.MeshBasicMaterial({ color: "ff8844", map: loadColorTexture('/george/georgeTexture5.webp') }),
    //   new THREE.MeshBasicMaterial({ color: "ff8844", map: loadColorTexture('/george/georgeTexture6.webp') }),
    // ]

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    const mesh = new THREE.Mesh(boxGeometry, material);
    addCubeFrame(mesh, { color: "white" })
    ctx.scene.add(mesh);

    function loadColorTexture( path: string ) {
      const texture = loader.load( path );
      texture.colorSpace = THREE.SRGBColorSpace;

      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.offset.set(0.2, 0.5);
      texture.rotation = THREE.MathUtils.degToRad(45);

      texture.repeat.set(3, 3)

      return texture;
    }
  },
}