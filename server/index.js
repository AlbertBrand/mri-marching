const fs = require('fs');
const path = require('path');
const buildScene = require('./buildScene');
const exporter = require('./exporter');

const overlays = ['interpolated_overlays_0002', 'interpolated_overlays_0070'];
overlays.forEach(overlay => {
  const scene = buildScene(overlay);
  exporter(scene).then(gltf => {
    const data = JSON.stringify(gltf);
    fs.writeFileSync(path.join(__dirname, '../client/scenes/' + overlay + '.gltf.json'), data);
  });
});
