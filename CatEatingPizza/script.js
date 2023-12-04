import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let gltf;
let pizza;
let isHappy = false;
let mouth;


// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 7;
//camera.lookAt(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const video = document.getElementById('video');
video.style.position = 'absolute';
video.style.top = '0';
video.style.left = '0';

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
      animate();
    },
    err => console.error(err)
  );
}

loadModel();
function loadModel() {
  let loader = new GLTFLoader();

  loader.load("./cat.glb", function (loadedGltf) {
    gltf = loadedGltf;
    scene.add(gltf.scene);
    gltf.scene.position.set(-5, 0, 0);
    gltf.scene.scale.set(5, 5, 5);
    gltf.scene.rotation.y = Math.PI/5*6;
  });

  //Cat mouth
  const mouthGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.01, 64); // 参数：底部半径，顶部半径，高度，分段数
  const mouthMaterial = new THREE.MeshBasicMaterial({ color: "#cd6486" });
  mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
  scene.add(mouth);
  mouth.position.set(-0.06,0.72,0.75)
  mouth.rotation.x = Math.PI / 2; // Math.PI / 2=90度


  let loader2 = new GLTFLoader();
  loader2.load("./pizza3.glb", function (loadedGltf) {
    pizza = loadedGltf;
    scene.add(pizza.scene);
    pizza.scene.position.set(3, 3, 0.4);
    pizza.scene.scale.set(0.6,0.6,0.6);
    pizza.scene.rotation.x = Math.PI/2;
    pizza.scene.rotation.y = Math.PI/4;
  });


}

function animate() {
  //gltf.scene.visible = isHappy;
  mouth.visible = isHappy;
  
  //上下浮动
  // if (isHappy) {
  //   gltf.scene.position.y = Math.sin(Date.now() * 0.003) * 0.1;
  // } else {
  //   gltf.scene.position.y = 0;
  // }

  if (isHappy) {
    // 在 isHappy 为真时，移动到新位置
    var targetPosition = new THREE.Vector3(-0.06, 0.72, 0.75);
    pizza.scene.position.lerp(targetPosition, 0.15); // 调整插值因子，控制移动速度
    pizza.scene.visible = true;
    if (pizza.scene.position.x < 0 ) {
      pizza.scene.position.set(3, 3, 0.4)
    }

} else {pizza.scene.visible = false;
  pizza.scene.position.set(3, 3, 0.4);
} 

//if(pizza.scene.position==targetPosition){pizza.scene.visible = false}

console.log(pizza.scene.position)




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
        console.log("Happy detected!");
      }
    });

  }, 100);
});
