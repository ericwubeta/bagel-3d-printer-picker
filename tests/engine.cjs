/* Software regression for space/budget-first comparison; not human, slicer or device validation. */
"use strict";
var assert = require("assert");
var fs = require("fs");
var path = require("path");
var vm = require("vm");
var data = require("../web/data.js");
var engine = require("../web/engine.js");
var questions = require("../web/questions.js");
var dataBefore = JSON.stringify(data);
var cases = [];
var exhaustiveAnswerCombinations = 0;
var base = { purpose: "small", size: "small", color: "single", place: "separate", budget: "under2" };

function input(patch) { return Object.assign({}, base, patch || {}); }
function check(name, run) {
  try { run(); cases.push({ name: name, passed: true }); }
  catch (error) { cases.push({ name: name, passed: false, error: error.message }); }
}
function ids(result) { return result.candidates.map(function (candidate) { return candidate.model.id; }); }
function text(candidate) { return candidate.reasons.concat(candidate.tradeoffs, candidate.pending).join(" "); }

check("questionnaire keeps five choices and exposes six actual rooms without legacy footprint labels", function () {
  assert.deepStrictEqual(questions.all.map(function (question) { return question.key; }), ["place", "budget", "size", "purpose", "color"]);
  var room = questions.find("place");
  assert.deepStrictEqual(room.options.map(function (option) { return option.value; }), ["separate", "living", "balcony", "bedroom", "study", "unknown"]);
  assert.ok(questions.option("place", "bedroom").reply.includes("不建议放在卧室"));
  assert.ok(room.hint.includes("独立卧室"));
});
check("all actual rooms keep the user's 4-8k small/phone/DIY comparison tier and savings option", function () {
  ["separate", "living", "balcony", "bedroom", "study", "unknown"].forEach(function (place) {
    var result = engine.evaluate(input({ place: place, size: "medium", color: "diy", budget: "4to8" }));
    assert.deepStrictEqual(ids(result), ["x2d", "h2d"]);
    assert.strictEqual(result.savingAlternative.model.id, "p2s");
    assert.strictEqual(result.space.footprint, "unknown");
    assert.strictEqual(result.space.confirmed, false);
  });
});
check("bedroom stays a change-location result across savings mode, favored flagship, and known over-cap quotes", function () {
  ["standard", "save"].forEach(function (mode) {
    var result = engine.evaluate(input({ place: "bedroom", budget: "4to8", compareMode: mode, favorite: "h2c", quoteModel: "x2d", quoteAmount: 9000, budgetCap: 8000 }));
    assert.strictEqual(result.kind, "prepare");
    assert.strictEqual(result.priorityAction, "先换摆放位置，再考虑购买");
    assert.strictEqual(result.notes[0], "ventilation");
    assert.ok(result.message.includes("换位置后的比较方向"));
    assert.ok(result.locationWarning.includes("不建议放在卧室"));
    assert.notStrictEqual(result.primary.budgetState, "over");
    result.candidates.concat([result.favorite]).forEach(function (candidate) {
      assert.ok(candidate.locationCaution.includes("换位置后比较"));
      assert.ok(candidate.spaceText.includes("不建议放在卧室"));
      assert.strictEqual(candidate.space.confirmed, false);
    });
  });
});
check("balcony requires environment confirmation without certifying space or downgrading the budget tier", function () {
  var result = engine.evaluate(input({ place: "balcony", budget: "over8" }));
  assert.deepStrictEqual(ids(result), ["h2d", "h2c"]);
  assert.strictEqual(result.kind, "prepare");
  assert.ok(result.priorityAction.includes("雨水、日晒和温湿度"));
  assert.ok(result.primary.locationCaution.includes("还未确认"));
  assert.strictEqual(result.notes[0], "ventilation");
});
check("living and study are different from bedroom and never assumed compact from a room name", function () {
  ["living", "study", "shared"].forEach(function (place) {
    var result = engine.evaluate(input({ place: place, purpose: "soft", budget: "over8" }));
    assert.deepStrictEqual(ids(result), ["h2d", "h2c"]);
    assert.strictEqual(result.kind, "prepare");
    assert.strictEqual(result.notes[0], "ventilation");
    assert.ok(result.notes.indexOf("filament") !== -1);
    assert.ok(result.primary.spaceText.includes("房间名称不代表桌面容量"));
    assert.ok(!result.primary.spaceText.includes("不建议放在卧室"));
  });
});
check("explicit small footprint changes hardware comparison without changing the recorded room", function () {
  var result = engine.evaluate(input({ place: "living", footprint: "compact", budget: "4to8" }));
  assert.deepStrictEqual(ids(result), ["x2d", "p2s"]);
  assert.strictEqual(result.space.choice, "living");
  assert.strictEqual(result.space.footprint, "compact");
  assert.strictEqual(result.notes[0], "ventilation");
  assert.strictEqual(result.space.confirmed, false);
});
check("explicit roomy footprint plus a large model can put H2D first without confirming fit", function () {
  ["separate", "study"].forEach(function (place) {
    var result = engine.evaluate(input({ place: place, footprint: "roomy", size: "large", budget: "4to8" }));
    assert.deepStrictEqual(ids(result), ["h2d", "x2d"]);
    assert.strictEqual(result.space.confirmed, false);
    assert.strictEqual(result.primary.geometry.confirmed, false);
  });
});
check("each unknown has a useful preparation action; room uncertainty takes priority", function () {
  [
    { patch: { place: "unknown", budget: "unknown", purpose: "unknown", size: "unknown" }, match: "先确定打印机的摆放位置" },
    { patch: { budget: "unknown" }, match: "完整报价" },
    { patch: { size: "unknown" }, match: "长、宽、高" },
    { patch: { purpose: "unknown" }, match: "真正想打印的模型" }
  ].forEach(function (example) {
    var result = engine.evaluate(input(example.patch));
    assert.strictEqual(result.kind, "prepare");
    assert.ok(result.priorityAction.includes(example.match));
    assert.strictEqual(result.action.steps[0], result.priorityAction);
  });
});
check("selecting separate room alone preserves the need to measure the whole arrangement", function () {
  var result = engine.evaluate(input({ place: "separate", budget: "4to8" }));
  assert.strictEqual(result.kind, "direction");
  assert.strictEqual(result.space.footprint, "unknown");
  assert.ok(result.priorityAction.includes("量台面"));
  assert.ok(result.locationCaution.includes("实测"));
  assert.strictEqual(result.space.confirmed, false);
});

