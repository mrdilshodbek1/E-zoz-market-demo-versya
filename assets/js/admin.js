/* EZOZ MARKET — Boshqaruv paneli: qobiq va sahifalar */
(function (w, d) {
  'use strict';
  var EZ = w.EZ, S = EZ.S(), C = w.Charts, Sh = w.Shop;
  var $ = function (s, r) { return (r || d).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || d).querySelectorAll(s)); };
  var esc = EZ.esc, fmt = EZ.fmt, fmtN = EZ.fmtN;
  var PAGE = d.body.getAttribute('data-page');
  var NAV = {
    dash: ['5-admin.html', 'Boshqaruv paneli', 'space_dashboard'],
    orders: ['admin-buyurtmalar.html', 'Buyurtmalar', 'shopping_bag'],
    products: ['admin-mahsulotlar.html', 'Mahsulotlar', 'inventory_2'],
    customers: ['admin-mijozlar.html', 'Mijozlar', 'group'],
    promos: ['admin-promokodlar.html', 'Promokodlar & Aksiyalar', 'loyalty'],
    an_new: ['admin-analitika-yangi.html', 'Yangi buyurtmalar analitikasi', 'Yangi buyurtmalar'],
    an_total: ['admin-analitika-jami.html', 'Jami buyurtmalar analitikasi', 'Jami buyurtmalar'],
    an_rev: ['admin-analitika-tushum.html', 'Tushum analitikasi', 'Tushum'],
    an_cust: ['admin-analitika-mijozlar.html', 'Mijozlar analitikasi', 'Mijozlar'],
    an_promo: ['admin-analitika-promokod.html', 'Promokod & Aksiya analitikasi', 'Promokod & Aksiya'],
    settings: ['admin-sozlamalar.html', 'Sozlamalar', 'settings']
  };
  var ST_CLS = ['p-red', 'p-amb', 'p-blue', 'p-ok', 'p-gray'], ST_IC = ['fiber_new', 'inventory_2', 'local_shipping', 'check_circle', 'block'];
  var LV_IC = { gold: 'workspace_premium', bronze: 'military_tech', silver: 'stars', oddiy: 'person' };
  var COL = { red: '#E60000', ink: '#17181D', ok: '#10B981', amb: '#F59E0B', blue: '#3B6FE0', gray: '#B9BCC6', violet: '#7C5CE0' };
  var WD = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

  function stPill(st) { return '<span class="pill sm ' + ST_CLS[st] + '"><span class="ms' + (st === 3 ? ' f' : '') + '">' + ST_IC[st] + '</span>' + EZ.STATUS[st] + '</span>'; }
  function payChip(p) { return p === 'Karta' ? '<span class="paychip card"><span class="ms">credit_card</span>Karta</span>' : '<span class="paychip cash"><span class="ms">payments</span>Naqd</span>'; }
  function lvBadge(k, sm) { return '<span class="lvl"' + ' style="background:' + EZ.levelColor(k) + (sm ? ';height:22px;font-size:11px;padding:0 9px 0 6px' : '') + '"><span class="ms f"' + (sm ? ' style="font-size:14px"' : '') + '>' + LV_IC[k] + '</span>' + EZ.LEVEL_NAMES[k] + '</span>'; }
  function ini(n) { return String(n).split(' ').map(function (x) { return x[0]; }).join('').slice(0, 2).toUpperCase(); }
  function toast(m, ic) { Sh.toast(m, ic); }
  function delta(cur, prev, inv) {
    if (!prev) return '<span class="delta" style="color:var(--mut-2)">—</span>';
    var p = (cur - prev) / prev * 100, up = p >= 0, good = inv ? !up : up;
    return '<span class="delta ' + (good ? 'up' : 'down') + '"><span class="ms">' + (up ? 'arrow_upward' : 'arrow_downward') + '</span>' + Math.abs(p).toFixed(1) + '%</span>';
  }
  function pct(a, b) { return b ? (a / b * 100) : 0; }
  function custOf(o) { if (o.ph) return { nm: o.nm, ph: o.ph }; var c = EZ.customers()[o.cid - 1]; return c ? { nm: c.nm, ph: c.ph } : { nm: o.nm, ph: '' }; }

  /* ---------- qobiq ---------- */
  function shell() {
    var isAn = /^an_/.test(PAGE), newCnt = S.orders.filter(function (o) { return o.st === 0; }).length;
    var link = function (k) { var n = NAV[k]; return '<a href="' + n[0] + '" class="' + (PAGE === k ? 'on' : '') + '"><span class="ms">' + n[2] + '</span>' + n[1] + (k === 'orders' && newCnt ? '<span class="badge num">' + newCnt + ' yangi</span>' : '') + '</a>'; };
    var anl = ['an_new', 'an_total', 'an_rev', 'an_cust', 'an_promo'].map(function (k) { return '<a href="' + NAV[k][0] + '" class="' + (PAGE === k ? 'on' : '') + '">' + NAV[k][2] + '</a>'; }).join('');
    var root = d.getElementById('adm');
    root.innerHTML = '<div class="adm-shell"><aside class="side" id="side" aria-label="Admin menyu">' +
      '<a class="logo" href="5-admin.html"><span class="logo-mark">E</span><span class="logo-txt"><b>EZOZ</b><small>ADMIN</small></span></a>' +
      '<div class="side-lbl">Asosiy</div><nav class="snav">' + link('dash') + link('orders') + link('products') + link('customers') + link('promos') +
      '<button class="grp' + (isAn ? ' open' : '') + '" id="grp-an" aria-expanded="' + isAn + '"><span class="ms">monitoring</span>Analitika<span class="ms chev">expand_more</span></button><div class="sub"><div>' + anl + '</div></div>' +
      link('settings') + '</nav>' +
      '<div class="side-foot"><div class="bot-st"><i></i>Telegram bot ulangan</div><div class="me"><span class="avatar">AR</span><div><b>Aziz Raximov</b><small>Super admin</small></div><a href="1-bosh-sahifa.html" title="Do\'konga o\'tish" aria-label="Do\'konga o\'tish"><span class="ms">storefront</span></a></div></div></aside>' +
      '<div class="scrim" id="scrim"></div><div class="adm-main"><header class="topbar"><button class="burger" id="burger" aria-label="Menyu"><span class="ms">menu</span></button>' +
      '<div class="tb-t"><small>' + (isAn ? 'Analitika<span class="ms">chevron_right</span>' + NAV[PAGE][2] : 'EZOZ Market') + '</small><h1>' + NAV[PAGE][1] + '</h1></div>' +
      '<div class="tb-r"><form class="tb-search" id="tb-search"><span class="ms">search</span><input placeholder="Buyurtma # yoki mijoz" aria-label="Qidirish"></form>' +
      '<a class="tb-ic" href="admin-buyurtmalar.html?st=0" aria-label="Yangi buyurtmalar"><span class="ms">notifications</span>' + (newCnt ? '<span class="dot num">' + newCnt + '</span>' : '') + '</a>' +
      '<a class="btn btn-red btn-sm" href="admin-promokodlar.html?new=1"><span class="ms">add</span><span class="t">Yangi promokod</span></a></div></header>' +
      '<div class="content" id="content"></div></div></div>';
    $('#grp-an').onclick = function () { this.classList.toggle('open'); this.setAttribute('aria-expanded', this.classList.contains('open')); };
    $('#burger').onclick = function () { d.body.classList.add('nav-open'); };
    $('#scrim').onclick = function () { d.body.classList.remove('nav-open'); };
    $('#tb-search').onsubmit = function (e) { e.preventDefault(); location.href = 'admin-buyurtmalar.html?q=' + encodeURIComponent($('input', this).value.trim()); };
  }

  /* ---------- sana oralig'i ---------- */
  if (!S.ar) S.ar = { k: '7', from: '', to: '' };
  function range() {
    var now = Date.now(), t0 = EZ.dayStart(now), a, b = now, k = S.ar.k;
    if (k === 'today') a = t0; else if (k === '30') a = t0 - 29 * EZ.D; else if (k === 'custom' && S.ar.from && S.ar.to) { a = new Date(S.ar.from + 'T00:00').getTime(); b = Math.min(now, new Date(S.ar.to + 'T23:59:59').getTime()); } else a = t0 - 6 * EZ.D;
    if (b < a) b = a + EZ.D - 1;
    return { a: a, b: b, pa: a - (b - a) - 1, pb: a - 1, hourly: b - a <= EZ.D };
  }
  function rangeBar() {
    var R = range(), k = S.ar.k;
    var lbl = R.hourly ? EZ.dayLabel(R.a) : EZ.dayLabel(R.a) + ' — ' + EZ.dayLabel(R.b);
    return '<div class="rangebar"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><div class="seg" role="group" aria-label="Davr">' +
      [['today', 'Bugun'], ['7', '7 kun'], ['30', '30 kun'], ['custom', '<span class="ms">date_range</span>Maxsus']].map(function (x) { return '<button data-r="' + x[0] + '" class="' + (k === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') +
      '</div><div class="custom' + (k === 'custom' ? ' on' : '') + '"><input type="date" id="r-from" value="' + (S.ar.from || EZ.isoDay(R.a)) + '" max="' + EZ.isoDay(Date.now()) + '"><span class="mut-s">—</span><input type="date" id="r-to" value="' + (S.ar.to || EZ.isoDay(R.b)) + '" max="' + EZ.isoDay(Date.now()) + '"><button class="btn btn-ink btn-sm" id="r-apply">Qo\'llash</button></div></div>' +
      '<span class="range-note">Davr: <b class="num">' + lbl + '</b> · oldingi davr bilan solishtiriladi</span></div>';
  }
  function wireRange(rerender) {
    $$('[data-r]').forEach(function (b) { b.onclick = function () { S.ar.k = b.getAttribute('data-r'); if (S.ar.k === 'custom' && !S.ar.from) { var R = range(); S.ar.from = EZ.isoDay(Date.now() - 13 * EZ.D); S.ar.to = EZ.isoDay(Date.now()); } EZ.save(); rerender(); }; });
    var ap = $('#r-apply'); if (ap) ap.onclick = function () { var f = $('#r-from').value, t = $('#r-to').value; if (!f || !t || f > t) { toast("Sanalarni to'g'ri tanlang", 'error'); return; } S.ar.from = f; S.ar.to = t; EZ.save(); rerender(); };
  }
  function buckets(R) {
    var out = [];
    if (R.hourly) { var t0 = EZ.dayStart(R.a); for (var h = 8; h < 23; h++) out.push({ a: t0 + h * EZ.H, b: t0 + (h + 1) * EZ.H - 1, l: (h < 10 ? '0' : '') + h + ':00', tl: EZ.dayLabel(t0) + ', ' + (h < 10 ? '0' : '') + h + ':00' }); }
    else for (var t = EZ.dayStart(R.a); t <= R.b; t += EZ.D) out.push({ a: t, b: t + EZ.D - 1, l: EZ.dayLabel(t), tl: WD[new Date(t).getDay()] + ', ' + EZ.dayLabel(t) });
    return out;
  }
  function inR(o, a, b) { return o.ts >= a && o.ts <= b; }
  function bucketize(list, B, fn) { var v = B.map(function () { return 0; }); list.forEach(function (o) { for (var i = 0; i < B.length; i++) if (o.ts >= B[i].a && o.ts <= B[i].b) { v[i] += fn ? fn(o) : 1; break; } }); return v; }

  /* ---------- eksport ---------- */
  function loadXLSX(cb) {
    if (w.XLSX) return cb(true);
    var s = d.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = function () { cb(!!w.XLSX); }; s.onerror = function () { cb(false); }; d.head.appendChild(s);
  }
  function exportExcel(name, cols, rows) {
    loadXLSX(function (ok) {
      if (ok) { var ws = w.XLSX.utils.aoa_to_sheet([cols].concat(rows)); ws['!cols'] = cols.map(function (c) { return { wch: Math.max(12, c.length + 4) }; }); var wb = w.XLSX.utils.book_new(); w.XLSX.utils.book_append_sheet(wb, ws, 'Hisobot'); w.XLSX.writeFile(wb, name + '.xlsx'); }
      else { var csv = '\ufeff' + [cols].concat(rows).map(function (r) { return r.map(function (c) { c = String(c == null ? '' : c); return /[";,\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(';'); }).join('\n'); var a = d.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = name + '.csv'; a.click(); }
      toast('Excel fayl yuklab olindi', 'download');
    });
  }
  function exportPDF(title, cols, rows) {
    var R = range(), win = w.open('', '_blank');
    if (!win) { toast("Brauzer yangi oynani blokladi", 'error'); return; }
    win.document.write('<!doctype html><html><head><meta charset="utf-8"><title>' + esc(title) + '</title><style>body{font:12px "Plus Jakarta Sans",system-ui,sans-serif;color:#17181D;margin:32px}h1{font-size:20px;margin:0 0 4px;letter-spacing:-.02em}p{color:#6B7080;margin:0 0 20px}table{width:100%;border-collapse:collapse}th{text-align:left;font-size:11px;color:#6B7080;border-bottom:2px solid #17181D;padding:8px 6px}td{padding:7px 6px;border-bottom:1px solid #eee}.b{display:flex;align-items:center;gap:10px;margin-bottom:20px}.m{width:30px;height:30px;border-radius:8px;background:#E60000;color:#fff;display:grid;place-items:center;font-weight:800}@page{margin:14mm}</style></head><body><div class="b"><span class="m">E</span><b>EZOZ MARKET</b></div><h1>' + esc(title) + '</h1><p>Davr: ' + EZ.dayLabel(R.a) + ' — ' + EZ.dayLabel(R.b) + ' · Tayyorlandi: ' + new Date().toLocaleString('ru-RU') + '</p><table><thead><tr>' + cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table><script>window.onload=function(){setTimeout(function(){window.print()},200)}<\/script></body></html>');
    win.document.close();
  }
  /* jadval paneli: T = {title, sub, cols:[{h,r}], rows:[[html...]], raw:[[text...]], per} */
  function tablePanel(id, T) {
    return '<section class="panel" id="' + id + '"><div class="panel-h"><div><h2>' + T.title + '</h2>' + (T.sub ? '<p>' + T.sub + '</p>' : '') + '</div><div class="export"><button class="btn btn-ghost btn-sm" data-x="xls"><span class="ms">table_view</span>Excel</button><button class="btn btn-ghost btn-sm" data-x="pdf"><span class="ms">picture_as_pdf</span>PDF</button></div></div><div class="panel-b" style="padding-bottom:0"><div class="tbl-wrap" data-tb></div></div><div class="tbl-foot" data-tf></div></section>';
  }
  function wireTable(id, T) {
    var el = d.getElementById(id), page = 1, per = T.per || 10;
    function draw() {
      var pages = Math.max(1, Math.ceil(T.rows.length / per)), sl = T.rows.slice((page - 1) * per, page * per);
      $('[data-tb]', el).innerHTML = '<table class="tbl"><thead><tr>' + T.cols.map(function (c) { return '<th' + (c.r ? ' class="r"' : '') + '>' + c.h + '</th>'; }).join('') + '</tr></thead><tbody>' + (sl.length ? sl.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (T.cols[i].r ? ' class="r num"' : '') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') : '<tr><td colspan="' + T.cols.length + '" style="text-align:center;color:var(--mut);padding:36px">Tanlangan davrda ma\'lumot yo\'q</td></tr>') + '</tbody></table>';
      var pg = '';
      if (pages > 1) { pg = '<div class="export"><button class="pg" data-p="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '') + ' aria-label="Oldingi"><span class="ms">chevron_left</span></button><span class="pg on num" style="min-width:64px">' + page + ' / ' + pages + '</span><button class="pg" data-p="' + (page + 1) + '"' + (page === pages ? ' disabled' : '') + ' aria-label="Keyingi"><span class="ms">chevron_right</span></button></div>'; }
      $('[data-tf]', el).innerHTML = '<span class="num">Jami: ' + fmtN(T.rows.length) + ' qator</span>' + pg;
      $$('[data-p]', el).forEach(function (b) { b.onclick = function () { page = +b.getAttribute('data-p'); draw(); }; });
    }
    $('[data-x=xls]', el).onclick = function () { exportExcel(T.file || id, T.cols.map(function (c) { return c.h; }), T.raw); };
    $('[data-x=pdf]', el).onclick = function () { exportPDF(T.title, T.cols.map(function (c) { return c.h; }), T.raw); };
    draw();
  }
  function kpi(ic, label, val, unit, dl, dark) { return '<div class="kpi' + (dark ? ' dark' : '') + '"><small><span class="ms">' + ic + '</span>' + label + '</small><b class="num">' + val + (unit ? '<em>' + unit + '</em>' : '') + '</b>' + (dl ? dl + '<span class="vs">oldingi davrga nisbatan</span>' : '') + '</div>'; }
  function panel(title, sub, body, extra) { return '<section class="panel"><div class="panel-h"><div><h2>' + title + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (extra || '') + '</div><div class="panel-b">' + body + '</div></section>'; }
  function legend(items) { return '<div class="legend">' + items.map(function (x) { return '<span><i class="' + (x.dash ? 'dash' : '') + '" style="background:' + x.c + '"></i>' + x.l + '</span>'; }).join('') + '</div>'; }

  /* ====================== BOSHQARUV PANELI ====================== */
  var selId = null, feedF = -1;
  function pageDash() {
    var all = EZ.allOrders(), now = Date.now(), t0 = EZ.dayStart(now), y0 = t0 - EZ.D, sinceMid = now - t0;
    var today = all.filter(function (o) { return o.ts >= t0; }), yest = all.filter(function (o) { return o.ts >= y0 && o.ts < y0 + sinceMid; });
    var rev = function (L) { return L.filter(function (o) { return o.st !== 4; }).reduce(function (s, o) { return s + o.t; }, 0); };
    var days = []; for (var i = 13; i >= 0; i--) days.push({ a: t0 - i * EZ.D, b: t0 - i * EZ.D + EZ.D - 1 });
    var dCnt = bucketize(all, days), dRev = bucketize(all.filter(function (o) { return o.st !== 4; }), days, function (o) { return o.t; });
    var cum = [], c0 = all.filter(function (o) { return o.ts < days[0].a; }).length; dCnt.forEach(function (v) { c0 += v; cum.push(c0); });
    var lastHour = all.filter(function (o) { return o.ts >= now - EZ.H; }).length, waiting = all.filter(function (o) { return o.st === 0; }).length;
    var html = '<div class="g-3">' +
      '<a class="stat" href="' + NAV.an_new[0] + '"><div class="stat-h"><span>Yangi buyurtmalar</span><span class="stat-ic"><span class="ms">add_shopping_cart</span></span></div><div class="stat-v"><b class="num">' + today.length + '</b><small>bugun</small></div>' + C.spark(dCnt, COL.red) + '<div class="stat-f"><span>' + delta(today.length, yest.length) + ' · oxirgi soatda <b class="num">' + lastHour + '</b> · kutmoqda <b class="num">' + waiting + '</b></span><span class="stat-go">Analitika<span class="ms">arrow_forward</span></span></div></a>' +
      '<a class="stat" href="' + NAV.an_total[0] + '"><div class="stat-h"><span>Jami buyurtmalar</span><span class="stat-ic"><span class="ms">receipt_long</span></span></div><div class="stat-v"><b class="num">' + fmtN(all.length) + '</b><small>barcha vaqt</small></div>' + C.spark(cum, COL.ink) + '<div class="stat-f"><span>Yakunlangan: <b class="num">' + pct(all.filter(function (o) { return o.st === 3; }).length, all.length).toFixed(1) + '%</b></span><span class="stat-go">Analitika<span class="ms">arrow_forward</span></span></div></a>' +
      '<a class="stat hero" href="' + NAV.an_rev[0] + '"><div class="stat-h"><span>Bugungi tushum</span><span class="stat-ic"><span class="ms">payments</span></span></div><div class="stat-v"><b class="num">' + fmtN(rev(today)) + '</b><small>so\'m</small></div>' + C.spark(dRev, '#FF5A4F') + '<div class="stat-f"><span>' + delta(rev(today), rev(yest)) + ' kechagi shu vaqtga nisbatan</span><span class="stat-go">Analitika<span class="ms">arrow_forward</span></span></div></a></div>' +
      '<div class="g-75"><section class="panel"><div class="panel-h"><div><h2>Buyurtmalar oqimi</h2><p>Saytdan kelgan jonli buyurtmalar · to\'lov faqat Naqd yoki Karta</p></div><div class="chipset" id="feed-f">' +
      [[-1, 'Barchasi'], [0, 'Yangi'], [1, 'Tayyorlanmoqda'], [2, "Yo'lda"], [3, 'Yetkazildi']].map(function (x) { return '<button class="chip' + (feedF === x[0] ? ' on' : '') + '" data-ff="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div></div><div class="feed" id="feed"></div></section>' +
      '<section class="panel det" id="det"></section></div>';
    $('#content').innerHTML = html;
    drawFeed();
    $$('[data-ff]').forEach(function (b) { b.onclick = function () { feedF = +b.getAttribute('data-ff'); $$('[data-ff]').forEach(function (x) { x.classList.toggle('on', x === b); }); drawFeed(); }; });
  }
  function liveSorted() { return S.orders.slice().sort(function (a, b) { return b.ts - a.ts; }); }
  function drawFeed() {
    var L = liveSorted().filter(function (o) { return feedF < 0 || o.st === feedF; });
    if (!selId || !S.orders.some(function (o) { return o.id === selId; })) selId = (liveSorted()[0] || {}).id;
    $('#feed').innerHTML = L.length ? L.map(function (o) {
      var mins = Math.round((Date.now() - o.ts) / 60e3);
      return '<button class="fi' + (o.id === selId ? ' on' : '') + '" data-oid="' + o.id + '"><span class="fi-n num">#' + o.id + '</span><span class="fi-t"><span class="top"><b>' + esc(o.nm) + '</b>' + stPill(o.st) + '</span><small class="num">' + esc(o.ph) + ' · ' + o.it.length + ' xil · ' + (mins < 60 ? mins + ' daq oldin' : EZ.dateLabel(o.ts)) + '</small></span><span class="fi-r"><b class="num">' + fmt(o.t) + '</b>' + payChip(o.pay) + '</span></button>';
    }).join('') : '<div class="empty" style="padding:30px"><p style="margin:0">Bu holatda buyurtma yo\'q</p></div>';
    $$('.fi').forEach(function (b) { b.onclick = function () { selId = +b.getAttribute('data-oid'); drawFeed(); if (w.innerWidth < 1100) $('#det').scrollIntoView({ behavior: 'smooth' }); }; });
    drawDetail($('#det'), S.orders.filter(function (o) { return o.id === selId; })[0]);
  }
  function drawDetail(el, o, onChange) {
    if (!el) return;
    if (!o) { el.innerHTML = '<div class="empty"><p>Buyurtmani tanlang</p></div>'; return; }
    var cu = custOf(o), isMe = o.mine || o.cid === 1, lv = isMe ? EZ.myLevel() : (o.lv || 'silver'), cnt = isMe ? EZ.myCount() : null, editable = !!S.orders.filter(function (x) { return x.id === o.id; })[0];
    var items = o.it.map(function (x) { var n = x.n || (EZ.product(x[0] || x.id) || {}).n, q = x.q || x[1], p = x.p || x[2]; return '<div><span><b style="font-weight:600">' + esc(n) + '</b><small class="num">' + q + ' dona × ' + fmt(p) + '</small></span><b class="num">' + fmt(p * q) + '</b></div>'; }).join('');
    var btns = [[1, 'inventory_2', 'Tayyorlanmoqda'], [2, 'local_shipping', "Yo'lda"], [3, 'check_circle', 'Yetkazildi'], [4, 'block', 'Bekor qilish']].map(function (b) {
      var dis = !editable || o.st >= 3 || (b[0] < 4 && b[0] <= o.st);
      return '<button data-st="' + b[0] + '" class="' + (o.st === b[0] ? 'cur ' : '') + (b[0] === 4 ? 'cxl' : '') + '"' + (dis && o.st !== b[0] ? ' disabled' : '') + '><span class="ms">' + b[1] + '</span>' + b[2] + '</button>';
    }).join('');
    el.innerHTML = '<div class="det-h"><div><h3 class="num">#' + o.id + ' ' + stPill(o.st) + '</h3><small class="num">' + EZ.dateLabel(o.ts) + (o.dist ? ' · ' + o.dist : '') + '</small></div>' + payChip(o.pay) + '</div>' +
      '<div class="det-b"><div class="det-sec"><h4>Mijoz</h4><div class="person" style="margin:0"><span class="avatar">' + ini(cu.nm) + '</span><div style="flex:1;min-width:0"><b>' + esc(cu.nm) + '</b><small class="num">' + esc(cu.ph) + (cnt ? ' · ' + cnt + '-buyurtma' : '') + '</small></div>' + lvBadge(lv, 1) + '</div>' + (o.ad ? '<p class="mut-s" style="margin:10px 0 0;display:flex;gap:6px"><span class="ms" style="font-size:18px;color:var(--red)">location_on</span>' + esc(o.ad) + '</p>' : '') + (o.note ? '<p class="mut-s" style="margin:6px 0 0;display:flex;gap:6px"><span class="ms" style="font-size:18px">chat</span>' + esc(o.note) + '</p>' : '') + '</div>' +
      '<div class="det-sec"><h4>Buyurtma tarkibi (' + o.it.length + ' xil)</h4><div class="det-items">' + items + '</div></div>' +
      '<dl class="rows"><div><dt>Mahsulotlar</dt><dd class="num">' + fmt(o.sub) + '</dd></div>' + (o.ds ? '<div class="neg"><dt>Promokod' + (o.code ? ' · ' + o.code : '') + '</dt><dd class="num">−' + fmt(o.ds) + '</dd></div>' : '') + '<div><dt>Yetkazib berish</dt><dd class="num">' + (o.dl ? fmt(o.dl) : 'Bepul') + '</dd></div><div class="tot"><dt>Jami</dt><dd class="num">' + fmt(o.t) + '</dd></div></dl>' +
      '<div class="det-sec"><h4>To\'lov</h4>' + (o.pay === 'Karta' ? '<span class="pill p-ok"><span class="ms f">verified</span>To\'langan (Karta)</span>' : '<span class="pill p-amb"><span class="ms">payments</span>Naqd — yetkazilganda to\'lanadi</span>') + '</div>' +
      '<div class="det-sec"><h4>Holatni o\'zgartirish' + (editable ? '' : ' · arxiv') + '</h4><div class="st-btns">' + btns + '</div></div></div>';
    $$('[data-st]', el).forEach(function (b) {
      b.onclick = function () {
        var live = S.orders.filter(function (x) { return x.id === o.id; })[0]; if (!live) return;
        var st = +b.getAttribute('data-st'); live.st = st; if (st === 4) live.reason = 'Admin bekor qildi'; EZ.save();
        toast('#' + o.id + ' — ' + EZ.STATUS[st]);
        if (onChange) onChange(live); else { shell(); render(); }
      };
    });
  }

  /* ====================== BUYURTMALAR ====================== */
  function pageOrders() {
    var u = new URLSearchParams(location.search), F = { st: u.get('st') !== null ? +u.get('st') : -1, q: u.get('q') || '', pay: '', page: 1 };
    var all = EZ.allOrders().slice().sort(function (a, b) { return b.ts - a.ts; });
    $('#content').innerHTML = '<section class="panel"><div class="toolbar"><div class="chipset" id="o-st">' + [[-1, 'Barchasi'], [0, 'Yangi'], [1, 'Tayyorlanmoqda'], [2, "Yo'lda"], [3, 'Yetkazildi'], [4, 'Bekor qilingan']].map(function (x) { return '<button class="chip" data-s="' + x[0] + '">' + x[1] + ' <span class="c num">' + fmtN(x[0] < 0 ? all.length : all.filter(function (o) { return o.st === x[0]; }).length) + '</span></button>'; }).join('') + '</div><span class="sp"></span>' +
      '<div class="sel-s"><select class="inp-s" id="o-pay" style="height:40px;width:150px"><option value="">Barcha to\'lov</option><option>Naqd</option><option>Karta</option></select><span class="ms">expand_more</span></div><div class="tb-search"><span class="ms">search</span><input id="o-q" placeholder="#, ism yoki telefon" value="' + esc(F.q) + '"></div></div>' +
      '<div class="panel-b"><div class="tbl-wrap" id="o-tb"></div></div><div class="tbl-foot" id="o-tf"></div></section>';
    function rows() { var q = F.q.toLowerCase().replace('#', ''); return all.filter(function (o) { if (F.st >= 0 && o.st !== F.st) return false; if (F.pay && o.pay !== F.pay) return false; if (!q) return true; var c = custOf(o); return (String(o.id) + ' ' + c.nm + ' ' + c.ph).toLowerCase().indexOf(q) >= 0; }); }
    function draw() {
      $$('[data-s]').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-s') === F.st); });
      var L = rows(), per = 14, pages = Math.max(1, Math.ceil(L.length / per)); if (F.page > pages) F.page = pages;
      $('#o-tb').innerHTML = '<table class="tbl"><thead><tr><th>Buyurtma</th><th>Sana</th><th>Mijoz</th><th>Tuman</th><th class="r">Mahsulot</th><th class="r">Summa</th><th>To\'lov</th><th>Holat</th><th></th></tr></thead><tbody>' +
        (L.slice((F.page - 1) * per, F.page * per).map(function (o) { var c = custOf(o); return '<tr><td class="strong num">#' + o.id + (o.live ? ' <span class="pill sm p-red" style="height:18px">jonli</span>' : '') + '</td><td class="num">' + EZ.dateLabel(o.ts) + '</td><td><div class="cell-u"><span class="avatar">' + ini(c.nm) + '</span><div><b style="font-weight:600">' + esc(c.nm) + '</b><small class="num">' + esc(c.ph) + '</small></div></div></td><td>' + esc(o.dist) + '</td><td class="r num">' + o.it.length + '</td><td class="r num strong">' + fmt(o.t) + '</td><td>' + payChip(o.pay) + '</td><td>' + stPill(o.st) + '</td><td class="r"><button class="btn btn-ghost btn-sm" data-view="' + o.id + '">Ko\'rish</button></td></tr>'; }).join('') || '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--mut)">Buyurtma topilmadi</td></tr>') + '</tbody></table>';
      $('#o-tf').innerHTML = '<span class="num">' + fmtN(L.length) + ' ta buyurtma</span><div class="export"><button class="pg" data-p="' + (F.page - 1) + '"' + (F.page === 1 ? ' disabled' : '') + '><span class="ms">chevron_left</span></button><span class="pg on num" style="min-width:80px">' + F.page + ' / ' + pages + '</span><button class="pg" data-p="' + (F.page + 1) + '"' + (F.page === pages ? ' disabled' : '') + '><span class="ms">chevron_right</span></button></div>';
      $$('#o-tf [data-p]').forEach(function (b) { b.onclick = function () { F.page = +b.getAttribute('data-p'); draw(); }; });
      $$('[data-view]').forEach(function (b) { b.onclick = function () { var id = +b.getAttribute('data-view'), o = all.filter(function (x) { return x.id === id && (x.live || !S.orders.some(function (y) { return y.id === id; })); })[0] || all.filter(function (x) { return x.id === id; })[0]; var live = S.orders.filter(function (x) { return x.id === id && o.live; })[0]; var m = Sh.modal('Buyurtma tafsilotlari', '<div class="panel det" id="m-det" style="box-shadow:none;border:0"></div>', { w: 520 }); drawDetail($('#m-det', m.el), live || o, function () { m.close(); all = EZ.allOrders().slice().sort(function (a, b) { return b.ts - a.ts; }); shell(); draw(); }); }; });
    }
    $$('[data-s]').forEach(function (b) { b.onclick = function () { F.st = +b.getAttribute('data-s'); F.page = 1; draw(); }; });
    $('#o-q').oninput = function () { F.q = this.value.trim(); F.page = 1; draw(); };
    $('#o-pay').onchange = function () { F.pay = this.value; F.page = 1; draw(); };
    draw();
  }

  /* ====================== MAHSULOTLAR ====================== */
  function pageProducts() {
    var F = { c: '', q: '' }, hist = EZ.history(), t30 = Date.now() - 30 * EZ.D, sold = {};
    hist.forEach(function (o) { if (o.ts >= t30 && o.st !== 4) o.it.forEach(function (x) { sold[x[0]] = (sold[x[0]] || 0) + x[1]; }); });
    var cats = EZ.CATS.filter(function (c) { return EZ.PRODUCTS.some(function (p) { return p.c === c.k; }); });
    $('#content').innerHTML = '<div class="g-4">' + kpi('inventory_2', 'Mahsulot turlari', EZ.PRODUCTS.length) + kpi('check_circle', 'Sotuvda', '<span id="k-on"></span>') + kpi('block', "Vaqtincha yo'q", '<span id="k-off"></span>') + kpi('trending_up', 'Eng ko\'p sotilgan (30 kun)', esc(EZ.product(+Object.keys(sold).sort(function (a, b) { return sold[b] - sold[a]; })[0]).n)) + '</div>' +
      '<section class="panel"><div class="toolbar"><div class="chipset">' + '<button class="chip on" data-c="">Barchasi</button>' + cats.map(function (c) { return '<button class="chip" data-c="' + c.k + '">' + c.uz + '</button>'; }).join('') + '</div><span class="sp"></span><div class="tb-search"><span class="ms">search</span><input id="p-q" placeholder="Mahsulot nomi"></div></div><div class="panel-b"><div class="tbl-wrap" id="p-tb"></div></div><div class="tbl-foot"><span>Narx va holat o\'zgarishlari do\'kon sahifasida darhol ko\'rinadi</span></div></section>';
    function draw() {
      var L = EZ.PRODUCTS.filter(function (p) { return (!F.c || p.c === F.c) && (!F.q || p.n.toLowerCase().indexOf(F.q) >= 0); });
      $('#k-on').textContent = EZ.PRODUCTS.filter(EZ.inStock).length; $('#k-off').textContent = EZ.PRODUCTS.filter(function (p) { return !EZ.inStock(p); }).length;
      $('#p-tb').innerHTML = '<table class="tbl"><thead><tr><th>Mahsulot</th><th>Bo\'lim</th><th class="r">Sotildi (30 kun)</th><th class="r">Narx, so\'m</th><th>Holat</th></tr></thead><tbody>' + L.map(function (p) {
        var on = EZ.inStock(p);
        return '<tr><td><div class="cell-u"><span class="thumb-s">' + Sh.thumb(p) + '</span><div><b style="font-weight:600">' + esc(p.n) + '</b><small>' + esc(p.d) + ' · ID ' + p.id + '</small></div></div></td><td>' + EZ.cat(p.c).uz + '</td><td class="r num">' + fmtN(sold[p.id] || 0) + ' dona</td><td class="r"><input class="price-in num" data-price="' + p.id + '" value="' + fmtN(EZ.price(p)) + '" inputmode="numeric" aria-label="Narx"></td><td><button class="tgl-w" data-stock="' + p.id + '"><span class="tgl' + (on ? ' on' : '') + '"></span>' + (on ? 'Sotuvda' : "Yo'q") + '</button></td></tr>';
      }).join('') + '</tbody></table>';
      $$('[data-price]').forEach(function (i) { i.onchange = function () { var id = +i.getAttribute('data-price'), v = parseInt(i.value.replace(/\D/g, ''), 10); if (!v || v < 100) { toast("Narxni to'g'ri kiriting", 'error'); i.value = fmtN(EZ.price(EZ.product(id))); return; } S.prod[id] = S.prod[id] || {}; S.prod[id].p = v; EZ.save(); i.value = fmtN(v); toast('Narx yangilandi: ' + fmt(v)); }; });
      $$('[data-stock]').forEach(function (b) { b.onclick = function () { var id = +b.getAttribute('data-stock'); S.prod[id] = S.prod[id] || {}; S.prod[id].off = !S.prod[id].off; EZ.save(); draw(); }; });
    }
    $$('[data-c]').forEach(function (b) { b.onclick = function () { F.c = b.getAttribute('data-c'); $$('[data-c]').forEach(function (x) { x.classList.toggle('on', x === b); }); draw(); }; });
    $('#p-q').oninput = function () { F.q = this.value.trim().toLowerCase(); draw(); };
    draw();
  }

  /* ====================== MIJOZLAR ====================== */
  function pageCustomers() {
    var F = { lv: '', q: '', page: 1 }, CU = EZ.customers();
    function counts() { var m = { oddiy: 0, silver: 0, bronze: 0, gold: 0 }; CU.forEach(function (c) { m[EZ.custLevel(c)]++; }); return m; }
    var asc = EZ.levelsAsc();
    $('#content').innerHTML = '<div class="g-4" id="c-k"></div><section class="panel"><div class="toolbar"><div class="chipset" id="c-lv"></div><span class="sp"></span><div class="tb-search"><span class="ms">search</span><input id="c-q" placeholder="Ism yoki telefon"></div></div><div class="panel-b"><div class="tbl-wrap" id="c-tb"></div></div><div class="tbl-foot" id="c-tf"></div></section>';
    function draw() {
      var m = counts();
      $('#c-k').innerHTML = kpi('group', 'Jami mijozlar', fmtN(CU.length), '', '', true) + asc.slice().reverse().map(function (k) { return kpi(LV_IC[k], EZ.LEVEL_NAMES[k] + ' (' + S.lv[k].min + '+ buyurtma)', fmtN(m[k]), 'mijoz'); }).join('');
      $('#c-lv').innerHTML = [['', 'Barchasi', CU.length], ['oddiy', 'Oddiy', m.oddiy]].concat(asc.map(function (k) { return [k, EZ.LEVEL_NAMES[k], m[k]]; })).map(function (x) { return '<button class="chip' + (F.lv === x[0] ? ' on' : '') + '" data-lv="' + x[0] + '">' + x[1] + ' <span class="c num">' + fmtN(x[2]) + '</span></button>'; }).join('');
      $$('[data-lv]').forEach(function (b) { b.onclick = function () { F.lv = b.getAttribute('data-lv'); F.page = 1; draw(); }; });
      var q = F.q.toLowerCase(), L = CU.filter(function (c) { return (!F.lv || EZ.custLevel(c) === F.lv) && (!q || (c.nm + ' ' + c.ph).toLowerCase().indexOf(q) >= 0); }).sort(function (a, b) { return EZ.custCount(b) - EZ.custCount(a) || a.id - b.id; });
      var me = L.filter(function (c) { return c.me; }); L = me.concat(L.filter(function (c) { return !c.me; }));
      var per = 15, pages = Math.max(1, Math.ceil(L.length / per)); if (F.page > pages) F.page = pages;
      $('#c-tb').innerHTML = '<table class="tbl"><thead><tr><th>Mijoz</th><th>Tuman</th><th class="r">Yakunlangan buyurtmalar</th><th class="r">Jami xarid</th><th>Daraja (avto)</th><th>Qo\'lda belgilash</th></tr></thead><tbody>' + L.slice((F.page - 1) * per, F.page * per).map(function (c) {
        var cnt = EZ.custCount(c), auto = EZ.levelFor(cnt), ov = S.ov[c.id] || 'auto', lv = EZ.custLevel(c);
        return '<tr><td><div class="cell-u"><span class="avatar"' + (c.me ? ' style="background:var(--red)"' : '') + '>' + ini(c.nm) + '</span><div><b style="font-weight:600">' + esc(c.nm) + (c.me ? ' <span class="pill sm p-red" style="height:18px">demo mijoz</span>' : '') + '</b><small class="num">' + esc(c.ph) + '</small></div></div></td><td>' + esc(c.dist) + '</td><td class="r num strong">' + cnt + '</td><td class="r num">' + fmt(cnt * (c.avg || 78000)) + '</td><td>' + lvBadge(lv, 1) + (ov !== 'auto' ? ' <small class="mut-s">qo\'lda · avto: ' + EZ.LEVEL_NAMES[auto] + '</small>' : '') + '</td>' +
          '<td><select class="ov-sel" data-ov="' + c.id + '"><option value="auto"' + (ov === 'auto' ? ' selected' : '') + '>Avtomatik</option>' + ['oddiy'].concat(asc).map(function (k) { return '<option value="' + k + '"' + (ov === k ? ' selected' : '') + '>' + EZ.LEVEL_NAMES[k] + '</option>'; }).join('') + '</select></td></tr>';
      }).join('') + '</tbody></table>';
      $('#c-tf').innerHTML = '<span class="num">' + fmtN(L.length) + ' ta mijoz · daraja yakunlangan buyurtmalar soniga qarab avtomatik beriladi</span><div class="export"><button class="pg" data-p="' + (F.page - 1) + '"' + (F.page === 1 ? ' disabled' : '') + '><span class="ms">chevron_left</span></button><span class="pg on num" style="min-width:80px">' + F.page + ' / ' + pages + '</span><button class="pg" data-p="' + (F.page + 1) + '"' + (F.page === pages ? ' disabled' : '') + '><span class="ms">chevron_right</span></button></div>';
      $$('#c-tf [data-p]').forEach(function (b) { b.onclick = function () { F.page = +b.getAttribute('data-p'); draw(); }; });
      $$('[data-ov]').forEach(function (s) { s.onchange = function () { var id = +s.getAttribute('data-ov'); if (s.value === 'auto') delete S.ov[id]; else S.ov[id] = s.value; EZ.save(); toast('Mijoz darajasi yangilandi'); draw(); }; });
    }
    $('#c-q').oninput = function () { F.q = this.value.trim(); F.page = 1; draw(); };
    draw();
  }

  /* ====================== PROMOKODLAR & AKSIYALAR ====================== */
  var ptab = 'codes', draftLv = null;
  var SWATCH = ['#8E9AAB', '#B0743F', '#C29A2E', '#E60000', '#17181D', '#10B981', '#3B6FE0', '#7C5CE0'];
  function lvlCards() {
    var CU = EZ.customers(), asc = EZ.levelsAsc();
    if (!draftLv) draftLv = JSON.parse(JSON.stringify(S.lv));
    var cnt = function (k) { var keys = ['silver', 'bronze', 'gold'].sort(function (a, b) { return draftLv[a].min - draftLv[b].min; }); return CU.filter(function (c) { var n = EZ.custCount(c), r = 'oddiy'; keys.forEach(function (x) { if (n >= draftLv[x].min) r = x; }); return r === k; }).length; };
    return '<section class="panel"><div class="panel-h"><div><h2>Loyallik darajalari</h2><p>Daraja mijozning yakunlangan buyurtmalari soniga qarab avtomatik beriladi. ' + draftLv[asc[0]].min + ' tadan kam buyurtma — «Oddiy mijoz», darajasiz.</p></div><div class="export"><button class="btn btn-ghost btn-sm" id="lv-reset">Bekor qilish</button><button class="btn btn-ink btn-sm" id="lv-save"><span class="ms">save</span>Saqlash</button></div></div><div class="panel-b"><div class="lv-cards">' +
      ['silver', 'bronze', 'gold'].sort(function (a, b) { return draftLv[a].min - draftLv[b].min; }).map(function (k) {
        var L = draftLv[k];
        return '<div class="lv-card" style="--c:' + L.color + '"><div class="lv-top"><span class="lv-ic"><span class="ms f">' + LV_IC[k] + '</span></span><div><b>' + EZ.LEVEL_NAMES[k] + '</b><small class="num">' + L.min + '+ yakunlangan buyurtma</small></div></div>' +
          '<div class="lv-f"><label>Buyurtmalar chegarasi</label><div class="num-in"><button data-lvstep="' + k + '" data-d="-1" aria-label="Kamaytirish"><span class="ms">remove</span></button><input type="number" min="1" max="999" value="' + L.min + '" data-lvmin="' + k + '" aria-label="' + EZ.LEVEL_NAMES[k] + ' chegarasi"><button data-lvstep="' + k + '" data-d="1" aria-label="Oshirish"><span class="ms">add</span></button></div></div>' +
          '<div class="lv-f"><label>Nishon rangi</label><div class="swatches">' + SWATCH.map(function (c) { return '<button class="sw' + (L.color.toLowerCase() === c.toLowerCase() ? ' on' : '') + '" style="--c:' + c + '" data-sw="' + k + '" data-c="' + c + '" aria-label="' + c + '"></button>'; }).join('') + '<label class="sw-in" title="Boshqa rang"><span class="ms">colorize</span><input type="color" value="' + L.color + '" data-swc="' + k + '"></label></div></div>' +
          '<div class="lv-n"><span>Shu darajadagi mijozlar</span><b class="num">' + fmtN(cnt(k)) + '</b></div></div>';
      }).join('') + '</div></div></section>';
  }
  function pagePromos() {
    var html = lvlCards() + '<div class="rangebar"><div class="ptabs"><button data-pt="codes" class="' + (ptab === 'codes' ? 'on' : '') + '"><span class="ms">confirmation_number</span>Promokodlar <span class="c num">' + S.promos.length + '</span></button><button data-pt="aks" class="' + (ptab === 'aks' ? 'on' : '') + '"><span class="ms">campaign</span>Aksiyalar <span class="c num">' + S.aks.length + '</span></button></div>' +
      (ptab === 'codes' ? '<button class="btn btn-red" id="new-code"><span class="ms">add</span>Yangi promokod</button>' : '<button class="btn btn-red" id="new-aks"><span class="ms">add</span>Yangi aksiya</button>') + '</div>' +
      (ptab === 'codes' ? codesTable() : aksGrid());
    $('#content').innerHTML = html;
    wireLevels(); wirePromos();
  }
  function wireLevels() {
    $$('[data-lvstep]').forEach(function (b) { b.onclick = function () { var k = b.getAttribute('data-lvstep'); draftLv[k].min = Math.max(1, Math.min(999, draftLv[k].min + +b.getAttribute('data-d'))); pagePromos(); }; });
    $$('[data-lvmin]').forEach(function (i) { i.onchange = function () { var k = i.getAttribute('data-lvmin'), v = parseInt(i.value, 10); if (v >= 1) draftLv[k].min = Math.min(999, v); pagePromos(); }; });
    $$('[data-sw]').forEach(function (b) { b.onclick = function () { draftLv[b.getAttribute('data-sw')].color = b.getAttribute('data-c'); pagePromos(); }; });
    $$('[data-swc]').forEach(function (i) { i.onchange = function () { draftLv[i.getAttribute('data-swc')].color = i.value; pagePromos(); }; });
    $('#lv-reset').onclick = function () { draftLv = null; pagePromos(); };
    $('#lv-save').onclick = function () {
      var m = [draftLv.silver.min, draftLv.bronze.min, draftLv.gold.min];
      if (m[0] === m[1] || m[1] === m[2] || m[0] === m[2]) { toast("Har bir daraja chegarasi har xil bo'lishi kerak", 'error'); return; }
      S.lv = JSON.parse(JSON.stringify(draftLv)); EZ.save(); toast('Darajalar saqlandi'); pagePromos();
    };
  }
  function codesTable() {
    var today = EZ.isoDay(Date.now());
    return '<section class="panel"><div class="panel-b"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kod</th><th>Chegirma</th><th>Ruxsat etilgan darajalar</th><th class="r">Min buyurtma</th><th>Foydalanish</th><th class="r">Har mijozga</th><th>Amal qilish muddati</th><th>Holat</th><th></th></tr></thead><tbody>' +
      S.promos.map(function (p, i) {
        var exp = p.e && p.e < today, used = p.lim ? pct(p.u, p.lim) : 0;
        return '<tr><td><span class="code-tag">' + esc(p.c) + '</span></td><td class="strong" style="color:var(--red)">' + (p.t === '%' ? p.v + '%' : fmt(p.v)) + '</td><td><div class="lvl-chips">' + EZ.levelsAsc().filter(function (k) { return p.l.indexOf(k) >= 0; }).map(function (k) { return lvBadge(k, 1); }).join('') + '</div></td><td class="r num">' + fmt(p.m) + '</td>' +
          '<td><div class="prog"><span class="num">' + fmtN(p.u) + ' / ' + (p.lim ? fmtN(p.lim) : '∞') + '</span>' + (p.lim ? '<span class="bar"><i style="width:' + used + '%"></i></span>' : '') + '</div></td><td class="r num">' + (p.pu ? p.pu + ' marta' : 'cheksiz') + '</td>' +
          '<td class="num">' + (p.s ? p.s.split('-').reverse().join('.') : '—') + ' — ' + (p.e ? p.e.split('-').reverse().join('.') : 'muddatsiz') + (exp ? ' <span class="pill sm p-gray">tugagan</span>' : '') + '</td>' +
          '<td><button class="tgl-w" data-ptog="' + i + '" aria-label="Holat"><span class="tgl' + (p.on ? ' on' : '') + '"></span>' + (p.on ? 'Faol' : 'Nofaol') + '</button></td><td class="r"><span class="row-act"><button data-ped="' + i + '" aria-label="Tahrirlash"><span class="ms">edit</span></button><button class="del" data-pdel="' + i + '" aria-label="O\'chirish"><span class="ms">delete</span></button></span></td></tr>';
      }).join('') + '</tbody></table></div></div><div class="tbl-foot"><span>Mijoz promokodni savatda kiritganda uning darajasi tekshiriladi. Mos kelmasa: «Bu promokod faqat … darajadagi mijozlar uchun».</span></div></section>';
  }
  function aksGrid() {
    var today = EZ.isoDay(Date.now());
    return '<div class="aks-grid">' + S.aks.map(function (a, i) {
      var live = a.on && (!a.s || a.s <= today) && (!a.e || a.e >= today), c = a.cat ? EZ.cat(a.cat) : null;
      return '<article class="aks"><div class="aks-img" style="background-image:url(\'' + a.img + '\')">' + (a.disc ? '<span class="pill p-red disc num">−' + a.disc + '%</span>' : '<span class="pill p-ink disc">Bepul yetkazish</span>') + '<span class="pill st ' + (live ? 'p-ok' : 'p-gray') + '">' + (live ? 'Faol' : a.on ? 'Rejalashtirilgan' : 'Nofaol') + '</span></div>' +
        '<div class="aks-b"><h3>' + esc(a.title) + '</h3><p>' + esc(a.sub) + '</p><div class="aks-meta"><span class="ms">category</span>' + (c ? c.uz : 'Barcha mahsulotlar') + '</div><div class="aks-meta"><span class="ms">event</span><span class="num">' + a.s.split('-').reverse().join('.') + ' — ' + a.e.split('-').reverse().join('.') + '</span></div><div class="lvl-chips">' + EZ.levelsAsc().filter(function (k) { return a.l.indexOf(k) >= 0; }).map(function (k) { return lvBadge(k, 1); }).join('') + '</div>' +
        '<div class="aks-f"><button class="tgl-w" data-atog="' + i + '"><span class="tgl' + (a.on ? ' on' : '') + '"></span>' + (a.on ? 'Yoqilgan' : "O'chirilgan") + '</button><span class="row-act"><button data-aed="' + i + '" aria-label="Tahrirlash"><span class="ms">edit</span></button><button class="del" data-adel="' + i + '" aria-label="O\'chirish"><span class="ms">delete</span></button></span></div></div></article>';
    }).join('') + '<button class="aks add" id="new-aks2"><span class="ms">add</span>Yangi aksiya qo\'shish</button></div><p class="mut-s" style="margin:0">Aksiyani faqat tanlangan darajadagi mijozlar ko\'radi (bosh sahifadagi promo kartalar va «Buyurtmalarim» sahifasi).</p>';
  }
  function wirePromos() {
    $$('[data-pt]').forEach(function (b) { b.onclick = function () { ptab = b.getAttribute('data-pt'); pagePromos(); }; });
    var nc = $('#new-code'); if (nc) nc.onclick = function () { promoModal(-1); };
    ['#new-aks', '#new-aks2'].forEach(function (s) { var b = $(s); if (b) b.onclick = function () { aksModal(-1); }; });
    $$('[data-ptog]').forEach(function (b) { b.onclick = function () { var p = S.promos[+b.getAttribute('data-ptog')]; p.on = p.on ? 0 : 1; EZ.save(); pagePromos(); toast(p.c + (p.on ? ' faollashtirildi' : ' o\'chirildi')); }; });
    $$('[data-ped]').forEach(function (b) { b.onclick = function () { promoModal(+b.getAttribute('data-ped')); }; });
    $$('[data-pdel]').forEach(function (b) { b.onclick = function () { var i = +b.getAttribute('data-pdel'); confirmBox(S.promos[i].c + " promokodini o'chirasizmi?", function () { S.promos.splice(i, 1); EZ.save(); pagePromos(); toast("Promokod o'chirildi"); }); }; });
    $$('[data-atog]').forEach(function (b) { b.onclick = function () { var a = S.aks[+b.getAttribute('data-atog')]; a.on = a.on ? 0 : 1; EZ.save(); pagePromos(); }; });
    $$('[data-aed]').forEach(function (b) { b.onclick = function () { aksModal(+b.getAttribute('data-aed')); }; });
    $$('[data-adel]').forEach(function (b) { b.onclick = function () { var i = +b.getAttribute('data-adel'); confirmBox("«" + S.aks[i].title + "» aksiyasini o'chirasizmi?", function () { S.aks.splice(i, 1); EZ.save(); pagePromos(); toast("Aksiya o'chirildi"); }); }; });
  }
  function confirmBox(q, yes) {
    var m = Sh.modal('Tasdiqlang', '<p class="lead" style="margin:0">' + esc(q) + '</p><div class="mf"><button class="btn btn-ghost" data-x>Bekor qilish</button><button class="btn btn-red" id="cf-y">O\'chirish</button></div>', { w: 440 });
    $('#cf-y', m.el).onclick = function () { m.close(); yes(); };
  }
  function lvlPick(sel) { return '<div class="lvl-pick" id="f-lv">' + EZ.levelsAsc().map(function (k) { return '<button type="button" data-k="' + k + '" class="' + (sel.indexOf(k) >= 0 ? 'on' : '') + '" style="--c:' + S.lv[k].color + '"><i><span class="ms">check</span></i>' + EZ.LEVEL_NAMES[k] + ' <small class="mut-s num">' + S.lv[k].min + '+</small></button>'; }).join('') + '</div>'; }
  function wirePick(el) { $$('#f-lv button', el).forEach(function (b) { b.onclick = function () { b.classList.toggle('on'); }; }); }
  function picked(el) { return $$('#f-lv button.on', el).map(function (b) { return b.getAttribute('data-k'); }); }
  function promoModal(i) {
    var p = i >= 0 ? S.promos[i] : { c: '', t: '%', v: 10, l: ['gold'], m: 50000, pu: 1, lim: 500, u: 0, s: EZ.isoDay(Date.now()), e: EZ.isoDay(Date.now() + 30 * EZ.D), on: 1 }, type = p.t;
    var m = Sh.modal(i >= 0 ? 'Promokodni tahrirlash' : 'Yangi promokod',
      '<div class="fgrid"><div class="field full"><label for="f-c">Promokod</label><div class="combo"><input class="inp-s code" id="f-c" maxlength="16" value="' + esc(p.c) + '" placeholder="MASALAN: GOLD20"><button type="button" class="btn btn-soft btn-sm" id="f-gen" style="height:46px"><span class="ms">casino</span>Yaratish</button></div><div class="form-err" id="e-c"></div></div>' +
      '<div class="field"><label>Chegirma turi</label><div class="seg" id="f-t"><button type="button" data-t="%" class="' + (type === '%' ? 'on' : '') + '">Foiz, %</button><button type="button" data-t="sum" class="' + (type === 'sum' ? 'on' : '') + '">Qat\'iy, so\'m</button></div></div>' +
      '<div class="field"><label for="f-v">Qiymat</label><input class="inp-s num" id="f-v" inputmode="numeric" value="' + p.v + '"><div class="form-err" id="e-v"></div></div>' +
      '<div class="field full"><label>Ruxsat etilgan darajalar</label>' + lvlPick(p.l) + '<div class="hint">Faqat tanlangan darajadagi mijozlar kodni qo\'llay oladi.</div><div class="form-err" id="e-l"></div></div>' +
      '<div class="field"><label for="f-m">Minimal buyurtma, so\'m</label><input class="inp-s num" id="f-m" inputmode="numeric" value="' + p.m + '"></div>' +
      '<div class="field"><label for="f-pu">Har bir mijozga limit</label><input class="inp-s num" id="f-pu" inputmode="numeric" value="' + (p.pu || '') + '" placeholder="Cheksiz"></div>' +
      '<div class="field"><label for="f-lim">Umumiy limit</label><input class="inp-s num" id="f-lim" inputmode="numeric" value="' + (p.lim || '') + '" placeholder="Cheksiz"></div>' +
      '<div class="field"><label>Holat</label><button type="button" class="tgl-w" id="f-on" style="height:46px"><span class="tgl' + (p.on ? ' on' : '') + '"></span><span>' + (p.on ? 'Faol' : 'Nofaol') + '</span></button></div>' +
      '<div class="field"><label for="f-s">Boshlanish sanasi</label><input class="inp-s" type="date" id="f-s" value="' + (p.s || '') + '"></div>' +
      '<div class="field"><label for="f-e">Tugash sanasi</label><input class="inp-s" type="date" id="f-e" value="' + (p.e || '') + '"><div class="hint">Bo\'sh qoldirilsa — muddatsiz</div></div></div>' +
      '<div class="mf"><button class="btn btn-ghost" data-x>Bekor qilish</button><button class="btn btn-red" id="f-save"><span class="ms">check</span>' + (i >= 0 ? 'Saqlash' : 'Promokod yaratish') + '</button></div>', { w: 640 });
    var el = m.el, on = !!p.on;
    wirePick(el);
    $$('#f-t button', el).forEach(function (b) { b.onclick = function () { type = b.getAttribute('data-t'); $$('#f-t button', el).forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
    $('#f-on', el).onclick = function () { on = !on; $('.tgl', this).classList.toggle('on', on); $('span:last-child', this).textContent = on ? 'Faol' : 'Nofaol'; };
    $('#f-gen', el).onclick = function () { var L = picked(el), base = (L[L.length - 1] || 'EZOZ').toUpperCase(); $('#f-c', el).value = base + (Math.floor(Math.random() * 90) + 10); };
    $('#f-c', el).oninput = function () { this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); };
    $('#f-save', el).onclick = function () {
      var code = $('#f-c', el).value.trim(), v = parseInt($('#f-v', el).value.replace(/\D/g, ''), 10) || 0, L = picked(el), ok = true;
      $$('.form-err', el).forEach(function (e) { e.textContent = ''; });
      if (!/^[A-Z0-9]{3,16}$/.test(code)) { $('#e-c', el).textContent = '3–16 ta lotin harfi yoki raqam'; ok = false; }
      else if (S.promos.some(function (x, j) { return x.c === code && j !== i; })) { $('#e-c', el).textContent = 'Bunday kod allaqachon mavjud'; ok = false; }
      if (!v || (type === '%' && v > 90)) { $('#e-v', el).textContent = type === '%' ? '1% dan 90% gacha' : 'Qiymatni kiriting'; ok = false; }
      if (!L.length) { $('#e-l', el).textContent = 'Kamida bitta darajani tanlang'; ok = false; }
      var s = $('#f-s', el).value, e = $('#f-e', el).value;
      if (s && e && e < s) { toast('Tugash sanasi boshlanishdan oldin bo\'lmasin', 'error'); ok = false; }
      if (!ok) return;
      var np = { c: code, t: type, v: v, l: L, m: parseInt($('#f-m', el).value.replace(/\D/g, ''), 10) || 0, pu: parseInt($('#f-pu', el).value, 10) || 0, lim: parseInt($('#f-lim', el).value.replace(/\D/g, ''), 10) || 0, u: p.u || 0, s: s, e: e, on: on ? 1 : 0 };
      if (i >= 0) S.promos[i] = np; else S.promos.unshift(np);
      EZ.save(); m.close(); ptab = 'codes'; pagePromos(); toast(i >= 0 ? 'Promokod saqlandi' : 'Promokod yaratildi: ' + code);
    };
    setTimeout(function () { $('#f-c', el).focus(); }, 50);
  }
  function aksModal(i) {
    var imgs = [EZ.IMG.dairy, EZ.IMG.fruit, EZ.IMG.basket, EZ.IMG.beef, EZ.IMG.tea, EZ.IMG.choco, EZ.IMG.rice, EZ.IMG.banana];
    var a = i >= 0 ? S.aks[i] : { title: '', sub: '', disc: 10, cat: '', img: imgs[0], l: ['silver', 'bronze', 'gold'], s: EZ.isoDay(Date.now()), e: EZ.isoDay(Date.now() + 14 * EZ.D), on: 1 }, img = a.img;
    var m = Sh.modal(i >= 0 ? 'Aksiyani tahrirlash' : 'Yangi aksiya',
      '<div class="fgrid"><div class="field full"><label>Banner rasmi</label><div class="img-pick">' + imgs.map(function (u) { return '<button type="button" data-img="' + u + '" style="background-image:url(\'' + u + '\')" class="' + (u === img ? 'on' : '') + '" aria-label="Rasm"></button>'; }).join('') + '</div></div>' +
      '<div class="field full"><label for="a-t">Sarlavha</label><input class="inp-s" id="a-t" value="' + esc(a.title) + '" placeholder="Masalan: Sut mahsulotlariga −25%"><div class="form-err" id="e-t"></div></div>' +
      '<div class="field full"><label for="a-s">Qisqa tavsif</label><input class="inp-s" id="a-s" value="' + esc(a.sub) + '"></div>' +
      '<div class="field"><label for="a-d">Chegirma, %</label><input class="inp-s num" id="a-d" inputmode="numeric" value="' + a.disc + '"><div class="hint">0 — bepul yetkazish aksiyasi</div></div>' +
      '<div class="field"><label for="a-c">Mahsulotlar / bo\'lim</label><div class="sel-s"><select class="inp-s" id="a-c"><option value="">Barcha mahsulotlar</option>' + EZ.CATS.map(function (c) { return '<option value="' + c.k + '"' + (a.cat === c.k ? ' selected' : '') + '>' + c.uz + '</option>'; }).join('') + '</select><span class="ms">expand_more</span></div></div>' +
      '<div class="field full"><label>Kimlar ko\'radi — darajalar</label>' + lvlPick(a.l) + '<div class="form-err" id="e-l"></div></div>' +
      '<div class="field"><label for="a-from">Boshlanish</label><input class="inp-s" type="date" id="a-from" value="' + a.s + '"></div><div class="field"><label for="a-to">Tugash</label><input class="inp-s" type="date" id="a-to" value="' + a.e + '"></div></div>' +
      '<div class="mf"><button class="btn btn-ghost" data-x>Bekor qilish</button><button class="btn btn-red" id="a-save"><span class="ms">check</span>Saqlash</button></div>', { w: 640 });
    var el = m.el; wirePick(el);
    $$('[data-img]', el).forEach(function (b) { b.onclick = function () { img = b.getAttribute('data-img'); $$('[data-img]', el).forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
    $('#a-save', el).onclick = function () {
      var t = $('#a-t', el).value.trim(), L = picked(el), s = $('#a-from', el).value, e = $('#a-to', el).value, ok = true;
      $$('.form-err', el).forEach(function (x) { x.textContent = ''; });
      if (t.length < 3) { $('#e-t', el).textContent = 'Sarlavhani kiriting'; ok = false; }
      if (!L.length) { $('#e-l', el).textContent = 'Kamida bitta darajani tanlang'; ok = false; }
      if (!s || !e || e < s) { toast("Sanalarni to'g'ri tanlang", 'error'); ok = false; }
      if (!ok) return;
      var na = { id: i >= 0 ? a.id : Date.now(), title: t, sub: $('#a-s', el).value.trim(), disc: Math.min(90, parseInt($('#a-d', el).value, 10) || 0), cat: $('#a-c', el).value, img: img, l: L, s: s, e: e, on: i >= 0 ? a.on : 1 };
      if (i >= 0) S.aks[i] = na; else S.aks.unshift(na);
      EZ.save(); m.close(); ptab = 'aks'; pagePromos(); toast('Aksiya saqlandi');
    };
  }

  /* ====================== SOZLAMALAR ====================== */
  function pageSettings() {
    var st = S.settings;
    $('#content').innerHTML = panel("Do'kon sozlamalari", "Bu qiymatlar mijoz sahifalarida darhol qo'llanadi",
      '<div class="set-row"><div><b>Call-markaz telefoni</b><small>Header va savat sahifasida</small></div><input class="inp-s" id="s-ph" value="' + esc(st.phone) + '"></div>' +
      '<div class="set-row"><div><b>Ish vaqti</b><small>Masalan: 08:00 – 23:00</small></div><input class="inp-s" id="s-h" value="' + esc(st.hours) + '"></div>' +
      '<div class="set-row"><div><b>Yetkazib berish narxi</b><small>so\'m</small></div><input class="inp-s num" id="s-fee" inputmode="numeric" value="' + st.fee + '"></div>' +
      '<div class="set-row"><div><b>Bepul yetkazish chegarasi</b><small>Shu summadan boshlab bepul</small></div><input class="inp-s num" id="s-free" inputmode="numeric" value="' + st.free + '"></div>' +
      '<div class="set-row"><div><b>To\'lov usullari</b><small>Tizimda faqat ikkita usul</small></div><div class="chipset"><span class="paychip cash" style="height:32px;padding:0 12px">' + '<span class="ms">payments</span>Naqd pul — kuryerga</span><span class="paychip card" style="height:32px;padding:0 12px"><span class="ms">credit_card</span>Karta orqali — onlayn</span></div></div>' +
      '<div class="mf" style="border:0;padding-top:6px"><button class="btn btn-red" id="s-save"><span class="ms">save</span>Saqlash</button></div>') +
      panel('Demo ma\'lumotlar', 'Brauzerda saqlangan savat, buyurtmalar, promokod va daraja sozlamalari',
        '<div class="warn-box"><span class="ms">info</span><span>Tiklash barcha o\'zgarishlarni o\'chirib, boshlang\'ich namunaviy ma\'lumotlarni qaytaradi.</span></div><div class="mf" style="border:0;padding-top:16px"><button class="btn btn-ghost" id="s-reset"><span class="ms">restart_alt</span>Boshlang\'ich holatga qaytarish</button></div>');
    $('#s-save').onclick = function () {
      var fee = parseInt($('#s-fee').value.replace(/\D/g, ''), 10), free = parseInt($('#s-free').value.replace(/\D/g, ''), 10);
      if (isNaN(fee) || isNaN(free)) { toast("Raqamlarni to'g'ri kiriting", 'error'); return; }
      st.phone = $('#s-ph').value.trim() || st.phone; st.hours = $('#s-h').value.trim() || st.hours; st.fee = fee; st.free = free; EZ.save(); toast('Sozlamalar saqlandi');
    };
    $('#s-reset').onclick = function () { confirmBox('Barcha demo ma\'lumotlar tiklansinmi?', function () { EZ.reset(); location.reload(); }); };
  }

  w.Admin = { $: $, $$: $$, range: range, rangeBar: rangeBar, wireRange: wireRange, buckets: buckets, bucketize: bucketize, inR: inR, kpi: kpi, panel: panel, legend: legend, tablePanel: tablePanel, wireTable: wireTable, delta: delta, pct: pct, stPill: stPill, payChip: payChip, lvBadge: lvBadge, ini: ini, custOf: custOf, COL: COL, WD: WD, LV_IC: LV_IC, NAV: NAV };

  var PAGES = { dash: pageDash, orders: pageOrders, products: pageProducts, customers: pageCustomers, promos: pagePromos, settings: pageSettings };
  function render() { var fn = PAGES[PAGE] || (w.AdminAnalytics && w.AdminAnalytics[PAGE]); if (fn) fn(); }
  function boot() {
    d.body.classList.add('adm');
    shell(); render();
    if (PAGE === 'promos' && /new=1/.test(location.search)) { ptab = 'codes'; promoModal(-1); history.replaceState(null, '', location.pathname); }
    var rt; w.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (/^an_/.test(PAGE)) render(); }, 200); });
    w.addEventListener('storage', function (e) {
      if (e.key !== 'ezoz_v6' || !e.newValue) return;
      var nv = JSON.parse(e.newValue), had = S.orders.length; for (var k in nv) S[k] = nv[k];
      shell(); render();
      if (S.orders.length > had) toast('Yangi buyurtma #' + S.orders[0].id + ' — ' + fmt(S.orders[0].t), 'notifications_active');
    });
  }
  w.Admin.boot = boot; w.Admin.render = render;
})(window, document);
