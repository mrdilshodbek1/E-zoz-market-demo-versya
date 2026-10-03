/* EZOZ MARKET — mijoz qobig'i: tarjima, header, kategoriya karuseli, mobil navigatsiya, toast, modal */
(function (w, d) {
  'use strict';
  var EZ = w.EZ, S = EZ.S();
  var PG = { home: '1-bosh-sahifa.html', cart: '2-savat.html', done: '3-buyurtma-qabul.html', orders: '4-buyurtmalarim.html' };

  /* ---------- tarjimalar ---------- */
  var T = {
    hours: ['Ish vaqti', 'Часы работы'], city: ['Toshkent shahar, Yunusobod t.', 'г. Ташкент, Юнусабадский р-н'],
    freeFrom: ["150 000 so'mdan bepul yetkazish", 'Бесплатная доставка от 150 000 сум'],
    catalog: ['Katalog', 'Каталог'], search: ['Mahsulot qidirish: non, sut, guruch…', 'Поиск: хлеб, молоко, рис…'], find: ['Qidirish', 'Найти'],
    cart: ['Savat', 'Корзина'], fav: ['Saralangan', 'Избранное'],
    home: ['Bosh sahifa', 'Главная'], orders: ['Buyurtmalar', 'Заказы'], profile: ['Profil', 'Профиль'], myOrders: ['Buyurtmalarim', 'Мои заказы'],
    deals: ['Aksiyalar & Chegirmalar', 'Акции и скидки'],
    levelOf: ['darajasi', 'уровень'],
    added: ["savatga qo'shildi", 'добавлено в корзину'], toCart: ['Savatga', 'В корзину'], inStock: ['Omborda bor', 'В наличии'], outStock: ["Vaqtincha yo'q", 'Нет в наличии'],
    sum: ["so'm", 'сум'], pcs: ['dona', 'шт'], close: ['Yopish', 'Закрыть'],
    st0: ['Qabul qilindi', 'Принят'], st1: ['Tayyorlanmoqda', 'Собирается'], st2: ["Yo'lda", 'В пути'], st3: ['Yetkazildi', 'Доставлен'], st4: ['Bekor qilingan', 'Отменён'],
    cash: ['Naqd pul', 'Наличные'], card: ['Karta orqali', 'Картой'], cashShort: ['Naqd', 'Наличные'], cardShort: ['Karta', 'Карта'],
    paidCard: ["To'langan (Karta)", 'Оплачено (Карта)'], payCash: ["Naqd — yetkazilganda to'lanadi", 'Наличные — оплата при получении'],
    oddiy: ['Oddiy mijoz', 'Обычный клиент']
  };
  function t(k) { var v = T[k]; return v ? v[S.lang === 'ru' ? 1 : 0] : k; }
  function add(dict) { for (var k in dict) T[k] = dict[k]; }
  function stName(st) { return t('st' + st); }
  function lvName(k) { return k === 'oddiy' ? t('oddiy') : EZ.LEVEL_NAMES[k]; }
  function lvBadge(k, small) {
    var ic = k === 'gold' ? 'workspace_premium' : k === 'bronze' ? 'military_tech' : k === 'silver' ? 'stars' : 'person';
    return '<span class="lvl" style="background:' + EZ.levelColor(k) + (small ? ';height:22px;font-size:11px' : '') + '"><span class="ms f">' + ic + '</span>' + lvName(k) + '</span>';
  }
  function money(n) { return EZ.fmtN(n) + '\u00a0' + t('sum'); }
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || d).querySelectorAll(s)); }
  function page() { return d.body.getAttribute('data-page'); }
  function catName(c) { return c ? (S.lang === 'ru' ? c.ru : c.uz) : ''; }

  /* ---------- toast ---------- */
  var tt;
  function toast(msg, icon) {
    var el = $('#toast');
    if (!el) { el = d.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); d.body.appendChild(el); }
    el.innerHTML = '<span class="ms f">' + (icon || 'check_circle') + '</span><span></span>';
    el.lastChild.textContent = msg;
    requestAnimationFrame(function () { el.classList.add('on'); });
    clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('on'); }, 2400);
  }

  /* ---------- modal ---------- */
  function modal(title, body, opts) {
    opts = opts || {};
    var bg = d.createElement('div'); bg.className = 'modal-bg';
    bg.innerHTML = '<div class="modal" role="dialog" aria-modal="true" style="max-width:' + (opts.w || 560) + 'px"><div class="modal-h"><h3 class="h3" style="font-size:20px">' + title + '</h3><button class="x-btn" data-x aria-label="' + t('close') + '"><span class="ms">close</span></button></div><div class="modal-b">' + body + '</div></div>';
    d.body.appendChild(bg); d.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { bg.classList.add('on'); });
    function close() { bg.classList.remove('on'); d.body.style.overflow = ''; setTimeout(function () { bg.remove(); }, 250); d.removeEventListener('keydown', key); }
    function key(e) { if (e.key === 'Escape') close(); }
    bg.addEventListener('click', function (e) { if (e.target === bg || e.target.closest('[data-x]')) close(); });
    d.addEventListener('keydown', key);
    var f = $('.x-btn', bg); if (f) f.focus();
    return { el: bg, close: close };
  }

  /* ---------- header ---------- */
  var NAV = [
    { k: 'deals', ic: 'local_fire_department', hot: 1 }, { k: 'oziq', ic: 'rice_bowl' }, { k: 'ichimlik', ic: 'local_cafe' }, { k: 'shirinlik', ic: 'cake' },
    { k: 'sut', ic: 'water_drop' }, { k: 'gosht', ic: 'set_meal' }, { k: 'meva', ic: 'nutrition' }, { k: 'non', ic: 'bakery_dining' },
    { k: 'maishiy', ic: 'cleaning_services' }, { k: 'gigiyena', ic: 'soap' }, { k: 'kiyim', ic: 'apparel' }
  ];
  function catHref(k) { return (page() === 'home' ? '' : PG.home) + (k === 'deals' ? '#catalog' : '?cat=' + k + '#products'); }
  function header() {
    var lv = EZ.myLevel(), q = EZ.cartQty(), sub = EZ.cartSub(), me = S.user, ini = me.nm.split(' ').map(function (x) { return x[0]; }).join('').slice(0, 2);
    var items = NAV.map(function (n) { var c = EZ.cat(n.k), label = c ? catName(c) : t('deals'); return '<a href="' + catHref(n.k) + '" data-cat="' + n.k + '"' + (n.hot ? ' class="hot"' : '') + ' draggable="false"><span class="ms' + (n.hot ? ' f' : '') + '">' + n.ic + '</span>' + EZ.esc(label) + '</a><i></i>'; }).join('');
    var h = d.getElementById('shell-top');
    h.innerHTML =
      '<div class="util"><div class="wrap">' +
      '<span class="loc"><span class="ms">location_on</span>' + t('city') + '</span>' +
      '<span class="hide-m"><span class="ms">schedule</span>' + t('hours') + ': <b>' + S.settings.hours + '</b></span>' +
      '<span class="hide-m"><span class="ms">local_shipping</span>' + t('freeFrom') + '</span>' +
      '<span class="sp"></span><a class="hide-m" href="tel:' + S.settings.phone.replace(/[^+\d]/g, '') + '"><span class="ms">call</span><b>' + S.settings.phone + '</b></a>' +
      '<div class="lang" role="group" aria-label="Til"><button data-lang="uz" class="' + (S.lang !== 'ru' ? 'on' : '') + '">O\'zbekcha</button><button data-lang="ru" class="' + (S.lang === 'ru' ? 'on' : '') + '">Русский</button></div>' +
      '</div></div>' +
      '<header class="hdr"><div class="wrap hdr-main">' +
      '<a class="logo" href="' + PG.home + '" aria-label="EZOZ MARKET"><span class="logo-mark">E</span><span class="logo-txt"><b>EZOZ</b><small>MARKET</small></span></a>' +
      '<a class="btn-cat" id="btn-catalog" href="' + PG.home + '#catalog"><span class="ms">grid_view</span><span class="t">' + t('catalog') + '</span></a>' +
      '<form class="search" id="search-form" role="search"><span class="ms">search</span><input id="search" type="search" autocomplete="off" placeholder="' + t('search') + '" aria-label="' + t('find') + '"><button type="submit">' + t('find') + '</button></form>' +
      '<div class="hdr-act">' +
      '<a class="icon-btn fav-btn" href="' + PG.home + '?fav=1#products" aria-label="' + t('fav') + '"><span class="ms">favorite</span>' + (S.fav.length ? '<span class="dot">' + S.fav.length + '</span>' : '') + '</a>' +
      '<a class="cart-btn" href="' + PG.cart + '" aria-label="' + t('cart') + '"><span class="cb-ic"><span class="ms">shopping_bag</span><span class="dot" data-cartq' + (q ? '' : ' hidden') + '>' + q + '</span></span><span class="cb-t"><small>' + t('cart') + '</small><b class="num" data-cartsum>' + money(sub) + '</b></span></a>' +
      '<a class="user-btn" href="' + PG.orders + '"><span class="avatar">' + ini + '</span><span class="u-t"><b>' + EZ.esc(me.nm.split(' ')[0]) + ' ' + me.nm.split(' ')[1][0] + '.</b><small style="color:' + EZ.levelColor(lv) + '">' + lvName(lv) + (lv === 'oddiy' ? '' : ' ' + t('levelOf')) + '</small></span></a>' +
      '</div></div>' +
      '<nav class="cats" aria-label="' + t('catalog') + '"><div class="marq" id="marq"><div class="marq-track">' + items + items + '</div></div></nav></header>';
    var b = d.getElementById('shell-bottom'), pg = page();
    var tabs = [['home', 'storefront', PG.home, 'home'], ['catalog', 'grid_view', PG.home + '#catalog', 'catalog'], ['cart', 'shopping_bag', PG.cart, 'cart'], ['orders', 'receipt_long', PG.orders, 'orders'], ['profile', 'person', PG.orders + '#loyalty', 'profile']];
    b.innerHTML = '<nav class="bnav" aria-label="Menu">' + tabs.map(function (x) {
      var on = (x[0] === 'home' && pg === 'home') || (x[0] === 'cart' && pg === 'cart') || (x[0] === 'orders' && (pg === 'orders' || pg === 'done'));
      return '<a href="' + x[2] + '" data-nav="' + x[0] + '" class="' + (on ? 'on' : '') + '"><span class="ms">' + x[1] + '</span>' + t(x[3]) + (x[0] === 'cart' ? '<span class="dot" data-cartq' + (q ? '' : ' hidden') + '>' + q + '</span>' : '') + '</a>';
    }).join('') + '</nav>';
    wireHeader();
  }
  function cartBadge() {
    var q = EZ.cartQty();
    $$('[data-cartq]').forEach(function (e) { e.textContent = q; e.hidden = !q; });
    $$('[data-cartsum]').forEach(function (e) { e.textContent = money(EZ.cartSub()); });
  }

  /* ---------- Katalog: silliq scroll ---------- */
  function goCatalog(e) {
    if (page() !== 'home') return; // boshqa sahifadan: href orqali bosh sahifaga #catalog bilan o'tadi
    if (e) e.preventDefault();
    var el = d.getElementById('catalog'); if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#catalog');
  }

  /* ---------- Kategoriya karuseli (cheksiz marquee, hover'da to'xtaydi, drag/swipe) ---------- */
  var mq = null;
  function marquee() {
    var box = $('#marq'); if (!box) return;
    var track = $('.marq-track', box), x = mq ? mq.x : 0, half = 0, hover = false, drag = null, moved = false, last = performance.now();
    var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var speed = reduce ? 0 : 28; // px/soniya — sekin marquee
    function measure() { half = track.scrollWidth / 2; }
    measure();
    function wrap() { if (half) { while (x <= -half) x += half; while (x > 0) x -= half; } }
    function frame(now) {
      var dt = Math.min(64, now - last); last = now;
      if (!hover && !drag && !d.hidden) x -= speed * dt / 1000;
      wrap(); track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      if (mq) mq.x = x;
      mq.raf = requestAnimationFrame(frame);
    }
    if (mq && mq.raf) cancelAnimationFrame(mq.raf);
    mq = { x: x };
    mq.raf = requestAnimationFrame(frame);
    box.addEventListener('mouseenter', function () { hover = true; });
    box.addEventListener('mouseleave', function () { hover = false; });
    box.addEventListener('pointerdown', function (e) { if (e.button !== 0) return; drag = { sx: e.clientX, x0: x, id: e.pointerId }; moved = false; });
    w.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.sx;
      if (!moved && Math.abs(dx) > 6) { moved = true; box.classList.add('drag'); try { box.setPointerCapture(drag.id); } catch (er) { } }
      if (moved) { x = drag.x0 + dx; wrap(); }
    });
    function end() { if (!drag) return; drag = null; box.classList.remove('drag'); if (e_isTouch) hover = false; }
    var e_isTouch = false;
    box.addEventListener('touchstart', function () { e_isTouch = true; }, { passive: true });
    w.addEventListener('pointerup', end); w.addEventListener('pointercancel', end);
    box.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; }
      var a = e.target.closest('a[data-cat]');
      if (a && page() === 'home' && w.EZHome) { e.preventDefault(); w.EZHome.openCat(a.getAttribute('data-cat')); }
    }, true);
    w.addEventListener('resize', measure);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(measure);
  }

  function wireHeader() {
    $$('[data-lang]').forEach(function (b) {
      b.onclick = function () { S.lang = b.getAttribute('data-lang'); EZ.save(); d.documentElement.lang = S.lang === 'ru' ? 'ru' : 'uz'; render(); };
    });
    $('#btn-catalog').addEventListener('click', goCatalog);
    $$('[data-nav=catalog]').forEach(function (a) { a.addEventListener('click', goCatalog); });
    $('#search-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var q = $('#search').value.trim();
      if (page() === 'home' && w.EZHome) w.EZHome.search(q);
      else location.href = PG.home + '?q=' + encodeURIComponent(q) + '#products';
    });
    marquee();
  }

  var pageRender = null;
  function render() { header(); if (pageRender) pageRender(); }
  function boot(fn) {
    pageRender = fn;
    d.documentElement.lang = S.lang === 'ru' ? 'ru' : 'uz';
    var start = function () { render(); };
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
    w.addEventListener('storage', function (e) { if (e.key === 'ezoz_v6') location.reload(); });
  }

  /* placeholder ikonka (rasmsiz mahsulotlar uchun) */
  function thumb(p, cls) {
    if (p.img) return '<img class="' + (cls || '') + '" src="' + p.img + '" alt="' + EZ.esc(p.n) + '" loading="lazy">';
    var c = EZ.cat(p.c);
    return '<span class="ph ' + (cls || '') + '" aria-hidden="true"><span class="ms">' + (c ? c.ic : 'shopping_basket') + '</span></span>';
  }
  /* bo'sh holat illyustratsiyasi */
  function emptyArt() {
    return '<svg width="148" height="112" viewBox="0 0 148 112" fill="none" aria-hidden="true"><ellipse cx="74" cy="102" rx="52" ry="6" fill="#F1EFEC"/><path d="M34 38h80l-7 52a8 8 0 0 1-8 7H49a8 8 0 0 1-8-7l-7-52Z" fill="#fff" stroke="#E7E3DF" stroke-width="2"/><path d="M52 38c0-12 10-22 22-22s22 10 22 22" stroke="#17181D" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="60" r="3" fill="#17181D"/><circle cx="88" cy="60" r="3" fill="#17181D"/><path d="M64 74c6 5 14 5 20 0" stroke="#E60000" stroke-width="3" stroke-linecap="round"/><circle cx="118" cy="26" r="7" fill="#FFE0DD"/><circle cx="26" cy="54" r="5" fill="#ECFDF5"/></svg>';
  }

  w.Shop = { t: t, add: add, PG: PG, toast: toast, modal: modal, boot: boot, render: render, cartBadge: cartBadge, money: money, stName: stName, lvName: lvName, lvBadge: lvBadge, $: $, $$: $$, catName: catName, thumb: thumb, emptyArt: emptyArt, header: header };
})(window, document);
