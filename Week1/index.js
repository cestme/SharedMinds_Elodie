import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

let camera, scene, renderer, controls;

let dot;

let moveForward = false;
			let moveBackward = false;
			let moveLeft = false;
			let moveRight = false;
			let canJump = false;

			let prevTime = performance.now();
			const velocity = new THREE.Vector3();
			const direction = new THREE.Vector3();
			const vertex = new THREE.Vector3();
			const color = new THREE.Color();

function init() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.x = 90; 
  camera.position.z = 50; 
  camera.position.y = 10; 
  
  //camera.rotateX(Math.PI/2);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//   let gridHelper = new THREE.GridHelper(25, 25);
//   scene.add(gridHelper);
controls = new PointerLockControls( camera, document.body );
// let controls = new OrbitControls(camera, renderer.domElement);
// controls.target()
//let controls = new FirstPersonControls(camera, renderer.domElement);
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
            if ( canJump === true ) velocity.y += 350;
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

 //light
  scene.add(new THREE.AmbientLight(new THREE.Color("0xffffff"), 0.8));
  let light = new THREE.DirectionalLight(0xffffff, 0.75);
    light.position.set(200, 300, 200);
    light.lookAt(0, 0, 0);
    
    light.castShadow = true;
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    scene.add(light);

    
    dot = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), new THREE.MeshBasicMaterial({color: "black"}));
    scene.add(dot);
    dot.add(camera);

//   loop();
  buildings();
  stars();
  tallb();
}

function buildings(){

  
for (let i = -200; i < 200; i+=50){
    for (let j = -200; j < 200; j+=Math.random()*50){
    //set random numbers
    let randomY = (Math.random()+0.2)*120;
    let randomWidth = (Math.random()+0.5)*10;
    let randomLength = (Math.random()+0.3)*13;


    const geometry = new THREE.BoxGeometry( randomWidth, randomY, randomLength );
    geometry.translate( 0, randomY/2, 0 );
    const material = new THREE.MeshPhysicalMaterial( {color: "#998FC7"} );
    const cube = new THREE.Mesh( geometry, material );
    cube.castShadow = true;

    cube.position.y = 0;
    cube.position.x = i;
    cube.position.z = j;

    scene.add( cube );
    }
}

for (let i = 190; i > -200; i-=55){
    for (let j = 190; j > -190; j-=Math.random()*50){
    //set random numbers
    let randomY = (Math.random()+0.1)*110;
    let randomWidth = (Math.random()+0.5)*15;
    let randomLength = (Math.random()+0.3)*12;


    const geometry2 = new THREE.BoxGeometry( randomWidth, randomY, randomLength );
    geometry2.translate( 0, randomY/2, 0 );
    const material2 = new THREE.MeshMatcapMaterial( {color: "#998FC7"} );
    const cube2 = new THREE.Mesh( geometry2, material2 );
    cube2.castShadow = true;
    
    cube2.position.y = 0;
    cube2.position.x = j;
    cube2.position.z = i;
    scene.add( cube2 );
    }

//ground
// const materialGround = new THREE.MeshBasicMaterial( {color:"#28262C", side: THREE.DoubleSide} );
// const plane = new THREE.Mesh( new THREE.PlaneGeometry( 210, 210 ), materialGround );
// plane.rotateX(Math.PI/2);
// scene.add( plane );




const ground = new THREE.Mesh( new THREE.ConeGeometry( 300, 150, 4 ), new THREE.MeshBasicMaterial( {color: "#28262C"} ) );
//ground.rotateY(Math.PI);
ground.rotateY(Math.PI/4);
ground.rotateZ(Math.PI);
ground.position.y = -75;
scene.add( ground );
ground.receiveShadow = true;
}

}

