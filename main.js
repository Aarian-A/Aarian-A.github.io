//use npm run dev to start locally

import "/style.css";
import * as THREE from "https://unpkg.com/three@0.154.0/build/three.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import anime from "animejs";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

//gradient
const gradientMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  vertexColors: THREE.VertexColors,
});
gradientMaterial.onBeforeCompile = (shader) => {
  shader.vertexShader = `
    varying vec3 vWorldPosition;
    ${shader.vertexShader}
  `;
  shader.vertexShader = shader.vertexShader.replace(
    `#include <project_vertex>`,
    `
      #include <project_vertex>
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    `
  );

  shader.fragmentShader = `
    varying vec3 vWorldPosition;
    ${shader.fragmentShader}
  `;
  shader.fragmentShader = shader.fragmentShader.replace(
    `vec4 diffuseColor = vec4( diffuse, opacity );`,
    `
      vec3 color1 = vec3(0.76, 0.58, 0.77);
      vec3 color2 = vec3(0.74, 0.76, 0.78);
      vec3 gradientColor = mix(color1, color2, vWorldPosition.y / 10.0);
      vec4 diffuseColor = vec4(gradientColor, opacity);
    `
  );
};

//torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});
const torus = new THREE.Mesh(geometry, material);

torus.material = gradientMaterial;

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

//const lightHelper = new THREE.PointLightHelper(pointLight);
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

//const controls = new OrbitControls(camera, renderer.domElement);

//stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

//background
const spaceTexture = new THREE.TextureLoader().load(
  "./assets/kZdXmGG53CAodaH72tZ6ekYeCWN4LAgO_4TuUu_inMw.webp"
);
scene.background = spaceTexture;

const aarianTexture = new THREE.TextureLoader().load(
  "./assets/croppedsmilingfireup.png"
);

//aarian cube
const aarian = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: aarianTexture })
);

scene.add(aarian);

//bojji moon
const bojjiTexture = new THREE.TextureLoader().load(
  "./assets/Anhedonia (Final).png"
);

const bojji = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: bojjiTexture })
);

scene.add(bojji);

bojji.position.z = 30;
bojji.position.setX(-10);

aarian.position.z = -5;
aarian.position.x = 2;

//camera
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  bojji.rotation.x += 0.05;
  bojji.rotation.y += 0.075;
  bojji.rotation.z += 0.05;

  aarian.rotation.y += 0.01;
  aarian.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  bojji.rotation.x += 0.005;

  //controls.update();

  renderer.render(scene, camera);
}

const animateGradient = () => {
  anime({
    targets: torus.material,
    gradientOpacity: [0, 1], // Animate the opacity of the gradient
    easing: "easeInOutQuad",
    duration: 2000,
    update: () => {
      torus.material.needsUpdate = true; // Ensure material update for each frame
    },
  });
};

// Call the animation function whenever you want the animation to start
animateGradient();
animate();

// Example animation using Anime.js
const animateObject = () => {
  anime({
    targets: torus.position,
    x: 10,
    y: 5,
    z: 20,
    duration: 2000,
    easing: "easeInOutQuad",
  });
};

// Call the animation function whenever you want the animation to start
animateObject();
