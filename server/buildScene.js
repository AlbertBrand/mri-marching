const fs = require('fs');
const PNG = require('pngjs').PNG;
require('./setup');
require('./MarchingCubes');

const RESOLUTION = 60;
const SUBTRACT = 5;
const STRENGTH = 0.01;
const Y_OFFSET = 4;

const NUM_FRAMES = 40;
const NUM_SLICES = 25;
const SLICE_WIDTH = 184;
const SLICE_HEIGHT = 184;

function buildScene() {
  const scene = new THREE.Scene();

  const path = '../mri/interpolated_overlays_0002/endo3/';

  const material = new THREE.MeshLambertMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });

  const mc = new THREE.MarchingCubes(RESOLUTION, material);

  // create meshes for each frame
  for (let sf = 0; sf < NUM_FRAMES; sf++) {
    mc.reset();

    for (let si = 0; si < NUM_SLICES; si++) {
      const buffer = fs.readFileSync(path + 'sl' + String(si).padStart(2, '0') + '-fr' + String(sf).padStart(3, '0') + '.png');
      const data = PNG.sync.read(buffer).data;

      for (let sy = 0; sy < SLICE_HEIGHT; sy++) {
        for (let sx = 0; sx < SLICE_WIDTH; sx++) {
          const offset = (sx + sy * SLICE_WIDTH) << 2;
          if (data[offset]) {
            const x = sx / SLICE_WIDTH;
            const z = (SLICE_WIDTH - sy) / SLICE_WIDTH;
            const dividend = (NUM_SLICES - si) + Y_OFFSET; // add extra offset
            const divisor = NUM_SLICES + 2 * Y_OFFSET; // add extra offset
            const y = dividend / divisor;
            mc.addBall(x, y, z, STRENGTH, SUBTRACT);
          }
        }
      }
    }

    const mesh = new THREE.Mesh(mc.generateBufferGeometry(), mc.material);
    mesh.scale.set(500, 500, 500);
    scene.add(mesh);
  }

  return scene;
}

module.exports = buildScene;