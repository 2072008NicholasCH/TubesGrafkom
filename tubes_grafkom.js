const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
const road_albedo = new THREE.TextureLoader().load('assets/road_albedo.png');
const road_normal = new THREE.TextureLoader().load('assets/road_normal.png');
const gltfLoader = new THREE.GLTFLoader();

camera.position.z = -20;
camera.position.y = 5;

const canvas = document.getElementById("game-canvas");
canvas.width = window.innerWidth - 100;

const renderer = new THREE.WebGLRenderer({canvas: canvas});
const orbitCtl = new THREE.OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth - 100, window.innerHeight);
renderer.setClearColor(0x444444, 1);

let timeSec = 3;
let a = 0;  // Accelerasi - decelerasi merah
let b = 0;  // Accel - Decel biru
let akselA = 0;
let akselB = 0;
let randomB = 0;

const speedometer = document.getElementById("speedo");

// Mobil Merah
//-------------------------------------------------------------
let redCar;
gltfLoader.load(
    "assets/Chevrolet_Camaro_SS_Red.glb",
    (gltf) => {
        scene.add(gltf.scene);
        redCar = gltf.scene;
    },
    undefined,
    (err) => {
        console.log(err);
    });
//-------------------------------------------------------------


// Mobil Biru
//-------------------------------------------------------------
let blueCar;
gltfLoader.load(
    "assets/Chevrolet_Camaro_SS_Blue.glb",
    (gltf) => {
        gltf.scene.position.x = 10;
        scene.add(gltf.scene);
        blueCar = gltf.scene;
    },
    undefined,
    (err) => {
        console.log(err);
    });
//-------------------------------------------------------------

//jalan
//-------------------------------------------------------------
const geometry_plane2 = new THREE.PlaneGeometry(30, 5000);
const material_plane2 = new THREE.MeshPhongMaterial({ map: road_albedo, normalMap: road_normal });
const plane2 = new THREE.Mesh(geometry_plane2, material_plane2);
plane2.position.x = 5
plane2.position.y = -1.45
scene.add(plane2);
//-------------------------------------------------------------

//Lampu
//-------------------------------------------------------------
// const spot = new THREE.SpotLight(0xffffff, 1);
// spot.position.y = -5;
// spot.position.x = 10;
// spot.position.z = 7;
// spot.power = 3;
// scene.add(spot);

// const spot2 = new THREE.SpotLight(0xffffff, 1);
// spot2.position.y = 10;
// spot2.position.x = 10;
// spot2.position.x = 0;
// spot2.position.z = 0;w
// spot2.power = 5;
// scene.add(spot2);

// "Matahari"
//-------------------------------------------------------------
const sun = new THREE.SpotLight(0xffffff, 1);
sun.position.set(0, 500, 0);
sun.target.position.set(0, 0, 200);
sun.target.updateMatrixWorld();
sun.power = 7;
scene.add(sun);

const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);
//-------------------------------------------------------------

// Lampu mobil merah
//-------------------------------------------------------------
const redLight = new THREE.SpotLight(0xffffff, 1);
redLight.position.set(0, 0, 5);
redLight.target.position.z = 10000000000;
redLight.target.updateMatrixWorld();
redLight.power = 10;
scene.add(redLight);
//-------------------------------------------------------------


// Lampu mobil biru
//-------------------------------------------------------------
const blueLight = new THREE.SpotLight(0xffffff, 1);
blueLight.position.set(10, 0, 5);
blueLight.target.position.z = 10000000000;
blueLight.target.updateMatrixWorld();
blueLight.power = 10;
scene.add(blueLight);
//-------------------------------------------------------------
//-------------------------------------------------------------


// Fog
const fog = new THREE.Fog(0x555555, 50, 100);
scene.fog = fog;
//-------------------------------------------------------------

