'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const modeIndex = process.argv.indexOf('--mode');
const mode = modeIndex < 0 ? 'public' : process.argv[modeIndex + 1];
if (!['public', 'brand'].includes(mode)) throw Error('Mode must be public or brand');
const root = path.resolve(__dirname, '..', 'dist', mode);
const i = process.argv.indexOf('--port');
const port = i < 0 ? 5201 : Number(process.argv[i + 1]);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Port must be 1024–65535');
if (!fs.existsSync(path.join(root, 'index.html'))) throw Error('Run npm run build first');
const mime = {'.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp'};
http.createServer((req, res) => {
  let url;
  try { url = decodeURIComponent(req.url.split('?')[0]); } catch (_) {res.writeHead(400); return res.end();}
  if (url.indexOf('\0') !== -1) {res.writeHead(400); return res.end();}
  if (url === '/favicon.ico') {res.writeHead(204); return res.end();}
  if (!['GET', 'HEAD'].includes(req.method)) {res.writeHead(405); return res.end();}
  let file;
  try {file = path.resolve(root, '.' + (url === '/' ? '/index.html' : url));} catch (_) {res.writeHead(400); return res.end();}
  if (!file.startsWith(root + path.sep)) {res.writeHead(403); return res.end();}
  // The development server only serves files inside this build, including after realpath resolution.
  try {fs.realpath(file, (error, real) => {
    if (error || !real.startsWith(fs.realpathSync(root) + path.sep)) {res.writeHead(404); return res.end('Not found');}
    fs.readFile(real, (readError, body) => {
      if (readError) {res.writeHead(404); return res.end('Not found');}
      res.writeHead(200, {'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; media-src 'self'; object-src 'none'; frame-src 'none'"});
      res.end(req.method === 'HEAD' ? undefined : body);
    });
  });} catch (_) {res.writeHead(400); res.end();}
}).listen(port, '127.0.0.1', () => console.log('Local preview: http://127.0.0.1:' + port + '/'));
