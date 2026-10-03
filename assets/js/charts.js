/* EZOZ — yengil SVG/HTML grafiklar (tashqi kutubxonasiz) */
(function (w, d) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  function nice(max) { if (max <= 0) return 1; var p = Math.pow(10, Math.floor(Math.log10(max))), f = max / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; }
  function shortN(v) { return v >= 1e9 ? (v / 1e9).toFixed(1).replace('.0', '') + ' mlrd' : v >= 1e6 ? (v / 1e6).toFixed(1).replace('.0', '') + ' mln' : v >= 1e3 ? Math.round(v / 1e3) + 'k' : String(Math.round(v)); }
  function smooth(pts) {
    if (pts.length < 2) return pts.length ? 'M' + pts[0][0] + ',' + pts[0][1] : '';
    var s = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, k = .16;
      var c1x = p1[0] + (p2[0] - p0[0]) * k, c1y = p1[1] + (p2[1] - p0[1]) * k, c2x = p2[0] - (p3[0] - p1[0]) * k, c2y = p2[1] - (p3[1] - p1[1]) * k;
      var lo = Math.min(p1[1], p2[1]), hi = Math.max(p1[1], p2[1]);
      c1y = Math.max(lo, Math.min(hi, c1y)); c2y = Math.max(lo, Math.min(hi, c2y));
      s += 'C' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return s;
  }
  function tipEl(el) { var t = el.querySelector('.tip'); if (!t) { t = d.createElement('div'); t.className = 'tip'; el.appendChild(t); } return t; }
  var uid = 0;

  /* chiziqli grafik: o = {labels, series:[{name,data,color,dash,area}], fmt, h} */
  function line(el, o) {
    var W = Math.max(280, el.clientWidth || 600), H = o.h || 270, pl = 52, pr = 14, pt = 14, pb = 30, n = o.labels.length;
    var all = []; o.series.forEach(function (s) { all = all.concat(s.data); });
    var max = nice(Math.max.apply(null, all.concat([1])) * 1.08), iw = W - pl - pr, ih = H - pt - pb;
    var X = function (i) { return pl + (n <= 1 ? iw / 2 : i * iw / (n - 1)); }, Y = function (v) { return pt + (1 - v / max) * ih; };
    var id = 'g' + (++uid), s = '<svg viewBox="0 0 ' + W + ' ' + H + '" height="' + H + '" role="img"><defs>';
    o.series.forEach(function (se, k) { s += '<linearGradient id="' + id + k + '" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="' + se.color + '" stop-opacity=".18"/><stop offset="1" stop-color="' + se.color + '" stop-opacity="0"/></linearGradient>'; });
    s += '</defs>';
    for (var g = 0; g <= 4; g++) { var v = max * g / 4, y = Y(v); s += '<line class="grid" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y + '" y2="' + y + '"' + (g ? ' stroke-dasharray="3 4"' : '') + '/><text class="ax" x="' + (pl - 10) + '" y="' + (y + 4) + '" text-anchor="end">' + shortN(v) + '</text>'; }
    var step = Math.max(1, Math.ceil(n / Math.max(4, Math.floor(iw / 70))));
    o.labels.forEach(function (l, i) { if (i % step === 0 || i === n - 1 && (n - 1) % step > step / 2) s += '<text class="ax" x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + l + '</text>'; });
    o.series.forEach(function (se, k) {
      var pts = se.data.map(function (v, i) { return [X(i), Y(v)]; }), p = smooth(pts);
      if (se.area !== false && !se.dash) s += '<path d="' + p + 'L' + X(n - 1) + ',' + Y(0) + 'L' + X(0) + ',' + Y(0) + 'Z" fill="url(#' + id + k + ')"/>';
      s += '<path d="' + p + '" fill="none" stroke="' + se.color + '" stroke-width="' + (se.dash ? 1.6 : 2.4) + '" stroke-linecap="round" stroke-linejoin="round"' + (se.dash ? ' stroke-dasharray="5 5"' : '') + '/>';
    });
    s += '<line class="hl" x1="0" x2="0" y1="' + pt + '" y2="' + (H - pb) + '" stroke="#17181D" stroke-width="1" opacity="0"/>';
    o.series.forEach(function (se, k) { s += '<circle class="hc' + k + '" r="5" fill="#fff" stroke="' + se.color + '" stroke-width="2.4" opacity="0"/>'; });
    s += '<rect x="' + pl + '" y="0" width="' + iw + '" height="' + H + '" fill="transparent" class="ov"/></svg>';
    el.innerHTML = s;
    hover(el, n, X, function (i) {
      var svg = el.querySelector('svg');
      svg.querySelector('.hl').setAttribute('x1', X(i)); svg.querySelector('.hl').setAttribute('x2', X(i)); svg.querySelector('.hl').setAttribute('opacity', .15);
      o.series.forEach(function (se, k) { var c = svg.querySelector('.hc' + k); c.setAttribute('cx', X(i)); c.setAttribute('cy', Y(se.data[i])); c.setAttribute('opacity', 1); });
      return { x: X(i), y: Y(Math.max.apply(null, o.series.map(function (se) { return se.data[i]; }))), html: '<b>' + (o.tipLabels ? o.tipLabels[i] : o.labels[i]) + '</b><br>' + o.series.map(function (se) { return '<i style="background:' + se.color + '"></i>' + se.name + ': <b>' + (o.fmt ? o.fmt(se.data[i]) : se.data[i]) + '</b>'; }).join('<br>') };
    }, function () { var svg = el.querySelector('svg'); svg.querySelector('.hl').setAttribute('opacity', 0); o.series.forEach(function (se, k) { svg.querySelector('.hc' + k).setAttribute('opacity', 0); }); }, W);
  }
  function hover(el, n, X, show, hide, W) {
    var tip = tipEl(el), svg = el.querySelector('svg');
    function mv(e) {
      var r = svg.getBoundingClientRect(), sx = (e.clientX - r.left) * (W / r.width), best = 0, bd = 1e9;
      for (var i = 0; i < n; i++) { var dd = Math.abs(X(i) - sx); if (dd < bd) { bd = dd; best = i; } }
      var t = show(best), k = r.width / W;
      tip.innerHTML = t.html; tip.classList.add('on');
      var left = t.x * k, tw = tip.offsetWidth / 2;
      tip.style.left = Math.max(tw, Math.min(r.width - tw, left)) + 'px'; tip.style.top = Math.max(0, t.y * k - 12) + 'px';
    }
    svg.addEventListener('pointermove', mv);
    svg.addEventListener('pointerleave', function () { tip.classList.remove('on'); hide(); });
  }

  /* ustunli (stacked) grafik: o = {labels, series:[{name,data,color}], fmt, h} */
  function columns(el, o) {
    var W = Math.max(280, el.clientWidth || 600), H = o.h || 270, pl = 46, pr = 10, pt = 14, pb = 30, n = o.labels.length, iw = W - pl - pr, ih = H - pt - pb;
    var tot = o.labels.map(function (_, i) { return o.series.reduce(function (s, se) { return s + se.data[i]; }, 0); });
    var max = nice(Math.max.apply(null, tot.concat([1])) * 1.05), bw = Math.max(3, Math.min(26, iw / n * .62)), X = function (i) { return pl + (i + .5) * iw / n; }, Y = function (v) { return pt + (1 - v / max) * ih; };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" height="' + H + '">';
    for (var g = 0; g <= 4; g++) { var v = max * g / 4, y = Y(v); s += '<line class="grid" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y + '" y2="' + y + '"' + (g ? ' stroke-dasharray="3 4"' : '') + '/><text class="ax" x="' + (pl - 10) + '" y="' + (y + 4) + '" text-anchor="end">' + shortN(v) + '</text>'; }
    var step = Math.max(1, Math.ceil(n / Math.max(4, Math.floor(iw / 64))));
    for (var i = 0; i < n; i++) {
      var acc = 0;
      s += '<g class="col" data-i="' + i + '">';
      o.series.forEach(function (se, k) { var v0 = acc, v1 = acc + se.data[i]; acc = v1; var h = Y(v0) - Y(v1); if (h > 0) s += '<rect x="' + (X(i) - bw / 2) + '" y="' + Y(v1) + '" width="' + bw + '" height="' + Math.max(0, h - (k < o.series.length - 1 ? 1.5 : 0)) + '" rx="' + Math.min(4, bw / 3) + '" fill="' + se.color + '"/>'; });
      s += '</g>';
      if (i % step === 0) s += '<text class="ax" x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle">' + o.labels[i] + '</text>';
    }
    s += '<rect class="hlb" x="0" y="' + pt + '" width="' + (iw / n) + '" height="' + ih + '" fill="#17181D" opacity="0" rx="6"/></svg>';
    el.innerHTML = s;
    var hlb = el.querySelector('.hlb');
    hover(el, n, X, function (i) { hlb.setAttribute('x', X(i) - iw / n / 2); hlb.setAttribute('opacity', .05); return { x: X(i), y: Y(tot[i]), html: '<b>' + (o.tipLabels ? o.tipLabels[i] : o.labels[i]) + '</b><br>' + o.series.map(function (se) { return '<i style="background:' + se.color + '"></i>' + se.name + ': <b>' + (o.fmt ? o.fmt(se.data[i]) : se.data[i]) + '</b>'; }).join('<br>') }; }, function () { hlb.setAttribute('opacity', 0); }, W);
  }

  /* donut: parts=[{l,v,c,sub}], center={v,l} */
  function donut(el, parts, center, fmt) {
    var tot = parts.reduce(function (s, p) { return s + p.v; }, 0) || 1, R = 70, C = 2 * Math.PI * R, off = 0;
    var s = '<svg viewBox="0 0 168 168"><circle cx="84" cy="84" r="' + R + '" fill="none" stroke="#F2F1EF" stroke-width="20"/>';
    parts.forEach(function (p) { var len = p.v / tot * C, gap = parts.length > 1 && len > 4 ? 2.5 : 0; s += '<circle cx="84" cy="84" r="' + R + '" fill="none" stroke="' + p.c + '" stroke-width="20" stroke-dasharray="' + Math.max(0, len - gap) + ' ' + C + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 84 84)"><title>' + p.l + '</title></circle>'; off += len; });
    s += '<text class="donut-c" x="84" y="82" text-anchor="middle" font-size="24" font-weight="800" fill="#17181D" letter-spacing="-1">' + center.v + '</text><text class="donut-c" x="84" y="102" text-anchor="middle" font-size="11.5" fill="#6B7080">' + center.l + '</text></svg>';
    el.innerHTML = '<div class="donut">' + s + '<div class="dl">' + parts.map(function (p) { return '<div class="dl-r"><i style="background:' + p.c + '"></i><span>' + p.l + (p.sub ? '<small>' + p.sub + '</small>' : '') + '</span><b class="num">' + Math.round(p.v / tot * 100) + '%</b></div>'; }).join('') + '</div></div>';
  }

  /* gorizontal ustunlar: rows=[{l,v,txt,c}] */
  function hbars(el, rows, fmt) {
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; }).concat([1]));
    el.innerHTML = '<div class="hbars">' + rows.map(function (r, i) { return '<div class="hb"><span class="hb-l" title="' + r.l + '">' + r.l + '</span><span class="hb-t"><i style="width:' + (r.v / max * 100) + '%;' + (r.c ? '--c:' + r.c + ';' : '') + 'animation-delay:' + (i * 40) + 'ms"></i></span><span class="hb-v num">' + (r.txt || (fmt ? fmt(r.v) : r.v)) + '</span></div>'; }).join('') + '</div>';
  }

  /* issiqlik xaritasi: m[7][15] (soat 8..22) */
  function heat(el, m, rows) {
    var max = 1; m.forEach(function (r) { r.forEach(function (v) { if (v > max) max = v; }); });
    var s = '<div class="heat"><span></span>';
    for (var h = 8; h < 23; h++) s += '<span class="hh">' + (h % 2 === 0 ? h : '') + '</span>';
    m.forEach(function (r, i) { s += '<span>' + rows[i] + '</span>'; r.forEach(function (v, j) { s += '<span class="hc" style="--a:' + (0.05 + .95 * v / max).toFixed(3) + '" title="' + rows[i] + ', ' + (j + 8) + ':00 — ' + v + ' ta buyurtma"></span>'; }); });
    el.innerHTML = s + '</div><div class="heat-k">Kam<i></i>Ko\'p</div>';
  }

  /* voronka: steps=[{l,ic,v,c,cls}] */
  function funnel(el, steps, base) {
    el.innerHTML = '<div class="funnel">' + steps.map(function (s, i) { var p = base ? s.v / base * 100 : 0; return '<div class="fn ' + (s.cls || '') + '"><span class="fn-l"><span class="ms">' + s.ic + '</span>' + s.l + '</span><span class="fn-b"><i style="width:' + Math.max(p, 2) + '%;--c:' + s.c + ';animation-delay:' + i * 70 + 'ms">' + (p >= 12 ? Math.round(p) + '%' : '') + '</i></span><span class="fn-v num"><b>' + s.v.toLocaleString('ru-RU').replace(/,/g, ' ') + '</b><small>' + p.toFixed(1) + '%</small></span></div>'; }).join('') + '</div>';
  }

  /* kichik sparkline */
  function spark(data, color, w2, h2) {
    w2 = w2 || 220; h2 = h2 || 42;
    var max = Math.max.apply(null, data.concat([1])), min = Math.min.apply(null, data), n = data.length;
    var pts = data.map(function (v, i) { return [i * w2 / (n - 1), 4 + (1 - (v - min) / ((max - min) || 1)) * (h2 - 8)]; });
    var id = 'sp' + (++uid), p = smooth(pts);
    return '<svg class="spark" viewBox="0 0 ' + w2 + ' ' + h2 + '" preserveAspectRatio="none" width="100%" height="' + h2 + '"><defs><linearGradient id="' + id + '" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="' + color + '" stop-opacity=".25"/><stop offset="1" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs><path d="' + p + 'L' + w2 + ',' + h2 + 'L0,' + h2 + 'Z" fill="url(#' + id + ')"/><path d="' + p + '" fill="none" stroke="' + color + '" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round"/></svg>';
  }

  w.Charts = { line: line, columns: columns, donut: donut, hbars: hbars, heat: heat, funnel: funnel, spark: spark, shortN: shortN };
})(window, document);
