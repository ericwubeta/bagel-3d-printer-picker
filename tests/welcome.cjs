/* SPDX-License-Identifier: MIT */
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, '../web/welcome.js'), 'utf8');
async function fixture(reduced) {
  const loaded = [], text = [], images = [], callbacks = [];
  const ctx = {globalAlpha: 1, fillRect() {}, save() {}, restore() {}, beginPath() {}, moveTo() {}, bezierCurveTo() {}, stroke() {},
    createLinearGradient() {return {addColorStop() {}};},
    fillText(value, x, y, maxWidth) {text.push({value, x, y, maxWidth, font: this.font});},
    drawImage(img) {images.push(img.src);}};
  const canvas = {hidden: false, getContext() {return ctx;}};
  function Image() {}
  Object.defineProperty(Image.prototype, 'src', {get() {return this.url;}, set(value) {this.url = value; loaded.push(value); this.onload();}});
  const browser = {Image, Promise, performance: {now() {return 0;}},
    matchMedia() {return {matches: reduced};},
    requestAnimationFrame(callback) {callbacks.push(callback); return callbacks.length;}, cancelAnimationFrame() {},
    document: {addEventListener() {}, getElementById() {return null;}}};
  browser.window = browser;
  vm.runInNewContext(source, browser);
  assert.strictEqual(browser.BagelWelcome.mount(canvas), true);
  await Promise.resolve(); await Promise.resolve();
  return {browser, canvas, loaded, text, images, callbacks};
}
(async () => {
  const animated = await fixture(false);
  assert.strictEqual(animated.loaded.length, 8);
  assert.ok(animated.loaded.every(url => /^\.\/assets\/welcome-pose-[0-7]\.png$/.test(url)));
  assert.strictEqual(animated.browser.BagelWelcome.status().ready, true);
  animated.callbacks.shift()(450);
  assert.deepStrictEqual(animated.text.slice(-2).map(item => item.value), ['Hello!', '欢迎光临！']);
  animated.callbacks.shift()(1800);
  assert.deepStrictEqual(animated.text.slice(-2).map(item => item.value), ['一起来选', '3D 打印机吧！']);
  assert.ok(animated.text.every(item => item.x === 322 && item.y <= 219 && item.maxWidth === 576 && /(?:serif|sans-serif)$/.test(item.font)));
  assert.strictEqual(animated.canvas.hidden, false);
  assert.strictEqual(animated.browser.BagelWelcome.status().originalSpeed, .75);
  const reduced = await fixture(true);
  assert.deepStrictEqual(reduced.text.map(item => item.value), ['一起来选', '3D 打印机吧！']);
  assert.strictEqual(reduced.callbacks.length, 0);
  assert.strictEqual(reduced.browser.BagelWelcome.status().ready, true);
  console.log(JSON.stringify({suite: 'native-welcome-lettering', passed: 4, total: 4, noRasterCaptionRequests: true, reducedMotion: true}));
})().catch(error => {console.error(error); process.exitCode = 1;});
