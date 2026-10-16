'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const net = require('net');
const http = require('http');
const child = require('child_process');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'bagel-server-test-'));
const source = path.resolve(__dirname, '..');
let server, checks = 0;
function request(port, target, method) {return new Promise((resolve, reject) => {
  const req = http.request({hostname: '127.0.0.1', port, path: target, method: method || 'GET'}, res => {
    const body = []; res.on('data', chunk => body.push(chunk)); res.on('end', () => resolve({status: res.statusCode, headers: res.headers, bytes: Buffer.concat(body).length}));
  }); req.on('error', reject); req.end();
});}
(async () => {
  fs.cpSync(path.join(source, 'web'), path.join(temporary, 'web'), {recursive: true});
  for (const directory of ['content', 'licensing']) fs.cpSync(path.join(source, directory), path.join(temporary, directory), {recursive: true});
  fs.mkdirSync(path.join(temporary, 'scripts'));
  for (const file of ['build.cjs', 'serve.cjs']) fs.copyFileSync(path.join(source, 'scripts', file), path.join(temporary, 'scripts', file));
  const build = child.spawnSync(process.execPath, [path.join(temporary, 'scripts/build.cjs')], {cwd: temporary, encoding: 'utf8'});
  assert.strictEqual(build.status, 0, build.stderr);
  const port = await new Promise((resolve, reject) => {const probe = net.createServer(); probe.on('error', reject); probe.listen(0, '127.0.0.1', () => {const free = probe.address().port; probe.close(() => resolve(free));});});
  server = child.spawn(process.execPath, [path.join(temporary, 'scripts/serve.cjs'), '--port', String(port)], {cwd: temporary, stdio: ['ignore', 'pipe', 'pipe']});
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(Error('Preview server startup timed out')), 10000);
    server.stdout.once('data', () => {clearTimeout(timeout); resolve();});
    server.once('exit', code => {clearTimeout(timeout); reject(Error('Preview server exited ' + code));});
    server.once('error', error => {clearTimeout(timeout); reject(error);});
  });
  let result = await request(port, '/'); assert.strictEqual(result.status, 200); assert.ok(result.headers['content-security-policy'].includes("connect-src 'none'")); checks++;
  result = await request(port, '/%00'); assert.strictEqual(result.status, 400); checks++;
  result = await request(port, '/%E0%A4%A'); assert.strictEqual(result.status, 400); checks++;
  result = await request(port, '/%2e%2e%2fpackage.json'); assert.strictEqual(result.status, 403); checks++;
  result = await request(port, '/', 'POST'); assert.strictEqual(result.status, 405); checks++;
  result = await request(port, '/', 'HEAD'); assert.strictEqual(result.status, 200); assert.strictEqual(result.bytes, 0); checks++;
  result = await request(port, '/'); assert.strictEqual(result.status, 200); assert.strictEqual(server.exitCode, null); checks++;
  result = await request(port, '/note-content.js'); assert.strictEqual(result.status, 200); assert.ok(result.headers['content-type'].startsWith('text/javascript')); checks++;
  result = await request(port, '/licensing/runtime-attribution.json'); assert.strictEqual(result.status, 200); assert.ok(result.bytes > 0); checks++;
  console.log(JSON.stringify({suite: 'preview-server', passed: checks, total: 9, localOnly: true}));
})().catch(error => {console.error(error); process.exitCode = 1;}).finally(async () => {
  if (server && server.exitCode === null) {const stopped = new Promise(resolve => server.once('exit', resolve)); server.kill(); await stopped;}
  const resolved = fs.realpathSync(temporary);
  if (!resolved.startsWith(fs.realpathSync(os.tmpdir()) + path.sep) || !path.basename(resolved).startsWith('bagel-server-test-')) throw Error('Unsafe temporary cleanup target');
  fs.rmSync(resolved, {recursive: true, force: true});
});
