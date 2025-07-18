import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import ao from "/textures/door/ambientOcclusion.jpg";
import color from "/textures/door/color.jpg";

const scene = new THREE.Scene();
//camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 15;
scene.add(camera);
//Group
const group = new THREE.Group();
//axis helper
const axisHelper = new THREE.AxesHelper(10);
scene.add(axisHelper);
//gui
const gui = new dat.GUI();
//texture
const loader = new THREE.TextureLoader();
const ao_loader = loader.load(ao);
const color_loader = loader.load(color);

//material
const material = new THREE.MeshStandardMaterial();
material.aoMap = ao_loader;
material.map = color_loader;

material.side = THREE.DoubleSide;
// material.color = new THREE.Color("red");
// material.wireframe = true;
material.opacity = 0.5;
material.transparent = true;
//geometry
const sphereGeometry = new THREE.SphereGeometry(2, 32, 16);
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
// Mesh
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
const planeMesh = new THREE.Mesh(planeGeometry, material);
const torusMesh = new THREE.Mesh(torusGeometry, material);
sphereMesh.position.x = -10;
torusMesh.position.x = 10;
group.add(sphereMesh);
group.add(planeMesh);
group.add(torusMesh);
scene.add(group);
//adding uv2 for the ambient occlusion
console.log(sphereGeometry.attributes.uv.array);
sphereGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphereGeometry.attributes.uv.array, 2)
);
planeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);
torusGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torusGeometry.attributes.uv.array, 2)
);

//Gui
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
document.body.appendChild(renderer.domElement);
// Light setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // dimmer ambient
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1); // brightness = 1
pointLight.position.set(1, 2, 3);
scene.add(pointLight);
// light helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
console.log("this is webpack threejs");
