/* Buyurtma qabul qilindi */
(function (w, d) {
  'use strict';
  var EZ = w.EZ, S = EZ.S(), Sh = w.Shop, t = Sh.t, $ = Sh.$;
  Sh.add({
    crumbO: ['Buyurtmalarim', 'Мои заказы'], okH: ['Buyurtmangiz qabul qilindi', 'Ваш заказ принят'],
    okP: ["Operatorimiz tez orada buyurtmani tasdiqlaydi va kuryerga topshiradi. Holat o'zgarishi haqida Telegram botda xabar olasiz.", 'Оператор скоро подтвердит заказ и передаст курьеру. Уведомления о статусе придут в Telegram-бот.'],
    order: ['Buyurtma', 'Заказ'], eta: ['Taxminiy yetib borish', 'Ожидаемое время'], live: ['Buyurtma holati', 'Статус заказа'],
    s0d: ['Tizim tasdiqladi', 'Подтверждён системой'], s1d: ['Mahsulotlar saralanmoqda', 'Товары собираются'], s2d: ["Kuryer yo'lga chiqadi", 'Курьер выезжает'], s3d: ['Eshik oldida topshiriladi', 'Передача у двери'],
    dInfo: ["Yetkazib berish ma'lumotlari", 'Данные доставки'], addr: ['Manzil', 'Адрес'], note: ['Kuryer uchun izoh', 'Комментарий курьеру'], pstat: ["To'lov holati", 'Статус оплаты'],
    items: ['Buyurtma tarkibi', 'Состав заказа'], subt: ['Mahsulotlar summasi', 'Сумма товаров'], disc: ['Promokod chegirmasi', 'Скидка'], deliv: ['Yetkazib berish', 'Доставка'], total: ["Jami to'lov", 'Итого'], free: ['Bepul', 'Бесплатно'],
    back: ['Bosh sahifaga qaytish', 'На главную'], receipt: ['Chekni yuklab olish', 'Скачать чек'], tg: ['Telegram orqali kuzatish', 'Отслеживать в Telegram'],
    others: ['Mening boshqa buyurtmalarim', 'Мои другие заказы'], seeAll: ["Barchasini ko'rish", 'Смотреть все'], details: ['Tafsilotlar', 'Подробнее'], ta: ['ta mahsulot', 'товара(ов)'],
    none: ["Hali buyurtma yo'q", 'Заказов пока нет'], noneP: ["Birinchi buyurtmangizni bering — u shu yerda ko'rinadi.", 'Оформите первый заказ — он появится здесь.']
  });
  var STEP_IC = ['task_alt', 'inventory_2', 'local_shipping', 'home_pin'];

  function timeline(o) {
    var base = o.ts, times = [base, base + 5 * 60e3, base + 20 * 60e3, base + 45 * 60e3];
    return '<ol class="tl">' + [0, 1, 2, 3].map(function (i) {
      var state = o.st === 4 ? (i === 0 ? 'done' : '') : i < o.st || (i === 3 && o.st === 3) ? 'done' : i === o.st ? 'now' : '';
      return '<li class="' + state + '"><span class="tl-ic"><span class="ms' + (state ? ' f' : '') + '">' + STEP_IC[i] + '</span></span><div><b>' + Sh.stName(i) + '</b><small>' + t('s' + i + 'd') + '</small></div><time class="num">' + EZ.hm(times[i]) + '</time></li>';
    }).join('') + '</ol>';
  }
  function payPill(o) { return o.pay === 'Karta' ? '<span class="pill p-ok"><span class="ms f">verified</span>' + t('paidCard') + '</span>' : '<span class="pill p-amb"><span class="ms">payments</span>' + t('payCash') + '</span>'; }

  function render() {
    var mine = S.orders.filter(function (x) { return x.mine; }), o = S.orders.filter(function (x) { return x.id === S.last; })[0] || mine[0];
    var app = $('#app');
    if (!o) { app.innerHTML = '<div class="wrap"><div class="card empty">' + Sh.emptyArt() + '<h3>' + t('none') + '</h3><p>' + t('noneP') + '</p><a class="btn btn-red" href="' + Sh.PG.home + '#catalog">' + Sh.t('catalog') + '</a></div></div>'; return; }
    var lv = EZ.myLevel(), others = mine.filter(function (x) { return x.id !== o.id; }).slice(0, 3);
    app.innerHTML = '<div class="wrap">' +
      '<nav class="crumbs"><a href="' + Sh.PG.home + '">' + t('home') + '</a><span class="ms">chevron_right</span><a href="' + Sh.PG.orders + '">' + t('crumbO') + '</a><span class="ms">chevron_right</span><b class="num">#' + o.id + '</b></nav>' +
      '<section class="ok-hero"><div class="ok-mark"><span class="ms f">check</span></div><div class="ok-t"><h1 class="h1">' + t('okH') + '</h1>' +
      '<p class="ok-meta"><span class="num">' + t('order') + ' <b>#' + o.id + '</b></span><span class="sep"></span><span>' + EZ.dateLabel(o.ts, S.lang) + '</span><span class="sep"></span>' + payPill(o) + '</p><p class="lead">' + t('okP') + '</p></div>' +
      '<div class="ok-eta"><small>' + t('eta') + '</small><b class="num">' + (o.slot ? o.slot : EZ.hm(o.ts + 45 * 60e3)) + '</b></div></section>' +
      '<div class="done-grid"><div class="stack">' +
      '<section class="card block"><div class="block-h"><h2 class="h3">' + t('live') + '</h2><span class="pill ' + (o.st === 3 ? 'p-ok' : o.st === 4 ? 'p-gray' : 'p-amb') + '">' + Sh.stName(o.st) + '</span></div>' + timeline(o) + '</section>' +
      '<section class="card block"><div class="block-h"><h2 class="h3">' + t('dInfo') + '</h2>' + Sh.lvBadge(lv) + '</div>' +
      '<div class="person"><span class="avatar">' + o.nm.split(' ').map(function (s) { return s[0]; }).join('').slice(0, 2) + '</span><div><b>' + EZ.esc(o.nm) + '</b><small class="num">' + EZ.esc(o.ph) + '</small></div></div>' +
      '<dl class="kv"><div><dt><span class="ms">location_on</span>' + t('addr') + '</dt><dd>' + EZ.esc(o.ad) + '</dd></div>' + (o.note ? '<div><dt><span class="ms">chat</span>' + t('note') + '</dt><dd>' + EZ.esc(o.note) + '</dd></div>' : '') +
      '<div><dt><span class="ms">account_balance_wallet</span>' + t('pstat') + '</dt><dd>' + payPill(o) + '</dd></div></dl></section></div>' +
      '<section class="card block receipt" id="receipt"><div class="block-h"><h2 class="h3">' + t('items') + ' <span class="mut-s num">(' + o.it.length + ')</span></h2><span class="mut-s num">#' + o.id + '</span></div>' +
      '<ul class="lines compact">' + o.it.map(function (x) { var p = EZ.product(x.id) || { n: x.n }; return '<li class="line"><div class="line-img">' + Sh.thumb(p) + '</div><div class="line-t"><b>' + EZ.esc(x.n) + '</b><span class="mut-s num">' + x.q + ' ' + t('pcs') + ' × ' + Sh.money(x.p) + '</span></div><b class="line-sum num">' + Sh.money(x.p * x.q) + '</b></li>'; }).join('') + '</ul>' +
      '<dl class="rows"><div><dt>' + t('subt') + '</dt><dd class="num">' + Sh.money(o.sub) + '</dd></div>' + (o.ds ? '<div class="neg"><dt>' + t('disc') + (o.code ? ' (' + o.code + ')' : '') + '</dt><dd class="num">−' + Sh.money(o.ds) + '</dd></div>' : '') +
      '<div><dt>' + t('deliv') + '</dt><dd class="num">' + (o.dl ? Sh.money(o.dl) : t('free')) + '</dd></div><div class="tot"><dt>' + t('total') + '</dt><dd class="num">' + Sh.money(o.t) + '</dd></div></dl>' +
      '<div class="actions"><a class="btn btn-ink" href="' + Sh.PG.home + '"><span class="ms">storefront</span>' + t('back') + '</a><button class="btn btn-ghost" data-print><span class="ms">receipt_long</span>' + t('receipt') + '</button><a class="btn btn-ghost" href="https://t.me/ezozmarket_bot" target="_blank" rel="noopener"><span class="ms">send</span>' + t('tg') + '</a></div></section></div>' +
      '<section class="sec-sm"><div class="sec-head"><h2 class="h2">' + t('others') + '</h2><a class="link" href="' + Sh.PG.orders + '">' + t('seeAll') + '<span class="ms">arrow_forward</span></a></div>' +
      (others.length ? '<div class="mini-orders">' + others.map(function (x) {
        return '<a class="card mini" href="' + Sh.PG.orders + '?id=' + x.id + '"><span class="mini-ic"><span class="ms">shopping_bag</span></span><div><b class="num">' + t('order') + ' #' + x.id + '</b><small class="num">' + EZ.dateLabel(x.ts, S.lang) + ' · ' + x.it.length + ' ' + t('ta') + '</small></div><div class="mini-r"><b class="num">' + Sh.money(x.t) + '</b><span class="pill ' + (x.st === 3 ? 'p-ok' : x.st === 4 ? 'p-gray' : 'p-amb') + '">' + Sh.stName(x.st) + '</span></div></a>';
      }).join('') + '</div>' : '') + '</section></div>';
  }
  d.addEventListener('click', function (e) { if (e.target.closest('[data-print]')) w.print(); });
  Sh.boot(render);
})(window, document);
