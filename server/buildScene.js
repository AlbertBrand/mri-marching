const fs = require('fs');
const PNG = require('pngjs').PNG;
require('./setup');
require('./MarchingCubes');

const RESOLUTION = 40;
const SUBTRACT = 2;
const STRENGTH = 0.01;
const Y_OFFSET = 4;

const NUM_FRAMES = 40;
const NUM_SLICES = 25;
const SLICE_WIDTH = 184;
const SLICE_HEIGHT = 184;

function buildScene(overlay) {
  const scene = new THREE.Scene();

  const parts = [{
    name: 'endo3',
    color: 0xff0000,
  }, {
    name: 'myo2',
    color: 0x00ff00,
  }, {
    name: 'RV_endo4',
    color: 0x0000ff,
  }];

  parts.forEach(part => {
    const group = new THREE.Group();

    const path = '../mri/' + overlay + '/' + part.name + '/';

    const material = new THREE.MeshLambertMaterial({
      color: part.color,
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
              const dividend = si + Y_OFFSET;
              const divisor = NUM_SLICES + 2 * Y_OFFSET;
              const y = dividend / divisor;
              mc.addBall(x, y, z, STRENGTH, SUBTRACT);
            }
          }
        }
      }

      const mesh = new THREE.Mesh(mc.generateBufferGeometry(), mc.material);
      mesh.scale.set(500, 500, 500);
      group.add(mesh);
    }

    scene.add(group);
  });

  return scene;
}

module.exports = buildScene;