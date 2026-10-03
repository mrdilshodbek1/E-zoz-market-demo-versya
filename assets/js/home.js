/* Bosh sahifa */
(function (w, d) {
  'use strict';
  var EZ = w.EZ, S = EZ.S(), Sh = w.Shop, t = Sh.t, $ = Sh.$, $$ = Sh.$$;
  Sh.add({
    openNow: ['Hozir ochiq', 'Сейчас открыто'],
    heroH: ['Kerakli mahsulotlar — bir joyda', 'Всё нужное — в одном месте'],
    heroP: ["Meva-sabzavotlar, sut va sifatli go'sht mahsulotlarini uyingizga 45 daqiqada yetkazib beramiz.", 'Доставим фрукты, овощи, молочные продукты и качественное мясо к вашей двери за 45 минут.'],
    start: ['Xaridni boshlash', 'Начать покупки'],
    s1: ['mahsulotlar', 'товаров'], s2: ["o'rtacha yetkazish", 'средняя доставка'], s3: ['mamnun mijozlar', 'довольных клиентов'], daq: ['daq', 'мин'],
    view: ["Ko'rish", 'Смотреть'], until: ['gacha', 'до'], forLevel: ['darajasi uchun', 'для уровня'],
    freeT: ["150 000 so'mdan bepul yetkazish", 'Бесплатная доставка от 150 000 сум'], freeS: ["Toshkent bo'ylab, har kuni 08:00 – 23:00", 'По Ташкенту, ежедневно 08:00 – 23:00'],
    catH: ["Katalog bo'limlari", 'Разделы каталога'], catP: ["Kerakli bo'limni tanlang va qulay xarid qiling", 'Выберите нужный раздел'], kinds: ['tur', 'видов'],
    popH: ['Ommabop mahsulotlar', 'Популярные товары'], popP: ["Xaridorlarimiz eng ko'p tanlayotgan kundalik tovarlar", 'Товары, которые выбирают чаще всего'],
    all: ['Barchasi', 'Все'], more: ["Yana ko'rsatish", 'Показать ещё'], favs: ['Saralanganlar', 'Избранное'],
    nothing: ["Bu bo'limda hozircha mahsulot yo'q", 'В этом разделе пока нет товаров'], nothingP: ["Tez orada yangi mahsulotlar qo'shiladi. Boshqa bo'limni tanlang yoki qidiruvdan foydalaning.", 'Скоро здесь появятся товары. Выберите другой раздел или воспользуйтесь поиском.'],
    showAll: ["Barcha mahsulotlar", 'Все товары'], results: ['qidiruv natijalari', 'результаты поиска'],
    tgH: ['Telegram bot orqali 1 daqiqada buyurtma bering', 'Заказывайте через Telegram-бот за 1 минуту'],
    tgP: ["Ro'yxatdan o'tmasdan xarid qiling, buyurtma holatini botda kuzating va har bosqichda xabar oling.", 'Покупайте без регистрации, отслеживайте статус заказа и получайте уведомления в боте.'],
    tg1: ['Botni oching va /start bosing', 'Откройте бот и нажмите /start'], tg2: ['Telefon raqamingizni yuboring', 'Отправьте номер телефона'], tg3: ['Buyurtmani 45 daqiqada qabul qiling', 'Получите заказ за 45 минут'],
    tgB: ['Botni ochish', 'Открыть бот'], tgN: ["Qo'shimcha ilova o'rnatish shart emas", 'Не нужно устанавливать приложение'],
    b1: ['Tezkor kuryer', 'Быстрый курьер'], b1p: ["Toshkent bo'ylab 45 daqiqada eshigingiz oldida", 'По Ташкенту — за 45 минут'],
    b2: ['Saralangan sifat', 'Отборное качество'], b2p: ['Har kuni tekshiriladigan yangi va halol mahsulotlar', 'Свежие халяль-продукты с ежедневной проверкой'],
    b3: ["Xavfsiz to'lov", 'Безопасная оплата'], b3p: ["Naqd yoki karta orqali to'lov", 'Наличными или картой'],
    b4: ["Qo'llab-quvvatlash 24/7", 'Поддержка 24/7'], b4p: ['Operatorlarimiz doimo savollaringizga tayyor', 'Операторы всегда на связи'],
    bot1: ['Assalomu alaykum! Yetkazish manzilini yuboring', 'Здравствуйте! Отправьте адрес доставки'], bot2: ['Toshkent, Yunusobod 4-mavze', 'Ташкент, Юнусабад 4'], bot3: ["Buyurtma #1026 qabul qilindi. Kuryer yo'lda!", 'Заказ #1026 принят. Курьер в пути!']
  });

  var F = { cat: '', q: '', fav: false, limit: 8 };
  (function () { var u = new URLSearchParams(location.search); F.cat = u.get('cat') || ''; F.q = u.get('q') || ''; F.fav = u.get('fav') === '1'; })();
  var LVL_IC = { gold: 'workspace_premium', bronze: 'military_tech', silver: 'stars' };

  function hero() {
    var lv = EZ.myLevel(), ak = EZ.aksiyalarFor(lv).slice(0, 2), side = '';
    ak.forEach(function (a, i) {
      side += '<a class="promo-card" href="?cat=' + (a.cat || '') + '#products" data-cat="' + (a.cat || '') + '" style="--bg:url(\'' + a.img + '\')">' +
        '<span class="pc-shade"></span><span class="promo-top">' + (a.disc ? '<span class="pill p-red num">−' + a.disc + '%</span>' : '<span class="pill p-ink"><span class="ms">local_shipping</span>0 so\'m</span>') +
        '<span class="lvl" style="background:' + EZ.levelColor(lv) + '"><span class="ms f">' + (LVL_IC[lv] || 'person') + '</span>' + Sh.lvName(lv) + '</span></span>' +
        '<span class="promo-b"><b>' + EZ.esc(a.title) + '</b><small>' + EZ.esc(a.sub) + ' · ' + a.e.slice(8) + '-' + EZ.MON[+a.e.slice(5, 7) - 1] + ' ' + t('until') + '</small><span class="promo-go">' + t('view') + '<span class="ms">arrow_forward</span></span></span></a>';
    });
    if (ak.length < 2) side += '<div class="promo-card plain"><span class="pf-ic"><span class="ms">local_shipping</span></span><span class="promo-b"><b>' + t('freeT') + '</b><small>' + t('freeS') + '</small></span></div>';
    if (ak.length < 1) side += '<div class="promo-card plain red"><span class="pf-ic"><span class="ms">verified</span></span><span class="promo-b"><b>100% Halol</b><small>' + t('b2p') + '</small></span></div>';
    return '<section class="hero-grid">' +
      '<div class="hero"><img class="hero-img" src="' + EZ.IMG.basket + '" alt="" fetchpriority="high"><div class="hero-in">' +
      '<span class="open"><i></i>' + t('openNow') + ' · ' + S.settings.hours + '</span>' +
      '<h1>' + t('heroH') + '</h1><p>' + t('heroP') + '</p>' +
      '<a class="btn btn-red btn-lg" href="#catalog" id="hero-start">' + t('start') + '<span class="ms">arrow_downward</span></a>' +
      '<dl class="stats"><div><dt class="num">12 000+</dt><dd>' + t('s1') + '</dd></div><div><dt class="num">45 ' + t('daq') + '</dt><dd>' + t('s2') + '</dd></div><div><dt class="num">99.4%</dt><dd>' + t('s3') + '</dd></div></dl>' +
      '</div></div><div class="hero-side">' + side + '</div></section>';
  }

  function counts() { var m = {}; EZ.PRODUCTS.forEach(function (p) { m[p.c] = (m[p.c] || 0) + 1; }); return m; }
  function catalog() {
    return '<section class="sec" id="catalog"><div class="sec-head"><div><h2 class="h2">' + t('catH') + '</h2><p class="lead">' + t('catP') + '</p></div></div>' +
      '<div class="tiles">' + EZ.CATS.map(function (c) {
        return '<a class="tile" href="?cat=' + c.k + '#products" data-cat="' + c.k + '"><span class="tile-ic"><span class="ms">' + c.ic + '</span></span><span class="tile-t"><b>' + Sh.catName(c) + '</b><small class="num">' + c.n + ' ' + t('kinds') + '</small></span><span class="ms tile-go">arrow_outward</span></a>';
      }).join('') + '</div></section>';
  }

  function card(p) {
    var c = EZ.cat(p.c), price = EZ.price(p), stock = EZ.inStock(p), fav = S.fav.indexOf(p.id) >= 0, disc = p.op ? Math.round((1 - price / p.op) * 100) : 0;
    return '<article class="pcard" data-id="' + p.id + '">' +
      '<div class="pc-media">' + Sh.thumb(p) +
      '<div class="pc-tags">' + (disc ? '<span class="pill p-red num">−' + disc + '%</span>' : '') + (p.tag ? '<span class="pill pc-tag">' + EZ.esc(p.tag) + '</span>' : '') + '</div>' +
      '<button class="pc-fav' + (fav ? ' on' : '') + '" data-fav aria-pressed="' + fav + '" aria-label="' + t('fav') + '"><span class="ms' + (fav ? ' f' : '') + '">favorite</span></button></div>' +
      '<div class="pc-body"><span class="pc-cat">' + Sh.catName(c) + '</span><h3>' + EZ.esc(p.n) + '</h3><p>' + EZ.esc(S.lang === 'ru' ? p.dr : p.d) + '</p>' +
      '<div class="pc-price"><b class="num">' + EZ.fmtN(price) + '</b><span>' + t('sum') + '</span>' + (p.op ? '<s class="num">' + EZ.fmtN(p.op) + '</s>' : '') + '</div>' +
      '<div class="pc-stock ' + (stock ? '' : 'no') + '"><i></i>' + (stock ? t('inStock') : t('outStock')) + '</div>' +
      '<div class="pc-act"><div class="qty" role="group"><button data-q="-1" aria-label="−"><span class="ms">remove</span></button><span class="num" data-qv>1</span><button data-q="1" aria-label="+"><span class="ms">add</span></button></div>' +
      '<button class="btn btn-red btn-sm pc-add" data-add' + (stock ? '' : ' disabled') + '><span class="ms">add_shopping_cart</span>' + t('toCart') + '</button></div></div></article>';
  }

  function filtered() {
    var q = F.q.toLowerCase();
    return EZ.PRODUCTS.filter(function (p) {
      if (F.fav && S.fav.indexOf(p.id) < 0) return false;
      if (F.cat && p.c !== F.cat) return false;
      if (q) { var c = EZ.cat(p.c); return (p.n + ' ' + p.d + ' ' + p.dr + ' ' + c.uz + ' ' + c.ru).toLowerCase().indexOf(q) >= 0; }
      return true;
    }).sort(function (a, b) { return (b.img ? 1 : 0) - (a.img ? 1 : 0); });
  }
  function products() {
    var cn = counts(), keys = EZ.CATS.filter(function (c) { return cn[c.k]; });
    var chips = '<button class="chip' + (!F.cat && !F.fav ? ' on' : '') + '" data-chip="">' + t('all') + ' <span class="c num">' + EZ.PRODUCTS.length + '</span></button>' +
      keys.map(function (c) { return '<button class="chip' + (F.cat === c.k ? ' on' : '') + '" data-chip="' + c.k + '">' + Sh.catName(c) + ' <span class="c num">' + cn[c.k] + '</span></button>'; }).join('') +
      '<button class="chip' + (F.fav ? ' on' : '') + '" data-chip="__fav"><span class="ms" style="font-size:17px">favorite</span>' + t('favs') + '</button>';
    var list = filtered(), shown = list.slice(0, F.limit), title = F.q ? '«' + EZ.esc(F.q) + '» — ' + t('results') : t('popH');
    var grid = shown.length ? '<div class="pgrid">' + shown.map(card).join('') + '</div>' : '<div class="card empty">' + Sh.emptyArt() + '<h3>' + t('nothing') + '</h3><p>' + t('nothingP') + '</p><button class="btn btn-ink" data-chip="">' + t('showAll') + '</button></div>';
    return '<section class="sec" id="products"><div class="sec-head"><div><h2 class="h2">' + title + '</h2><p class="lead">' + t('popP') + '</p></div></div>' +
      '<div class="chips chips-scroll" style="margin-bottom:24px">' + chips + '</div>' + grid +
      (list.length > F.limit ? '<div class="more"><button class="btn btn-ghost" data-more>' + t('more') + ' <span class="num">(' + (list.length - F.limit) + ')</span><span class="ms">expand_more</span></button></div>' : '') + '</section>';
  }

  function telegram() {
    return '<section class="sec tg"><div class="tg-in"><div class="tg-txt">' +
      '<span class="tg-badge"><span class="ms f">send</span>@ezozmarket_bot</span><h2 class="h2">' + t('tgH') + '</h2><p>' + t('tgP') + '</p>' +
      '<ol class="tg-steps"><li><span>1</span>' + t('tg1') + '</li><li><span>2</span>' + t('tg2') + '</li><li><span>3</span>' + t('tg3') + '</li></ol>' +
      '<div class="tg-cta"><a class="btn btn-red" href="https://t.me/Ezoz_supermarket_uz_bot" target="_blank" rel="noopener"><span class="ms">send</span>' + t('tgB') + '</a><small>' + t('tgN') + '</small></div></div>' +
      '<div class="phone" aria-hidden="true"><div class="ph-top"><span class="avatar" style="background:var(--red)">E</span><div><b>EZOZ Market Bot</b><small>bot · online</small></div></div>' +
      '<div class="ph-chat"><p class="in">' + t('bot1') + '</p><p class="out"><span class="ms">location_on</span>' + t('bot2') + '</p><p class="in ok"><span class="ms f">check_circle</span>' + t('bot3') + '</p></div></div></div></section>';
  }
  function benefits() {
    var B = [['electric_moped', 'b1'], ['verified_user', 'b2'], ['credit_card', 'b3'], ['support_agent', 'b4']];
    return '<section class="sec benefits">' + B.map(function (b) { return '<div class="bf"><span class="bf-ic"><span class="ms">' + b[0] + '</span></span><div><b>' + t(b[1]) + '</b><p>' + t(b[1] + 'p') + '</p></div></div>'; }).join('') + '</section>';
  }

  function renderProducts() { var el = $('#products'); if (el) el.outerHTML = products(); }
  function scrollTo(id) { var el = d.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  function render() {
    var app = $('#app');
    app.innerHTML = '<div class="wrap">' + hero() + catalog() + products() + telegram() + benefits() + '</div>';
    if (F.q) $('#search').value = F.q;
  }

  /* hodisalar (bir marta) */
  d.addEventListener('click', function (e) {
    var a;
    if ((a = e.target.closest('#hero-start'))) { e.preventDefault(); scrollTo('catalog'); history.replaceState(null, '', '#catalog'); return; }
    if ((a = e.target.closest('#app [data-cat]'))) { e.preventDefault(); openCat(a.getAttribute('data-cat')); return; }
    if ((a = e.target.closest('[data-chip]'))) { var k = a.getAttribute('data-chip'); F.fav = k === '__fav'; F.cat = F.fav ? '' : k; F.q = ''; F.limit = 8; $('#search').value = ''; renderProducts(); return; }
    if ((a = e.target.closest('[data-more]'))) { F.limit += 8; renderProducts(); return; }
    var c = e.target.closest('.pcard'); if (!c) return;
    var id = +c.getAttribute('data-id'), p = EZ.product(id), qv = $('[data-qv]', c);
    if ((a = e.target.closest('[data-q]'))) { qv.textContent = Math.max(1, Math.min(99, +qv.textContent + +a.getAttribute('data-q'))); }
    else if (e.target.closest('[data-add]')) { EZ.addToCart(id, +qv.textContent); qv.textContent = 1; Sh.cartBadge(); Sh.toast(p.n + ' ' + t('added')); }
    else if ((a = e.target.closest('[data-fav]'))) {
      var i = S.fav.indexOf(id); if (i >= 0) S.fav.splice(i, 1); else S.fav.push(id); EZ.save();
      var on = i < 0; a.classList.toggle('on', on); a.setAttribute('aria-pressed', on); a.firstChild.classList.toggle('f', on); Sh.header();
    }
  });
  function openCat(k) {
    if (!k || k === 'deals') { scrollTo('catalog'); return; }
    F.cat = k; F.q = ''; F.fav = false; F.limit = 8; renderProducts(); scrollTo('products');
    history.replaceState(null, '', '?cat=' + k + '#products');
  }
  w.EZHome = { openCat: openCat, search: function (q) { F.q = q; F.cat = ''; F.fav = false; F.limit = 8; renderProducts(); scrollTo('products'); } };

  Sh.boot(render);
  /* boshqa sahifadan #catalog bilan kelganda — sahifa chizilgandan keyin silliq scroll */
  w.addEventListener('load', function () { var h = location.hash.slice(1); if (h === 'catalog' || h === 'products') setTimeout(function () { scrollTo(h); }, 60); });
})(window, document);
