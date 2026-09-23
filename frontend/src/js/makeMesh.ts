import * as THREE from "three";

export function makePlaneMesh(material: "phong" | "standard" | "basic" = "standard") {
  if (!["phong", "standard", "basic"].includes(material)) {
    throw new Error(`Invalid material type: ${material}`);
  }

  const planeSize = 40;
  const loader = new THREE.TextureLoader();
  const texture = loader.load('/tinychecker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  const repeats = planeSize / 4;
  texture.repeat.set(repeats, repeats);

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);

  let planeMat;
  let mesh;

  switch(material) {
    case "basic":
      planeMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      break;
    case "phong":
      planeMat = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
      break;
    case "standard":
      planeMat = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
      break;
  }

  // planeMat.color.setRGB(1.5, 1.5, 1.5);

  mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -0.5;
  return mesh;
}

export function makeCubeMesh() {
  const cubeSize = 4;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);

  return mesh;
}

export function makeSphereMesh() {
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);

  return mesh;
}