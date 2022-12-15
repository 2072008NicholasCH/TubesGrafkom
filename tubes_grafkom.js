const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x444444, 1);

document.body.appendChild(renderer.domElement);

const orbitCtl = new THREE.OrbitControls(camera, renderer.domElement);

const gltfLoader = new THREE.GLTFLoader();
gltfLoader.load(
    "assets/Chevrolet_Camaro_SS_Red.glb",
    (gltf)=>{
        scene.add(gltf.scene);
    },
    undefined,
    (err)=>{
        console.log(err);
    });


const spot = new THREE.SpotLight(0xffffff, 1);
spot.position.y = -5;
spot.position.x = 3;
spot.position.z = 7;
spot.power = 3;
scene.add(spot);

const spot2 = new THREE.SpotLight(0xffffff, 1);
spot2.position.y = -5;
spot2.position.x = -3;
spot2.position.z = 7;
spot2.power = 3;
scene.add(spot2);

function draw(){
    renderer.render(scene, camera);
    orbitCtl.update();

    requestAnimationFrame(draw);
}

draw();
