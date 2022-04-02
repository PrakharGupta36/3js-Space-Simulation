import * as three from "three";
import gsap from "gsap";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import earthTexture from "./textures/earth.jpeg";
import moonTexture from "./textures/moon.jpeg";
import spaceTexture from "./textures/space.jpeg";
import sunTexture from "./textures/sun.jpeg";
import * as dat from "dat.gui";

console.log(dat);

// UI Controls
const gui = new dat.GUI({ closed: true });

// Cursor-controls
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
const textureEarth = new three.TextureLoader().load(earthTexture);
const textureMoon = new three.TextureLoader().load(moonTexture);
const textureSun = new three.TextureLoader().load(sunTexture);

// objects
const earth = new three.Mesh(
  new three.SphereGeometry(4, 32, 16),
  new three.MeshBasicMaterial({ map: textureEarth })
);

const moon = new three.Mesh(
  new three.SphereGeometry(1.5, 32, 16),
  new three.MeshBasicMaterial({ map: textureMoon })
);

// const sun = new three.Mesh(
//   new three.SphereGeometry(2, 32, 16),
//   new three.MeshBasicMaterial({ map: textureSun })
// );

moon.position.x = 12;

earth.scale.set(1.85, 1.85, 1.85);

group.add(earth, moon);

// GUI
gui.add(earth.position, "x").min(-3).max(3).step(0.01);
gui.add(earth.position, "y").min(-3).max(3).step(0.01);
gui.add(earth.position, "z").min(-3).max(3).step(0.01);

gui.add(earth, "visible");

gui.add(earth.material, "wireframe");

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

// background texture
let background = new three.TextureLoader().load(spaceTexture);

scene.background = background;

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
var t = 0;
const tick = () => {
  t += 0.0075;
  const elapsedTime = clock.getElapsedTime();

  earth.rotation.y = elapsedTime * 0.2;
  moon.position.x = 20 * Math.cos(t) + 0;
  moon.position.z = 20 * Math.sin(t) + 0;

  controls.update();
  // render

  rendered.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
