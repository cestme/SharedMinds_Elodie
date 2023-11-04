let camera3D, scene, renderer;
let heartShape, mesh;
let dir = 0.1;

init3D();

function init3D() { //like setup
    scene = new THREE.Scene();
    camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // scene.background = new THREE.Color("#480CA8");

    const texture = new THREE.CanvasTexture(createGradientCanvas());
    scene.background = texture;
    
    const x = 0, y = 0;

    heartShape = new THREE.Shape();
    
    heartShape.moveTo( x + 5, y + 5 );
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );
    
    const geometry = new THREE.ShapeGeometry( heartShape );
    const material = new THREE.MeshPhongMaterial( { color: "grey" } );
    mesh = new THREE.Mesh( geometry, material ) ;
    mesh.scale.set(0.5,0.5,0.5)
    mesh.position.set(0,5,5);
    mesh.rotation.z = Math.PI;
    scene.add( mesh );

    mesh2 = new THREE.Mesh( geometry, material ) ;
    mesh2.position.set(20,20,5);
    mesh2.scale.set(0.5,0.5,0.5);
    mesh2.rotation.z = Math.PI;
    scene.add( mesh2 );

    mesh3 = new THREE.Mesh( geometry, material ) ;
    mesh3.position.set(-20,-15,-5)
    mesh3.scale.set(0.5,0.5,0.5)
    mesh3.rotation.z = Math.PI;
    scene.add( mesh3 );


    // const directionalLight = new THREE.DirectionalLight( "red", 0.5 );
    // directionalLight.position.set(1, 1, -1);
    // directionalLight.lookAt(0, 0, 0);
    // scene.add( directionalLight );
    
    light1 = new THREE.PointLight("#4CC9F0", 1);
    light1.position.set(10, 10, -10);
    scene.add(light1);

    light2 = new THREE.PointLight("#4361EE", 1);
    light2.position.set(-10, -10, -10);
    scene.add(light2);

    light3 = new THREE.PointLight("#3A0CA3", 1);
    light3.position.set(-10, 10, -10);
    scene.add(light3);

    light4 = new THREE.PointLight("#560BAD", 1);
    light4.position.set(10, -10, -10);
    scene.add(light4);

    light5 = new THREE.PointLight("#B5179E", 1);
    light5.position.set(10, 10, 10);
    scene.add(light5);

    light6 = new THREE.PointLight("#F72585", 1);
    light6.position.set(10, -10, 10);
    scene.add(light6);

    light7 = new THREE.PointLight("#4895EF", 1);
    light7.position.set(-10, 10, 10);
    scene.add(light7);
    
    light8 = new THREE.PointLight("#3F37C9", 1);
    light8.position.set(-10, -10, 10);
    scene.add(light8);
    
    
    
    camera3D.position.z = 50;
    animate(); 
}


function animate() {  //like draw
    requestAnimationFrame(animate);  //call it self, almost recursive
    // cube.position.setZ(cube.position.z + dir);
    mesh.rotation.y -= 0.01;
    mesh.rotation.x -= 0.01;
    mesh.rotation.z += 0.01;
    //mesh.position.setX(mesh.position.x + dir);

    mesh2.rotation.y += 0.01;
    mesh2.rotation.x -= 0.01;
    mesh2.rotation.z -= 0.01;

    mesh3.rotation.y += 0.01;
    mesh3.rotation.x += 0.01;
    mesh3.rotation.z -= 0.01;
    // if (cube.position.z < -100 || cube.position.z > -10) {
    //     dir = -dir;
    // }
    renderer.render(scene, camera3D);
}


function createGradientCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const context = canvas.getContext('2d');
  
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#E0B1CB');
    gradient.addColorStop(1, '#5E548E');
  
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    return canvas;
  }
