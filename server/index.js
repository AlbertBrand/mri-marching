const fs = require('fs');
const path = require('path');
const buildScene = require('./buildScene');
const exporter = require('./exporter');

const scene = buildScene();
exporter(scene).then(gltf => {
  const data = JSON.stringify(gltf);
  fs.writeFileSync(path.join(__dirname, '../client/scenes/scene_1.gltf.json'), data);
});
