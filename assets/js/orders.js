/* Buyurtmalarim */
(function (w, d) {
  'use strict';
  var EZ = w.EZ, S = EZ.S(), Sh = w.Shop, t = Sh.t, $ = Sh.$;
  Sh.add({
    title: ['Buyurtmalarim', 'Мои заказы'], titleP: ['Barcha xaridlaringiz, holatlar va cheklar tarixi', 'История покупок, статусы и чеки'],
    loy: ['Sodiqlik dasturi', 'Программа лояльности'], done: ['ta yakunlangan buyurtma', 'завершённых заказов'], lvlNow: ['Joriy daraja', 'Текущий уровень'],
    toNext: ['darajasiga yana', 'до уровня ещё'], toNext2: ['ta buyurtma', 'заказов'], top: ['Siz eng yuqori darajadasiz', 'У вас максимальный уровень'],
    perks: ['Darajangiz uchun promokod va aksiyalar', 'Промокоды и акции для вашего уровня'], noPerks: ["Silver darajasiga yetganingizda shaxsiy promokodlar shu yerda paydo bo'ladi.", 'Персональные промокоды появятся при достижении уровня Silver.'],
    copy: ['Nusxa olish', 'Копировать'], copied: ['Promokod nusxalandi', 'Промокод скопирован'], until: ['gacha', 'до'], min: ['min', 'от'], always: ['Muddatsiz', 'Бессрочно'],
    searchP: ['Buyurtma raqami, masalan 1025', 'Номер заказа, например 1025'],
    dAll: ['Barcha vaqt', 'За всё время'], dToday: ['Bugun', 'Сегодня'], d7: ['Oxirgi 7 kun', 'Последние 7 дней'], d30: ['Oxirgi 30 kun', 'Последние 30 дней'], d90: ['Oxirgi 3 oy', 'Последние 3 месяца'],
    tAll: ['Barchasi', 'Все'], tAct: ['Faol', 'Активные'],
    order: ['Buyurtma', 'Заказ'], items: ['ta mahsulot', 'товаров'], pay: ["To'lov", 'Оплата'],
    det: ['Tafsilotlar', 'Подробнее'], again: ['Qayta buyurtma berish', 'Повторить заказ'], track: ['Kuzatish', 'Отследить'], cancel: ['Bekor qilish', 'Отменить'],
    againOk: ["Mahsulotlar savatga qo'shildi", 'Товары добавлены в корзину'], cancelQ: ['Buyurtmani bekor qilasizmi?', 'Отменить заказ?'], cancelOk: ['Buyurtma bekor qilindi', 'Заказ отменён'], yes: ['Ha, bekor qilish', 'Да, отменить'], no: ["Yo'q", 'Нет'],
    emptyH: ['Buyurtmalar topilmadi', 'Заказы не найдены'], emptyP: ["Bu filtr bo'yicha buyurtma yo'q. Filtrni o'zgartiring yoki yangi xarid qiling.", 'По этому фильтру заказов нет. Измените фильтр или сделайте покупку.'], start: ['Xaridni boshlash', 'Начать покупки'],
    subt: ['Mahsulotlar summasi', 'Сумма товаров'], disc: ['Chegirma', 'Скидка'], deliv: ['Yetkazib berish', 'Доставка'], total: ['Jami', 'Итого'], free: ['Bepul', 'Бесплатно'], addr: ['Manzil', 'Адрес'], reason: ['Sabab', 'Причина'],
    prev: ['Oldingi', 'Назад'], next: ['Keyingi', 'Далее'], shown: ["ko'rsatilmoqda", 'показано'], of: ['dan', 'из'],
    s0d: ['Tizim tasdiqladi', 'Подтверждён'], s1d: ['Mahsulotlar saralanmoqda', 'Товары собираются'], s2d: ['Kuryer yo\'lda', 'Курьер в пути'], s3d: ['Eshik oldida topshirildi', 'Передан у двери'], courier: ['Kuryer', 'Курьер']
  });
  var TABS = [['all', 'tAll'], ['act', 'tAct'], ['prep', 'st1'], ['road', 'st2'], ['done', 'st3'], ['cancel', 'st4']];
  var F = { tab: 'all', q: '', date: 'all', page: 1, per: 5 };
  (function () { var id = new URLSearchParams(location.search).get('id'); if (id) F.q = id; })();
  var LVL_IC = { gold: 'workspace_premium', bronze: 'military_tech', silver: 'stars', oddiy: 'person' };

  function mine() { return S.orders.filter(function (o) { return o.mine; }).sort(function (a, b) { return b.ts - a.ts; }); }
  function inTab(o, k) { return k === 'all' || (k === 'act' && o.st < 3) || (k === 'prep' && o.st <= 1) || (k === 'road' && o.st === 2) || (k === 'done' && o.st === 3) || (k === 'cancel' && o.st === 4); }
  function inDate(o) { if (F.date === 'all') return true; var t0 = EZ.dayStart(Date.now()), n = { today: 0, d7: 6, d30: 29, d90: 89 }[F.date]; return o.ts >= t0 - n * EZ.D; }
  function list() { return mine().filter(function (o) { return inTab(o, F.tab) && inDate(o) && (!F.q || String(o.id).indexOf(F.q.replace(/\D/g, '')) >= 0); }); }
  function stPill(st) { return '<span class="pill ' + ['p-red', 'p-amb', 'p-blue', 'p-ok', 'p-gray'][st] + '"><span class="ms' + (st === 3 ? ' f' : '') + '">' + ['fiber_new', 'inventory_2', 'local_shipping', 'check_circle', 'block'][st] + '</span>' + Sh.stName(st) + '</span>'; }

  function loyalty() {
    var c = EZ.myCount(), lv = EZ.myLevel(), nx = EZ.nextLevel(c), asc = EZ.levelsAsc(), max = S.lv[asc[2]].min, today = EZ.isoDay(Date.now());
    var track = '<div class="ltrack"><div class="lt-bar"><i style="width:' + Math.min(100, c / max * 100) + '%"></i></div>' + asc.map(function (k) {
      var pos = S.lv[k].min / max * 100, reached = c >= S.lv[k].min;
      return '<span class="lt-mk' + (reached ? ' on' : '') + '" style="left:' + pos + '%;--c:' + S.lv[k].color + '"><i></i><b>' + EZ.LEVEL_NAMES[k] + '</b><small class="num">' + S.lv[k].min + '+</small></span>';
    }).join('') + '</div>';
    var codes = S.promos.filter(function (p) { return p.on && p.l.indexOf(lv) >= 0 && (!p.e || p.e >= today) && (!p.s || p.s <= today); });
    var aks = EZ.aksiyalarFor(lv);
    var perks = codes.map(function (p) {
      return '<div class="perk"><div class="perk-t"><b class="code num">' + p.c + '</b><span>' + EZ.promoLabel(p) + ' · ' + t('min') + ' ' + Sh.money(p.m) + '</span><small>' + (p.e ? p.e.split('-').reverse().slice(0, 2).join('.') + ' ' + t('until') : t('always')) + '</small></div><button class="icon-btn" data-copy="' + p.c + '" aria-label="' + t('copy') + '"><span class="ms">content_copy</span></button></div>';
    }).join('') + aks.map(function (a) {
      return '<a class="perk aks" href="' + Sh.PG.home + (a.cat ? '?cat=' + a.cat + '#products' : '#catalog') + '"><img src="' + a.img + '" alt=""><div class="perk-t"><b>' + EZ.esc(a.title) + '</b><small>' + a.e.split('-').reverse().slice(0, 2).join('.') + ' ' + t('until') + '</small></div><span class="ms">arrow_forward</span></a>';
    }).join('');
    return '<section class="loy" id="loyalty"><div class="loy-l">' +
      '<div class="loy-top"><span class="loy-badge" style="--c:' + EZ.levelColor(lv) + '"><span class="ms f">' + LVL_IC[lv] + '</span></span><div><small>' + t('loy') + ' · ' + t('lvlNow') + '</small><h2>' + Sh.lvName(lv) + '</h2><p class="num"><b>' + c + '</b> ' + t('done') + '</p></div></div>' +
      track + '<p class="loy-next">' + (nx ? '<b>' + EZ.LEVEL_NAMES[nx] + '</b> ' + t('toNext') + ' <b class="num">' + (S.lv[nx].min - c) + '</b> ' + t('toNext2') : '<span class="ms f">workspace_premium</span>' + t('top')) + '</p></div>' +
      '<div class="loy-r"><h3>' + t('perks') + '</h3>' + (perks ? '<div class="perks">' + perks + '</div>' : '<p class="loy-empty">' + t('noPerks') + '</p>') + '</div></section>';
  }

  function card(o) {
    var thumbs = o.it.slice(0, 4).map(function (x) { var p = EZ.product(x.id) || { n: x.n, c: '' }; return '<span class="oc-th">' + Sh.thumb(p) + '</span>'; }).join('') + (o.it.length > 4 ? '<span class="oc-th more num">+' + (o.it.length - 4) + '</span>' : '');
    var q = o.it.reduce(function (s, x) { return s + x.q; }, 0);
    return '<article class="card oc' + (o.st < 3 ? ' active' : '') + '" data-id="' + o.id + '">' +
      '<div class="oc-h"><div class="oc-id"><b class="num">#' + o.id + '</b>' + stPill(o.st) + '</div><time class="mut-s num">' + EZ.dateLabel(o.ts, S.lang) + '</time></div>' +
      '<div class="oc-m"><div class="oc-ths">' + thumbs + '</div><div class="oc-info"><span class="num">' + o.it.length + ' ' + t('items') + ' · ' + q + ' ' + t('pcs') + '</span><span class="oc-pay"><span class="ms">' + (o.pay === 'Karta' ? 'credit_card' : 'payments') + '</span>' + (o.pay === 'Karta' ? t('cardShort') : t('cashShort')) + '</span></div><b class="oc-total num">' + Sh.money(o.t) + '</b></div>' +
      '<div class="oc-a"><button class="btn btn-ghost btn-sm" data-a="det"><span class="ms">visibility</span>' + t('det') + '</button>' +
      (o.st < 3 ? '<button class="btn btn-soft btn-sm amb" data-a="trk"><span class="ms">my_location</span>' + t('track') + '</button>' : '') +
      (o.st < 1 ? '<button class="btn btn-sm txt" data-a="can">' + t('cancel') + '</button>' : '') +
      '<button class="btn btn-red btn-sm push" data-a="re"><span class="ms">replay</span>' + t('again') + '</button></div></article>';
  }

  function render() {
    var all = mine(), L = list(), pages = Math.max(1, Math.ceil(L.length / F.per));
    if (F.page > pages) F.page = pages;
    var slice = L.slice((F.page - 1) * F.per, F.page * F.per);
    var tabs = TABS.map(function (x) { var n = all.filter(function (o) { return inTab(o, x[0]) && inDate(o); }).length; return '<button role="tab" aria-selected="' + (F.tab === x[0]) + '" class="tab' + (F.tab === x[0] ? ' on' : '') + '" data-tab="' + x[0] + '">' + t(x[1]) + '<span class="num">' + n + '</span></button>'; }).join('');
    var pager = '';
    if (pages > 1) {
      pager = '<nav class="pager" aria-label="Pagination"><span class="mut-s num">' + ((F.page - 1) * F.per + 1) + '–' + Math.min(F.page * F.per, L.length) + ' / ' + L.length + '</span><div><button class="pg" data-pg="' + (F.page - 1) + '"' + (F.page === 1 ? ' disabled' : '') + ' aria-label="' + t('prev') + '"><span class="ms">chevron_left</span></button>';
      for (var i = 1; i <= pages; i++) pager += '<button class="pg num' + (i === F.page ? ' on' : '') + '" data-pg="' + i + '">' + i + '</button>';
      pager += '<button class="pg" data-pg="' + (F.page + 1) + '"' + (F.page === pages ? ' disabled' : '') + ' aria-label="' + t('next') + '"><span class="ms">chevron_right</span></button></div></nav>';
    }
    $('#app').innerHTML = '<div class="wrap"><nav class="crumbs"><a href="' + Sh.PG.home + '">' + t('home') + '</a><span class="ms">chevron_right</span><b>' + t('title') + '</b></nav>' + loyalty() +
      '<section class="sec-sm"><div class="sec-head"><div><h1 class="h2">' + t('title') + '</h1><p class="lead">' + t('titleP') + '</p></div>' +
      '<div class="filters"><div class="input"><span class="ms">search</span><input id="oq" type="search" inputmode="numeric" placeholder="' + t('searchP') + '" value="' + EZ.esc(F.q) + '"></div>' +
      '<div class="input sel"><span class="ms">calendar_month</span><select id="od">' + [['all', 'dAll'], ['today', 'dToday'], ['d7', 'd7'], ['d30', 'd30'], ['d90', 'd90']].map(function (x) { return '<option value="' + x[0] + '"' + (F.date === x[0] ? ' selected' : '') + '>' + t(x[1]) + '</option>'; }).join('') + '</select><span class="ms chev">expand_more</span></div></div></div>' +
      '<div class="tabs" role="tablist">' + tabs + '</div>' +
      (slice.length ? '<div class="olist">' + slice.map(card).join('') + '</div>' + pager : '<div class="card empty">' + Sh.emptyArt() + '<h3>' + t('emptyH') + '</h3><p>' + t('emptyP') + '</p><a class="btn btn-red" href="' + Sh.PG.home + '#catalog"><span class="ms">shopping_bag</span>' + t('start') + '</a></div>') +
      '</section></div>';
  }
  function rerenderList() { var a = d.activeElement && d.activeElement.id; render(); if (a === 'oq') { var i = $('#oq'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }

  function details(o) {
    Sh.modal(t('order') + ' <span class="num">#' + o.id + '</span>',
      '<div class="md-top">' + stPill(o.st) + '<span class="mut-s num">' + EZ.dateLabel(o.ts, S.lang) + '</span></div>' +
      '<ul class="lines compact">' + o.it.map(function (x) { var p = EZ.product(x.id) || { n: x.n }; return '<li class="line"><div class="line-img">' + Sh.thumb(p) + '</div><div class="line-t"><b>' + EZ.esc(x.n) + '</b><span class="mut-s num">' + x.q + ' ' + t('pcs') + ' × ' + Sh.money(x.p) + '</span></div><b class="line-sum num">' + Sh.money(x.p * x.q) + '</b></li>'; }).join('') + '</ul>' +
      '<dl class="rows"><div><dt>' + t('subt') + '</dt><dd class="num">' + Sh.money(o.sub) + '</dd></div>' + (o.ds ? '<div class="neg"><dt>' + t('disc') + (o.code ? ' (' + o.code + ')' : '') + '</dt><dd class="num">−' + Sh.money(o.ds) + '</dd></div>' : '') + '<div><dt>' + t('deliv') + '</dt><dd class="num">' + (o.dl ? Sh.money(o.dl) : t('free')) + '</dd></div><div class="tot"><dt>' + t('total') + '</dt><dd class="num">' + Sh.money(o.t) + '</dd></div></dl>' +
      '<dl class="kv"><div><dt><span class="ms">location_on</span>' + t('addr') + '</dt><dd>' + EZ.esc(o.ad) + '</dd></div><div><dt><span class="ms">account_balance_wallet</span>' + t('pay') + '</dt><dd>' + (o.pay === 'Karta' ? '<span class="pill p-ok">' + t('paidCard') + '</span>' : '<span class="pill p-amb">' + t('payCash') + '</span>') + '</dd></div>' +
      (o.reason ? '<div><dt><span class="ms">info</span>' + t('reason') + '</dt><dd>' + EZ.esc(o.reason) + '</dd></div>' : '') + '</dl>', { w: 600 });
  }
  function tracking(o) {
    var ic = ['task_alt', 'inventory_2', 'local_shipping', 'home_pin'];
    Sh.modal(t('track') + ' · <span class="num">#' + o.id + '</span>',
      '<ol class="tl">' + [0, 1, 2, 3].map(function (i) { var s = i < o.st ? 'done' : i === o.st ? 'now' : ''; return '<li class="' + s + '"><span class="tl-ic"><span class="ms' + (s ? ' f' : '') + '">' + ic[i] + '</span></span><div><b>' + Sh.stName(i) + '</b><small>' + t('s' + i + 'd') + '</small></div><time class="num">' + EZ.hm(o.ts + [0, 5, 20, 45][i] * 60e3) + '</time></li>'; }).join('') + '</ol>' +
      (o.st === 2 ? '<div class="person" style="margin-top:18px"><span class="avatar" style="background:var(--red)">SR</span><div><b>' + t('courier') + ': Sardor R.</b><small class="num">+998 90 987 65 43</small></div><a class="btn btn-ghost btn-sm" style="margin-left:auto" href="tel:+998909876543"><span class="ms">call</span></a></div>' : ''), { w: 520 });
  }
  function confirmCancel(o) {
    var m = Sh.modal(t('cancelQ'), '<p class="lead" style="margin:0 0 22px">' + t('order') + ' <b class="num">#' + o.id + '</b> · ' + Sh.money(o.t) + '</p><div class="actions"><button class="btn btn-red" id="cc-y">' + t('yes') + '</button><button class="btn btn-ghost" data-x>' + t('no') + '</button></div>', { w: 440 });
    $('#cc-y', m.el).onclick = function () { o.st = 4; o.reason = 'Mijoz bekor qildi'; EZ.save(); m.close(); render(); Sh.toast(t('cancelOk')); };
  }

  d.addEventListener('click', function (e) {
    var a;
    if ((a = e.target.closest('[data-tab]'))) { F.tab = a.getAttribute('data-tab'); F.page = 1; render(); return; }
    if ((a = e.target.closest('[data-pg]'))) { F.page = +a.getAttribute('data-pg'); render(); $('.tabs').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    if ((a = e.target.closest('[data-copy]'))) { var c = a.getAttribute('data-copy'); try { navigator.clipboard.writeText(c); } catch (er) { } S.promo = c; EZ.save(); Sh.toast(t('copied') + ': ' + c, 'content_copy'); return; }
    if ((a = e.target.closest('[data-a]'))) {
      var o = S.orders.filter(function (x) { return x.id === +a.closest('[data-id]').getAttribute('data-id'); })[0], k = a.getAttribute('data-a');
      if (k === 'det') details(o); else if (k === 'trk') tracking(o); else if (k === 'can') confirmCancel(o);
      else if (k === 're') { o.it.forEach(function (x) { if (EZ.product(x.id)) EZ.addToCart(x.id, x.q); }); Sh.toast(t('againOk')); setTimeout(function () { location.href = Sh.PG.cart; }, 500); }
    }
  });
  d.addEventListener('input', function (e) { if (e.target.id === 'oq') { F.q = e.target.value; F.page = 1; rerenderList(); } });
  d.addEventListener('change', function (e) { if (e.target.id === 'od') { F.date = e.target.value; F.page = 1; render(); } });
  Sh.boot(render);
  w.addEventListener('load', function () { if (location.hash === '#loyalty') { var el = d.getElementById('loyalty'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } });
})(window, document);
