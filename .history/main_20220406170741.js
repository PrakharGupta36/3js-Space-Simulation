import * as three from "three";
import gsap from "gsap";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import earthTexture from "./textures/earth.jpeg";
import moonTexture from "./textures/moon.jpeg";
import spaceTexture from "./textures/space.jpeg";
import sunTexture from "./textures/sun.jpeg";
import * as dat from "dat.gui";

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
const loadingManager = new three.LoadingManager();

const textureLoader = new three.TextureLoader(loadingManager);

loadingManager.onStart = () => {
  console.log("Starting...");
};

loadingManager.onLoad = () => {
  console.log("OnLoaded...");
};

loadingManager.onError = () => {
  console.log("Error...");
};

const textureEarth = textureLoader.load(earthTexture);
const textureMoon = textureLoader.load(moonTexture);
const textureSun = textureLoader.load(sunTexture);

textureEarth.wrapS = three.Re;

// objects
const earth = new three.Mesh(
  new three.SphereGeometry(4, 32, 16),
  new three.MeshStandardMaterial({ map: textureEarth })
);

const moon = new three.Mesh(
  new three.SphereGeometry(1.5, 32, 16),
  new three.MeshStandardMaterial({ map: textureMoon })
);

const sun = new three.Mesh(
  new three.SphereGeometry(18, 32, 16),
  new three.MeshStandardMaterial({ map: textureSun })
);

moon.position.x = 12;
sun.position.x = 1000;

earth.scale.set(1.85, 1.85, 1.85);

// light

group.add(earth, moon, sun);

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

const light = new three.DirectionalLight(0xdfdfdf, 2, Infinity);
light.position.set(sun.position.x, sun.position.y, sun.position.z);

const pointLight = new three.PointLight(0xe68729, 300, 1000);
pointLight.position.set(
  sun.position.x + 1,
  sun.position.y + 1,
  sun.position.z + 1
);

camera.add(light, pointLight);

scene.add(camera);

// background texture
let background = new three.TextureLoader().load(spaceTexture);

scene.background = background;

// rendered
let canvas = document.querySelector(".webgl");
const rendered = new three.WebGLRenderer({
  canvas: canvas,
  antialias: true,
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
  sun.rotation.y = elapsedTime;

  moon.position.x = 20 * Math.cos(t);
  moon.position.z = 20 * Math.sin(t);

  controls.update();
  // render

  rendered.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