check("reported small toy + phone length + DIY + separate + 4-8k compares X2D/H2D", function () {
  var result = engine.evaluate(input({ size: "medium", color: "diy", budget: "4to8" }));
  assert.deepStrictEqual(ids(result), ["x2d", "h2d"]);
  assert.ok(result.primary.reasons.join(" ").includes("主辅双喷嘴"));
  assert.ok(result.alternative.reasons.join(" ").includes("也可以打印小件"));
  assert.ok(result.primary.reasons.join(" ").includes("不默认加自动换料"));
});
check("one changed budget moves the same small project to the relevant comparison tier", function () {
  assert.deepStrictEqual(ids(engine.evaluate(input({ budget: "under2" }))), ["a1-mini", "a1"]);
  assert.deepStrictEqual(ids(engine.evaluate(input({ budget: "2to4" }))), ["p2s", "p1s"]);
  assert.deepStrictEqual(ids(engine.evaluate(input({ budget: "4to8" }))), ["x2d", "h2d"]);
  assert.deepStrictEqual(ids(engine.evaluate(input({ budget: "over8" }))), ["h2d", "h2c"]);
  assert.deepStrictEqual(ids(engine.evaluate(input({ budget: "unknown" }))), ["p2s", "x2d"]);
});
check("under-2k medium current project compares A1 before mini", function () {
  assert.deepStrictEqual(ids(engine.evaluate(input({ size: "medium" }))), ["a1", "a1-mini"]);
});
check("under-2k large project excludes mini and visibly identifies conflicting budget/size", function () {
  var result = engine.evaluate(input({ size: "large" }));
  assert.deepStrictEqual(ids(result), ["a1", "p2s"]);
  assert.ok(result.pending.join(" ").includes("低预算可能冲突"));
  assert.strictEqual(result.alternative.historyAboveBudget, true);
  assert.ok(result.alternative.budgetWarning.includes("先别当作预算内"));
});
check("4-8k limited desk compares X2D/P2S rather than unmeasured H-series", function () {
  var result = engine.evaluate(input({ budget: "4to8", place: "compact" }));
  assert.deepStrictEqual(ids(result), ["x2d", "p2s"]);
  assert.ok(result.primary.spaceText.includes("暂不确认能放下"));
  assert.strictEqual(result.kind, "prepare");
});
check("shared room at 4-8k preserves X2D/H2D and environment preparation without assuming a small desk", function () {
  var result = engine.evaluate(input({ budget: "4to8", place: "shared" }));
  assert.deepStrictEqual(ids(result), ["x2d", "h2d"]);
  assert.strictEqual(result.notes[0], "ventilation");
  assert.ok(result.primary.spaceText.includes("同住者"));
  assert.strictEqual(result.kind, "prepare");
});
check("space answer changes the high-budget pair without implying higher price means bigger", function () {
  assert.deepStrictEqual(ids(engine.evaluate(input({ budget: "over8", place: "roomy" }))), ["h2d", "h2c"]);
  assert.deepStrictEqual(ids(engine.evaluate(input({ budget: "over8", place: "compact" }))), ["x2d", "p2s"]);
  var shared = engine.evaluate(input({ budget: "over8", place: "shared" }));
  assert.deepStrictEqual(ids(shared), ["h2d", "h2c"]);
  assert.ok(shared.primary.spaceText.includes("操作空间"));
});
check("roomy + large at 4-8k compares H2D before X2D", function () {
  var result = engine.evaluate(input({ budget: "4to8", place: "roomy", size: "large" }));
  assert.deepStrictEqual(ids(result), ["h2d", "x2d"]);
  assert.ok(result.primary.reasons.join(" ").includes("充裕空间"));
  assert.ok(result.primary.spaceText.includes("大机身"));
});
check("a roomy answer alone does not force H2D to the front for a small project", function () {
  assert.deepStrictEqual(ids(engine.evaluate(input({ budget: "4to8", place: "roomy", size: "small" }))), ["x2d", "h2d"]);
});
check("unknown space still returns X2D/H2D at 4-8k with explicit pending placement", function () {
  var result = engine.evaluate(input({ budget: "4to8", place: "unknown" }));
  assert.deepStrictEqual(ids(result), ["x2d", "h2d"]);
  assert.strictEqual(result.space.status, "pending");
  assert.strictEqual(result.space.confirmed, false);
  assert.strictEqual(result.kind, "prepare");
  result.candidates.forEach(function (candidate) {
    assert.strictEqual(candidate.space.confirmed, false);
    assert.ok(candidate.spaceText.includes("位置还没定"));
  });
});
check("separate and roomy positions are choices, never a measured placement approval", function () {
  ["separate", "roomy"].forEach(function (place) {
    var result = engine.evaluate(input({ place: place, budget: "4to8" }));
    assert.strictEqual(result.space.confirmed, false);
    result.candidates.forEach(function (candidate) {
      assert.ok(candidate.spaceText.includes("量过才确认"));
      assert.strictEqual(candidate.space.status, "pending");
    });
  });
});
check("purpose does not shrink a 4-8k comparison tier to entry hardware", function () {
  ["small", "home", "large", "functional", "soft", "unknown"].forEach(function (purpose) {
    assert.deepStrictEqual(ids(engine.evaluate(input({ purpose: purpose, budget: "4to8", size: "medium" }))), ["x2d", "h2d"]);
  });
});
check("purpose changes explanation while budget and placement continue to decide the tier", function () {
  var soft = engine.evaluate(input({ purpose: "soft", budget: "4to8" }));
  var functional = engine.evaluate(input({ purpose: "functional", budget: "4to8" }));
  assert.ok(soft.primary.reasons.join(" ").includes("软配件"));
  assert.ok(functional.primary.reasons.join(" ").includes("功能零件"));
  assert.notStrictEqual(soft.primary.reasons.join(" "), functional.primary.reasons.join(" "));
});
check("future large-use preference does not override current size at low budget", function () {
  var future = engine.evaluate(input({ purpose: "large", size: "small" }));
  assert.deepStrictEqual(ids(future), ["a1-mini", "a1"]);
  assert.ok(future.pending.join(" ").includes("这次按你选的"));
});
check("automatic color does not invent a material or package compatibility pass", function () {
  var result = engine.evaluate(input({ color: "auto", budget: "4to8" }));
  result.candidates.forEach(function (candidate) {
    assert.ok(candidate.reasons.join(" ").includes("箱单另核"));
    assert.ok(candidate.tradeoffs.join(" ").includes("不默认任何耗材"));
    assert.ok(candidate.pending.join(" ").includes("箱单和耗材兼容性"));
  });
});
check("single-color and DIY choices compare single machines rather than requiring AMS", function () {
  ["single", "diy"].forEach(function (color) {
    var result = engine.evaluate(input({ color: color, budget: "4to8" }));
    assert.ok(result.primary.reasons.join(" ").includes("先比较单机"));
    assert.ok(!result.primary.reasons.join(" ").includes("必须 AMS"));
  });
});
check("color unknown starts single without forcing preparation by itself", function () {
  var result = engine.evaluate(input({ color: "unknown", budget: "4to8" }));
  assert.strictEqual(result.kind, "direction");
  assert.ok(result.pending.join(" ").includes("以后是否自动换色还没定"));
});
check("soft material at high budget keeps higher tier with specific feeding/nozzle warnings", function () {
  var result = engine.evaluate(input({ purpose: "soft", color: "auto", budget: "4to8" }));
  assert.deepStrictEqual(ids(result), ["x2d", "h2d"]);
  assert.strictEqual(result.notes[0], "filament");
  result.candidates.forEach(function (candidate) {
    assert.ok(text(candidate).includes("按具体产品逐一核"));
    assert.ok(text(candidate).includes("不是所有软料"));
    assert.ok(text(candidate).includes("主辅喷嘴"));
    assert.ok(text(candidate).includes("不因软料就默认需要封箱"));
    assert.ok(!text(candidate).includes("绝对安全"));
  });
});
check("soft material preserves environment-first reading for a shared room", function () {
  var result = engine.evaluate(input({ purpose: "soft", place: "shared", budget: "4to8" }));
  assert.strictEqual(result.notes[0], "ventilation");
  assert.ok(result.notes.indexOf("filament") !== -1);
  assert.ok(result.pending.join(" ").includes("同住者"));
});
check("functional parts keep material and actual use validation separate from the high tier", function () {
  var result = engine.evaluate(input({ purpose: "functional", budget: "4to8" }));
  assert.deepStrictEqual(ids(result), ["x2d", "h2d"]);
  assert.ok(result.primary.pending.join(" ").includes("机器型号不能保证"));
  assert.strictEqual(result.kind, "prepare");
});
check("closed higher tiers never claim to resolve home noise smell ventilation or pet contact", function () {
  engine.evaluate(input({ budget: "over8" })).candidates.forEach(function (candidate) {
    assert.ok(candidate.tradeoffs.join(" ").includes("封闭结构不代表自动解决"));
  });
});
check("large at 2-4k retains the comparison tier while refusing fit confirmation", function () {
  var result = engine.evaluate(input({ budget: "2to4", size: "large" }));
  assert.deepStrictEqual(ids(result), ["p2s", "p1s"]);
  assert.ok(result.pending.join(" ").includes("可能超过"));
  result.candidates.forEach(function (candidate) {
    assert.strictEqual(candidate.geometry.confirmed, false);
    assert.ok(candidate.pending.join(" ").includes("不确认它能整件打印"));
  });
});
check("small and phone-sized analogies cannot approve geometry on a high tier", function () {
  ["small", "medium"].forEach(function (size) {
    var result = engine.evaluate(input({ budget: "4to8", size: size }));
    result.candidates.forEach(function (candidate) {
      assert.strictEqual(candidate.geometry.status, "pending");
      assert.ok(candidate.pending.join(" ").includes("不等于已确认放得下"));
    });
  });
});
check("unknown size stays unknown even for a small-object purpose", function () {
  var result = engine.evaluate(input({ budget: "4to8", size: "unknown" }));
  assert.deepStrictEqual(ids(result), ["x2d", "h2d"]);
  assert.strictEqual(result.kind, "prepare");
  assert.ok(result.primary.pending.join(" ").includes("尺寸还未确认"));
});
check("X2D explanation distinguishes main/auxiliary geometry and capabilities", function () {
  var candidate = engine.evaluate(input({ budget: "4to8" })).primary;
  assert.ok(candidate.tradeoffs.join(" ").includes("双喷共同能力"));
  assert.ok(candidate.tradeoffs.join(" ").includes("主、辅喷嘴"));
  assert.strictEqual(candidate.geometry.confirmed, false);
});
check("H2D explanation distinguishes intersection from union without an all-material full-size promise", function () {
  var candidate = engine.evaluate(input({ budget: "4to8" })).alternative;
  assert.ok(candidate.tradeoffs.join(" ").includes("共同区与并集不同"));
  assert.ok(candidate.tradeoffs.join(" ").includes("不承诺"));
  assert.strictEqual(candidate.geometry.confirmed, false);
});
check("H2C has conditional heat-end and task benefits rather than a universal zero-waste promise", function () {
  var candidate = engine.evaluate(input({ budget: "over8" })).alternative;
  assert.ok(candidate.reasons.join(" ").includes("Vortek"));
  assert.ok(candidate.tradeoffs.join(" ").includes("不等于"));
});
check("4-8k result exposes a P2S saving comparison without hiding standard H2D", function () {
  var result = engine.evaluate(input({ budget: "4to8" }));
  assert.deepStrictEqual(ids(result), ["x2d", "h2d"]);
  assert.strictEqual(result.canSaveAlternative, true);
  assert.strictEqual(result.defaultAlternativeName, "H2D");
  assert.strictEqual(result.savingAlternative.model.id, "p2s");
  assert.ok(result.savingAlternative.reasons.join(" ").includes("更省预算"));
});
check("save switch replaces only second card and does not mutate the selected budget", function () {
  var answers = input({ budget: "4to8", compareMode: "save" });
  var before = JSON.stringify(answers);
  var result = engine.evaluate(answers);
  assert.deepStrictEqual(ids(result), ["x2d", "p2s"]);
  assert.strictEqual(result.defaultAlternativeName, "H2D");
  assert.strictEqual(result.compareMode, "save");
  assert.strictEqual(JSON.stringify(answers), before);
});
check("save switch at over-8k keeps H2D primary and exposes P2S alternative", function () {
  var result = engine.evaluate(input({ budget: "over8", compareMode: "save" }));
  assert.deepStrictEqual(ids(result), ["h2d", "p2s"]);
  assert.strictEqual(result.defaultAlternativeName, "H2C");
});
check("a pair already containing P2S does not offer redundant savings mode", function () {
  ["compact"].forEach(function (place) {
    var result = engine.evaluate(input({ budget: "4to8", place: place, compareMode: "save" }));
    assert.deepStrictEqual(ids(result), ["x2d", "p2s"]);
    assert.strictEqual(result.canSaveAlternative, false);
    assert.strictEqual(result.savingAlternative, null);
  });
});
check("save mode preserves actual standard primary after known quotation reordering", function () {
  var patch = { budget: "4to8", quoteModel: "x2d", quoteAmount: 9000, budgetCap: 8000 };
  var standard = engine.evaluate(input(patch));
  var saving = engine.evaluate(input(Object.assign({}, patch, { compareMode: "save" })));
  assert.strictEqual(standard.primary.model.id, "h2d");
  assert.deepStrictEqual(ids(saving), ["h2d", "p2s"]);
  assert.notStrictEqual(saving.primary.budgetState, "over");
});
check("known over-cap P2S package cannot appear as a saving option in standard or save mode", function () {
  ["standard", "save"].forEach(function (mode) {
    var result = engine.evaluate(input({ budget: "4to8", compareMode: mode, quoteModel: "p2s", quoteAmount: 10000, budgetCap: 8000 }));
    assert.deepStrictEqual(ids(result), ["x2d", "h2d"]);
    assert.strictEqual(result.canSaveAlternative, false);
    assert.strictEqual(result.savingAlternative, null);
    assert.strictEqual(result.compareMode, "standard");
    assert.strictEqual(result.primary.budgetState, "unknown");
    assert.strictEqual(result.alternative.budgetState, "unknown");
  });
});
check("over-cap P2S favorite remains available without a saving claim or package-wide exclusion", function () {
  var result = engine.evaluate(input({ budget: "4to8", favorite: "p2s", quoteModel: "p2s", quoteAmount: 10000, budgetCap: 8000 }));
  assert.strictEqual(result.favorite.model.id, "p2s");
  assert.strictEqual(result.favorite.budgetState, "over");
  assert.ok(!result.favorite.reasons.join(" ").includes("更省预算"));
  assert.ok(result.favorite.reasons.join(" ").includes("其他套餐价格仍待核"));
  assert.strictEqual(result.canSaveAlternative, false);
});
check("small-project explanations do not imply current prices have passed the selected budget", function () {
  var result = engine.evaluate(input({ budget: "4to8" }));
  result.candidates.forEach(function (candidate) {
    assert.ok(candidate.reasons.join(" ").includes("结合预算比较"));
    assert.ok(!candidate.reasons.join(" ").includes("比较预算内的能力"));
    assert.strictEqual(candidate.budgetState, "unknown");
    assert.ok(candidate.configurationText.includes("先比较单机"));
  });
});
check("H2D historical package at 8000 has visible tier-edge warning and no budget pass", function () {
  var result = engine.evaluate(input({ budget: "4to8" }));
  assert.strictEqual(result.alternative.model.id, "h2d");
  assert.strictEqual(result.alternative.budgetEdge, true);
  assert.strictEqual(result.alternative.budgetState, "unknown");
  assert.ok(result.alternative.budgetWarning.includes("预算上沿"));
  assert.ok(result.alternative.budgetWarning.includes("耗材"));
  assert.strictEqual(result.budget.confirmed, false);
});
check("8000-plus does not imply the H2C 13000 historical package is within a known maximum", function () {
  var result = engine.evaluate(input({ budget: "over8" }));
  assert.strictEqual(result.alternative.model.id, "h2c");
  assert.strictEqual(result.alternative.budgetState, "unknown");
  assert.ok(result.alternative.budgetWarning.includes("没有具体上限"));
  assert.ok(result.pending.join(" ").includes("不默认所有高配都在预算"));
});
check("an explicit maximum on the 8000-plus choice stays known without approving unquoted candidates", function () {
  var result = engine.evaluate(input({ budget: "over8", budgetCap: 10000 }));
  assert.deepStrictEqual(ids(result), ["h2d", "h2c"]);
  assert.ok(result.alternative.budgetWarning.includes("预算上限为 10000 元"));
  assert.ok(!result.alternative.budgetWarning.includes("没有具体上限"));
  assert.ok(!result.pending.join(" ").includes("没有具体上限"));
  assert.ok(result.pending.join(" ").includes("还不能确认符合预算"));
  assert.strictEqual(result.alternative.budgetState, "unknown");
});
check("618 records never pass current budget eligibility at any comparison tier", function () {
  ["under2", "2to4", "4to8", "over8", "unknown"].forEach(function (budget) {
    engine.evaluate(input({ budget: budget })).candidates.forEach(function (candidate) {
      assert.strictEqual(candidate.budgetState, "unknown");
      assert.ok(candidate.priceText.includes("618 多色套装参考"));
      assert.ok(candidate.priceText.includes("本次价格"));
    });
  });
});
check("historical record schema stays canonical and does not fabricate a single-machine amount", function () {
  data.models.filter(function (model) { return model.historicalPrice; }).forEach(function (model) {
    assert.strictEqual(typeof model.historicalPrice.reference_min, "number");
    assert.strictEqual(typeof model.historicalPrice.reference_max, "number");
    assert.ok(model.historicalPrice.reference_min <= model.historicalPrice.reference_max);
    assert.strictEqual(model.historicalPrice.single_amount, null);
  });
});
check("missing historical price stays unknown rather than zero or budget-approved", function () {
  var result = engine.evaluate(input({ favorite: "h2s" }));
  assert.strictEqual(result.favorite.model.historicalPrice, null);
  assert.strictEqual(result.favorite.budgetState, "unknown");
  assert.strictEqual(result.favorite.historyAboveBudget, false);
  assert.ok(result.favorite.priceText.includes("未记录"));
});
check("a historical record above selected tier warns rather than becoming a current over-cap quote", function () {
  var result = engine.evaluate(input({ budget: "2to4", favorite: "x2d" }));
  assert.strictEqual(result.favorite.historyAboveBudget, true);
  assert.strictEqual(result.favorite.budgetState, "unknown");
  assert.ok(result.favorite.budgetWarning.includes("高于你选的预算"));
  assert.deepStrictEqual(ids(result), ["p2s", "p1s"]);
});
check("current user quote is an estimate and is not replaced by higher historical reference", function () {
  var result = engine.evaluate(input({ favorite: "p2s", quoteModel: "p2s", quoteAmount: 1900, budgetCap: 2000 }));
  assert.strictEqual(result.favorite.budgetState, "userEstimate");
  assert.strictEqual(result.favorite.historyAboveBudget, true);
  assert.ok(result.favorite.pending.join(" ").includes("报价可作估算"));
  assert.ok(!result.favorite.budgetWarning.includes("高于你选的预算"));
});
check("known over-cap low-budget quote cannot remain primary or erase all hardware packages", function () {
  var result = engine.evaluate(input({ quoteModel: "a1-mini", quoteAmount: 2500, budgetCap: 2200 }));
  assert.strictEqual(result.primary.model.id, "a1");
  assert.strictEqual(result.alternative.budgetState, "over");
  assert.ok(result.alternative.pending.join(" ").includes("所有套餐"));
});
check("known X2D over-cap quote promotes H2D as conditional alternative", function () {
  var result = engine.evaluate(input({ budget: "4to8", quoteModel: "x2d", quoteAmount: 9000, budgetCap: 8000 }));
  assert.deepStrictEqual(ids(result), ["h2d", "x2d"]);
  assert.strictEqual(result.primary.budgetState, "unknown");
  assert.strictEqual(result.alternative.budgetState, "over");
});
check("exactly-at-cap quote remains a user estimate rather than verified budget fit", function () {
  var result = engine.evaluate(input({ budget: "4to8", quoteModel: "x2d", quoteAmount: 8000, budgetCap: 8000 }));
  assert.strictEqual(result.primary.model.id, "x2d");
  assert.strictEqual(result.primary.budgetState, "userEstimate");
});
check("quote without explicit maximum does not invent a hard cap from a historical tier", function () {
  var result = engine.evaluate(input({ quoteModel: "a1-mini", quoteAmount: 2500 }));
  assert.strictEqual(result.primary.model.id, "a1-mini");
  assert.strictEqual(result.primary.budgetState, "userEstimate");
});
check("missing zero negative and malformed quotes remain unknown", function () {
  [undefined, null, 0, -1, "", "unknown", NaN, Infinity].forEach(function (value) {
    assert.strictEqual(engine.evaluate(input({ quoteModel: "a1-mini", quoteAmount: value, budgetCap: 2000 })).primary.budgetState, "unknown");
  });
});
check("unrelated over-cap flagship quotation does not exclude a budget-tier candidate", function () {
  assert.strictEqual(engine.evaluate(input({ quoteModel: "h2c", quoteAmount: 20000, budgetCap: 2200 })).primary.model.id, "a1-mini");
});
check("favorite remains independent of recommended pair", function () {
  var result = engine.evaluate(input({ favorite: "h2c" }));
  assert.deepStrictEqual(ids(result), ["a1-mini", "a1"]);
  assert.strictEqual(result.favorite.model.id, "h2c");
});
check("unverified new names cannot become recommended models or inferred specs", function () {
  ["p3s", "p3sc", "h3c"].forEach(function (id) {
    assert.strictEqual(engine.getModel(id), null);
    var result = engine.evaluate(input({ favorite: id }));
    assert.strictEqual(result.favorite, null);
    assert.ok(ids(result).indexOf(id) === -1);
  });
  data.newModels.forEach(function (model) {
    assert.strictEqual(model.specs, null);
    assert.strictEqual(model.price, null);
    assert.strictEqual(model.releaseDate, null);
  });
  assert.deepStrictEqual(data.newModels.map(function (model) { return model.id; }), ["p3s", "h3c"]);
  assert.ok(data.newModels[0].aliases.indexOf("P3SC") !== -1);
});
check("unknown budget offers conditional P2S/X2D rather than fabricated tier eligibility", function () {
  var result = engine.evaluate(input({ budget: "unknown" }));
  assert.deepStrictEqual(ids(result), ["p2s", "x2d"]);
  assert.ok(result.pending.join(" ").includes("预算还没定"));
  assert.strictEqual(result.budget.confirmed, false);
});
check("invalid answers degrade to pending directions and cannot assert room or material safety", function () {
  var result = engine.evaluate({ purpose: "random", size: false, color: "six", place: "safe", budget: 0, compareMode: "danger" });
  assert.strictEqual(result.kind, "prepare");
  assert.deepStrictEqual(ids(result), ["p2s", "x2d"]);
  assert.strictEqual(result.compareMode, "standard");
  assert.strictEqual(result.space.choice, "unknown");
  assert.strictEqual(result.space.confirmed, false);
});
check("sex age and student identity do not determine recommendations", function () {
  assert.deepStrictEqual(ids(engine.evaluate(input({ sex: "female", age: 16, student: true }))), ids(engine.evaluate(input({ sex: "male", age: 52, student: false }))));
});
check("browser classic-script API runs without Node or globalThis", function () {
  var context = { window: { BagelData: data } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../web/engine.js"), "utf8"), context);
  assert.strictEqual(typeof context.window.BagelEngine.evaluate, "function");
  assert.strictEqual(context.window.BagelEngine.evaluate(input({ budget: "4to8" })).primary.model.id, "x2d");
});
check("all 4320 current and legacy combinations retain two conditional models and never a known-over-cap primary", function () {
  ["small", "home", "large", "functional", "soft", "unknown"].forEach(function (purpose) {
    ["small", "medium", "large", "unknown"].forEach(function (size) {
      ["single", "auto", "diy", "unknown"].forEach(function (color) {
        ["separate", "living", "balcony", "bedroom", "study", "unknown", "compact", "roomy", "shared"].forEach(function (place) {
          ["under2", "2to4", "4to8", "over8", "unknown"].forEach(function (budget) {
            exhaustiveAnswerCombinations += 1;
            var answers = { purpose: purpose, size: size, color: color, place: place, budget: budget };
            var result = engine.evaluate(answers);
            assert.ok(result.primary && result.alternative);
            assert.strictEqual(result.candidates.length, 2);
            assert.notStrictEqual(result.primary.model.id, result.alternative.model.id);
            assert.strictEqual(result.space.confirmed, false);
            assert.ok(result.priorityAction);
            assert.strictEqual(result.action.steps[0], result.priorityAction);
            if (place === "bedroom") {
              assert.strictEqual(result.kind, "prepare");
              assert.strictEqual(result.priorityAction, "先换摆放位置，再考虑购买");
              assert.strictEqual(result.notes[0], "ventilation");
              assert.ok(result.locationWarning.includes("不建议放在卧室"));
            }
            result.candidates.forEach(function (candidate) {
              assert.ok(engine.getModel(candidate.model.id));
              assert.strictEqual(candidate.geometry.confirmed, false);
              assert.strictEqual(candidate.budgetState, "unknown");
            });
            var quoted = engine.evaluate(Object.assign({}, answers, { quoteModel: result.primary.model.id, quoteAmount: 20000, budgetCap: 2000 }));
            assert.ok(quoted.primary);
            assert.notStrictEqual(quoted.primary.budgetState, "over");
            var saving = engine.evaluate(Object.assign({}, answers, { compareMode: "save" }));
            assert.ok(saving.primary);
            assert.strictEqual(saving.primary.model.id, result.primary.model.id);
            assert.strictEqual(saving.candidates.length, 2);
            if (size === "large") assert.ok(ids(result).indexOf("a1-mini") === -1);
          });
        });
      });
    });
  });
  assert.strictEqual(exhaustiveAnswerCombinations, 4320);
});
check("evaluations do not mutate caller answers or canonical facts", function () {
  var answers = input({ favorite: "h2c", budget: "4to8", compareMode: "save" });
  var before = JSON.stringify(answers);
  engine.evaluate(answers);
  assert.strictEqual(JSON.stringify(answers), before);
  assert.strictEqual(JSON.stringify(data), dataBefore);
});

var failed = cases.filter(function (test) { return !test.passed; });
console.log(JSON.stringify({
  version: "C-v04 rebuild room and footprint separated",
  type: "software regression, not human, slicer or device validation",
  passed: cases.length - failed.length,
  total: cases.length,
  exhaustiveAnswerCombinations: exhaustiveAnswerCombinations,
  cases: cases
}, null, 2));
if (failed.length) process.exitCode = 1;
