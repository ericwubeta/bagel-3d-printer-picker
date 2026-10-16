'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const runtime = ['index.html', 'style-v04.css', 'pages.css', 'portraits.css', 'data.js', 'engine.js', 'questions.js', 'notes.js', 'diagrams.js', 'meow-data.js', 'welcome.js', 'prices.js', 'pages.js', 'assets-config.js', 'app-v04.js'];
const machines = ['a1-mini', 'a1', 'a2l', 'p1s', 'p2s', 'x2d', 'h2s', 'h2d', 'h2c'];
const brand = ['bagel-extra-poses.png', 'bagel-poses-soft-v02.png'].concat(Array.from({length: 8}, (_, i) => 'welcome-pose-' + i + '.png'));
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
function arg(name) { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; }
const profile = arg('--mode') || (arg('--private-assets') ? 'brand' : 'public');
if (!['public', 'brand'].includes(profile)) throw Error('Mode must be public or brand');
const privateAssets = profile === 'brand' ? path.resolve(arg('--private-assets') || path.join(root, 'private-assets')) : null;
const dist = path.resolve(root, 'dist', profile);
// Only these two resolved build directories may be replaced. Refuse symlinks and junctions.
if (![path.join(root, 'dist/public'), path.join(root, 'dist/brand')].includes(dist)) throw Error('Unsafe output path');
if (fs.lstatSync(root).isSymbolicLink() || fs.realpathSync(root) !== root) throw Error('Repository root must not be a symlink or junction');
const parent = path.join(root, 'dist');
if (fs.existsSync(parent) && (fs.lstatSync(parent).isSymbolicLink() || fs.realpathSync(parent) !== parent)) throw Error('Output parent must not be a symlink or junction');
if (fs.existsSync(dist) && (fs.lstatSync(dist).isSymbolicLink() || fs.realpathSync(dist) !== dist)) throw Error('Output must not be a symlink or junction');
const reports = path.join(root, 'output');
if (fs.existsSync(reports) && (fs.lstatSync(reports).isSymbolicLink() || fs.realpathSync(reports) !== reports)) throw Error('Report output must not be a symlink or junction');
// Validate all inputs before replacing previous build output.
const inputs = runtime.map(file => [file, path.join(root, 'web', file)]).concat(brand.map(file => ['assets/' + file, path.join(root, 'web/assets', file)]));
inputs.push(['licensing/runtime-attribution.json', path.join(root, 'licensing/runtime-attribution.json')]);
machines.forEach(id => inputs.push(['assets/' + id + (privateAssets ? '.png' : '.svg'), privateAssets ? path.resolve(privateAssets, id + '.png') : path.join(root, 'web/assets', id + '.svg')]));
for (const [file, source] of inputs) {
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) throw Error('Missing build input: ' + file);
  if (file.endsWith('.js')) new vm.Script(fs.readFileSync(source, 'utf8'), {filename: file});
  if (file.endsWith('.json')) JSON.parse(fs.readFileSync(source, 'utf8'));
}
const noteContent = JSON.parse(fs.readFileSync(path.join(root, 'content/notes.json'), 'utf8'));
if (!noteContent || !Array.isArray(noteContent.list)) throw Error('Invalid note content');
// Keep CC-licensed prose separate from the MIT query wrapper. No runtime JSON request.
const noteScript = '// SPDX-License-Identifier: CC-BY-NC-4.0\n// Generated from content/notes.json; see licensing/runtime-attribution.json.\nvar BagelNoteContent = ' + JSON.stringify(noteContent, null, 2).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + ';\n';
new vm.Script(noteScript, {filename: 'note-content.js'});
const attributionFile = 'licensing/runtime-attribution.json';
const attribution = JSON.parse(fs.readFileSync(path.join(root, attributionFile), 'utf8'));
if (!Array.isArray(attribution.materials)) throw Error('Attribution materials must be an array');
if (privateAssets) {
  for (const id of machines) {
    const originals = attribution.materials.filter(item => (item.runtime_path || item.path) === 'assets/' + id + '.svg');
    if (originals.length !== 1) throw Error('Missing or ambiguous schematic attribution: ' + id);
    Object.assign(originals[0], {
      path: 'assets/' + id + '.png', runtime_path: 'assets/' + id + '.png',
      source_path: 'private-assets/' + id + '.png',
      license: 'NO-PUBLIC-REDISTRIBUTION-GRANT',
      creator: 'Vendor image; rights retained by the original rights holder',
      source: 'Local private vendor-image input; excluded from public source and public redistribution.',
      modifications: 'Copied for the local brand build; not relicensed under MIT or CC BY-NC-4.0.',
      third_party_exception: 'No public redistribution grant; excluded from MIT and CC BY-NC-4.0.'
    });
  }
}
const runtimeFiles = inputs.map(([file]) => file).concat(['note-content.js']);
for (const material of attribution.materials) {
  const file = material.runtime_path || material.path;
  if (file === attributionFile || !runtimeFiles.includes(file)) throw Error('Attribution path is not a runtime material: ' + file);
}
fs.rmSync(dist, {recursive: true, force: true});
fs.mkdirSync(path.join(dist, 'assets'), {recursive: true});
for (const [file, source] of inputs) {
  fs.mkdirSync(path.dirname(path.join(dist, file)), {recursive: true});
  fs.copyFileSync(source, path.join(dist, file));
}
fs.writeFileSync(path.join(dist, 'note-content.js'), noteScript, 'utf8');
if (privateAssets) {
  const data = require(path.join(root, 'web/data.js'));
  data.assetProfile = 'private-vendor-images';
  for (const model of data.models) { model.image = './assets/' + model.id + '.png'; model.imageCaption = '机型图片；尺寸与配置以资料为准'; }
  fs.writeFileSync(path.join(dist, 'data.js'), 'var BagelData = ' + JSON.stringify(data, null, 2) + ';\nif(typeof module!=="undefined"&&module.exports)module.exports=BagelData;\n');
}
for (const material of attribution.materials) {
  material.runtime_path = material.runtime_path || material.path;
  material.sha256 = hash(fs.readFileSync(path.join(dist, material.runtime_path)));
  if (privateAssets && material.license === 'NO-PUBLIC-REDISTRIBUTION-GRANT') material.source_sha256 = material.sha256;
}
fs.writeFileSync(path.join(dist, attributionFile), JSON.stringify(attribution, null, 2) + '\n', 'utf8');
const entries = runtimeFiles.map(file => {const buffer = fs.readFileSync(path.join(dist, file)); return {file, bytes: buffer.length, sha256: hash(buffer)};}).sort((a, b) => a.file.localeCompare(b.file, 'en'));
const report = {mode: profile, output: 'dist/' + profile, count: entries.length, totalBytes: entries.reduce((n, item) => n + item.bytes, 0), files: entries};
fs.mkdirSync(path.join(root, 'output'), {recursive: true});
fs.writeFileSync(path.join(root, 'output/manifest-' + profile + '.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({mode: profile, output: 'dist/' + profile, files: report.count, totalBytes: report.totalBytes}));
