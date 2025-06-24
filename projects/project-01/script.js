import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarField from "./getStarField.js";

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

document.body.appendChild(renderer.domElement);
const aspect = w/h;
const fov = 75;
const near = 0.01;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;
const scene = new THREE.Scene();
const detail = 12;
const loader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, detail);
const mat = new THREE.MeshStandardMaterial({
    map: loader.load("./assets/textures/earthmap4k.jpg"),
});

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI /180; 

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.03;

const mesh = new THREE.Mesh(geo,mat);
scene.add(earthGroup);
earthGroup.add(mesh);

const stars = getStarField({numStars: 1000});
scene.add(stars);

const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("./assets/textures/03_earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geo,lightsMat);
earthGroup.add(lightsMesh);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0, 1.5);
scene.add(sunLight);

function animate(t = 0){
    requestAnimationFrame(animate);
    mesh.rotation.y = t* 0.0001;
    lightsMesh.rotation.y = t* 0.0001;

    renderer.render(scene, camera);
    controls.update();
}
animate();
  