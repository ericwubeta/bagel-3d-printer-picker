'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const data = require('../web/data.js');
const engine = require('../web/engine.js');
let checks = 0;
function check(name, run) {run(); checks++; console.log('PASS ' + name);}
check('Two dated reports keep machine and AMS bundle configurations distinct', () => {
  assert.strictEqual(data.priceSnapshots.length, 2);
  const a1 = data.priceSnapshots.find(entry => entry.model_id === 'a1');
  const x2d = data.priceSnapshots.find(entry => entry.model_id === 'x2d');
  assert.strictEqual(a1.amount, 899); assert.strictEqual(a1.configuration, 'machine_only');
  assert.strictEqual(x2d.amount, 4000); assert.strictEqual(x2d.configuration, 'ams_bundle'); assert.strictEqual(x2d.approximate, true);
  for (const row of data.priceSnapshots) {
    assert.strictEqual(row.observed_at, '2026-10-16');
    assert.strictEqual(row.source_type, 'user_report');
    assert.strictEqual(row.independently_verified, false);
    assert.strictEqual(row.valid_for_budget_gate, false);
    ['channel', 'store', 'coupon_conditions', 'subsidy_eligibility', 'ams_model'].forEach(field => assert.strictEqual(row[field], null));
    assert.strictEqual(row.complete_contents_verified, false);
  }
});
check('Recent prices supplement, rather than replace, historical configuration records', () => {
  assert.strictEqual(engine.getModel('a1').historicalPrice.reference_min, 1900);
  assert.strictEqual(engine.getModel('x2d').historicalPrice.reference_min, 4500);
  for (const id of ['a1', 'x2d']) {
    const text = engine.priceText(id);
    assert.ok(text.includes('2026-10-16')); assert.ok(text.includes('未独立核价')); assert.ok(text.includes('618 多色套装参考'));
  }
  assert.ok(engine.priceText('a1').includes('899 元（单机）'));
  assert.ok(engine.priceText('x2d').includes('约 4,000 元（AMS 套装）'));
  assert.ok(!engine.priceText('p2s').includes('2026-10-16'));
});
check('Price reports do not approve budget or room fit', () => {
  for (const patch of [{budget: 'under2', favorite: 'a1'}, {budget: '2to4', favorite: 'x2d'}, {budget: '4to8', favorite: 'x2d'}]) {
    const result = engine.evaluate(Object.assign({place: 'bedroom', size: 'small', purpose: 'small', color: 'single'}, patch));
    assert.strictEqual(result.kind, 'prepare'); assert.strictEqual(result.budget.confirmed, false);
    assert.strictEqual(result.favorite.budgetState, 'unknown'); assert.strictEqual(result.space.confirmed, false);
    assert.strictEqual(result.priorityAction, '先换摆放位置，再考虑购买');
  }
});
check('Shared price panel presents snapshot provenance and history without external requests', () => {
  const context = {BagelData: data}; vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../web/prices.js'), 'utf8'), context);
  const html = context.BagelPriceUI.panel('test');
  ['899 元（单机）', '约 4,000 元（AMS 套装）', '2026-10-16', '未独立核价', '618历史', '完整入坑费用'].forEach(value => assert.ok(html.includes(value), value));
  assert.ok(!html.includes('href='));
});
check('Unannounced models remain outside ranked routes and have no inferred specs', () => {
  assert.deepStrictEqual(data.newModels.map(model => model.id), ['p3s', 'h3c']);
  for (const model of data.newModels) {assert.strictEqual(model.specs, null); assert.strictEqual(model.price, null); assert.strictEqual(model.releaseDate, null); assert.strictEqual(model.recorded_at, '2026-10-14');}
  assert.deepStrictEqual(data.newModels[0].aliases, ['P3SC']);
});
check('New-model page exposes its dated offline boundary without claiming a fresh official check', () => {
  const context = {BagelData: data};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../web/pages.js'), 'utf8'), context);
  const html = context.BagelPages.catalog({}, 'new');
  assert.ok(html.includes('网友线索，正式资料待核'));
  assert.ok(html.includes('线索整理于2026-10-14'));
  assert.ok(html.includes('离线页面不自动更新'));
  assert.ok(html.includes('是否有新消息以官方为准'));
  assert.ok(!html.includes('尚无官方消息'));
  assert.ok(html.includes('<h2>P3S</h2>')); assert.ok(html.includes('<h2>H3C</h2>'));
  assert.ok(!html.includes('P3SC'));
  assert.strictEqual((html.match(/<dd>未知<\/dd>/g) || []).length, 4);
  assert.strictEqual((html.match(/<dd>未定<\/dd>/g) || []).length, 2);
  assert.ok(!/\d+\s*(?:mm|℃|元)/.test(html));
});
console.log(JSON.stringify({suite: 'recent-price-snapshots', passed: checks, total: checks}));
