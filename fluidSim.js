import * as THREE from 'three';
import {MarchingCubes} from "three/addons";

export default function fluidSim(container) {
    let camera;
    let scene;
    let light;
    let pointLight;
    let ambientLight;
    let material;
    let resolution;
    let effect;
    let renderer;
    let time = 0;

    const effectController = {
        speed: 2,
        numBlobs: 10,
        resolution: 32,
        isolation: 80
    }

    const clock = new THREE.Clock();


    // CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(-500, 500, 1500);

    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    // LIGHTS
    light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0.5, 0.5, 1);
    scene.add(light);

    pointLight = new THREE.PointLight(0xff7c00, 3, 0, 0);
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);

    ambientLight = new THREE.AmbientLight(0x323232, 3);
    scene.add(ambientLight);

    const path = 'textures/cube/SwedishRoyalCastle/';
    const format = '.jpg';
    const urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const reflectionCube = cubeTextureLoader.load(urls);

    material = new THREE.MeshStandardMaterial({color: 0x9c0000, envMap: reflectionCube, roughness: 0.1, metalness: 1.0})


    effect = new MarchingCubes(effectController.resolution, material, true, true, 100000);
    effect.position.set(0, 0, 0);
    effect.scale.set(700, 700, 700);

    effect.enableUvs = false;
    effect.enableColors = true;

    scene.add(effect);

    // RENDERER

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize);

    function animate() {

        render();

    }

    function render() {

        const delta = clock.getDelta();
        time += delta * effectController.speed * 0.5;
        effect.isolation = effectController.isolation;


        updateCubes(effect, time, effectController.numBlobs, false, false, false);

        // render

        renderer.render(scene, camera);
    }

    function updateCubes(object, time, numblobs, floor, wallx, wallz) {

        object.reset();

        // fill the field with some metaballs

        const rainbow = [
            new THREE.Color(0xff0000),
            new THREE.Color(0xffbb00),
            new THREE.Color(0xffff00),
            new THREE.Color(0x00ff00),
            new THREE.Color(0x0000ff),
            new THREE.Color(0x9400bd),
            new THREE.Color(0xc800eb)
        ];
        const subtract = 12;
        const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

        for (let i = 0; i < numblobs; i++) {

            const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
            const bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor
            const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;

            object.addBall(ballx, bally, ballz, strength, subtract);

        }

        if (floor) object.addPlaneY(2, 12);
        if (wallz) object.addPlaneZ(2, 12);
        if (wallx) object.addPlaneX(2, 12);

        object.update();

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
