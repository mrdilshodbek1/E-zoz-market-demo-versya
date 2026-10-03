/* EZOZ MARKET — Analitika sahifalari (har biri alohida sahifa) */
(function (w, d) {
  'use strict';
  var EZ = w.EZ, S = EZ.S(), C = w.Charts, A = w.Admin, $ = A.$, fmt = EZ.fmt, fmtN = EZ.fmtN, esc = EZ.esc, COL = A.COL;
  function rev(L) { return L.reduce(function (s, o) { return s + (o.st === 4 ? 0 : o.t); }, 0); }
  function sliceR(all, R) { return { cur: all.filter(function (o) { return A.inR(o, R.a, R.b); }), prev: all.filter(function (o) { return A.inR(o, R.pa, R.pb); }) }; }
  function base(fn) { return function () { var R = A.range(), all = EZ.allOrders(), X = sliceR(all, R), B = A.buckets(R); fn(R, all, X.cur, X.prev, B); A.wireRange(w.Admin.render); }; }
  function mount(html) { $('#content').innerHTML = A.rangeBar() + html; }
  function per(R) { return R.hourly ? 'soat' : 'kun'; }

  /* 1. YANGI BUYURTMALAR */
  var an_new = base(function (R, all, cur, prev, B) {
    var waiting = all.filter(function (o) { return o.st === 0; }).length;
    var hrs = new Array(15).fill(0); cur.forEach(function (o) { var h = new Date(o.ts).getHours(); if (h >= 8 && h < 23) hrs[h - 8]++; });
    var pk = hrs.indexOf(Math.max.apply(null, hrs)) + 8;
    var series = A.bucketize(cur, B), pseries = A.bucketize(prev.map(function (o) { return { ts: o.ts + (R.a - R.pa) }; }), B);
    var hmSrc = R.b - R.a < 7 * EZ.D ? all.filter(function (o) { return o.ts >= EZ.dayStart(Date.now()) - 27 * EZ.D; }) : cur;
    var hm = [1, 2, 3, 4, 5, 6, 0].map(function () { return new Array(15).fill(0); });
    hmSrc.forEach(function (o) { var t = new Date(o.ts), h = t.getHours(), wd = (t.getDay() + 6) % 7; if (h >= 8 && h < 23) hm[wd][h - 8]++; });
    var byD = {}; cur.forEach(function (o) { byD[o.dist] = (byD[o.dist] || 0) + 1; });
    var dist = Object.keys(byD).sort(function (a, b) { return byD[b] - byD[a]; }).map(function (k, i) { return { l: k, v: byD[k], txt: fmtN(byD[k]) + '<small>' + A.pct(byD[k], cur.length).toFixed(0) + '%</small>', c: i ? '#F3A3A0' : COL.red }; });
    var rows = cur.slice().sort(function (a, b) { return b.ts - a.ts; });
    var T = { title: 'Yangi buyurtmalar ro\'yxati', sub: 'Tanlangan davrda kelgan buyurtmalar', file: 'yangi-buyurtmalar', per: 10, cols: [{ h: 'Buyurtma' }, { h: 'Vaqt' }, { h: 'Mijoz' }, { h: 'Tuman' }, { h: 'Mahsulotlar', r: 1 }, { h: 'Summa', r: 1 }, { h: "To'lov" }, { h: 'Holat' }],
      rows: rows.map(function (o) { var c = A.custOf(o); return ['<b class="num">#' + o.id + '</b>', EZ.dateLabel(o.ts), esc(c.nm), esc(o.dist), o.it.length, '<b>' + fmt(o.t) + '</b>', A.payChip(o.pay), A.stPill(o.st)]; }),
      raw: rows.map(function (o) { var c = A.custOf(o); return [o.id, EZ.dateLabel(o.ts), c.nm, o.dist, o.it.length, o.t, o.pay, EZ.STATUS[o.st]]; }) };
    mount('<div class="g-4">' + A.kpi('add_shopping_cart', 'Yangi buyurtmalar', fmtN(cur.length), 'ta', A.delta(cur.length, prev.length), true) + A.kpi('hourglass_top', 'Hozir javob kutmoqda', waiting, 'ta') + A.kpi('speed', "O'rtacha har " + per(R) + 'da', (cur.length / B.length).toFixed(1), 'ta', A.delta(cur.length / B.length, prev.length / B.length)) + A.kpi('local_fire_department', "Eng qizg'in soat", (pk < 10 ? '0' : '') + pk + ':00', '— ' + hrs[pk - 8] + ' ta') + '</div>' +
      A.panel('Yangi buyurtmalar dinamikasi', R.hourly ? 'Soatbay, 08:00 – 23:00' : 'Kunlik', '<div class="chart" id="ch1"></div>', A.legend([{ l: 'Joriy davr', c: COL.red }, { l: 'Oldingi davr', c: '#B9BCC6', dash: 1 }])) +
      '<div class="g-11">' + A.panel("Eng qizg'in soatlar", R.b - R.a < 7 * EZ.D ? 'Hafta kuni × soat, oxirgi 4 hafta' : 'Hafta kuni × soat, tanlangan davr', '<div id="ch2"></div>') + A.panel('Tumanlar bo\'yicha buyurtmalar', 'Toshkent shahri', '<div id="ch3"></div>') + '</div>' + A.tablePanel('tb', T));
    C.line($('#ch1'), { labels: B.map(function (b) { return b.l; }), tipLabels: B.map(function (b) { return b.tl; }), series: [{ name: 'Joriy', data: series, color: COL.red }, { name: 'Oldingi', data: pseries, color: '#B9BCC6', dash: 1 }], fmt: function (v) { return v + ' ta'; } });
    C.heat($('#ch2'), hm, ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak']);
    C.hbars($('#ch3'), dist);
    A.wireTable('tb', T);
  });

  /* 2. JAMI BUYURTMALAR */
  var an_total = base(function (R, all, cur, prev, B) {
    var stage = function (o) { return o.st === 4 ? o.id % 3 : o.st; };
    var n = cur.length, done = cur.filter(function (o) { return o.st === 3; }), cx = cur.filter(function (o) { return o.st === 4; });
    var pdone = prev.filter(function (o) { return o.st === 3; }), pcx = prev.filter(function (o) { return o.st === 4; });
    var avg = function (L) { return L.length ? L.reduce(function (s, o) { return s + (o.mins || 0); }, 0) / L.length : 0; };
    var reach = function (k) { return cur.filter(function (o) { return o.st !== 4 ? o.st >= k : stage(o) >= k; }).length; };
    var steps = [{ l: 'Yangi', ic: 'fiber_new', v: n, c: COL.ink }, { l: 'Tayyorlanmoqda', ic: 'inventory_2', v: reach(1), c: '#3A3D47' }, { l: "Yo'lda", ic: 'local_shipping', v: reach(2), c: COL.amb }, { l: 'Yetkazildi', ic: 'check_circle', v: done.length, c: COL.ok }, { l: 'Bekor qilingan', ic: 'block', v: cx.length, c: COL.red, cls: 'cancel' }];
    var rs = {}; cx.forEach(function (o) { rs[o.reason] = (rs[o.reason] || 0) + 1; });
    var reasons = Object.keys(rs).sort(function (a, b) { return rs[b] - rs[a]; }).map(function (k) { return { l: k, v: rs[k], txt: rs[k] + '<small>' + A.pct(rs[k], cx.length).toFixed(0) + '%</small>', c: COL.red }; });
    var sDone = A.bucketize(done, B), sCx = A.bucketize(cx, B), sAct = A.bucketize(cur.filter(function (o) { return o.st < 3; }), B);
    var dRows = B.map(function (b, i) { var L = cur.filter(function (o) { return o.ts >= b.a && o.ts <= b.b; }), dn = L.filter(function (o) { return o.st === 3; }); return [b.tl, L.length, dn.length, sCx[i], A.pct(dn.length, L.length).toFixed(1) + '%', Math.round(avg(dn)) + ' daq']; }).reverse();
    var T = { title: (R.hourly ? 'Soatbay' : 'Kunlik') + ' buyurtmalar hisoboti', file: 'jami-buyurtmalar', per: 10, cols: [{ h: R.hourly ? 'Soat' : 'Sana' }, { h: 'Jami', r: 1 }, { h: 'Yetkazildi', r: 1 }, { h: 'Bekor', r: 1 }, { h: 'Yakunlanish', r: 1 }, { h: "O'rtacha yetkazish", r: 1 }], rows: dRows.map(function (r) { return [r[0], fmtN(r[1]), fmtN(r[2]), r[3], '<b>' + r[4] + '</b>', r[5]]; }), raw: dRows };
    var dd = {}; done.forEach(function (o) { (dd[o.dist] = dd[o.dist] || []).push(o.mins); });
    var dt = Object.keys(dd).map(function (k) { var v = dd[k].reduce(function (s, x) { return s + x; }, 0) / dd[k].length; return { l: k, v: v, txt: Math.round(v) + ' daq', c: v > 40 ? COL.amb : COL.ok }; }).sort(function (a, b) { return a.v - b.v; });
    mount('<div class="g-4">' + A.kpi('receipt_long', 'Jami buyurtmalar', fmtN(n), 'ta', A.delta(n, prev.length), true) + A.kpi('task_alt', 'Yakunlanish darajasi', A.pct(done.length, n).toFixed(1), '%', A.delta(A.pct(done.length, n), A.pct(pdone.length, prev.length))) + A.kpi('cancel', 'Bekor qilish darajasi', A.pct(cx.length, n).toFixed(1), '%', A.delta(A.pct(cx.length, n), A.pct(pcx.length, prev.length), 1)) + A.kpi('timer', "O'rtacha yetkazish vaqti", Math.round(avg(done)), 'daqiqa', A.delta(avg(done), avg(pdone), 1)) + '</div>' +
      A.panel('Buyurtmalar holati bo\'yicha', R.hourly ? 'Soatbay' : 'Kunlik', '<div class="chart" id="ch1"></div>', A.legend([{ l: 'Yetkazildi', c: COL.ok }, { l: 'Jarayonda', c: COL.amb }, { l: 'Bekor qilingan', c: COL.red }])) +
      '<div class="g-11">' + A.panel('Holatlar voronkasi', 'Yangi → Tayyorlanmoqda → Yo\'lda → Yetkazildi / Bekor', '<div id="ch2"></div>') + A.panel('Bekor qilish sabablari', fmtN(cx.length) + ' ta bekor qilingan buyurtma', '<div id="ch3"></div>') + '</div>' +
      A.panel("Tumanlar bo'yicha o'rtacha yetkazish vaqti", "40 daqiqadan oshgan tumanlar sariq rangda", '<div id="ch4"></div>') + A.tablePanel('tb', T));
    C.columns($('#ch1'), { labels: B.map(function (b) { return b.l; }), tipLabels: B.map(function (b) { return b.tl; }), series: [{ name: 'Yetkazildi', data: sDone, color: COL.ok }, { name: 'Jarayonda', data: sAct, color: COL.amb }, { name: 'Bekor', data: sCx, color: COL.red }], fmt: function (v) { return v + ' ta'; } });
    C.funnel($('#ch2'), steps, n);
    C.hbars($('#ch3'), reasons.length ? reasons : [{ l: "Bekor qilingan buyurtma yo'q", v: 0, txt: '0' }]);
    C.hbars($('#ch4'), dt);
    A.wireTable('tb', T);
  });

  /* 3. TUSHUM */
  var an_rev = base(function (R, all, cur, prev, B) {
    var ok = cur.filter(function (o) { return o.st !== 4; }), pok = prev.filter(function (o) { return o.st !== 4; });
    var r = rev(ok), pr = rev(pok), avg = ok.length ? r / ok.length : 0, pavg = pok.length ? pr / pok.length : 0;
    var disc = ok.reduce(function (s, o) { return s + o.ds; }, 0), pdisc = pok.reduce(function (s, o) { return s + o.ds; }, 0);
    var s1 = A.bucketize(ok, B, function (o) { return o.t; }), s0 = A.bucketize(pok.map(function (o) { return { ts: o.ts + (R.a - R.pa), t: o.t }; }), B, function (o) { return o.t; });
    var cat = {}; ok.forEach(function (o) { o.it.forEach(function (x) { cat[x[3]] = (cat[x[3]] || 0) + x[1] * x[2]; }); });
    var catTot = Object.keys(cat).reduce(function (s, k) { return s + cat[k]; }, 0);
    var cats = Object.keys(cat).sort(function (a, b) { return cat[b] - cat[a]; }).map(function (k, i) { return { l: EZ.cat(k).uz, v: cat[k], txt: EZ.short(cat[k]) + '<small>' + A.pct(cat[k], catTot).toFixed(0) + '%</small>', c: i < 3 ? COL.red : '#F3A3A0' }; });
    var cash = ok.filter(function (o) { return o.pay === 'Naqd'; }), card = ok.filter(function (o) { return o.pay === 'Karta'; });
    var dc = {}; ok.forEach(function (o) { if (o.code) dc[o.code] = (dc[o.code] || 0) + o.ds; });
    var codes = Object.keys(dc).sort(function (a, b) { return dc[b] - dc[a]; }).map(function (k) { return { l: k, v: dc[k], txt: EZ.short(dc[k]) + " so'm", c: COL.ink }; });
    var rows = B.map(function (b) { var L = ok.filter(function (o) { return o.ts >= b.a && o.ts <= b.b; }), rv = rev(L); return [b.tl, L.length, rv, L.length ? Math.round(rv / L.length) : 0, rev(L.filter(function (o) { return o.pay === 'Naqd'; })), rev(L.filter(function (o) { return o.pay === 'Karta'; })), L.reduce(function (s, o) { return s + o.ds; }, 0)]; }).reverse();
    var T = { title: (R.hourly ? 'Soatbay' : 'Kunlik') + ' tushum hisoboti', file: 'tushum', per: 10, cols: [{ h: R.hourly ? 'Soat' : 'Sana' }, { h: 'Buyurtmalar', r: 1 }, { h: 'Tushum', r: 1 }, { h: "O'rtacha chek", r: 1 }, { h: 'Naqd', r: 1 }, { h: 'Karta', r: 1 }, { h: 'Chegirma', r: 1 }], rows: rows.map(function (x) { return [x[0], fmtN(x[1]), '<b>' + fmt(x[2]) + '</b>', fmt(x[3]), fmt(x[4]), fmt(x[5]), '−' + fmt(x[6])]; }), raw: rows };
    mount('<div class="g-4">' + A.kpi('payments', 'Tushum', fmtN(r), "so'm", A.delta(r, pr), true) + A.kpi('receipt', "O'rtacha chek", fmtN(avg), "so'm", A.delta(avg, pavg)) + A.kpi('shopping_bag', "To'langan buyurtmalar", fmtN(ok.length), 'ta', A.delta(ok.length, pok.length)) + A.kpi('sell', 'Promokod chegirmalari', fmtN(disc), "so'm", A.delta(disc, pdisc, 1)) + '</div>' +
      A.panel('Tushum dinamikasi', 'Bekor qilingan buyurtmalarsiz', '<div class="chart" id="ch1"></div>', A.legend([{ l: 'Joriy davr', c: COL.red }, { l: 'Oldingi davr', c: '#B9BCC6', dash: 1 }])) +
      '<div class="g-11">' + A.panel("Bo'limlar bo'yicha tushum", 'Mahsulot summalari asosida', '<div id="ch2"></div>') +
      '<div style="display:flex;flex-direction:column;gap:18px">' + A.panel("To'lov usullari: Naqd va Karta", fmtN(ok.length) + " ta to'lov", '<div id="ch3"></div>') + A.panel('Promokodlar orqali berilgan chegirmalar', 'Jami: ' + fmt(disc), '<div id="ch4"></div>') + '</div></div>' + A.tablePanel('tb', T));
    C.line($('#ch1'), { labels: B.map(function (b) { return b.l; }), tipLabels: B.map(function (b) { return b.tl; }), series: [{ name: 'Joriy', data: s1, color: COL.red }, { name: 'Oldingi', data: s0, color: '#B9BCC6', dash: 1 }], fmt: fmt });
    C.hbars($('#ch2'), cats);
    C.donut($('#ch3'), [{ l: 'Naqd pul', v: rev(cash), c: COL.ok, sub: fmtN(cash.length) + ' ta · ' + EZ.short(rev(cash)) + " so'm" }, { l: 'Karta orqali', v: rev(card), c: COL.blue, sub: fmtN(card.length) + ' ta · ' + EZ.short(rev(card)) + " so'm" }], { v: EZ.short(r), l: "so'm tushum" });
    C.hbars($('#ch4'), codes.length ? codes : [{ l: "Promokod ishlatilmagan", v: 0, txt: '0' }]);
    A.wireTable('tb', T);
  });

  /* 4. MIJOZLAR */
  var an_cust = base(function (R, all, cur, prev, B) {
    var CU = EZ.customers(), nw = cur.filter(function (o) { return o.nw; }), ret = cur.filter(function (o) { return !o.nw; }), pnw = prev.filter(function (o) { return o.nw; });
    var uniq = {}; cur.forEach(function (o) { uniq[o.cid] = 1; }); var act = Object.keys(uniq).length, puniq = {}; prev.forEach(function (o) { puniq[o.cid] = 1; });
    var lv = { oddiy: 0, silver: 0, bronze: 0, gold: 0 }; CU.forEach(function (c) { lv[EZ.custLevel(c)]++; });
    var asc = EZ.levelsAsc();
    var top = CU.slice().sort(function (a, b) { return EZ.custCount(b) - EZ.custCount(a); }).slice(0, 25);
    var T = { title: 'Eng faol mijozlar', sub: 'Yakunlangan buyurtmalar soni bo\'yicha', file: 'top-mijozlar', per: 10, cols: [{ h: '#' }, { h: 'Mijoz' }, { h: 'Telefon' }, { h: 'Tuman' }, { h: 'Buyurtmalar', r: 1 }, { h: 'Daraja' }, { h: 'Jami xarid', r: 1 }],
      rows: top.map(function (c, i) { return [i + 1, '<div class="cell-u"><span class="avatar">' + A.ini(c.nm) + '</span><b style="font-weight:600">' + esc(c.nm) + '</b></div>', esc(c.ph), esc(c.dist), '<b>' + EZ.custCount(c) + '</b>', A.lvBadge(EZ.custLevel(c), 1), fmt(EZ.custCount(c) * (c.avg || 78000))]; }),
      raw: top.map(function (c, i) { return [i + 1, c.nm, c.ph, c.dist, EZ.custCount(c), EZ.LEVEL_NAMES[EZ.custLevel(c)], EZ.custCount(c) * (c.avg || 78000)]; }) };
    var lvRows = asc.slice().reverse().map(function (k) { return { l: EZ.LEVEL_NAMES[k] + ' (' + S.lv[k].min + '+)', v: lv[k], c: S.lv[k].color, sub: fmtN(lv[k]) + ' mijoz' }; }).concat([{ l: 'Oddiy (<' + S.lv[asc[0]].min + ')', v: lv.oddiy, c: '#D9D9DE', sub: fmtN(lv.oddiy) + ' mijoz' }]);
    var spend = {}; cur.forEach(function (o) { spend[o.lv] = (spend[o.lv] || 0) + (o.st === 4 ? 0 : o.t); });
    mount('<div class="g-4">' + A.kpi('group', 'Jami mijozlar', fmtN(CU.length), '', '', true) + A.kpi('person_add', 'Yangi mijozlar', fmtN(nw.length), 'ta', A.delta(nw.length, pnw.length)) + A.kpi('autorenew', 'Qaytgan mijozlar ulushi', A.pct(ret.length, cur.length).toFixed(1), '%') + A.kpi('how_to_reg', 'Faol mijozlar (davrda)', fmtN(act), 'ta', A.delta(act, Object.keys(puniq).length)) + '</div>' +
      A.panel('Yangi va qaytgan mijozlar', 'Buyurtmalar soni, ' + (R.hourly ? 'soatbay' : 'kunlik'), '<div class="chart" id="ch1"></div>', A.legend([{ l: 'Qaytgan', c: COL.ink }, { l: 'Yangi', c: COL.red }])) +
      '<div class="g-11">' + A.panel('Loyallik darajalari bo\'yicha mijozlar', 'Daraja yakunlangan buyurtmalar soniga qarab', '<div id="ch2"></div>') + A.panel('Darajalar bo\'yicha tushum', 'Tanlangan davr', '<div id="ch3"></div>') + '</div>' + A.tablePanel('tb', T));
    C.columns($('#ch1'), { labels: B.map(function (b) { return b.l; }), tipLabels: B.map(function (b) { return b.tl; }), series: [{ name: 'Qaytgan', data: A.bucketize(ret, B), color: COL.ink }, { name: 'Yangi', data: A.bucketize(nw, B), color: COL.red }], fmt: function (v) { return v + ' ta'; } });
    C.donut($('#ch2'), lvRows, { v: fmtN(CU.length), l: 'mijoz' });
    C.hbars($('#ch3'), ['gold', 'bronze', 'silver', 'oddiy'].map(function (k) { return { l: EZ.LEVEL_NAMES[k], v: spend[k] || 0, txt: EZ.short(spend[k] || 0) + " so'm", c: EZ.levelColor(k) }; }));
    A.wireTable('tb', T);
  });

  /* 5. PROMOKOD & AKSIYA */
  var an_promo = base(function (R, all, cur, prev, B) {
    var pc = cur.filter(function (o) { return o.code && o.st !== 4; }), ppc = prev.filter(function (o) { return o.code && o.st !== 4; });
    var pr = rev(pc), ppr = rev(ppc), dsc = pc.reduce(function (s, o) { return s + o.ds; }, 0);
    var by = {}; pc.forEach(function (o) { var x = by[o.code] = by[o.code] || { n: 0, r: 0, d: 0 }; x.n++; x.r += o.t; x.d += o.ds; });
    var codes = Object.keys(by).sort(function (a, b) { return by[b].n - by[a].n; });
    var palette = [COL.red, COL.ink, COL.amb, COL.blue, COL.ok, COL.violet];
    var top = codes.slice(0, 4);
    var lvU = {}; pc.forEach(function (o) { lvU[o.lv] = (lvU[o.lv] || 0) + 1; });
    var asc = EZ.levelsAsc();
    var aksNow = EZ.S().aks.filter(function (a) { return a.on; }).length;
    var rows = codes.map(function (k) { var p = EZ.findPromo(k) || { l: [], t: '%', v: 0 }; return [k, (p.t === '%' ? p.v + '%' : fmt(p.v)), by[k].n, by[k].r, by[k].d, Math.round(by[k].r / by[k].n), asc.filter(function (x) { return p.l.indexOf(x) >= 0; }).map(function (x) { return EZ.LEVEL_NAMES[x]; }).join(', ')]; });
    var T = { title: "Promokodlar samaradorligi", file: 'promokodlar', per: 10, cols: [{ h: 'Kod' }, { h: 'Chegirma' }, { h: 'Ishlatildi', r: 1 }, { h: 'Tushum', r: 1 }, { h: 'Berilgan chegirma', r: 1 }, { h: "O'rtacha chek", r: 1 }, { h: 'Darajalar' }],
      rows: rows.map(function (x) { var p = EZ.findPromo(x[0]) || { l: [] }; return ['<span class="code-tag">' + x[0] + '</span>', x[1], '<b>' + fmtN(x[2]) + '</b>', fmt(x[3]), '−' + fmt(x[4]), fmt(x[5]), '<div class="lvl-chips">' + asc.filter(function (k) { return p.l.indexOf(k) >= 0; }).map(function (k) { return A.lvBadge(k, 1); }).join('') + '</div>']; }), raw: rows };
    mount('<div class="g-4">' + A.kpi('confirmation_number', 'Promokodli buyurtmalar', fmtN(pc.length), 'ta', A.delta(pc.length, ppc.length), true) + A.kpi('payments', 'Promo buyurtmalar tushumi', fmtN(pr), "so'm", A.delta(pr, ppr)) + A.kpi('sell', 'Berilgan chegirma', fmtN(dsc), "so'm") + A.kpi('campaign', 'Faol aksiyalar', aksNow, 'ta') + '</div>' +
      A.panel('Promokodlar foydalanilishi', 'Eng faol ' + top.length + ' ta kod, ' + (R.hourly ? 'soatbay' : 'kunlik'), '<div class="chart" id="ch1"></div>', A.legend(top.map(function (k, i) { return { l: k, c: palette[i] }; }))) +
      '<div class="g-11">' + A.panel("Har bir kod bo'yicha foydalanish", fmtN(pc.length) + ' ta qo\'llanish', '<div id="ch2"></div>') + A.panel("Darajalar bo'yicha foydalanish", 'Qaysi daraja mijozlari kodlardan ko\'proq foydalanadi', '<div id="ch3"></div>') + '</div>' + A.tablePanel('tb', T));
    C.line($('#ch1'), { labels: B.map(function (b) { return b.l; }), tipLabels: B.map(function (b) { return b.tl; }), series: top.map(function (k, i) { return { name: k, data: A.bucketize(pc.filter(function (o) { return o.code === k; }), B), color: palette[i], area: i === 0 }; }), fmt: function (v) { return v + ' ta'; } });
    C.hbars($('#ch2'), codes.map(function (k, i) { return { l: k, v: by[k].n, txt: fmtN(by[k].n) + '<small>' + EZ.short(by[k].r) + "</small>", c: palette[i % palette.length] }; }));
    C.donut($('#ch3'), asc.slice().reverse().map(function (k) { return { l: EZ.LEVEL_NAMES[k], v: lvU[k] || 0, c: S.lv[k].color, sub: fmtN(lvU[k] || 0) + ' ta' }; }), { v: fmtN(pc.length), l: 'qo\'llanish' });
    A.wireTable('tb', T);
  });

  w.AdminAnalytics = { an_new: an_new, an_total: an_total, an_rev: an_rev, an_cust: an_cust, an_promo: an_promo };
})(window, document);
