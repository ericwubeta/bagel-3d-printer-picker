'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const child = require('child_process');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'bagel-build-test-'));
let passed = 0;
function run(script, args) {return child.spawnSync(process.execPath, [path.join(temporary, 'scripts', script)].concat(args || []), {cwd: temporary, encoding: 'utf8'});}
try {
  fs.cpSync(path.join(root, 'web'), path.join(temporary, 'web'), {recursive: true});
  for (const directory of ['content', 'licensing']) fs.cpSync(path.join(root, directory), path.join(temporary, directory), {recursive: true});
  const attributionTemplate = fs.readFileSync(path.join(temporary, 'licensing/runtime-attribution.json'));
  fs.mkdirSync(path.join(temporary, 'scripts'));
  for (const file of ['build.cjs', 'validate.cjs']) fs.copyFileSync(path.join(root, 'scripts', file), path.join(temporary, 'scripts', file));
  let result = run('build.cjs', ['--mode', 'public']);
  assert.strictEqual(result.status, 0, result.stderr);
  result = run('validate.cjs', ['--mode', 'public']);
  assert.strictEqual(result.status, 0, result.stdout + result.stderr);
  assert.ok(fs.existsSync(path.join(temporary, 'dist/public/licensing/runtime-attribution.json')));
  assert.ok(fs.existsSync(path.join(temporary, 'dist/public/note-content.js')));
  assert.ok(!fs.existsSync(path.join(temporary, 'dist/public/content/notes.json')));
  passed++;
  // Both distributed profiles use the checked-in official images without private workspace inputs.
  result = run('build.cjs', ['--mode', 'brand']); assert.strictEqual(result.status, 0, result.stderr);
  const defaultBrand = JSON.parse(fs.readFileSync(path.join(temporary, 'dist/brand/licensing/runtime-attribution.json'), 'utf8'));
  for(const model of require('../web/data.js').models){
    const file='assets/'+model.id+'.png';
    assert.deepStrictEqual(fs.readFileSync(path.join(temporary,'dist/public',file)),fs.readFileSync(path.join(temporary,'dist/brand',file)));
    assert.strictEqual(defaultBrand.materials.find(m=>m.path===file).license,'LicenseRef-Bambu-Product-Images');
  }
  passed++;
  // Reproducible fresh clone: no original workspace, private assets, npm install or research neighbors.
  const first = fs.readFileSync(path.join(temporary, 'output/manifest-public.json'), 'utf8');
  result = run('build.cjs', ['--mode', 'public']); assert.strictEqual(result.status, 0, result.stderr);
  assert.strictEqual(fs.readFileSync(path.join(temporary, 'output/manifest-public.json'), 'utf8'), first);
  passed++;
  fs.writeFileSync(path.join(temporary, 'dist/public/stale-secret.txt'), 'should not ship');
  result = run('validate.cjs', ['--mode', 'public']); assert.notStrictEqual(result.status, 0);
  result = run('build.cjs', ['--mode', 'public']); assert.strictEqual(result.status, 0, result.stderr);
  assert.ok(!fs.existsSync(path.join(temporary, 'dist/public/stale-secret.txt')));
  passed++;
  const before = fs.readFileSync(path.join(temporary, 'dist/public/index.html'), 'utf8');
  const missingImage=path.join(temporary,'web/assets/a1.png');
  fs.renameSync(missingImage,missingImage+'.backup');
  result = run('build.cjs', ['--mode', 'brand']); assert.notStrictEqual(result.status, 0);
  assert.strictEqual(fs.readFileSync(path.join(temporary, 'dist/public/index.html'), 'utf8'), before);
  fs.renameSync(missingImage+'.backup',missingImage);
  passed++;
  // Exercise explicit local asset injection using synthetic fixture images, not vendor media.
  fs.mkdirSync(path.join(temporary, 'local-asset-fixtures'));
  const fixture = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl9sAAAAASUVORK5CYII=', 'base64');
  for (const model of require('../web/data.js').models) fs.writeFileSync(path.join(temporary, 'local-asset-fixtures', model.id + '.png'), fixture);
  result = run('build.cjs', ['--mode', 'brand', '--private-assets', path.join(temporary, 'local-asset-fixtures')]);
  assert.strictEqual(result.status, 0, result.stderr);
  result = run('validate.cjs', ['--mode', 'brand']); assert.strictEqual(result.status, 0, result.stdout + result.stderr);
  const brandContext = {}; require('vm').runInNewContext(fs.readFileSync(path.join(temporary, 'dist/brand/data.js'), 'utf8'), brandContext);
  assert.ok(brandContext.BagelData.models.every(model => model.image.endsWith('.png')));
  passed++;
  // Each notice must describe the files actually shipped by its own build profile.
  const notices = {};
  for (const profile of ['public', 'brand']) {
    const profileRoot = path.join(temporary, 'dist', profile);
    notices[profile] = JSON.parse(fs.readFileSync(path.join(profileRoot, 'licensing/runtime-attribution.json'), 'utf8'));
    assert.strictEqual(notices[profile].materials.length, 21);
    for (const material of notices[profile].materials) {
      const runtimePath = material.runtime_path || material.path;
      assert.strictEqual(material.path, runtimePath);
      const bytes = fs.readFileSync(path.join(profileRoot, runtimePath));
      assert.strictEqual(material.sha256, crypto.createHash('sha256').update(bytes).digest('hex'), profile + ': ' + runtimePath);
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(temporary, 'output', 'manifest-' + profile + '.json'), 'utf8'));
    const noticeEntry = manifest.files.find(item => item.file === 'licensing/runtime-attribution.json');
    assert.strictEqual(noticeEntry.sha256, crypto.createHash('sha256').update(fs.readFileSync(path.join(profileRoot, noticeEntry.file))).digest('hex'));
  }
  for (const model of require('../web/data.js').models) {
    const official = notices.public.materials.filter(item => item.path === 'assets/' + model.id + '.png');
    const vendor = notices.brand.materials.filter(item => item.path === 'assets/' + model.id + '.png');
    assert.strictEqual(official.length, 1); assert.strictEqual(official[0].license, 'LicenseRef-Bambu-Product-Images');
    assert.strictEqual(vendor.length, 1); assert.strictEqual(vendor[0].license, 'NO-PUBLIC-REDISTRIBUTION-GRANT');
    assert.strictEqual(vendor[0].source_sha256, vendor[0].sha256);
    assert.ok(!notices.brand.materials.some(item => item.path === 'assets/' + model.id + '.svg'));
  }
  const audio = notices.brand.materials.find(item => item.path === 'meow-data.js');
  assert.ok(audio.components.some(item => item.license === 'CC0-1.0' && item.pcm_sha256));
  assert.strictEqual(notices.brand.materials.find(item => item.path === 'note-content.js').license, 'CC-BY-NC-4.0');
  assert.deepStrictEqual(fs.readFileSync(path.join(temporary, 'licensing/runtime-attribution.json')), attributionTemplate);
  passed++;
  result = run('build.cjs', ['--mode', '../escape']); assert.notStrictEqual(result.status, 0);
  assert.ok(!fs.existsSync(path.join(temporary, 'escape')));
  passed++;
  const originalReports = path.join(temporary, 'reports-original');
  const externalReports = path.join(temporary, 'unrelated-reports');
  fs.renameSync(path.join(temporary, 'output'), originalReports);
  fs.mkdirSync(externalReports);
  fs.symlinkSync(externalReports, path.join(temporary, 'output'), process.platform === 'win32' ? 'junction' : 'dir');
  result = run('build.cjs', ['--mode', 'public']); assert.notStrictEqual(result.status, 0);
  assert.deepStrictEqual(fs.readdirSync(externalReports), []);
  result = run('validate.cjs', ['--mode', 'public']); assert.notStrictEqual(result.status, 0);
  fs.unlinkSync(path.join(temporary, 'output'));
  fs.renameSync(originalReports, path.join(temporary, 'output'));
  passed++;
  // A syntactically valid but reordered entry must fail even with matching manifest hashes.
  const entryPath = path.join(temporary, 'web/index.html');
  const entry = fs.readFileSync(entryPath, 'utf8');
  fs.writeFileSync(entryPath, entry.replace('  <script src="./note-content.js"></script>\n', '').replace('  <script src="./notes.js"></script>', '  <script src="./notes.js"></script>\n  <script src="./note-content.js"></script>'));
  result = run('build.cjs', ['--mode', 'public']); assert.strictEqual(result.status, 0, result.stderr);
  result = run('validate.cjs', ['--mode', 'public']); assert.notStrictEqual(result.status, 0);
  assert.ok(result.stdout.includes('Note content must load before'));
  fs.writeFileSync(entryPath, entry);
  result = run('build.cjs', ['--mode', 'public']); assert.strictEqual(result.status, 0, result.stderr);
  passed++;
  // Missing content must not replace the preceding successful output.
  const notePath = path.join(temporary, 'content/notes.json');
  const noteBytes = fs.readFileSync(notePath);
  const builtNotes = fs.readFileSync(path.join(temporary, 'dist/public/note-content.js'));
  fs.renameSync(notePath, notePath + '.backup');
  result = run('build.cjs', ['--mode', 'public']); assert.notStrictEqual(result.status, 0);
  assert.deepStrictEqual(fs.readFileSync(path.join(temporary, 'dist/public/note-content.js')), builtNotes);
  fs.renameSync(notePath + '.backup', notePath);
  assert.deepStrictEqual(fs.readFileSync(notePath), noteBytes);
  passed++;
  console.log(JSON.stringify({suite: 'standalone-build', passed, total: 11, localOverrideUsesSyntheticFixtures: true}));
} finally {
  const resolved = fs.realpathSync(temporary);
  const allowedParent = fs.realpathSync(os.tmpdir()) + path.sep;
  if (!resolved.startsWith(allowedParent) || !path.basename(resolved).startsWith('bagel-build-test-')) throw Error('Unsafe temporary cleanup target');
  fs.rmSync(resolved, {recursive: true, force: true});
}
