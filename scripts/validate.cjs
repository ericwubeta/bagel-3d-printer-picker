'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const modeIndex = process.argv.indexOf('--mode');
const mode = modeIndex < 0 ? 'public' : process.argv[modeIndex + 1];
if (!['public', 'brand'].includes(mode)) throw Error('Mode must be public or brand');
const dist = path.join(root, 'dist', mode);
for (const dir of [root, path.join(root, 'dist'), dist, path.join(root, 'output')]) {
  if (fs.lstatSync(dir).isSymbolicLink() || fs.realpathSync(dir) !== dir) throw Error('Validation paths must not be symlinks or junctions');
}
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'output/manifest-' + mode + '.json'), 'utf8'));
const errors = [], warnings = [];
function walk(dir) {return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
  if (entry.isSymbolicLink()) throw Error('Symlink in runtime output: ' + entry.name);
  return entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.relative(dist, path.join(dir, entry.name)).replace(/\\/g, '/')];
});}
const actual = walk(dist).sort();
const expected = manifest.files.map(item => item.file).sort();
if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push('Output file inventory differs from build manifest');
if (actual.filter(file => file.endsWith('.html')).join(',') !== 'index.html') errors.push('Exactly one root index.html required');
const allowed = /\.(?:html|css|js|png|jpe?g|gif|webp|svg|woff2?|json)$/;
const forbidden = /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|Worker|SharedWorker|eval)\s*\(|new\s+Function\b|navigator\.(?:clipboard|serviceWorker|geolocation|bluetooth|usb|hid|serial)|window\.open\s*\(|\?\.|\?\?|\b(?:import|export)\s|\b(?:WebAssembly|RTCPeerConnection|PaymentRequest)\b/;
const newApi = /\.\s*(?:matchAll|replaceAll|flatMap|flat|at|toSorted)\s*\(|\bglobalThis\b/;
const sourceTexts = [];
let textBytes = 0;
for (const item of manifest.files) {
  const full = path.join(dist, item.file);
  if (!allowed.test(item.file)) errors.push('Disallowed runtime type: ' + item.file);
  if (!fs.existsSync(full)) continue;
  const buffer = fs.readFileSync(full);
  if (buffer.length !== item.bytes || crypto.createHash('sha256').update(buffer).digest('hex') !== item.sha256) errors.push('Build hash/size mismatch: ' + item.file);
  if (/\.(?:html|css|js|json|svg)$/.test(item.file)) {
    const text = buffer.toString('utf8'); sourceTexts.push(text); textBytes += buffer.length;
    if (item.file.endsWith('.json')) {
      try {JSON.parse(text);} catch (error) {errors.push('Invalid JSON: ' + item.file);}
    }
    if (/[A-Z]:[\\/]|AppData|(?:sk-[a-zA-Z0-9]{20,})|(?:gh[pousr]_[A-Za-z0-9]{20,})|xsec_token|access_token|API_KEY/.test(text)) errors.push('Potential private path or credential: ' + item.file);
    if (/\.(?:html|css|svg)$/.test(item.file)) {
      const refs = Array.from(text.matchAll(/(?:src|href)=["']([^"']+)["']|url\(["']?([^)'"\s]+)["']?\)/g)).map(match => match[1] || match[2]);
      for (const ref of refs) if (!ref.startsWith('#') && (ref.startsWith('data:') || ref.startsWith('blob:') || !ref.startsWith('./') || !fs.existsSync(path.resolve(path.dirname(full), ref)))) errors.push('Nonlocal or missing resource: ' + item.file + ' -> ' + ref);
    }
    if (item.file.endsWith('.js')) {
      try {new vm.Script(text, {filename: item.file});} catch (error) {errors.push(error.message);}
      if (forbidden.test(text) || newApi.test(text)) errors.push('Forbidden capability or post-baseline JS found: ' + item.file);
    }
    if (item.file.endsWith('.css') && /(?:^|[;{\s])(?:gap|row-gap|column-gap)\s*:|aspect-ratio\s*:|\b(?:clamp|min|max)\(|:has\(|:focus-visible|@container|@layer|\b\d+(?:dvh|svh|lvh)\b/.test(text)) errors.push('Modern-only CSS needs reviewed fallback: ' + item.file);
  }
}
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html) || /\son\w+\s*=|type\s*=\s*["']module|<(?:iframe|object|base)\b|javascript:|\bdownload\s*=/.test(html)) errors.push('Unsupported HTML behavior');
const scripts = Array.from(html.matchAll(/<script\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)>/gi));
const noteContentIndex = scripts.findIndex(match => match[2] === './note-content.js');
const notesIndex = scripts.findIndex(match => match[2] === './notes.js');
const appIndex = scripts.findIndex(match => match[2] === './app-v04.js');
if (noteContentIndex < 0 || notesIndex <= noteContentIndex || appIndex <= notesIndex) errors.push('Note content must load before notes.js and app-v04.js');
for (const index of [noteContentIndex, notesIndex, appIndex]) {
  if (index >= 0 && /\b(?:async|defer)\b/i.test(scripts[index][1] + scripts[index][3])) errors.push('Note script order must be synchronous');
}
for (const file of ['note-content.js', 'notes.js', 'licensing/runtime-attribution.json']) {
  if (!actual.includes(file)) errors.push('Missing note content or attribution: ' + file);
}
try {
  const noteContext = {}; noteContext.window = noteContext;
  for (const file of ['note-content.js', 'notes.js']) vm.runInNewContext(fs.readFileSync(path.join(dist, file), 'utf8'), noteContext, {filename: file});
  const expectedNotes = JSON.parse(fs.readFileSync(path.join(root, 'content/notes.json'), 'utf8'));
  if (JSON.stringify(noteContext.BagelNotes) !== JSON.stringify(expectedNotes)) errors.push('Runtime note content differs from content/notes.json');
  for (const note of expectedNotes.list) if (noteContext.BagelNotes.find(note.id) !== noteContext.BagelNotes.list.find(item => item.id === note.id)) errors.push('Runtime note lookup failed: ' + note.id);
  if (noteContext.BagelNotes.find('__missing__') !== undefined) errors.push('Unknown note lookup must return undefined');
} catch (error) {errors.push('Note runtime validation failed: ' + error.message);}
const dataContext = {}; vm.runInNewContext(fs.readFileSync(path.join(dist, 'data.js'), 'utf8'), dataContext);
for (const model of dataContext.BagelData.models) if (!model.image.startsWith('./assets/') || !fs.existsSync(path.resolve(dist, model.image))) errors.push('Missing model asset: ' + model.id);
try {
  const attribution = JSON.parse(fs.readFileSync(path.join(dist, 'licensing/runtime-attribution.json'), 'utf8'));
  if (!Array.isArray(attribution.materials)) throw Error('Attribution materials must be an array');
  for (const material of attribution.materials) {
    const file = material.runtime_path || material.path;
    if (!actual.includes(file)) errors.push('Attribution refers to missing runtime material: ' + file);
    else if (material.sha256 !== crypto.createHash('sha256').update(fs.readFileSync(path.join(dist, file))).digest('hex')) errors.push('Attribution material hash mismatch: ' + file);
  }
  for (const model of dataContext.BagelData.models) {
    const file = model.image.slice(2);
    const matches = attribution.materials.filter(material => (material.runtime_path || material.path) === file);
    const expectedLicense = mode === 'brand' ? 'NO-PUBLIC-REDISTRIBUTION-GRANT' : 'MIT';
    if (matches.length !== 1 || matches[0].license !== expectedLicense) errors.push('Incorrect machine-image attribution: ' + model.id);
  }
} catch (error) {errors.push('Runtime attribution validation failed: ' + error.message);}
for (const snapshot of dataContext.BagelData.priceSnapshots) if (snapshot.independently_verified || snapshot.valid_for_budget_gate) errors.push('Unverified price promoted to eligibility');
const totalBytes = manifest.files.reduce((n, item) => n + item.bytes, 0);
if (totalBytes > 2 * 1024 * 1024) warnings.push('Uncompressed output exceeds recommended 2 MiB; ZIP limit is checked by packager');
if (textBytes > 5 * 1024 * 1024) warnings.push('Text total exceeds recommended 5 MiB');
warnings.push('Static scan is not an ES2017 parser or Chrome 61 device run; runtime compatibility remains untested.');
const report = {mode, count: actual.length, totalBytes, textBytes, errors, warnings, platformSimulator: 'PENDING', android: 'PENDING', ios: 'PENDING', chrome61: 'NOT_RUN', networkPolicy: 'offline-only'};
fs.writeFileSync(path.join(root, 'output/validation-' + mode + '.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
