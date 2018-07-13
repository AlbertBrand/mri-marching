// create a polyfilled environment to run Three exports in Node
const JSDOM = require("jsdom").JSDOM;
const dom = new JSDOM(`<!DOCTYPE html>`);
global.window = {
  FileReader: dom.window.FileReader
};
global.Blob = dom.window.Blob;

global.THREE = require('three');
require('three/examples/js/exporters/GLTFExporter');
