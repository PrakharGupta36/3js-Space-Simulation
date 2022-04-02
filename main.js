import * as three from "three";
import gsap from "gsap";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import earthTexture from "./textures/earth.jpeg"

// controls
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  const { x, y } = cursor;
  cursor.x = e.clientX / sizes.width;
  cursor.y = e.clientY / sizes.height;
});

// scene
const scene = new three.Scene();
const group = new three.Group();
scene.add(group);

// texture
const texture = new three.TextureLoader().load(earthTexture);

// objects
const earth = new three.Mesh(
  new three.SphereGeometry(4, 32, 16),
  new three.MeshBasicMaterial({ map: texture })
);

earth.scale.set(1.85, 1.85, 1.85);

group.add(earth);

// camera
const sizes = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  rendered.setSize(sizes.width, sizes.height);
  rendered.setPixelRatio(Math.min(window.devicePixelRatio, 3));
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

const camera = new three.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  1,
  1000
);

camera.position.z = 30;

scene.add(camera);

// rendered
let canvas = document.querySelector(".webgl");
const rendered = new three.WebGLRenderer({
  canvas: canvas,
});
rendered.setSize(sizes.width, sizes.height);
rendered.setPixelRatio(Math.min(window.devicePixelRatio, 3));
rendered.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();

// time
const clock = new three.Clock();

// animations
const tick = () => {
  // current time
  const elapsedTime = clock.getElapsedTime();

  earth.rotation.y = elapsedTime * 0.2;

  controls.update();
  // render

  rendered.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