function stars(){
    for (let i = -1000; i < 1000; i+=40){
        for (let j = -1000; j < 1000; j+=Math.random()*40){
let stars = new THREE.Mesh(new THREE.OctahedronGeometry(10,0), new THREE.MeshLambertMaterial({ color: '#FFF' }))
let starsScale = Math.random()/10;
stars.scale.set(starsScale, starsScale, starsScale);
stars.position.set(i,300+Math.random()*30,j);
scene.add(stars);

        }
    }
}


function tallb(){
    const geometry = new THREE.BoxGeometry( 20, 240, 20 );
    const material = new THREE.MeshMatcapMaterial( {color: "#998FC7"} );
    const building = new THREE.Mesh( geometry, material );
    building.position.set(20,60,20);
    building.castShadow = true;
    scene.add( building );

    //right
    let window1 = new THREE.Mesh(new THREE.BoxGeometry( 0.1, 5, 5 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    window1.position.set(10, 10, 5);
    building.add(window1);
    let window2 = new THREE.Mesh(new THREE.BoxGeometry( 0.1, 5, 5 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    window2.position.set(10, 50, -5);
    building.add(window2);
    let w1 = new THREE.Mesh(new THREE.BoxGeometry( 0.1, 5, 5 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    w1.position.set(10, 100, -5);
    building.add(w1);
    let w2 = new THREE.Mesh(new THREE.BoxGeometry( 0.1, 5, 5 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    w2.position.set(10, 80, 5);
    building.add(w2);

    //front
    let window3 = new THREE.Mesh(new THREE.BoxGeometry( 5, 5, 0.1 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    window3.position.set(-5, 40, 10);
    building.add(window3);
    let window4 = new THREE.Mesh(new THREE.BoxGeometry( 5, 5, 0.1 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    window4.position.set(5,-10, 10);
    building.add(window4);
    let w3 = new THREE.Mesh(new THREE.BoxGeometry( 5, 5, 0.1 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    w3.position.set(5,110, 10);
    building.add(w3);
    let w4 = new THREE.Mesh(new THREE.BoxGeometry( 5, 5, 0.1 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    w4.position.set(5,70, 10);
    building.add(w4);

    //left
    let window5 = new THREE.Mesh(new THREE.BoxGeometry( 0.1, 5, 5 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    window5.position.set(-10, 5, 5);
    building.add(window5);
    let window6 = new THREE.Mesh(new THREE.BoxGeometry( 0.1, 5, 5 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    window6.position.set(-10, 45, -5);
    building.add(window6);
    let w5 = new THREE.Mesh(new THREE.BoxGeometry( 0.1, 5, 5 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    w5.position.set(-10, 95, 5);
    building.add(w5);
    let w6 = new THREE.Mesh(new THREE.BoxGeometry( 0.1, 5, 5 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    w6.position.set(-10, 75, -5);
    building.add(w6);

   //back
    let window7 = new THREE.Mesh(new THREE.BoxGeometry( 5, 5, 0.1 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    window7.position.set(5, 30, -10);
    building.add(window7);
    let window8 = new THREE.Mesh(new THREE.BoxGeometry( 5, 5, 0.1 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    window8.position.set(-5, -20, -10);
    building.add(window8);
    let w7 = new THREE.Mesh(new THREE.BoxGeometry( 5, 5, 0.1 ), new THREE.MeshLambertMaterial( {color: "#F7B801"} ))
    w7.position.set(-5, 90, -10);
    building.add(w7);
   
}

function animate() {

    requestAnimationFrame( animate );

    const time = performance.now();

    if ( controls.isLocked === true ) {

        // raycaster.ray.origin.copy( controls.getObject().position );
        // raycaster.ray.origin.y -= 10;

        // const intersections = raycaster.intersectObjects( objects, false );

        //const onObject = intersections.length > 0;

        const delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        // if ( onObject === true ) {

        //     velocity.y = Math.max( 0, velocity.y );
        //     canJump = true;

        // }

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

    }

    prevTime = time;

    renderer.render( scene, camera );

}



  
  init();
  animate();