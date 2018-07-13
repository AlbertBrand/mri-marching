const buildScene = require('./buildScene');
const exporter = require('./exporter');

describe('exporter', () => {
  it('gives output', () => {
    const scene = buildScene();
    return expect(exporter(scene)).resolves.not.toBeUndefined();
  });
});