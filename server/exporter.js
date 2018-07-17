require('./setup');
require('three/examples/js/exporters/GLTFExporter');

const gltfExporter = new THREE.GLTFExporter();

function exporter(scene) {
  return new Promise((resolve) => {
    gltfExporter.parse(scene, gltf => {
      resolve(gltf);
    });
  });
}

module.exports = exporter;