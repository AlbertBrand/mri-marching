const MARGIN = 0;
const SPEED = 25;

let screenWidth, screenHeight;
let stats;
let camera, scene, renderer, controls, groups;
let light, pointLight;
let time = 0;
let clock;

function updateScreenSize() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight - 2 * MARGIN;
}

function onWindowResize() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight - 2 * MARGIN;

  camera.aspect = screenWidth / screenHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(screenWidth, screenHeight);
}

function init() {
  updateScreenSize();

  clock = new THREE.Clock();

  camera = new THREE.PerspectiveCamera(45, screenWidth / screenHeight, 1, 10000);
  camera.position.set(0, 1000, 1500);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);

  const container = document.getElementById('container');
  const info = document.getElementById("info");

  let query = window.location.search.substring(1);
  query = query !== '' ? query : 'interpolated_overlays_0002';

  const loader = new THREE.GLTFLoader();
  loader.load('scenes/' + query + '.gltf.json',
      gltf => {
        info.innerHTML = '';
        scene.add(gltf.scene);
        groups = gltf.scene.children;
      },
      xhr => {
        info.innerHTML = Math.floor(xhr.loaded / xhr.total * 100) + '% loaded';
      },
      error => {
        info.innerHTML = 'Loading scene failed';
        console.log('A load error happened', error);
      }
  );

  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0.5, 0.5, 1);
  scene.add(light);

  pointLight = new THREE.PointLight(0xff3300);
  pointLight.position.set(0, 0, 100);
  scene.add(pointLight);

  ambientLight = new THREE.AmbientLight(0x080808);
  scene.add(ambientLight);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(screenWidth, screenHeight);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = MARGIN + "px";
  renderer.domElement.style.left = "0px";
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  stats = new Stats();
  container.appendChild(stats.dom);

  window.addEventListener('resize', onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render() {
  const delta = clock.getDelta();
  time += delta * SPEED;

  if (groups) {
    groups.forEach(group => {
      group.children.forEach(mesh => {
        mesh.visible = false;
      });
    });
    const frame = Math.floor(time % groups[0].children.length);
    groups.forEach(group => {
      group.children[frame].visible = true;
    });
  }

  renderer.clear();
  renderer.render(scene, camera);
}

if (!Detector.webgl) Detector.addGetWebGLMessage();
init();
animate();
