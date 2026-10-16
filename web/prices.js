/* Shared dated price presentation. Never treats a reference as a personal quote. */
(function (root) {
  'use strict';
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function panel(className) {
    var data = root.BagelData;
    var recent = (data.priceSnapshots || []).map(function (snapshot) {
      var model = data.models.filter(function (item) { return item.id === snapshot.model_id; })[0];
      return '<li><strong>' + esc(model ? model.name : snapshot.model_id) + '</strong><span>' + esc(snapshot.price_label) + '</span></li>';
    }).join('');
    var historical = data.models.map(function (model) {
      return '<li><strong>' + esc(model.name) + '</strong><span>' + esc(model.historicalPrice ? model.historicalPrice.price_label : '原记录未包含') + '</span></li>';
    }).join('');
    return '<details class="' + esc(className) + '"><summary>近期与618参考价</summary><p class="hint">2026-10-16 用户反馈，未独立核价。单机和 AMS 套装分开看，均不代表完整入坑费用。</p><ul class="history-list">' + recent + '</ul><p class="hint">渠道、优惠券、补贴资格、库存和套餐箱单尚未确认。双十一价格会变化，购买前请核对自己的订单条件。</p><details><summary>展开618历史多色套装记录</summary><ul class="history-list">' + historical + '</ul><p class="hint">作者的历史约价，原图未印精确日期。不要把这些套装价当作本次单机价。</p></details></details>';
  }
  root.BagelPriceUI = {panel: panel};
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this));
