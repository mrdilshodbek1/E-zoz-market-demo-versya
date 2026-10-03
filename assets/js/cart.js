/* Savat va buyurtma */
(function (w, d) {
  'use strict';
  var EZ = w.EZ, S = EZ.S(), Sh = w.Shop, t = Sh.t, $ = Sh.$, $$ = Sh.$$;
  Sh.add({
    title: ['Savat va buyurtma', 'Корзина и оформление'], sub: ["Do'kon ochiq: ", 'Магазин открыт: '],
    items: ['Savatdagi mahsulotlar', 'Товары в корзине'], kinds: ['turdagi mahsulot', 'вида товаров'],
    unit: ['Dona narxi', 'Цена за шт'], clear: ['Savatni tozalash', 'Очистить корзину'], addMore: ["Yana mahsulot qo'shish", 'Добавить ещё товары'],
    emptyH: ["Savatingiz hozircha bo'sh", 'Ваша корзина пуста'], emptyP: ["Katalogdan kerakli mahsulotlarni tanlang — 45 daqiqada eshigingizgacha yetkazamiz.", 'Выберите товары в каталоге — доставим за 45 минут.'], goCat: ["Katalogga o'tish", 'Перейти в каталог'],
    cs1: ["Qabul qiluvchi ma'lumotlari", 'Данные получателя'], name: ['Ism va familiya', 'Имя и фамилия'], phone: ['Telefon raqami', 'Номер телефона'],
    cs2: ['Yetkazib berish manzili', 'Адрес доставки'], dist: ['Shahar va tuman', 'Город и район'], addr: ["Aniq manzil — ko'cha, uy, xonadon", 'Точный адрес — улица, дом, квартира'], land: ["Mo'ljal", 'Ориентир'], note: ['Kuryer uchun izoh', 'Комментарий для курьера'], noteP: ['Masalan: domofon kodi, qavat', 'Например: код домофона, этаж'],
    cs3: ['Yetkazib berish usuli', 'Способ доставки'], dStd: ['Standart tezkor', 'Стандартная экспресс'], dStdS: ['45–60 daqiqa', '45–60 минут'], dPlan: ['Rejalashtirilgan', 'Ко времени'], dPick: ["Do'kondan olib ketish", 'Самовывоз'], dPickS: ['Yunusobod, 11-kvartal', 'Юнусабад, 11-квартал'], free: ['Bepul', 'Бесплатно'],
    cs4: ["To'lov usuli", 'Способ оплаты'], payCashT: ['Naqd pul', 'Наличные'], payCashS: ["Kuryerga to'lash", 'Оплата курьеру'], payCardT: ['Karta orqali', 'Картой'], payCardS: ["Onlayn to'lov", 'Онлайн-оплата'],
    payCashD: ['Buyurtmani qabul qilganda naqd pul bilan', 'Наличными при получении заказа'], payCardD: ["Buyurtma berishda bank kartasi bilan xavfsiz to'lov", 'Безопасная оплата банковской картой при оформлении'],
    sumH: ['Buyurtma hisobi', 'Сумма заказа'], subt: ['Mahsulotlar jami', 'Товары'], disc: ['Promokod chegirmasi', 'Скидка по промокоду'], deliv: ['Yetkazib berish', 'Доставка'], total: ["Jami to'lov", 'Итого к оплате'],
    promoQ: ['Promokod', 'Промокод'], promoP: ['Kodni kiriting', 'Введите код'], apply: ["Qo'llash", 'Применить'], remove: ["Olib tashlash", 'Убрать'],
    yourCodes: ['Sizning darajangiz uchun kodlar', 'Коды для вашего уровня'], applied: ["qo'llandi", 'применён'],
    checkout: ['BUYURTMA BERISH', 'ОФОРМИТЬ ЗАКАЗ'], secure: ["Ma'lumotlaringiz himoyalangan", 'Ваши данные защищены'],
    freeLeft: ["Bepul yetkazishgacha yana", 'До бесплатной доставки ещё'], freeOk: ['Yetkazib berish bepul', 'Доставка бесплатно'],
    req: ["Ism, telefon va manzilni to'ldiring", 'Заполните имя, телефон и адрес'],
    cardTitle: ["Karta orqali to'lov", 'Оплата картой'], cardNum: ['Karta raqami', 'Номер карты'], cardExp: ['Amal qilish muddati', 'Срок действия'], cardHolder: ['Karta egasi', 'Владелец карты'],
    pay: ["To'lash", 'Оплатить'], paying: ["To'lov amalga oshirilmoqda…", 'Выполняется оплата…'], cardErr: ["Karta raqami va muddatini to'g'ri kiriting", 'Введите корректный номер и срок карты'],
    cardNote: ["Karta ma'lumotlari saqlanmaydi va faqat to'lov uchun ishlatiladi", 'Данные карты не сохраняются'],
    help: ['Buyurtma bo\'yicha savolingiz bormi?', 'Есть вопросы по заказу?'], helpP: ["Operatorlarimiz har kuni 08:00 dan 23:00 gacha", 'Операторы ежедневно с 08:00 до 23:00']
  });
  var F = { dtype: S.dtype || 'std', pay: S.pay || 'cash', slot: '18:00 – 20:00' };
  var form = { nm: S.user.nm, ph: S.user.ph, dist: S.user.dist, ad: S.user.ad, land: '', note: '' };

  function calc() {
    var sub = EZ.cartSub(), r = S.promo ? EZ.checkPromo(S.promo, sub) : null, ds = r && !r.e ? r.d : 0;
    var dl = !sub || F.dtype === 'pick' || sub >= S.settings.free ? 0 : S.settings.fee;
    return { sub: sub, ds: ds, dl: dl, total: sub - ds + dl, pr: r };
  }

  function itemsCard() {
    var L = EZ.cartLines();
    if (!L.length) return '<section class="card empty">' + Sh.emptyArt() + '<h3>' + t('emptyH') + '</h3><p>' + t('emptyP') + '</p><a class="btn btn-red" href="' + Sh.PG.home + '#catalog"><span class="ms">grid_view</span>' + t('goCat') + '</a></section>';
    return '<section class="card block"><div class="block-h"><div><h2 class="h3">' + t('items') + '</h2><p class="mut-s num">' + L.length + ' ' + t('kinds') + ' · ' + EZ.cartQty() + ' ' + t('pcs') + '</p></div><button class="btn btn-soft btn-sm" data-clear><span class="ms">delete_sweep</span>' + t('clear') + '</button></div>' +
      '<ul class="lines">' + L.map(function (x) {
        var p = EZ.product(x.id);
        return '<li class="line" data-id="' + x.id + '"><div class="line-img">' + Sh.thumb(p) + '</div><div class="line-t"><b>' + EZ.esc(x.n) + '</b><span class="mut-s num">' + t('unit') + ': ' + Sh.money(x.p) + '</span><span class="pill p-ok"><span class="ms f">check_circle</span>' + t('inStock') + '</span></div>' +
          '<div class="qty"><button data-step="-1" aria-label="−"><span class="ms">remove</span></button><span class="num">' + x.q + '</span><button data-step="1" aria-label="+"><span class="ms">add</span></button></div>' +
          '<b class="line-sum num">' + Sh.money(x.p * x.q) + '</b><button class="icon-btn line-del" data-del aria-label="Delete"><span class="ms">close</span></button></li>';
      }).join('') + '</ul><a class="link add-more" href="' + Sh.PG.home + '#catalog"><span class="ms">add</span>' + t('addMore') + '</a></section>';
  }

  function step(n, title, body) { return '<section class="card block step"><div class="step-h"><span class="step-n">' + n + '</span><h2 class="h3">' + title + '</h2></div>' + body + '</section>'; }
  function field(id, label, ic, val, type, ph, req) {
    return '<div class="field"><label for="' + id + '">' + label + (req ? ' <span class="req">*</span>' : '') + '</label><div class="input"><span class="ms">' + ic + '</span><input id="' + id + '" type="' + (type || 'text') + '" value="' + EZ.esc(val || '') + '"' + (ph ? ' placeholder="' + EZ.esc(ph) + '"' : '') + (req ? ' required' : '') + '></div></div>';
  }
  function steps() {
    var c = calc(), feeTxt = c.sub >= S.settings.free ? t('free') : Sh.money(S.settings.fee);
    var s1 = '<div class="g2">' + field('f-nm', t('name'), 'person', form.nm, 'text', '', 1) + field('f-ph', t('phone'), 'call', form.ph, 'tel', '+998 __ ___ __ __', 1) + '</div>';
    var s2 = '<div class="g2"><div class="field"><label for="f-dist">' + t('dist') + ' <span class="req">*</span></label><div class="input"><span class="ms">location_city</span><select id="f-dist">' +
      EZ.DISTRICTS.map(function (x) { return '<option' + (x === form.dist ? ' selected' : '') + ' value="' + x + '">Toshkent sh., ' + x + ' tumani</option>'; }).join('') + '</select><span class="ms chev">expand_more</span></div></div>' +
      field('f-ad', t('addr'), 'home_pin', form.ad, 'text', '', 1) + field('f-land', t('land'), 'near_me', form.land, 'text', 'Masalan: Mega Planet yonida') + field('f-note', t('note'), 'chat', form.note, 'text', t('noteP')) + '</div>';
    var opts = [['std', 'electric_moped', t('dStd'), t('dStdS'), feeTxt], ['plan', 'schedule', t('dPlan'), (S.lang === 'ru' ? 'Сегодня ' : 'Bugun ') + F.slot, feeTxt], ['pick', 'storefront', t('dPick'), t('dPickS'), t('free')]];
    var s3 = '<div class="opts3" role="radiogroup">' + opts.map(function (o) {
      return '<label class="opt' + (F.dtype === o[0] ? ' on' : '') + '"><input type="radio" name="dtype" value="' + o[0] + '"' + (F.dtype === o[0] ? ' checked' : '') + '><span class="opt-ic"><span class="ms">' + o[1] + '</span></span><b>' + o[2] + '</b><small>' + o[3] + '</small><em class="num">' + o[4] + '</em></label>';
    }).join('') + '</div>' + (F.dtype === 'plan' ? '<div class="chips slots">' + ['10:00 – 12:00', '14:00 – 16:00', '18:00 – 20:00', '20:00 – 22:00'].map(function (s) { return '<button class="chip' + (F.slot === s ? ' on' : '') + '" data-slot="' + s + '">' + s + '</button>'; }).join('') + '</div>' : '');
    var s4 = '<div class="pays" role="radiogroup">' +
      payCard('cash', 'payments', t('payCashT'), t('payCashS'), t('payCashD')) + payCard('card', 'credit_card', t('payCardT'), t('payCardS'), t('payCardD')) + '</div>';
    return step(1, t('cs1'), s1) + step(2, t('cs2'), s2) + step(3, t('cs3'), s3) + step(4, t('cs4'), s4);
  }
  function payCard(v, ic, tt, s, desc) {
    var on = F.pay === v;
    return '<label class="pay' + (on ? ' on' : '') + '"><input type="radio" name="pay" value="' + v + '"' + (on ? ' checked' : '') + '><span class="pay-ic"><span class="ms">' + ic + '</span></span><span class="pay-t"><b>' + tt + ' <span class="dash">—</span> ' + s + '</b><small>' + desc + '</small></span><span class="pay-chk"><span class="ms">check</span></span></label>';
  }

  function summary() {
    var c = calc(), lv = EZ.myLevel(), today = EZ.isoDay(Date.now());
    var mine = S.promos.filter(function (p) { return p.on && p.l.indexOf(lv) >= 0 && (!p.e || p.e >= today) && (!p.s || p.s <= today); });
    var msg = '';
    if (S.promo && c.pr) {
      msg = c.pr.e ? '<div class="pmsg err"><span class="ms">error</span><span>' + EZ.esc(c.pr.e) + '</span></div>'
        : '<div class="pmsg ok"><span class="ms f">check_circle</span><span><b>' + c.pr.p.c + '</b> ' + t('applied') + ': ' + levelFor(c.pr.p) + ' ' + EZ.promoLabel(c.pr.p) + '</span><button data-unpromo>' + t('remove') + '</button></div>';
    }
    var left = S.settings.free - c.sub, pct = Math.min(100, Math.round(c.sub / S.settings.free * 100));
    return '<aside class="sum-col"><div class="card sum">' +
      '<div class="sum-h"><h2 class="h3">' + t('sumH') + '</h2>' + Sh.lvBadge(lv) + '</div>' +
      (F.dtype !== 'pick' && c.sub ? '<div class="free-bar"><div class="fb-t">' + (left > 0 ? t('freeLeft') + ' <b class="num">' + Sh.money(left) + '</b>' : '<span class="ms f">local_shipping</span>' + t('freeOk')) + '</div><div class="bar"><i style="width:' + pct + '%"></i></div></div>' : '') +
      '<dl class="rows"><div><dt>' + t('subt') + '</dt><dd class="num">' + Sh.money(c.sub) + '</dd></div>' +
      '<div class="' + (c.ds ? 'neg' : '') + '"><dt>' + t('disc') + '</dt><dd class="num">−' + Sh.money(c.ds) + '</dd></div>' +
      '<div><dt>' + t('deliv') + '</dt><dd class="num">' + (c.dl ? Sh.money(c.dl) : t('free')) + '</dd></div>' +
      '<div class="tot"><dt>' + t('total') + '</dt><dd class="num">' + Sh.money(c.total) + '</dd></div></dl>' +
      '<div class="promo"><label for="promo">' + t('promoQ') + '</label><div class="promo-row"><div class="input"><span class="ms">sell</span><input id="promo" autocomplete="off" spellcheck="false" placeholder="' + t('promoP') + '" value="' + EZ.esc(S.promo) + '"></div><button class="btn btn-ink" data-apply>' + t('apply') + '</button></div>' +
      '<div class="phint" id="phint"></div>' + msg +
      (mine.length ? '<div class="mycodes"><small>' + t('yourCodes') + '</small><div class="chips">' + mine.map(function (p) { return '<button class="code-chip" data-code="' + p.c + '"><b>' + p.c + '</b><span>' + EZ.promoLabel(p) + '</span></button>'; }).join('') + '</div></div>' : '') + '</div>' +
      '<button class="btn btn-red btn-go" data-go' + (c.sub ? '' : ' disabled') + '><span>' + t('checkout') + ' (<span class="num">' + Sh.money(c.total) + '</span>)</span><span class="ms">arrow_forward</span></button>' +
      '<p class="secure"><span class="ms">lock</span>' + t('secure') + '</p></div>' +
      '<div class="help"><span class="ms">support_agent</span><div><b>' + t('help') + '</b><small>' + t('helpP') + '</small><a href="tel:' + S.settings.phone.replace(/[^+\d]/g, '') + '" class="num">' + S.settings.phone + '</a></div></div></aside>';
  }
  function levelFor(p) { var L = EZ.levelsAsc().filter(function (k) { return p.l.indexOf(k) >= 0; }); return L.map(Sh.lvName).join(', ') + ' ' + (S.lang === 'ru' ? 'уровня' : 'darajasi uchun'); }
  function hint(code) {
    var el = $('#phint'); if (!el) return;
    var p = EZ.findPromo(code);
    el.innerHTML = p && code.length >= 3 ? '<span class="ms f">stars</span>' + levelFor(p) + ' <b class="num">' + EZ.promoLabel(p) + '</b>' + (p.m ? ' · min ' + Sh.money(p.m) : '') : '';
  }

  function render() {
    var L = EZ.cartLines();
    $('#app').innerHTML = '<div class="wrap"><nav class="crumbs"><a href="' + Sh.PG.home + '">' + t('home') + '</a><span class="ms">chevron_right</span><b>' + t('title') + '</b></nav>' +
      '<div class="page-h"><h1 class="h1">' + t('title') + '</h1><p class="lead"><span class="dot-ok"></span>' + t('sub') + S.settings.hours + '</p></div>' +
      '<div class="co-grid"><div class="co-main">' + itemsCard() + (L.length ? steps() : '') + '</div>' + (L.length ? summary() : '') + '</div></div>';
    hint(S.promo);
  }
  function refreshSummary() { var a = $('.sum-col'); if (a) { var v = $('#promo').value; a.outerHTML = summary(); $('#promo').value = v; hint(v); } Sh.cartBadge(); }
  function readForm() { ['nm', 'ph', 'dist', 'ad', 'land', 'note'].forEach(function (k) { var e = $('#f-' + k); if (e) form[k] = e.value.trim(); }); }

  d.addEventListener('click', function (e) {
    var a, li = e.target.closest('.line');
    if (li && (a = e.target.closest('[data-step]'))) { var id = +li.getAttribute('data-id'), x = S.cart.filter(function (c) { return c.id === id; })[0]; x.q = Math.max(1, Math.min(99, x.q + +a.getAttribute('data-step'))); EZ.save(); readForm(); render(); Sh.cartBadge(); return; }
    if (li && e.target.closest('[data-del]')) { var id2 = +li.getAttribute('data-id'); S.cart = S.cart.filter(function (c) { return c.id !== id2; }); EZ.save(); readForm(); render(); Sh.cartBadge(); return; }
    if (e.target.closest('[data-clear]')) { S.cart = []; S.promo = ''; EZ.save(); render(); Sh.cartBadge(); return; }
    if ((a = e.target.closest('[data-slot]'))) { readForm(); F.slot = a.getAttribute('data-slot'); render(); return; }
    if ((a = e.target.closest('[data-code]'))) { $('#promo').value = a.getAttribute('data-code'); applyPromo(); return; }
    if (e.target.closest('[data-apply]')) { applyPromo(); return; }
    if (e.target.closest('[data-unpromo]')) { S.promo = ''; EZ.save(); $('#promo').value = ''; refreshSummary(); return; }
    if (e.target.closest('[data-go]')) { checkout(); }
  });
  d.addEventListener('change', function (e) {
    if (e.target.name === 'dtype') { readForm(); F.dtype = S.dtype = e.target.value; EZ.save(); render(); }
    if (e.target.name === 'pay') { F.pay = S.pay = e.target.value; EZ.save(); $$('.pay').forEach(function (l) { l.classList.toggle('on', l.contains(e.target)); }); }
  });
  d.addEventListener('input', function (e) {
    if (e.target.id === 'promo') { e.target.value = e.target.value.toUpperCase().replace(/\s/g, ''); hint(e.target.value); }
    if (/^f-/.test(e.target.id)) e.target.classList.remove('err');
  });
  d.addEventListener('keydown', function (e) { if (e.target.id === 'promo' && e.key === 'Enter') { e.preventDefault(); applyPromo(); } });
  function applyPromo() {
    var v = $('#promo').value.trim().toUpperCase();
    S.promo = v; EZ.save(); refreshSummary();
    var r = v ? EZ.checkPromo(v, EZ.cartSub()) : null;
    if (r && r.e) { S.promo = v; } // xatoni ko'rsatish uchun saqlaymiz, hisobda chegirma 0
  }

  function checkout() {
    readForm();
    var bad = [];
    if (form.nm.length < 2) bad.push('f-nm');
    if (form.ph.replace(/\D/g, '').length < 9) bad.push('f-ph');
    if (form.ad.length < 5) bad.push('f-ad');
    if (bad.length) { bad.forEach(function (id) { $('#' + id).classList.add('err'); }); $('#' + bad[0]).focus(); $('#' + bad[0]).closest('.step').scrollIntoView({ behavior: 'smooth', block: 'center' }); Sh.toast(t('req'), 'error'); return; }
    if (F.pay === 'card') cardModal(); else place(false);
  }
  function cardModal() {
    var c = calc();
    var m = Sh.modal(t('cardTitle'),
      '<div class="cardviz"><span class="cv-chip"></span><span class="cv-num num" id="cv-num">•••• •••• •••• ••••</span><div class="cv-row"><span id="cv-name">' + EZ.esc(form.nm.toUpperCase()) + '</span><span class="num" id="cv-exp">MM/YY</span></div></div>' +
      '<div class="stack"><div class="field"><label for="c-num">' + t('cardNum') + '</label><div class="input"><span class="ms">credit_card</span><input id="c-num" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" maxlength="19"></div></div>' +
      '<div class="g2"><div class="field"><label for="c-exp">' + t('cardExp') + '</label><div class="input"><span class="ms">event</span><input id="c-exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5"></div></div>' +
      '<div class="field"><label for="c-h">' + t('cardHolder') + '</label><div class="input"><span class="ms">person</span><input id="c-h" autocomplete="cc-name" value="' + EZ.esc(form.nm) + '"></div></div></div>' +
      '<button class="btn btn-red btn-go" id="c-pay"><span class="ms">lock</span>' + t('pay') + ' <span class="num">' + Sh.money(c.total) + '</span></button><p class="secure" style="margin:0"><span class="ms">shield</span>' + t('cardNote') + '</p></div>', { w: 480 });
    var el = m.el, num = $('#c-num', el), exp = $('#c-exp', el);
    num.focus();
    num.addEventListener('input', function () { var v = num.value.replace(/\D/g, '').slice(0, 16); num.value = v.replace(/(\d{4})(?=\d)/g, '$1 '); $('#cv-num', el).textContent = (v + '••••••••••••••••').slice(0, 16).replace(/(.{4})(?=.)/g, '$1 '); });
    exp.addEventListener('input', function () { var v = exp.value.replace(/\D/g, '').slice(0, 4); exp.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v; $('#cv-exp', el).textContent = exp.value || 'MM/YY'; });
    $('#c-h', el).addEventListener('input', function (e) { $('#cv-name', el).textContent = e.target.value.toUpperCase(); });
    $('#c-pay', el).addEventListener('click', function () {
      var n = num.value.replace(/\D/g, ''), ex = exp.value.split('/'), mm = +ex[0];
      if (n.length !== 16 || !(mm >= 1 && mm <= 12) || !ex[1] || ex[1].length !== 2) { Sh.toast(t('cardErr'), 'error'); (n.length !== 16 ? num : exp).focus(); return; }
      var b = this; b.disabled = true; b.innerHTML = '<span class="spin"></span>' + t('paying');
      setTimeout(function () { m.close(); place(true); }, 1300);
    });
  }
  function place(paid) {
    var c = calc(), now = Date.now();
    var o = { id: EZ.liveId(now), nm: form.nm, ph: form.ph, dist: form.dist, ad: 'Toshkent sh., ' + form.dist + ' t., ' + form.ad + (form.land ? ' (' + form.land + ')' : ''), note: form.note, it: EZ.cartLines().map(function (x) { return { id: x.id, n: x.n, p: x.p, q: x.q }; }), sub: c.sub, ds: c.ds, dl: c.dl, t: c.total, pay: F.pay === 'card' ? 'Karta' : 'Naqd', paid: !!paid, st: 0, ts: now, mine: 1, live: 1, code: c.ds && c.pr && c.pr.p ? c.pr.p.c : '', dtype: F.dtype, slot: F.dtype === 'plan' ? F.slot : '' };
    if (o.code) { c.pr.p.u++; S.promoUse[o.code] = (S.promoUse[o.code] || 0) + 1; }
    S.user.nm = form.nm; S.user.ph = form.ph; S.user.dist = form.dist; S.user.ad = form.ad;
    S.orders.unshift(o); S.last = o.id; S.cart = []; S.promo = ''; EZ.save();
    EZ.postOrder(o);
    location.href = Sh.PG.done;
  }

  Sh.boot(render);
})(window, document);