//Countdown
//-------------------------------------------------------------
function countdown() {
    console.log("COUNTDOWN!");
    const countDown = setInterval(() => {
        timeSec--;
        if (timeSec == -1) {
            document.getElementById("countdown-lamp").setAttribute("src", "assets/Hijau.png");
        } else if (timeSec == 0){
            document.getElementById("countdown-lamp").setAttribute("src", "assets/Kuning.png");
        } else if (timeSec == -2){
            document.getElementById("countdown-lamp").style.display = "none";
            clearInterval(countDown);
        }
    }, 1000);
}
//-------------------------------------------------------------

// Main
//-------------------------------------------------------------
let accelerate = false;
let decelerate = false;
const topSpeed = 5;


switch (mode) {
    case "easy":
        randomB = 0.007;
        break;
    case "medium":
        randomB = 0.0075;
        break;
    case "hard":
        randomB = 0.0095;
        break;
    case "insane":
        randomB = 0.01;
        break;

}

plane2.rotation.x = -1.571;

let finished = false;
function finish(car){
    if (!finished) {
        window.location = "finish.html?car=" + car;
    }
    finished = true;
}
//-------------------------------------------------------------

// Engine Sound
//-------------------------------------------------------------
const engine = new Audio();
engine.src = "assets/engine2.mp3";
engine.volume = 0.4;

let rpm = 1;

//-------------------------------------------------------------


//Drawer
//-------------------------------------------------------------
function draw() {
    renderer.render(scene, camera);
    orbitCtl.update();
    requestAnimationFrame(draw);
}

let accel = 0.01;
let gear = 1;
let changeGear = false;

function draw2() {
    akselA = Math.random() * 0.01;
    akselB = Math.random() * randomB;
    // console.log(`A=${akselA}`);
    // console.log(`B=${akselB}`);
    renderer.render(scene, camera);
    orbitCtl.update();

    blueCar.position.z += b;
    blueLight.position.z += b;

    if (b <= topSpeed) {
        b += akselB;
    }

    redCar.position.z += a;
    redLight.position.z += a;
    camera.position.z += a;

    if (accelerate){
        if (!changeGear){
            switch(gear){
                case 1:
                    accel = 0.06;
                    break;
                case 2:
                    accel = 0.04;
                    break;
                case 3:
                    accel = 0.02;
                    break;
                case 4:
                    accel = 0.01;
                    break;
                case 5:
                    accel = 0.009;
                    break;
                case 6:
                    accel = 0.008;
                    break;
            }
        }

        rpm += accel;

        if (rpm >= 4 && gear <= 5){
            changeGear = true;
            accel = -0.05;
            gear++;
        } else if (rpm <= 2.5){
            changeGear = false;
        }
    } else {
        rpm -= 0.01;
        if (rpm <= 1){
            rpm = 1;
        }
    }

    engine.playbackRate = rpm;
    
    speedometer.innerHTML = "Speed: " + Math.round(a * 40) + " KMH";

    if (accelerate && a <= topSpeed) {
        a += akselA;
    } else if (!accelerate && a > 0) {
        a -= 0.0075;
    }

    if (decelerate && a > 0) {
        // Rem
        a -= 0.008;
    }

    // Biar ga mundur
    if (a < 0) {
        a = 0;
    }

    if (redCar.position.z >= 2500){
        finish("Red");
    }

    if (blueCar.position.z >= 2500){
        finish("Blue");
    }

    orbitCtl.target.set(0, 0, redCar.position.z);

    requestAnimationFrame(draw2);
}
//-------------------------------------------------------------

//Listener
//-------------------------------------------------------------
document.addEventListener("keydown", (e) => {
    if (e.code == "KeyW") {
        accelerate = true;
    } else if (e.code == "KeyS") {
        decelerate = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code == "KeyW") {
        accelerate = false;
    } else if (e.code == "KeyS") {
        decelerate = false;
    }
});

window.addEventListener("resize", (e) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
//-------------------------------------------------------------

//Caller
//-------------------------------------------------------------
draw();
countdown();
engine.play();
engine.preservesPitch = false;

setTimeout(() => {
    draw2();
}, 4000);
//-------------------------------------------------------------