require('./setup');

const gltfExporter = new THREE.GLTFExporter();

function exporter(scene) {
  return new Promise((resolve) => {
    gltfExporter.parse(scene, gltf => {
      resolve(gltf);
    });
  });
}

module.exports = exporter;