import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

let gltf;
let isHappy = false;
let bunny;
let playground;
let bunnyPosition;

let controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set(22,1,14);
scene.background = new THREE.Color("lightblue");


const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

controls = new PointerLockControls( camera, document.body );

var geometry = new THREE.PlaneGeometry(10, 8); // 平面大小
var video = document.createElement('video');
video.width = 640; // 设置视频宽度
video.height = 480; // 设置视频高度
var videoTexture = new THREE.VideoTexture(video);
var material = new THREE.MeshBasicMaterial({ map: videoTexture });
var plane = new THREE.Mesh(geometry, material);
// heart.add(plane);

const x = 0, y = 0;

const heartShape = new THREE.Shape();

heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

const heartgeometry = new THREE.ShapeGeometry( heartShape );
const heartmaterial = new THREE.MeshBasicMaterial( { color: "pink" } );
const heart = new THREE.Mesh( heartgeometry, heartmaterial ) ;
scene.add( heart );
//heart.position.copy(bunnyPosition.clone().add(new THREE.Vector3(0.1, 1.2, 0.4)));
heart.rotation.z = Math.PI;
heart.scale.set(0.02,0.02,0.02)
heart.add(plane);
plane.rotation.z = Math.PI;
plane.position.set(5,25,-0.1);
plane.scale.set(2,2,2)

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo);

function startVideo() {


navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
        animate();
      })
      .catch(function (error) {
        console.error('Error accessing the camera:', error);
      });
}

loadModel();
function loadModel() {
  let loader = new GLTFLoader();
  loader.load("./bunny.glb", function (loadedGltf) {
    gltf = loadedGltf;
    bunny = gltf.scene;
    scene.add(gltf.scene);
    bunny.position.set(22, 0, 10);
    bunny.scale.set(0.1, 0.1, 0.1);
    //bunny.rotation.y = Math.PI/5*6;
  });

  let loader2 = new GLTFLoader();
  loader2.load("./city.glb", function (loadedGltf) {
    playground = loadedGltf;
    scene.add(playground.scene);
    playground.scene.position.set(0, -1, 0);
    playground.scene.scale.set(0.5,0.5,0.5);
    playground.scene.rotation.y = Math.PI;
    // playground.scene.rotation.y = Math.PI/4;
  });

  

}



function animate() {

var offsetY = -0.5;
var offsetZ = -1.5;
bunny.position.lerp(camera.position.clone().add(new THREE.Vector3(0, offsetY, offsetZ)), 0.01);
bunny.lookAt(camera.position);
heart.lookAt(camera.position);

bunnyPosition = bunny.position;
if (isHappy) {
  
  heart.position.y +=0.008
  heart.visible = true;

  const swayAmount = 0.3; // 摇晃的幅度
   heart.rotation.z = Math.sin(Date.now() * 0.002) * swayAmount+ Math.PI;

  if(heart.position.y >2.5){
    //heart.position.set(0,0,0);
    heart.position.copy(bunnyPosition.clone().add(new THREE.Vector3(0.1, 0.8, 0.2)));
  }

} 
else {heart.visible = false;
  heart.position.copy(bunnyPosition.clone().add(new THREE.Vector3(0.1, 0.8, 0.2)));
} 



  Control()
  renderer.render(scene, camera);

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

function Control() {
  const time = performance.now();

  if ( controls.isLocked === true ) {


      //set speed
      const delta = ( time - prevTime ) / 6000;

      velocity.x -= velocity.x * 20.0 * delta;
      velocity.z -= velocity.z * 20.0 * delta;

      velocity.y -= 6 * 100.0 * delta; // 100.0 = mass

      direction.z = Number( moveForward ) - Number( moveBackward );
      direction.x = Number( moveRight ) - Number( moveLeft );
      direction.normalize(); // this ensures consistent movements in all directions

      if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
      if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;


      controls.moveRight( - velocity.x * delta );
      controls.moveForward( - velocity.z * delta );

      controls.getObject().position.y += ( velocity.y * delta ); // new behavior

      if ( controls.getObject().position.y < 0 ) {

          velocity.y = 0;
          controls.getObject().position.y = 0;

          canJump = true;

      }

  }

  prevTime = time;

}

Key()
function Key(){
instructions.addEventListener( 'click', function () {

  controls.lock();

} );

controls.addEventListener( 'lock', function () {

  instructions.style.display = 'none';
  blocker.style.display = 'none';

} );

controls.addEventListener( 'unlock', function () {

  blocker.style.display = 'block';
  instructions.style.display = '';

} );
const onKeyDown = function ( event ) {

  switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
          moveForward = true;
          break;

      case 'ArrowLeft':
      case 'KeyA':
          moveLeft = true;
          break;

      case 'ArrowDown':
      case 'KeyS':
          moveBackward = true;
          break;

      case 'ArrowRight':
      case 'KeyD':
          moveRight = true;
          break;

      case 'Space':
          if ( canJump === true ) velocity.y += 50;
          canJump = false;
          break;

  }

};
const onKeyUp = function ( event ) {

  switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
          moveForward = false;
          break;

      case 'ArrowLeft':
      case 'KeyA':
          moveLeft = false;
          break;

      case 'ArrowDown':
      case 'KeyS':
          moveBackward = false;
          break;

      case 'ArrowRight':
      case 'KeyD':
          moveRight = false;
          break;

  }

};
document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );
}