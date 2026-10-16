'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/notes.json'), 'utf8'));
const canonical = JSON.stringify(content);
// Captured from the complete data portion of web/notes.js before extraction.
const originalContentSha256 = '31bd1076205a01a6d43d70cfa7e64f8fac5c7db318ab7309974f21104a1f7301';
assert.strictEqual(crypto.createHash('sha256').update(canonical).digest('hex'), originalContentSha256, 'Original note strings or ordering changed');
const wrapper = fs.readFileSync(path.join(root, 'web/notes.js'), 'utf8');
for (const text of [content.account, content.guide, content.boundary].concat(content.list.map(note => note.title))) assert.ok(!wrapper.includes(text), 'CC content must remain outside the MIT wrapper');
assert.ok(wrapper.includes('SPDX-License-Identifier: MIT'));
const api = require('../web/notes.js');
assert.deepStrictEqual(JSON.parse(JSON.stringify(api)), content);
for (const note of content.list) assert.strictEqual(api.find(note.id), api.list.find(item => item.id === note.id));
assert.strictEqual(api.find('__missing__'), undefined);
// Browser execution has no CommonJS loader, network API, or source JSON request.
const browser = {BagelNoteContent: JSON.parse(canonical)}; browser.window = browser;
vm.runInNewContext(wrapper, browser, {filename: 'notes.js'});
assert.strictEqual(JSON.stringify(browser.BagelNotes), canonical);
for (const note of content.list) assert.strictEqual(browser.BagelNotes.find(note.id).title, note.title);
assert.throws(() => vm.runInNewContext(wrapper, {window: {}}, {filename: 'notes.js'}), /Load note-content.js before notes.js/);
console.log(JSON.stringify({suite: 'note-content-separation', passed: 5, total: 5, originalContentSha256, notes: content.list.length, nodeAndBrowser: true}));
