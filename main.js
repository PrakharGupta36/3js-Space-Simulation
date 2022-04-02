import * as three from "three";
import gsap from "gsap";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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

// objects
const cube1 = new three.Mesh(
  new three.BoxGeometry(1, 1, 1),
  new three.MeshBasicMaterial({ color: "red" })
);

cube1.scale.set(0.75, 0.75, 0.75);

group.add(cube1);

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

camera.position.z = 3;

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

  controls.update();
  // render

  rendered.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
