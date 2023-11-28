import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let gltfArray = [];
let isHappy = true; // 设置为 true

const video = document.getElementById('video');

// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;
camera.lookAt(0,0,0);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Color: white, Intensity: 0.5
scene.add(ambientLight);


// Position the video element
video.style.position = 'absolute';
video.style.top = '0';
video.style.left = '0';

// Load face-api.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => {
      video.srcObject = stream;
      // Start Three.js animation loop
      animate();
    },
    err => console.error(err)
  );
}

loadModel();
function loadModel() {
  setInterval(() => {
    let loader = new GLTFLoader();
    
    loader.load("./cat.glb", function (loadedGltf) {
      gltfArray.push(loadedGltf); // 添加到数组
      scene.add(loadedGltf.scene);
      loadedGltf.scene.position.set(Math.random() * 10 - 7, Math.random() * 10 - 5, Math.random() * 10 - 6); // 随机位置
      loadedGltf.scene.rotation.y = Math.PI/5*6;
    });
  }, 1000); // 每两秒加载一个模型
}

function animate() {
  gltfArray.forEach(gltf => {
    gltf.scene.visible = isHappy;
    gltf.scene.position.y = Math.sin(Date.now() * 0.003) * 0.1;
  });

  // Render Three.js scene
  renderer.render(scene, camera);

  // Continue the animation loop
  requestAnimationFrame(animate);
}








video.addEventListener('play', () => {
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(video, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // Check for "happy" expression
    resizedDetections.forEach(detection => {
      const happyProbability = detection.expressions.happy;
      isHappy = happyProbability > 0.5;
      if (happyProbability > 0.5) {
        console.log("Happy detected!")
      }
    });

  }, 100);
});
