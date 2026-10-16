/* Five-choice route finder. Space and budget set the comparison tier; facts stay in data.js. */
(function (root) {
  "use strict";

  var data = root.BagelData;
  if (!data && typeof module !== "undefined" && module.exports) data = require("./data.js");

  var allowed = {
    purpose: ["small", "home", "large", "functional", "soft", "unknown"],
    size: ["small", "medium", "large", "unknown"],
    color: ["single", "auto", "diy", "unknown"],
    place: ["separate", "living", "balcony", "bedroom", "study", "unknown", "compact", "roomy", "shared"],
    budget: ["under2", "2to4", "4to8", "over8", "unknown"]
  };

  function getModel(id) {
    return data.models.filter(function (model) { return model.id === id; })[0] || null;
  }

  function unique(items) {
    return items.filter(function (item, index) { return items.indexOf(item) === index; });
  }

  function amount(value) {
    if (typeof value !== "number" && typeof value !== "string") return null;
    if (typeof value === "string" && !value.trim()) return null;
    var parsed = Number(value);
    return isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  function normalize(input) {
    var answers = {};
    Object.keys(allowed).forEach(function (key) {
      answers[key] = allowed[key].indexOf(input[key]) !== -1 ? input[key] : "unknown";
    });
    answers.compareMode = input.compareMode === "save" ? "save" : "standard";
    answers.favorite = typeof input.favorite === "string" ? input.favorite : null;
    answers.quoteModel = typeof input.quoteModel === "string" ? input.quoteModel : null;
    answers.quoteAmount = amount(input.quoteAmount);
    answers.budgetCap = amount(input.budgetCap);
    // Optional placement detail, never inferred from a room name or a sixth required question.
    answers.footprint = ["compact", "roomy"].indexOf(input.footprint) !== -1 ? input.footprint : (answers.place === "compact" || answers.place === "roomy" ? answers.place : "unknown");
    return answers;
  }

  function priceText(modelOrId) {
    var model = typeof modelOrId === "string" ? getModel(modelOrId) : modelOrId;
    if (!model) return "未收录这款价格，本次价格与具体套餐待核。";
    var snapshot = (data.priceSnapshots || []).filter(function (entry) { return entry.model_id === model.id; })[0];
    var recent = snapshot ? snapshot.observed_at + " 用户反馈：" + model.name + " " + snapshot.price_label + "；未独立核价，渠道、优惠条件与箱单待核。" : "";
    var history = model.historicalPrice;
    var historical = history ? "618 多色套装参考" + history.price_label + "；本次价格与具体套餐待核。" : "618 未记录这款约价；本次价格与具体套餐待核。";
    return (recent ? recent + " " : "") + historical;
  }

  function quoteState(model, answers) {
    if (answers.quoteModel !== model.id || answers.quoteAmount === null) return "unknown";
    if (answers.budgetCap !== null && answers.quoteAmount > answers.budgetCap) return "over";
    return "userEstimate";
  }

  function referenceCap(answers) {
    return { under2: 2000, "2to4": 4000, "4to8": 8000 }[answers.budget] || null;
  }

  function historyAboveBudget(model, answers) {
    var cap = referenceCap(answers);
    return Boolean(cap && model.historicalPrice && model.historicalPrice.reference_min > cap);
  }

  function routes(answers) {
    // These are comparison directions, not verified current prices or measured placement approvals.
    // Small projects can be compared on a higher tier: purpose alone never locks an entry model.
    if (answers.budget === "under2") {
      if (answers.size === "large") return ["a1", "p2s"];
      return answers.size === "medium" ? ["a1", "a1-mini"] : ["a1-mini", "a1"];
    }
    if (answers.budget === "2to4") return ["p2s", "p1s"];
    var limitedSpace = answers.footprint === "compact";
    if (answers.budget === "4to8") {
      if (limitedSpace) return ["x2d", "p2s"];
      if (answers.footprint === "roomy" && answers.size === "large") return ["h2d", "x2d"];
      return ["x2d", "h2d"];
    }
    if (answers.budget === "over8") return limitedSpace ? ["x2d", "p2s"] : ["h2d", "h2c"];
    return ["p2s", "x2d"];
  }

  function colorReason(answers) {
    if (answers.purpose === "soft" && answers.color === "auto") return "想自动换色；软料能否通过自动换料装置，要按具体产品逐一核，先不默认它能进料。";
    if (answers.color === "auto") return "想让同一个作品自动换几种颜色：比较这款的自动换料配置，箱单另核。";
    if (answers.color === "diy") return "愿意自己涂色，或分颜色打印后拼起来：先比较单机，不默认加自动换料装置。";
    if (answers.color === "single") return "先打主要一种颜色的作品：先比较单机，需要时再看多色配置。";
    return "这次先按单色试试：先比较单机；以后想自动换色，再核配件和费用。";
  }

  function spaceText(model, answers) {
    var prefix;
    if (model.series === "H") prefix = "大机身路线：先量桌面、上方高度、料架和操作空间。";
    else if (!model.enclosed) prefix = "开放机型：先量桌面、热床移动、料架和操作空间，不能只按机身摆放。";
    else prefix = "先量桌面、上方高度、料架、线缆和开门操作空间。";
    if (answers.footprint === "compact") prefix += "你已说明桌面有限；暂不确认能放下，也不把高档一律当作更大。";
    if (answers.place === "bedroom") return prefix + "不建议放在卧室；候选仅供换位置后比较，先换摆放位置，再考虑购买。";
    if (answers.place === "balcony") return prefix + "阳台先核雨水、日晒和温湿度条件，再按具体机型要求决定能否长期摆放电器。";
    if (["shared", "living", "study"].indexOf(answers.place) !== -1) return prefix + "有人长期活动的房间，还要安排同住者、运行时段、通风和宠物接触；房间名称不代表桌面容量。";
    if (answers.place === "unknown") return prefix + "位置还没定，目前只给条件方向。";
    if (answers.place === "compact") return prefix;
    return prefix + "有独立房间或充裕空间，也要量过才确认。";
  }

  function locationCaution(answers) {
    if (answers.place === "bedroom") return "不建议放在卧室。以下候选只供换位置后比较，封箱、过滤或小机身都不表示这个条件已解决。";
    if (answers.place === "balcony") return "阳台的雨水、日晒与温湿度条件还未确认，先核是否适合长期放置电器。";
    if (answers.place === "living") return "客厅有人经常活动，先安排通风、运行时段、同住者和宠物接触。";
    if (answers.place === "study") return "书房经常工作、学习，先安排打印时段、通风与声音，避免长时间近距离共处。";
    if (answers.place === "shared") return "共用房间先确认实际用途、同住者、运行时段、通风和宠物接触；旧记录不代表位置已合适。";
    if (answers.place === "unknown") return "摆放位置还没定，先确定位置；候选目前也不确认放得下。";
    return "摆放和操作空间仍要实测；独立位置不代表通风等环境条件已确认。";
  }

  function priorityAction(answers) {
    if (answers.place === "bedroom") return "先换摆放位置，再考虑购买";
    if (answers.place === "balcony") return "先核阳台的雨水、日晒和温湿度条件";
    if (answers.place === "unknown") return "先确定打印机的摆放位置";
    if (answers.footprint === "compact") return "先量台面和整套设备的摆放、操作空间";
    if (["living", "study", "shared"].indexOf(answers.place) !== -1) return "先看家庭环境笔记，安排通风与打印时段";
    if (answers.budget === "unknown") return "先拿到想买套餐的完整报价，再确定总预算";
    if (answers.size === "unknown") return "先量第一件作品的长、宽、高";
    if (answers.size === "large") return "先核大件模型三边和实际打印工作区";
    if (answers.purpose === "functional") return "先确认零件的使用条件和具体材料";
    if (answers.purpose === "soft") return "先选具体软料，再核机器与送料方式";
    if (answers.purpose === "unknown") return "先找一个真正想打印的模型";
    return "买前量台面、料架和操作空间，再核整套报价";
  }

  function makeCandidate(id, answers) {
    var model = getModel(id);
    if (!model) return null;
    var reasons = [];
    var tradeoffs = [];
    var pending = [];
    var budgetState = quoteState(model, answers);
    var cap = referenceCap(answers);
    var history = model.historicalPrice;
    var budgetEdge = Boolean(cap && history && history.reference_min <= cap && history.reference_max >= cap);
    var budgetWarning = "";

    if (id === "a1-mini") {
      reasons.push(answers.budget === "under2" ? "预算先放在 2000 元以内、主要试小件时，可以从这条小尺寸路线比较。实际套餐价格还要核。" : "想先试小件、减少投入时，可单独比较 mini 的小尺寸路线；不把它当作预算内唯一选择。");
      tradeoffs.push("标称范围是 18 × 18 × 18 厘米；手机或可乐的类比不能确认实际模型放得下。");
    } else if (id === "a1") {
      reasons.push(answers.size === "medium" && answers.budget === "under2" ? "预算先放在 2000 元以内，又想留一点尺寸余量，可以先比较 A1。" : "比 mini 有更大的标称打印范围，可作为想多留尺寸余量的另一条路线。");
      tradeoffs.push("开放结构要留出热床移动、料架和维护空间，不能只按机身尺寸摆放。");
    } else if (id === "p2s") {
      reasons.push(budgetState === "over" ? "P2S 可以单独比较；你记录的配置高于明确预算上限，其他套餐价格仍待核。" : answers.budget === "2to4" || answers.budget === "unknown" ? "先比较常规尺寸的封闭路线；618 多色套装约 3500 元，适合拿来判断预算量级。" : answers.budget === "under2" ? "作为另一条封闭路线来比较；标称打印范围与 A1 同量级，不确认大件能放下，实际配置价格也要核。" : "如果主要打小件，暂时用不到主动腔温或双喷，可以把 P2S 当作更省预算的比较方向。");
      tradeoffs.push("封闭单喷嘴路线，没有主动腔温加热；能否覆盖你的任务，要按具体材料和模型核。");
    } else if (id === "p1s") {
      reasons.push("同样是常规尺寸封闭单喷嘴路线，618 套装记录较低，可和 P2S 比较价格、配置与取舍。");
      tradeoffs.push("打印尺寸和温度沿用上一轮资料；磨蚀材料、升级配件和实际套餐另核，没有主动腔温加热。");
    } else if (id === "x2d") {
      reasons.push("主要比较主辅双喷嘴和主动腔温能力；小摆件也能列入比较，是否用得上这些能力再看模型。");
      tradeoffs.push("主、辅喷嘴的工作范围与材料限制不同；不能把主喷嘴能力或两区并集当作双喷共同能力。");
    } else if (id === "h2d") {
      reasons.push(answers.footprint === "roomy" && answers.size === "large" ? "你想打较大的整件，也愿意留充裕空间，可以先比较 H2D 的更大打印范围、双喷嘴和主动腔温。" : "想多留尺寸和任务余量时，可以比较 H2D 的更大打印范围、双喷嘴和主动腔温；也可以打印小件。");
      tradeoffs.push("大机身要先量摆放与操作空间；双喷嘴共同区与并集不同，不承诺两材料覆盖整个标称范围。");
    } else if (id === "h2c") {
      reasons.push("预算上限再往上、也愿意留空间时，可比较 H2C 的双喷嘴、主动腔温与 Vortek 热端切换能力。");
      tradeoffs.push(model.tradeoff);
    } else {
      reasons.push("这是你心仪的机型，可结合它的具体能力单独比较；五道题不确认你需要全部功能。");
      tradeoffs.push(model.tradeoff);
    }
    if (answers.purpose === "small") reasons.push("这次主要打小摆件、小玩具：结合预算比较能力和方便程度，不因作品小就只给入门机。");
    else if (answers.purpose === "home") reasons.push("想做日常收纳和家用小物：先核模型尺寸、接触环境和选用材料。");
    else if (answers.purpose === "large") reasons.push("有大件想法：本轮仍按你选的实际大小比较，今后的大件再量三边。");
    else if (answers.purpose === "functional") reasons.push("想做功能零件：材料、使用条件和实际验证比仅看机型档位更重要。");
    else if (answers.purpose === "soft") reasons.push("想做能弯、能捏的软配件：具体软料与送料方式另核，不因软料就默认需要封箱。");
    reasons.push(colorReason(answers));
    if (answers.size === "large") pending.push("先量实际模型三边，并按这款的单喷或双喷共同工作区查看切片；‘大件’选项不确认它能整件打印。");
    else if (answers.size === "unknown") pending.push("尺寸还未确认，先看实际模型的长、宽、高和切片摆放。");
    else pending.push("类比只帮助想象大小；先看实际模型的长、宽、高和切片摆放，不等于已确认放得下。");
    if (answers.purpose === "functional") pending.push("先确认具体材料、使用条件和性能验证；机器型号不能保证耐热、承重或配合精度。");
    if (answers.purpose === "soft") pending.push("先选具体软料，再核机器、主辅喷嘴、送料方式和打印设置；不是所有软料都能通过自动换料装置。");
    if (answers.color === "auto") {
      tradeoffs.push("自动换颜色需要兼容的换料配置，也会增加时间和换色废料；不默认任何耗材都能自动进料。");
      pending.push("先确认同一作品要几种颜色，再核具体料槽、扩展配置、箱单和耗材兼容性。");
    }
    if (model.enclosed) tradeoffs.push("封闭结构不代表自动解决噪声、气味、通风或宠物接触问题。");
    var placement = spaceText(model, answers);
    pending.push(placement);
    if (budgetState === "over") {
      budgetWarning = "你记录的这套配置超过明确预算上限；先核其他套餐，不把它列为预算内首选。";
      pending.push("不能据此直接排除同款机器的所有套餐；其他配置价格仍待核。");
    } else if (budgetState === "userEstimate") {
      pending.push("你记录的报价可作估算；购买前再核渠道、箱单和额外费用。");
    } else {
      pending.push("近期反馈与 618 历史记录都不是你的完整报价，单机、AMS 套装和整套入坑费用分开核，不据此确认符合预算。");
      if (historyAboveBudget(model, answers)) budgetWarning = "这款的 618 多色套装记录高于你选的预算量级；本次单机和其他配置待核，先别当作预算内推荐。";
      else if (budgetEdge) budgetWarning = "618 多色套装约价已到这档预算上沿；耗材、配件等费用还要留余量，本次总价待核。";
      else if (answers.budget === "over8" && id === "h2c") budgetWarning = answers.budgetCap === null ? "8000 元以上还没有具体上限；H2C 的 618 套装约 13000 元，先核你愿意投入的总额。" : "你记录的预算上限为 " + answers.budgetCap + " 元；H2C 的 618 套装约 13000 元，本次配置总价仍待核。";
    }
    if (budgetWarning) pending.push(budgetWarning);
    return {
      model: model,
      reasons: reasons,
      configurationText: colorReason(answers),
      tradeoffs: tradeoffs,
      pending: pending,
      priceText: priceText(model),
      budgetState: budgetState,
      budgetEdge: budgetEdge,
      budgetWarning: budgetWarning,
      spaceText: placement,
      locationCaution: locationCaution(answers),
      locationWarning: answers.place === "bedroom" || answers.place === "balcony" ? locationCaution(answers) : "",
      space: { status: "pending", confirmed: false, text: placement },
      geometry: { status: "pending", confirmed: false },
      historyAboveBudget: historyAboveBudget(model, answers)
    };
  }

  function prioritizeQuotes(candidates) {
    return candidates.filter(function (candidate) { return candidate.budgetState !== "over"; }).concat(candidates.filter(function (candidate) { return candidate.budgetState === "over"; }));
  }

  function evaluate(input) {
    var answers = normalize(input || {});
    var standardCandidates = prioritizeQuotes(unique(routes(answers)).map(function (id) { return makeCandidate(id, answers); }).filter(Boolean));
    var standardPrimary = standardCandidates.filter(function (candidate) { return candidate.budgetState !== "over"; })[0] || null;
    var standardAlternative = standardCandidates.filter(function (candidate) { return candidate !== standardPrimary; })[0] || null;
    var canSaveAlternative = (answers.budget === "4to8" || answers.budget === "over8") && !standardCandidates.some(function (candidate) { return candidate.model.id === "p2s"; });
    var savingAlternative = canSaveAlternative ? makeCandidate("p2s", answers) : null;
    // A known over-cap configuration cannot carry a saving label; other packages remain unknown.
    if (savingAlternative && savingAlternative.budgetState === "over") {
      canSaveAlternative = false;
      savingAlternative = null;
    }
    // Preserve the standard primary when switching the second card. A known over-cap quote never becomes primary.
    var candidates = answers.compareMode === "save" && canSaveAlternative ? [standardPrimary, savingAlternative].filter(Boolean) : standardCandidates;
    var primary = candidates.filter(function (candidate) { return candidate.budgetState !== "over"; })[0] || null;
    var alternative = candidates.filter(function (candidate) { return candidate !== primary; })[0] || null;
    var pending = [];
    var steps = [];
    var notes = ["choose", "filament", "ventilation"];
    var needsPreparation = answers.purpose === "unknown" || answers.purpose === "functional" || answers.purpose === "soft" || answers.size === "unknown" || answers.size === "large" || answers.budget === "unknown" || answers.footprint === "compact" || ["living", "balcony", "bedroom", "study", "shared", "unknown"].indexOf(answers.place) !== -1;

    if (answers.purpose === "unknown") pending.push("先从笔记找一个真的想打印的东西，不用急着决定型号。");
    if (answers.size === "unknown") pending.push("第一件作品的尺寸还未确认；这次只看机型方向，之后量长、宽、高。");
    if (answers.purpose === "large" && (answers.size === "small" || answers.size === "medium")) pending.push("这次按你选的小件或常规尺寸来比较；今后要做大件，再单独量三边。");
    if (answers.size === "large") {
      pending.push("大件可能超过候选机型的实际工作区；量三边、查看切片，必要时拆件或另看更合适的尺寸路线。");
      steps.push("先量想打印的模型长、宽、高，按实际单喷或双喷工作区查看切片，看看能否整件打印。");
      if (answers.budget === "under2") pending.push("大件要求和低预算可能冲突：A1 的范围也不确认够用，P2S 的 618 套装记录高于这档预算。先核模型与本次配置价格。");
    } else {
      steps.push("先找一个想打印的模型，看实际长、宽、高和适用机型。");
    }
    if (answers.purpose === "functional") {
      pending.push("功能件需要先核材料和使用条件，先不把封闭或主动腔温机型当作性能保证。");
      notes = ["filament", "choose", "ventilation"];
    }
    if (answers.purpose === "soft") {
      pending.push("软配件的具体材料和送料方式还没确认；先看耗材笔记，再决定比较什么配置。");
      notes = ["filament", "choose", "ventilation"];
    }
    if (["living", "balcony", "bedroom", "study", "shared", "unknown"].indexOf(answers.place) !== -1) {
      pending.push(locationCaution(answers));
      notes = ["ventilation"].concat(notes.filter(function (id) { return id !== "ventilation"; }));
    }
    if (answers.footprint === "compact") {
      pending.push("有限桌面还没量尺寸；先核机身、料架和操作空间，不按价格高低推断谁一定更大。");
    }
    steps.push("量好桌面、上方高度、料架和操作空间，再安排运行时段、通风和同住者。");
    if (answers.purpose === "soft") {
      steps.push("先看耗材笔记，选具体软料并核机器和送料方式；想自动换色，也先核这款软料的兼容性。");
    } else if (answers.color === "auto") {
      steps.push("先看耗材笔记，再核自动换料装置是否包含、材料是否兼容。");
    } else if (answers.purpose === "functional") {
      steps.push("先看耗材笔记，把具体用途和材料弄清楚，再核性能与预设。");
    }
    if (answers.color === "unknown") pending.push("这次先单色试试；以后是否自动换色还没定，到时再核配套装置。");
    if (standardCandidates.some(function (candidate) { return candidate.budgetState === "over"; })) {
      pending.push("已把超过明确上限的报价配置移出首选；其他配置价格仍待确认。");
    }
    if (answers.budget === "unknown") pending.push("预算还没定，P2S 和 X2D 仅作档位比较；看完 618 参考记录，再核本次配置总价。");
    if (answers.budget === "over8") pending.push(answers.budgetCap === null ? "8000 元以上没有具体上限；先确定你愿意投入的总额，不默认所有高配都在预算里。" : "按你记录的 " + answers.budgetCap + " 元预算上限核对本次配置；未报价的候选还不能确认符合预算。");
    steps.push("购买前核对本次单机或多色套装总价、箱单，以及耗材等额外费用。");
    var firstAction = priorityAction(answers);
    steps = unique([firstAction].concat(steps));
    var favorite = getModel(answers.favorite) ? makeCandidate(answers.favorite, answers) : null;
    return {
      primary: primary,
      alternative: alternative,
      candidates: candidates,
      kind: needsPreparation ? "prepare" : "direction",
      message: answers.place === "bedroom" ? "先换摆放位置，再考虑购买。以下两款只作为换位置后的比较方向。" : "按你选的预算先比较这两款。具体模型、配置价格和摆放尺寸再核对。",
      priorityAction: firstAction,
      locationCaution: locationCaution(answers),
      locationWarning: answers.place === "bedroom" || answers.place === "balcony" ? locationCaution(answers) : "",
      action: { title: needsPreparation ? "买之前，先做这几步" : "接下来核对这些就好", steps: steps },
      notes: notes,
      pending: unique(pending),
      favorite: favorite,
      compareMode: answers.compareMode === "save" && canSaveAlternative ? "save" : "standard",
      canSaveAlternative: canSaveAlternative,
      defaultAlternativeName: standardAlternative ? standardAlternative.model.name : "",
      savingAlternative: savingAlternative,
      space: { status: "pending", confirmed: false, choice: answers.place, footprint: answers.footprint },
      budget: { status: "pending", confirmed: false, choice: answers.budget }
    };
  }

  var api = { evaluate: evaluate, getModel: getModel, priceText: priceText };
  root.BagelEngine = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
