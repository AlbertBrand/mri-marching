const buildScene = require('./buildScene');
const exporter = require('./exporter');

describe('exporter', () => {
  it('gives output', () => {
    const scene = buildScene('interpolated_overlays_0002');
    return expect(exporter(scene)).resolves.not.toBeUndefined();
  });
});