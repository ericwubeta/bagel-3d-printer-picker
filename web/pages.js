/* C-v04: printable capability routes and model reading pages. Pure HTML functions. */
(function (root) {
  'use strict';

  var copy = {
    'a1-mini': {
      headline: '小巧起步',
      short: '桌面小件，轻量入门',
      added: '先从小作品开始，自动校准让日常操作更简单。',
      suitable: '先试小摆件、小玩具，愿意接受较小打印范围的人。',
      check: '机身之外，还要留热床移动、料架和日常操作的位置。',
      scale: '小件路线'
    },
    a1: {
      headline: '桌面入门，更大打印空间',
      short: '比 mini 多留尺寸余量',
      added: '沿用开放式桌面路线，标称打印范围比 mini 更大。',
      suitable: '想打常用小物，也想给作品尺寸留一点余量的人。',
      check: '开放式热床会移动；量摆放位置时，要把运动与料架一起算。',
      scale: '常规尺寸'
    },
    a2l: {
      headline: '开放式大尺寸',
      short: '想打更大，再看这条路线',
      added: '打印空间进一步变大；刀切、画笔模组通过另购套装扩展。',
      suitable: '有较大作品想法，愿意安排开放式大机器的人。',
      check: '刀切不是标配；大尺寸也不代表具备封闭机型的材料条件。',
      scale: '大尺寸'
    },
    p1s: {
      headline: '经典封闭机型',
      short: '给常规尺寸增加机箱结构',
      added: '采用封闭式结构，可按具体套餐搭配自动换料装置。',
      suitable: '想比较常规尺寸封闭路线，再权衡配置和费用的人。',
      check: '封闭结构仍要安排通风、声音与接触；材料升级条件和套餐另核。',
      scale: '常规尺寸'
    },
    p2s: {
      headline: '操作与校准升级',
      short: '常规尺寸，封闭单喷',
      added: '相对 P1S，重点看触屏操作、动态流量校准等变化。',
      suitable: '主要做常用作品，希望比较日常操作与预算取舍的人。',
      check: '没有主动腔温加热；自动换料、烘干供电和套餐内容分开核。',
      scale: '常规尺寸'
    },
    x2d: {
      headline: '常规尺寸，主辅双喷',
      short: '两个喷嘴，可以分工',
      added: '主、辅喷嘴分工，并有主动腔温能力；小物也能列入比较。',
      suitable: '预算允许，想试主体与支撑分工等玩法的人。',
      check: '主、辅喷嘴的材料与范围不同，不能把主喷能力照搬给辅助喷嘴。',
      scale: '常规尺寸'
    },
    h2s: {
      headline: '大尺寸单喷',
      short: '扩大空间，仍是一个喷嘴',
      added: '把封闭路线的打印空间做大，并具备主动腔温能力。',
      suitable: '大件是主要需求，想先比较单喷路线的人。',
      check: '先核实际模型和整套摆放；它是单喷机型，AMS 兼容按具体装置看。',
      scale: '大尺寸'
    },
    h2d: {
      headline: '大尺寸双喷',
      short: '更大作品，两个喷嘴分工',
      added: '大尺寸路线增加双喷分工，也能打印小件；是否用得上，按作品看。',
      suitable: '想给大件和多种任务留余量，也愿意留出摆放位置的人。',
      check: '单喷、双喷共同区与两路并集分别看；还要给整套费用留余量。',
      scale: '大尺寸'
    },
    h2c: {
      headline: '多热端切换',
      short: '继续探索多色、多材料',
      added: '在双喷路线中增加 Vortek 热端切换，比较多色与多材料的不同做法。',
      suitable: '有明确多色或多材料任务，愿意继续研究配置的进阶玩家。',
      check: '先核热端、孔径、送料和具体任务条件；不等于任意任务都没有换色废料。',
      scale: '多色进阶'
    }
  };

  var routes = [
    { title: '桌面起步', subtitle: '从小件，到更大打印空间', ids: ['a1-mini', 'a1', 'a2l'], links: ['更大打印空间', '更大打印空间'] },
    { title: '封闭与双喷', subtitle: '看机箱、操作与喷嘴分工', ids: ['p1s', 'p2s', 'x2d'], links: ['操作与校准升级', '增加主辅双喷'] },
    { title: '大尺寸与多热端', subtitle: '再看大件和多色进阶', ids: ['h2s', 'h2d', 'h2c'], links: ['双喷分工', '多热端切换'] }
  ];

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function data() { return root.BagelData || { models: [], sources: [], historyModels: [] }; }
  function getModel(id) {
    return data().models.filter(function (m) { return m.id === id; })[0] || null;
  }
  function complete(answers) {
    return ['place', 'budget', 'size', 'purpose', 'color'].every(function (key) { return Boolean(answers && answers[key]); });
  }
  function result(answers) {
    return root.BagelEngine && complete(answers) ? root.BagelEngine.evaluate(answers) : null;
  }
  function portrait(pose) {
    return typeof root.BagelPortrait === 'function' ? root.BagelPortrait(pose, 'pages-cat') : '<span class="pages-cat-fallback" aria-hidden="true">贝果陪你看</span>';
  }
  function header(title, description, pose) {
    if (pose === 'peek') return '<header class="pages-header pages-header-peek">' + portrait(pose) + '<div class="pages-heading"><h1>' + esc(title) + '</h1><p>' + esc(description) + '</p></div></header>';
    return '<header class="pages-header"><div class="pages-heading"><h1>' + esc(title) + '</h1><p>' + esc(description) + '</p></div>' + portrait(pose) + '</header>';
  }
  function tabs(mode) {
    return '<nav class="pages-tabs" aria-label="机型阅读">' + [ ['all', '全系能力图'], ['favorite', '心仪高配'], ['new', '新品猜想'] ].map(function (t) {
      return '<button type="button" data-mode="' + t[0] + '" aria-pressed="' + (mode === t[0]) + '">' + t[1] + '</button>';
    }).join('') + '</nav>';
  }
  function recommendedIds(answers) {
    var r = result(answers);
    return r ? r.candidates.slice(0, 2).map(function (c) { return c.model.id; }) : [];
  }
  function node(id, recommendationIds) {
    var m = getModel(id), c = copy[id];
    if (!m || !c) return '';
    var selected = recommendationIds.indexOf(id) !== -1;
    return '<li class="pages-route-node' + (selected ? ' pages-recommended' : '') + '"><button type="button" class="pages-node-open" data-model="' + esc(id) + '" aria-label="看 ' + esc(m.name) + '：' + esc(c.headline) + '"><img class="pages-node-photo" src="' + esc(m.image) + '" alt="' + esc(m.name + ' ' + m.imageCaption) + '"><span class="pages-node-copy"><span class="pages-node-topline"><span class="pages-node-name">' + esc(m.name) + '</span>' + (selected ? '<span class="pages-rec-label">本次建议</span>' : '') + '</span><strong class="pages-node-advantage">' + esc(c.headline) + '</strong><span class="pages-node-explainer">' + esc(c.short) + '</span><span class="pages-node-read">看这款详情</span></span></button></li>';
  }
  function route(routeData, ids) {
    return '<section class="pages-route" aria-label="' + esc(routeData.title) + '"><div class="pages-route-heading"><h2>' + esc(routeData.title) + '</h2><p>' + esc(routeData.subtitle) + '</p></div><ol class="pages-route-list">' + routeData.ids.map(function (id, index) {
      return (index ? '<li class="pages-connector" aria-label="能力变化"><span>' + esc(routeData.links[index - 1]) + '</span></li>' : '') + node(id, ids);
    }).join('') + '</ol></section>';
  }
  function crossComparison(ids) {
    var items = [];
    if (ids.indexOf('x2d') !== -1 && ids.indexOf('h2d') !== -1) items.push({ ids: ['x2d', 'h2d'], title: 'X2D 和 H2D，多出来的空间', text: '两款都可比较喷嘴分工。H2D 的打印空间更大；X2D 的主、辅喷嘴条件另看。先按模型与实际摆放取舍。' });
    if (ids.indexOf('a1') !== -1 || ids.indexOf('p2s') !== -1) items.push({ ids: ['a1', 'p2s'], title: 'A1 和 P2S，开放与封闭', text: '标称打印范围同量级，主要区别之一是开放或封闭结构。封闭机箱仍需要安排通风、声音与日常接触。' });
    if (!items.length) return '';
    return '<details class="pages-fold"><summary>放在一起，再看一个差别</summary>' + items.map(function (item) {
      return '<article class="pages-comparison"><h3>' + esc(item.title) + '</h3><p>' + esc(item.text) + '</p><div class="pages-inline-actions">' + item.ids.map(function (id) { return '<button type="button" data-model="' + esc(id) + '">看 ' + esc(getModel(id).name) + '</button>'; }).join('') + '</div></article>';
    }).join('') + '</details>';
  }
  function ams() {
    return '<details class="pages-fold pages-ams"><summary>颜色与送料扩展</summary><p class="pages-ams-intro">AMS 是帮助机器自动换不同线卷的装置。它是配件，先按具体机型核兼容。</p><dl class="pages-ams-list"><div><dt>换颜色</dt><dd>同一作品打印时换线卷。先看需要几种颜色、机器的料路和套餐配件。</dd></div><div><dt>防潮存放</dt><dd>让线卷在存放时减少受潮。封闭存放与主动烘干，是两件事。</dd></div><div><dt>主动烘干</dt><dd>用加热等方式处理材料中的水分。具体温度、供电与可用状态按装置核。</dd></div></dl><p class="pages-small">A1 mini / A1 可先看 AMS lite；A2L 的扩展选择另看配置。H2S 不兼容 AMS lite。其他机型与 AMS / AMS 2 Pro / AMS HT 的组合逐款核对，不能按“同品牌”视为通用。</p><p class="pages-small">软料也按具体产品核兼容，不把所有 TPU 都当作能自动进料。</p></details>';
  }
  function priceHistory() { return root.BagelPriceUI.panel('pages-fold'); }
  function history() {
    return '<details class="pages-fold"><summary>历代机型与其他型号</summary><p>P1P、X1 / X1C 可作为历代路线了解；X1E、H2D Pro 等型号另看具体用途与采购条件。</p><p class="pages-small">发布日期、供应、当前套餐和价格另核。这里没有把能力路线当作真实年份发展史。</p></details>';
  }
  function favoriteCard(m, answers) {
    var c = copy[m.id], selected = answers.favorite === m.id;
    var favoriteAnswers = {};
    Object.keys(answers).forEach(function (key) { favoriteAnswers[key] = answers[key]; });
    favoriteAnswers.favorite = m.id;
    var f = root.BagelEngine && complete(answers) ? root.BagelEngine.evaluate(favoriteAnswers).favorite : null;
    var warning = f && f.budgetWarning ? '<p class="pages-visible-warning">' + esc(f.budgetWarning) + '</p>' : '';
    return '<article class="pages-favorite-card"><button type="button" class="pages-node-open" data-model="' + esc(m.id) + '"><img class="pages-node-photo" src="' + esc(m.image) + '" alt="' + esc(m.name + ' ' + m.imageCaption) + '"><span class="pages-node-copy"><span class="pages-node-name">' + esc(m.name) + '</span><strong class="pages-node-advantage">' + esc(c.headline) + '</strong><span class="pages-node-explainer">' + esc(c.short) + '</span><span class="pages-node-read">看这款详情</span></span></button>' + warning + '<p class="pages-small">' + esc(m.series === 'H' ? '大机身路线：整套摆放与操作空间还要量。' : '机身、料架、开门与操作空间还要一起量。') + '</p><button type="button" class="pages-favorite-button" data-favorite="' + esc(m.id) + '" aria-pressed="' + selected + '">' + (selected ? '已留作心仪比较' : '留作心仪比较') + '</button></article>';
  }
  function favoritePage(answers) {
    return header('心仪高配', '喜欢这款，也可以单独拿来比较。', 'listen') + tabs('favorite') + '<p class="pages-intro">心仪机型只记录偏好。用途、预算与摆放提醒仍按你的回答保留。</p>' + (answers.place === 'bedroom' ? '<p class="pages-visible-warning">先换摆放位置，再考虑购买。这里的机型方向，不表示适合放在卧室。</p>' : '') + '<div class="pages-favorites">' + data().models.filter(function (m) { return m.id === 'x2d' || m.series === 'H'; }).map(function (m) { return favoriteCard(m, answers); }).join('') + '</div>' + priceHistory();
  }
  function newPage() {
    return header('新品猜想', '公开讨论中的名字，等待官方消息。', 'peek') + tabs('new') + '<p class="pages-intro">先保留好奇，等官方资料再比较。</p><div class="pages-new-list">' + ['P3S', 'H3C'].map(function (name) {
      return '<article class="pages-new-model"><h2>' + name + '</h2><p class="pages-new-status">网友线索，正式资料待核</p><dl class="pages-new-facts"><div><dt>销售时间</dt><dd>未定</dd></div><div><dt>机器定价</dt><dd>未知</dd></div><div><dt>打印性能</dt><dd>未知</dd></div></dl></article>';
    }).join('') + '</div><p class="pages-small">线索整理于2026-10-14；离线页面不自动更新，是否有新消息以官方为准。</p><p class="pages-small">当前线索尚不能用于预算和性能比较；这里也不猜机器外观。</p><button type="button" class="pages-main-button" data-mode="all">先看已知机型</button>';
  }
  function catalog(answers, mode) {
    answers = answers || {};
    if (mode === 'new') return '<div class="pages-shell">' + newPage() + '</div>';
    if (mode === 'favorite') return '<div class="pages-shell">' + favoritePage(answers) + '</div>';
    var ids = recommendedIds(answers);
    return '<div class="pages-shell">' + header('拓竹全系能力图', '看看每款，多了什么能力。', 'stand') + tabs('all') + '<p class="pages-intro">点开机型，看优势与取舍。' + (data().assetProfile === 'public-schematic' ? '图中为结构示意。' : '') + (ids.length ? '蓝色标记是你这次的两款建议。' : '做完五个选择后，会标出本次建议。') + '</p><p class="pages-map-note">连线比较能力变化，不代表必须逐台购买，也不是发布时间顺序。</p><div class="pages-routes">' + routes.map(function (routeData) { return route(routeData, ids); }).join('') + '</div>' + crossComparison(ids) + ams() + history() + priceHistory() + '<p class="pages-dated-note">资料沿用 2026 年 10 月 13–14 日核对记录；后续报价、供应与新消息另核。</p></div>';
  }
  function knownSources(m) {
    var entries = (m.sourceIds || []).map(function (id) {
      var s = data().sources.filter(function (source) { return source.id === id; })[0];
      if (!s) return '';
      var level = s.access_level === 'retrieved_text_unreadable' ? '该次获取成功，但正文未能读出' : s.access_level === 'search_excerpt' ? '官方搜索摘录，未当作正文直读' : '此前官网资料核对';
      return '<li><strong>' + esc(s.title) + '</strong><p class="pages-source-url">' + esc(s.url) + '</p><p class="pages-small">记录核对日：' + esc(s.checked_at || '未记录') + '；' + esc(level) + '。</p></li>';
    }).join('');
    var extra = {
      a2l: { title: 'A2L FAQ，第 8–10 题：刀切为可选套装', url: 'https://bambulab.cn/zh-cn/a2l/faq' },
      p2s: { title: 'P2S FAQ：操作、校准与腔温条件', url: 'https://bambulab.cn/zh-cn/p2s/faq' },
      x2d: { title: 'X2D 产品页及注释：主辅喷条件', url: 'https://bambulab.cn/zh-cn/x2d' },
      h2s: { title: 'H2S FAQ：AMS 兼容条件', url: 'https://bambulab.cn/zh-cn/h2s/faq' },
      h2c: { title: 'H2C FAQ，第 1–2、5–6 题：热端与切换条件', url: 'https://bambulab.cn/zh-cn/h2c/faq' }
    }[m.id];
    if (extra) entries += '<li><strong>' + esc(extra.title) + '</strong><p class="pages-source-url">' + esc(extra.url) + '</p><p class="pages-small">沿用 2026 年 10 月 14 日方案补核。</p></li>';
    return '<details class="pages-fold"><summary>资料来源与核对日期</summary><p class="pages-small">字段来自已有研究快照，没有分析你的实际模型，也没有执行切片。</p>' + (m.id === 'p1s' ? '<p class="pages-small">P1S 的打印尺寸与温度沿用较早研究；该次快速入门指南未能提取正文，不算该次新核规格。</p>' : '') + '<ul class="pages-source-list">' + entries + '</ul><p class="pages-small">官网中的配件计划，不代表本次已经有货或功能已经上线。</p></details>';
  }
  function specs(m) {
    var names = { single: '单喷打印区', main: '主喷打印区', auxiliary: '辅助喷打印区', left: '左喷单独打印区', right: '右喷单独打印区', dual_intersection: '双喷共同打印区', dual_union: '两路合并范围' };
    return '<details class="pages-fold"><summary>精确尺寸与结构</summary><dl class="pages-specs">' + Object.keys(m.build || {}).map(function (key) {
      return '<div><dt>' + esc(names[key] || key) + '</dt><dd>' + esc(m.build[key].join(' × ')) + ' mm</dd></div>';
    }).join('') + '<div><dt>结构</dt><dd>' + esc(m.architecture) + '</dd></div><div><dt>腔温</dt><dd>' + esc(m.chamber) + '</dd></div>' + (m.device ? '<div><dt>机身外形</dt><dd>' + esc(m.device.join(' × ')) + ' mm</dd></div>' : '') + '</dl><p class="pages-small">标称范围不保证模型能整件打。双喷共同区和两路合并范围不同，使用两种材料时先核实际路径。</p><p class="pages-small">' + esc(m.motionNote || '机身、料架、开门、运动与维护空间另核。') + '</p></details>';
  }
  function model(answers, id) {
    answers = answers || {};
    var m = getModel(id), c = copy[id];
    if (!m || !c) return '<div class="pages-shell">' + header('这款资料还没收录', '先回到已知机型，继续比较。', 'listen') + '<button type="button" class="pages-main-button" data-mode="all">看全系能力图</button></div>';
    var selected = answers.favorite === id;
    var r = result(answers), candidate = r ? r.candidates.filter(function (item) { return item.model.id === id; })[0] : null;
    var favoriteAnswers = {};
    Object.keys(answers).forEach(function (key) { favoriteAnswers[key] = answers[key]; });
    favoriteAnswers.favorite = id;
    var favoriteCandidate = root.BagelEngine && complete(answers) ? root.BagelEngine.evaluate(favoriteAnswers).favorite : null;
    var budgetWarning = favoriteCandidate && favoriteCandidate.budgetWarning ? '<p class="pages-visible-warning">' + esc(favoriteCandidate.budgetWarning) + '</p>' : '';
    return '<article class="pages-shell pages-model-page">' + header(m.name, c.headline, 'listen') + '<figure class="pages-model-figure"><img class="pages-model-hero" src="' + esc(m.image) + '" alt="' + esc(m.name + ' ' + m.imageCaption) + '"><figcaption>' + esc(c.short) + ' · ' + esc(m.imageCaption) + '</figcaption></figure>' + (answers.place === 'bedroom' ? '<p class="pages-visible-warning">先换摆放位置，再考虑购买。机箱和过滤不能让卧室条件自动解决。</p>' : '') + budgetWarning + '<div class="pages-reading"><section><h2>多了什么</h2><p>' + esc(c.added) + '</p></section><section><h2>更适合谁</h2><p>' + esc(c.suitable) + '</p></section><section><h2>还要核什么</h2><p>' + esc(c.check) + '</p></section></div>' + (candidate ? '<details class="pages-fold"><summary>和我这次的选择，怎么对上</summary><p>' + esc(candidate.reasons[0] || '') + '</p><p class="pages-small">' + esc(candidate.configurationText || '') + '</p><p class="pages-small">' + esc(candidate.spaceText || '') + '</p></details>' : '') + '<div class="pages-price-context"><p>' + esc(root.BagelEngine ? root.BagelEngine.priceText(m) : '本次价格与具体套餐待核。') + '</p><p class="pages-small">购买前拿到本次整套报价，再核耗材与配件的额外费用。</p></div><div class="pages-model-actions"><button type="button" class="pages-main-button" data-favorite="' + esc(id) + '" aria-pressed="' + selected + '">' + (selected ? '已留作心仪比较' : '留作心仪比较') + '</button><p class="pages-small">只记录偏好，不改你的五个选择。</p></div>' + specs(m) + knownSources(m) + '<button type="button" class="pages-back-link" data-mode="all">回到全系能力图</button></article>';
  }

  root.BagelPages = { catalog: catalog, model: model };
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this));
