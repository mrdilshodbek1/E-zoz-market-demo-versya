/* EZOZ MARKET — umumiy ma'lumotlar ombori (mijoz sahifalari + admin panel)
   Holat localStorage'da saqlanadi; server.py orqali ishga tushirilsa buyurtma /api/order ga ham yuboriladi. */
(function (w) {
  'use strict';
  var KEY = 'ezoz_v6';
  var G = 'https://lh3.googleusercontent.com/aida-public/';
  var IMG = {
    basket: G + 'AB6AXuAVirrmAEcUUZB3uyuirKf_euXmw_C3-_aYy2F13t5-DFjJh6G4ZYpZvjHZVW8so0t1Xbvb2c47jZoI-j9PPbe_wqSgaklT_xUPekSvKeNh89OMmq8DrMpxAz4qz4J2uNP0VFy5efr6ZmuF7mZkm_Bk7EakEs0JB8JKqAmodbfRnPRtNNbQo6k-qWgGHKWeWXMWpZOKdTkTmVOjM17ywvfuvfPilHflqQLgSfaoAodT4WXHxdyPpIP4qQ',
    dairy: G + 'AB6AXuDoPZAw2hThOHGOwVLSD1m1WLUEA8eNtLmFu9UAmd0XmjQL01GfOQ8kNpsKdonQa1w4H67WDPyKExZtj2SiX_H1d8xRbrDID00Z4rTL1vMGGjL7m0k4tNUkA8AZlx_SDrjFC6FxE25AzS8IOwi6WlF8fYBZHCxWkRHhGgJp2AV4nH0ORd-bOyNGDGL5bpDAeuHYeRtcEwgzlKE4eBpxCLlpdaxb7PA2E2Idm6pSc1EVlFbpBL3SJ-2mWg',
    fruit: G + 'AB6AXuBVus66yt4WeTlS7_8G7PCf8D74noj2Iszf-zswQskNoKUuQS18rS-gVCOPR1XSniKeJ0A1il6N9h-u5AJXGX-qhE85QBI5BWOlQXF-ucav96T3HaZnm4_OD-sIR8sj-jn6A9R5kKnefYNDQJoXvviSgqnPCq65WPPwOKNK5dXzlLUIusNAcetiWKj-rHXramAdL2u68BmeHHIUfkTduU29R2mvOpWfZ56ywmRRSTrlKGDleE27BePpzQ',
    tea: G + 'AB6AXuBOZ1TQIQ15oet2taumiPUkUdU3wNZ7V353BT2lHsuOf7JV5HCJnsYk-5RnjZz5To9kAmqLEqOjYSDX_fEY6PECt6kk6n01TqEKjbRxAHtrLQw1hpB-MqMHW6K7XkDIIyHgAHqgQmYgSlVE0ZYuKP0h5fNZ1Fb_qLlAE1tTEvK9XEEN15xC9D8QBp5fAknobaXlRVWHXh1fyFXcrE41_fjdWIlKuIQG-uQrrjqahBzzVHze5Dnnr4vArg',
    rice: G + 'AB6AXuCwDh4GdWnJIjLkzyJD7Zc2rulPu-kyVgJJpUPXRjheM8xPNWmjVJtOp0409yUyAqic7mpYSgbVwB23JwlR8onuHytj07IYXXDsKQbRVraYlVo2iwiG_ZeHf3m_aUK8_UevIkjqJkP4nsCCW9QtElHHSqxtu4fQcctezSVZLROKALfjTrNjNpo5aezeMy7IOFI_LLuCSvX-_Z61Wf50VTllRXLqGhKggzEhNGo3chxHYkF8WSnBkRyLKw',
    choco: G + 'AB6AXuDV2wj7M2FZVmRsHFl-JvPX1Dt_is3-MwLY_dOFOzK7M2p5HSw33qpSCqGxy7S7RdqTvQz-WhtcVSNrZ_RMn23vDFU5PigeXkcVC8SUHqtd84cT69zSAdyLYI6W_aDPelUbn2BG-B0of3X2dQX3KrV9ornsO0lVgG3wzFftVjIAfDp9dM9_smQ62xbuZk-ZvNB5NZijDIa391QsNXF8PuMSGExYVsvh_4vbp2_S_TUKWtdoHzudHwKQKg',
    borjomi: G + 'AB6AXuCFYMda4LAQcnfJj2o4ZC6LBE1y3E7VtMlP8JxoqMR7U9whJsO27TSxHd9MW4mIC5aujCCUeQXvfgHK8fu1Nwyt-1H_hFHkE3wbZI_-7PFebms3yp2z0kXVcqPv_ClJqQffgQnIrPQAfmS-NFOc0Td_uoPacgo7gqhqEBpaD0pr75555R9NiHXHBOiSR4QPMr2uXob4xJWLhHhZl2M1_AbL8-wngGKKz5ki8C6rsNT-E3SF56HQxrtB-w',
    eggs: G + 'AB6AXuC7cfF6soUojh-o_GjHWC-s6sjFiN4E90BH4YgRG4cuR9AYkmRnVfZ8t2QhtSvCP1ZhJvWgWvD2FraTwLzvAahupIPj6iqp7_-Mpd09ohRJ24n4IBZyLG9eaKMJhIht1GDudDoJbgYRTf_AKLnvMY7T8OcmnMNpjQwGKWE4hUVhjTC0F5EWaKTEd_3q33MmJOyVnvQ_I0mDTq0noMpgsp17rUkQFVXhjZPxGG5LFowOpZwxgu-aCwPH1g',
    beef: G + 'AB6AXuCkAxb_-y_YBHSoniG2PKqUq8BvIN4IwM_0gxXQ30HsFYcwE0Jqzgv-oxHLL1ZGTopB4-NQdZuPRrY3FVqbeWDOM0OOruulKPiLKygTU57CHumierWelTg10nXtdxMiehZtJiRqza9wK-l_RIqsrgTplwpEChoOvmuyWE9ysx6mkfFuENMJ4Z4TY_bIv5TX3eDVrUJm5_Hq76QlJaNG9L17UP2bJUJm4R8DZpATZoIOffmYq5gdlz707Q',
    banana: G + 'AB6AXuC0Li_rHv5Vc8VjR2b8fJO-lvKka6E3BzSr5rSXswNBUuGC0KW8W2XlnEelyzD8N3Y1eoVSSCPChsm-kT0LNyr1Oc83VxVGyD1hiZNlZ2YTQL8ov-61Rsrx3-nxOZzAL5pWGQcolbCoHkA7n0ryCBHTpY3txg-hdqqTKqWbZMTV8ns_ySniyvlYkCFsPCgPVnWJUJnGvFePgfjVgScZ7kTertcLnd0Nl8O4ZG41ZRsiHEQos3CLmHtN9w',
    fairy: G + 'AB6AXuD_qNSrUmiL3KOzfXd-N1xjzT2CGiaqS-b2Sv6bmmTGoNwBKeKXCCWKThR3j0w5pGyrXPTabCQSHVT1mijtVtsjO799uoKYw_epllrM4Vwf5bIGlAj28KfQclprRCbJTuNir_HFjkB6ckriHxCOjcv46tQJdZMSgGviFGWXjR6xtzBtAO9IGEFh0vclEx3I3EQLUJrnvgXvRtfqOtrqIIVyMQFXYGf5Q-Ike9tGfZPYjVqtnDBvoogKpg',
    cola: G + 'AB6AXuDgOO3M5QrFFx70ej9yoOJYMRNNUTKvD8L78NpZ0_wC7PaBsUriTo4wBOSluxlO0XPVIeoxA2dee8m9K32xhjDIe-3gef65jVYyjgtHMhvCuyRvJR74Wh8opC18mV8JObKjXAAB0MBbUgWYpx3Worbvd___e0VSWwF2Ti9QJroEGCrSbl6jDb2THs563H-ykr0SIO36aiLz2irzYhfGAjx1zB-c7oY57T-uxlLEgySkP3NVzBaMk0avhQ',
    milk: G + 'AB6AXuARbrqCoVaVWM_1OZj04sBdvfyptiBurM8EeUHI5wAEUsCXOkq5MMkGlayI9yt8pyNWOTIKG3oTQH8TFQi-aKT43ddnzyAkBGIYg5hSv8tzlUVXQ_5G4PTjyVU2D4RIwKiWqUYsXSAwF1v1CJF8QqiH0bXJ-tu5l5yIfwwv_n9isI7FqtL_uNp9TGdsGlUaUIU2tucSqWIZ7ehVUFlR-yfO_b7tktZ_NFamnT0lHWvRIH20gdcSmCgYZg',
    bread: G + 'AB6AXuCLMxlai5DhOFfBBroI5seg3qYOMvc0uoyLSYWfJoaDnDqo4r3qAqF2npzJ-fCU_LBm5Md0B1pF2Ug2_jO0pBzMWTjY6gbpjV31fUZGut4TgXBYkXxiq-AdB_mnlOYHk3xrzBuWU7m2jLmwNcQEZxbpLmwkXzoOWM33JIV1aBZVfcJ7CR0cWKKQunZae-WWM_QK4u4HYcaNl0fj695BtYpfCjNGcBxWNn6UXa6lclpAzrABxzJAm3IoOw',
    sugar: G + 'AB6AXuDnyineOsNbbrX7gG6OGG0NLLkGR7KGuNlHTkMFv5-zBGtg-8FSsqKroYEcHCF89-8w1jrptdmV4DG07uU0x3YzUm8M_nvq73egT9I78lrVR_L4ImN3hNp90SUuZEon2FzqbtpCPHnI2kFD77oo3SBlF9bRLpv9nrmIvmNDxbVBfxi8TVy71zCIwi5r-s5BG93bqf32WtGFx-_uMfTTDt4xhOmQSVN7j-UzApMGz6pO27EyI2BLYqCqrQ',
    oil: G + 'AB6AXuBvz3td9SXK3Hythgq1tAFIDjwz3Jq6rYbzVD7VICPN4lzIAnJznRKfKGNDHtSoM9KQrtxcmESzVzSkWCkQqWZ878Lvd7SHKc2z9GS3nOWFD5xw-d0Bw42x-5WCrGWVWCn29cag9iZFxIyjNlP_xUDWYL2ZriVITCHcG_JmLFvFoRlymVeFfXsPOV9eQ4DfG9iCekn6ls26pJW_GaGXCDaEDsNzj50gkhkxvU0MbkbD2dHQrmfcwZA1AQ'
  };

  /* Katalog bo'limlari (10 ta) — k: kalit, ic: Material Symbols ikonkasi */
  var CATS = [
    { k: 'oziq', uz: 'Oziq-ovqat', ru: 'Бакалея', ic: 'rice_bowl', n: '1 240+' },
    { k: 'ichimlik', uz: 'Ichimliklar', ru: 'Напитки', ic: 'local_cafe', n: '480+' },
    { k: 'shirinlik', uz: 'Shirinliklar', ru: 'Сладости', ic: 'cake', n: '350+' },
    { k: 'sut', uz: 'Sut mahsulotlari', ru: 'Молочные продукты', ic: 'water_drop', n: '290+' },
    { k: 'gosht', uz: "Go'sht mahsulotlari", ru: 'Мясо и птица', ic: 'set_meal', n: '180+' },
    { k: 'meva', uz: 'Meva va sabzavotlar', ru: 'Фрукты и овощи', ic: 'nutrition', n: '210+' },
    { k: 'non', uz: 'Non', ru: 'Хлеб и выпечка', ic: 'bakery_dining', n: '95+' },
    { k: 'maishiy', uz: 'Maishiy kimyo', ru: 'Бытовая химия', ic: 'cleaning_services', n: '420+' },
    { k: 'gigiyena', uz: 'Gigiyena', ru: 'Гигиена', ic: 'soap', n: '310+' },
    { k: 'kiyim', uz: 'Kiyim-kechak', ru: 'Одежда', ic: 'apparel', n: '140+' }
  ];

  /* id'lar server.py dagi SEED tartibiga mos (1..26) */
  var PRODUCTS = [
    { id: 1, n: 'Coca-Cola 1.5L', d: 'Klassik gazli ichimlik', dr: 'Классический газированный напиток', p: 9000, c: 'ichimlik', img: IMG.cola },
    { id: 2, n: 'Borjomi 0.5L', d: 'Shisha idishda, tabiiy vulqoniy', dr: 'В стекле, вулканического происхождения', p: 11000, c: 'ichimlik', img: IMG.borjomi, tag: 'Tabiiy' },
    { id: 3, n: 'Mineral suv 1.5L', d: "Gazsiz, toza buloq suvi", dr: 'Негазированная родниковая вода', p: 4000, c: 'ichimlik' },
    { id: 4, n: 'Alokozay qora choy (100 dona)', d: 'Paketda 100 dona × 2g', dr: '100 пакетиков × 2 г', p: 24000, c: 'ichimlik', img: IMG.tea, tag: 'Mashhur' },
    { id: 5, n: 'Musaffo sut 3.2% 1L', d: 'Yangi sigir suti', dr: 'Свежее коровье молоко', p: 11500, c: 'sut', img: IMG.milk },
    { id: 6, n: 'Qatiq 1L', d: "Uy usulida tayyorlangan", dr: 'Домашний катык', p: 12000, c: 'sut' },
    { id: 7, n: 'Tvorog 400g', d: "Yumshoq, 9% yog'lilik", dr: 'Мягкий, 9% жирности', p: 18000, c: 'sut' },
    { id: 8, n: "Saryog' 200g", d: "82.5% yog'lilik", dr: 'Жирность 82,5%', p: 22000, c: 'sut' },
    { id: 9, n: 'Tuxum 1-toifa (10 dona)', d: 'Katta o\'lcham, katakchali lotok', dr: 'Крупные, в лотке', p: 38000, c: 'gosht', img: IMG.eggs, tag: 'Yangi' },
    { id: 10, n: 'Lazer guruch oliy nav 1kg', d: 'Xorazm saralangan, palovbop', dr: 'Хорезмский, для плова', p: 26000, c: 'oziq', img: IMG.rice, tag: 'Eng sara' },
    { id: 11, n: 'Shakar 1kg', d: 'Oq kristall shakar', dr: 'Белый сахар-песок', p: 13000, c: 'oziq', img: IMG.sugar },
    { id: 12, n: "Kungaboqar yog'i 1L", d: 'Tozalangan, oliy nav', dr: 'Рафинированное, высший сорт', p: 18500, c: 'oziq', img: IMG.oil },
    { id: 13, n: 'Makaron 400g', d: "Qattiq bug'doydan", dr: 'Из твёрдых сортов пшеницы', p: 8000, c: 'oziq' },
    { id: 14, n: 'Un 2kg', d: 'Oliy nav bug\'doy uni', dr: 'Пшеничная мука высшего сорта', p: 16000, c: 'oziq' },
    { id: 15, n: "Mol go'shti lahm 1kg", d: "Yangi so'yilgan, suyaksiz", dr: 'Свежая, без кости', p: 95000, c: 'gosht', img: IMG.beef, tag: '100% Halol' },
    { id: 16, n: "Tovuq go'shti 1kg", d: 'Muzlatilmagan, butun', dr: 'Охлаждённая, целая', p: 42000, c: 'gosht' },
    { id: 17, n: 'Banan (Ekvador) 1kg', d: "Sariq, xushbo'y va shirin", dr: 'Спелые и сладкие', p: 22000, c: 'meva', img: IMG.banana },
    { id: 18, n: 'Olma 1kg', d: 'Mahalliy, qizil nav', dr: 'Местные, красные', p: 14000, c: 'meva' },
    { id: 19, n: 'Pomidor 1kg', d: 'Issiqxona, pishgan', dr: 'Тепличные, спелые', p: 12000, c: 'meva' },
    { id: 20, n: 'Kartoshka 1kg', d: 'Saralangan, yirik', dr: 'Отборный, крупный', p: 7000, c: 'meva' },
    { id: 21, n: 'Oloy tandir non', d: 'Issiq, bugun yopilgan', dr: 'Горячая, испечена сегодня', p: 3000, c: 'non', img: IMG.bread },
    { id: 22, n: 'Bulochka', d: 'Shirin, yumshoq', dr: 'Сдобная булочка', p: 4500, c: 'non' },
    { id: 23, n: 'Nestlé sutli shokolad 90g', d: 'Klassik shveytsariya retsepti', dr: 'Классический швейцарский рецепт', p: 14000, op: 16500, c: 'shirinlik', img: IMG.choco },
    { id: 24, n: 'Pechenye 300g', d: 'Sariyog\'li, choyga', dr: 'Сливочное, к чаю', p: 15000, c: 'shirinlik' },
    { id: 25, n: 'Fairy idish yuvish 900ml', d: "Limon ekstrakti bilan", dr: 'С экстрактом лимона', p: 21000, c: 'maishiy', img: IMG.fairy },
    { id: 26, n: 'Kir yuvish kukuni 3kg', d: 'Avtomat mashinalar uchun', dr: 'Для автоматических машин', p: 58000, c: 'maishiy' }
  ];

  var DISTRICTS = ['Yunusobod', "Mirzo Ulug'bek", 'Chilonzor', 'Shayxontohur', 'Yakkasaroy', 'Yashnobod', 'Olmazor', 'Sergeli', 'Uchtepa', 'Mirobod'];
  var STATUS = ['Yangi', 'Tayyorlanmoqda', "Yo'lda", 'Yetkazildi', 'Bekor qilingan'];
  var STATUS_RU = ['Новый', 'Собирается', 'В пути', 'Доставлен', 'Отменён'];
  var REASONS = ['Mijoz bekor qildi', 'Mahsulot tugagan', 'Manzil topilmadi', 'Kuryer kechikdi', "Mijoz javob bermadi"];
  var LEVEL_NAMES = { oddiy: 'Oddiy mijoz', silver: 'Silver', bronze: 'Bronze', gold: 'Gold' };

  /* ---------- yordamchilar ---------- */
  var H = 3600e3, D = 24 * H;
  function fmtN(n) { return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); }
  function fmt(n) { return fmtN(n) + "\u00a0so'm"; }
  function short(n) { return n >= 1e6 ? (n / 1e6).toFixed(n >= 1e8 ? 0 : 1).replace('.0', '') + ' mln' : n >= 1e3 ? Math.round(n / 1e3) + ' ming' : String(Math.round(n)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var MON = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
  var MON_RU = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  function dayStart(t) { var d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function hm(t) { var d = new Date(t); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function dateLabel(t, lang) {
    var t0 = dayStart(Date.now()), d = new Date(t), ru = lang === 'ru';
    if (t >= t0) return (ru ? 'Сегодня, ' : 'Bugun, ') + hm(t);
    if (t >= t0 - D) return (ru ? 'Вчера, ' : 'Kecha, ') + hm(t);
    return d.getDate() + (ru ? ' ' + MON_RU[d.getMonth()] : '-' + MON[d.getMonth()]) + ', ' + hm(t);
  }
  function dayLabel(t) { var d = new Date(t); return d.getDate() + '-' + MON[d.getMonth()]; }
  function isoDay(t) { var d = new Date(t); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  /* Buyurtma raqami: kun indeksi × 200 + kun ichidagi tartib. Arxiv (analitika) 0..169, sayt buyurtmalari 170..199 —
     raqamlar takrorlanmaydi va vaqt bo'yicha o'sib boradi. */
  var EPOCH = new Date(2026, 0, 1).getTime();
  function dayIdx(t) { return Math.round((dayStart(t) - EPOCH) / D); }
  function liveId(t, orders) { var di = dayIdx(t), n = 0; (orders || []).forEach(function (o) { if (o.id >= di * 200 + 170 && o.id < di * 200 + 200) n = Math.max(n, o.id - di * 200 - 169); }); return di * 200 + 170 + Math.min(n, 29); }
  function product(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function cat(k) { for (var i = 0; i < CATS.length; i++) if (CATS[i].k === k) return CATS[i]; return null; }

  /* ---------- boshlang'ich holat ---------- */
  function seed() {
    var now = Date.now(), t0 = dayStart(now);
    function it(arr) { return arr.map(function (a) { var p = product(a[0]); return { id: p.id, n: p.n, p: p.p, q: a[1] }; }); }
    function mk(id, nm, ph, dist, items, st, ts, pay, mine, extra) {
      var list = it(items), sub = list.reduce(function (s, x) { return s + x.p * x.q; }, 0), dl = sub >= 150000 ? 0 : 10000;
      var o = { id: 0, nm: nm, ph: ph, dist: dist, ad: 'Toshkent sh., ' + dist + ' t., ' + (extra && extra.ad || 'Amir Temur ko\'chasi 45-uy, 12-xonadon'), note: '', it: list, sub: sub, ds: 0, dl: dl, t: sub + dl, pay: pay, paid: pay === 'Karta', st: st, ts: ts, mine: mine ? 1 : 0, live: 1, code: '' };
      if (extra) for (var k in extra) if (k !== 'ad') o[k] = extra[k];
      o.t = o.sub - o.ds + o.dl;
      o.id = liveId(ts, made); made.push(o);
      return o;
    }
    var made = [], me = ['Ali Valiyev', '+998 90 123 45 67'];
    var orders = [
      mk(1025, me[0], me[1], 'Yunusobod', [[1, 2], [5, 1], [21, 3], [11, 1], [12, 1]], 0, now - 18 * 60e3, 'Karta', 1, { ds: 5000, code: 'BRONZE5', note: 'Domofon kodi 45K' }),
      mk(1024, 'Dilnoza Karimova', '+998 93 456 78 90', 'Chilonzor', [[4, 1], [23, 2], [24, 1]], 1, now - 35 * 60e3, 'Naqd', 0, { lv: 'bronze' }),
      mk(1023, 'Jamshid Oripov', '+998 97 111 22 33', 'Mirobod', [[12, 2], [11, 3], [10, 2], [9, 1], [15, 1]], 2, now - 52 * 60e3, 'Karta', 0, { lv: 'silver' }),
      mk(1022, me[0], me[1], 'Yunusobod', [[17, 2], [18, 1], [19, 2], [20, 3]], 2, now - 80 * 60e3, 'Naqd', 1),
      mk(1021, 'Shahnoza Yusupova', '+998 99 888 77 66', 'Yakkasaroy', [[1, 2]], 3, now - 2.4 * H, 'Naqd', 0, { lv: 'oddiy' }),
      mk(1020, 'Bekzod Tursunov', '+998 91 222 33 44', 'Sergeli', [[16, 2], [6, 2], [21, 4], [3, 6]], 0, now - 6 * 60e3, 'Naqd', 0, { lv: 'gold' }),
      mk(1019, me[0], me[1], 'Yunusobod', [[12, 2], [11, 3], [5, 4], [10, 1], [21, 2], [8, 1], [4, 1]], 3, t0 - D + 11.25 * H, 'Karta', 1),
      mk(1017, me[0], me[1], 'Yunusobod', [[21, 3], [5, 1], [11, 1]], 3, t0 - 4 * D + 18.3 * H, 'Naqd', 1),
      mk(1014, me[0], me[1], 'Yunusobod', [[15, 1], [16, 1], [9, 1], [19, 2], [20, 2], [12, 1]], 3, t0 - 7 * D + 12.1 * H, 'Karta', 1),
      mk(1012, me[0], me[1], 'Yunusobod', [[23, 3], [24, 2], [1, 2]], 4, t0 - 9 * D + 20.5 * H, 'Naqd', 1, { reason: 'Mijoz bekor qildi' }),
      mk(1009, me[0], me[1], 'Yunusobod', [[25, 1], [26, 1], [3, 4]], 3, t0 - 13 * D + 10.7 * H, 'Karta', 1),
      mk(1006, me[0], me[1], 'Yunusobod', [[10, 2], [12, 1], [11, 2], [14, 1], [13, 3]], 3, t0 - 18 * D + 17.9 * H, 'Naqd', 1),
      mk(1003, me[0], me[1], 'Yunusobod', [[2, 4], [5, 2], [7, 1]], 3, t0 - 26 * D + 9.4 * H, 'Karta', 1),
      mk(998, me[0], me[1], 'Yunusobod', [[17, 1], [18, 2], [22, 4], [6, 1]], 3, t0 - 34 * D + 19.2 * H, 'Naqd', 1),
      mk(991, me[0], me[1], 'Yunusobod', [[15, 2], [21, 3]], 3, t0 - 47 * D + 13.6 * H, 'Karta', 1),
      mk(985, me[0], me[1], 'Yunusobod', [[4, 2], [24, 2], [23, 1]], 4, t0 - 61 * D + 16.0 * H, 'Karta', 1, { reason: 'Mahsulot tugagan' })
    ];
    made = []; orders.slice().sort(function (a, b) { return a.ts - b.ts; }).forEach(function (o) { o.id = liveId(o.ts, made); made.push(o); });
    orders.sort(function (a, b) { return b.ts - a.ts; });
    var d = function (n) { return isoDay(t0 + n * D); };
    return {
      v: 6, lang: 'uz', user: { id: 1, nm: me[0], ph: me[1], dist: 'Yunusobod', ad: "Amir Temur ko'chasi 45-uy, 12-xonadon" },
      lv: { silver: { min: 11, color: '#8E9AAB' }, bronze: { min: 24, color: '#B0743F' }, gold: { min: 50, color: '#C29A2E' } },
      base: 30, last: 0,
      cart: [{ id: 1, q: 2 }, { id: 5, q: 1 }, { id: 21, q: 3 }, { id: 11, q: 1 }, { id: 12, q: 1 }],
      fav: [4, 10, 23], promo: '', promoUse: {}, ov: {},
      settings: { fee: 10000, free: 150000, phone: '+998 71 200-00-20', hours: '08:00 – 23:00', city: 'Toshkent' },
      prod: {},
      promos: [
        { c: 'GOLD50', t: '%', v: 10, l: ['gold'], m: 100000, pu: 0, lim: 0, u: 124, s: d(-90), e: '', on: 1 },
        { c: 'BRONZE5', t: '%', v: 5, l: ['bronze', 'gold'], m: 50000, pu: 3, lim: 0, u: 241, s: d(-60), e: d(90), on: 1 },
        { c: 'SILVERLOVE', t: '%', v: 7, l: ['silver', 'bronze', 'gold'], m: 70000, pu: 2, lim: 500, u: 189, s: d(-30), e: d(45), on: 1 },
        { c: 'EZOZ15', t: 'sum', v: 15000, l: ['silver', 'bronze', 'gold'], m: 120000, pu: 1, lim: 1000, u: 540, s: d(-45), e: d(30), on: 1 },
        { c: 'YOZ20', t: '%', v: 20, l: ['gold'], m: 200000, pu: 1, lim: 200, u: 200, s: d(-120), e: d(-20), on: 0 }
      ],
      aks: [
        { id: 1, title: 'Sut mahsulotlariga −25%', sub: 'Qatiq, tvorog va saryog\'', disc: 25, cat: 'sut', img: IMG.dairy, l: ['silver', 'bronze', 'gold'], s: d(-3), e: d(10), on: 1 },
        { id: 2, title: 'Yangi hosil: meva va sabzavot', sub: 'Bugun ertalab saralangan partiya', disc: 15, cat: 'meva', img: IMG.fruit, l: ['bronze', 'gold'], s: d(-1), e: d(14), on: 1 },
        { id: 3, title: 'Gold: bepul ekspress yetkazish', sub: 'Har qanday summadagi buyurtmaga', disc: 0, cat: '', img: IMG.basket, l: ['gold'], s: d(-2), e: d(5), on: 1 }
      ],
      orders: orders
    };
  }

  var S = null;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { }
  if (!S && /^EZ6\{/.test(w.name || '')) { try { S = JSON.parse(w.name.slice(3)); } catch (e) { } }
  if (!S || S.v !== 6) S = seed();
  function save() { var j = JSON.stringify(S); try { localStorage.setItem(KEY, j); } catch (e) { } try { w.name = 'EZ6' + j; } catch (e) { } }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) { } w.name = ''; S = seed(); save(); return S; }

  /* ---------- daraja (loyallik) ---------- */
  function levelsAsc() { return ['silver', 'bronze', 'gold'].sort(function (a, b) { return S.lv[a].min - S.lv[b].min; }); }
  function levelFor(count) { var L = levelsAsc(), r = 'oddiy'; L.forEach(function (k) { if (count >= S.lv[k].min) r = k; }); return r; }
  function myCount() { return S.base + S.orders.filter(function (o) { return o.mine && o.st === 3; }).length; }
  function myLevel() { var o = S.ov[S.user.id]; return o && o !== 'auto' ? o : levelFor(myCount()); }
  function nextLevel(count) { var L = levelsAsc(); for (var i = 0; i < L.length; i++) if (S.lv[L[i]].min > count) return L[i]; return null; }
  function levelColor(k) { return k === 'oddiy' ? '#6B7080' : S.lv[k].color; }

  /* ---------- promokod ---------- */
  function findPromo(code) { code = String(code || '').trim().toUpperCase(); for (var i = 0; i < S.promos.length; i++) if (S.promos[i].c === code) return S.promos[i]; return null; }
  function promoLabel(p) { return p.t === '%' ? '−' + p.v + '%' : '−' + fmt(p.v); }
  function promoLevelsText(p) {
    var L = levelsAsc().filter(function (k) { return p.l.indexOf(k) >= 0; });
    return L.map(function (k) { return LEVEL_NAMES[k]; }).join(', ');
  }
  function checkPromo(code, sub) {
    var p = findPromo(code), today = isoDay(Date.now());
    if (!code) return { e: 'Promokodni kiriting' };
    if (!p || !p.on) return { e: 'Bunday promokod mavjud emas yoki faol emas' };
    if (p.s && today < p.s) return { e: 'Promokod ' + p.s + ' dan boshlab amal qiladi' };
    if (p.e && today > p.e) return { e: 'Promokod muddati tugagan' };
    if (p.lim && p.u >= p.lim) return { e: 'Promokod limiti tugagan' };
    if (p.pu && (S.promoUse[p.c] || 0) >= p.pu) return { e: 'Siz bu promokoddan ' + p.pu + ' marta foydalangansiz' };
    var lv = myLevel();
    if (p.l.indexOf(lv) < 0) {
      var asc = levelsAsc(), allowed = asc.filter(function (k) { return p.l.indexOf(k) >= 0; }), low = allowed[0];
      var contiguousTop = allowed.length && asc.slice(asc.indexOf(low)).every(function (k) { return p.l.indexOf(k) >= 0; });
      return { e: 'Bu promokod faqat ' + (contiguousTop ? LEVEL_NAMES[low] + (low === asc[asc.length - 1] ? '' : ' va undan yuqori') : allowed.map(function (k) { return LEVEL_NAMES[k]; }).join(', ')) + ' darajadagi mijozlar uchun', lvl: true };
    }
    if (sub < p.m) return { e: "Minimal buyurtma summasi: " + fmt(p.m) };
    var d = p.t === '%' ? Math.round(sub * p.v / 100) : Math.min(p.v, sub);
    return { p: p, d: d };
  }
  function aksiyalarFor(lv) {
    var today = isoDay(Date.now());
    return S.aks.filter(function (a) { return a.on && a.l.indexOf(lv) >= 0 && (!a.s || a.s <= today) && (!a.e || a.e >= today); });
  }

  /* ---------- savat ---------- */
  function cartLines() { return (S.cart || []).map(function (c) { var p = product(c.id); return p ? { id: p.id, n: p.n, p: price(p), q: c.q, img: p.img, c: p.c } : null; }).filter(Boolean); }
  function cartSub() { return cartLines().reduce(function (s, x) { return s + x.p * x.q; }, 0); }
  function cartQty() { return (S.cart || []).reduce(function (s, x) { return s + x.q; }, 0); }
  function addToCart(id, q) { var x = S.cart.filter(function (c) { return c.id === id; })[0]; if (x) x.q += q; else S.cart.push({ id: id, q: q }); save(); }
  function price(p) { var o = S.prod[p.id]; return o && o.p ? o.p : p.p; }
  function inStock(p) { var o = S.prod[p.id]; return !(o && o.off); }

  /* ---------- tarixiy ma'lumotlar (analitika uchun, deterministik) ---------- */
  var HIST = null, CUSTOMERS = null;
  var FN = ['Aziz', 'Dilnoza', 'Jasur', 'Madina', 'Sardor', 'Nodira', 'Bekzod', 'Gulnora', 'Otabek', 'Shahlo', 'Rustam', 'Malika', 'Jamshid', 'Zarina', 'Ulug\'bek', 'Kamola', 'Sherzod', 'Feruza', 'Doniyor', 'Laylo', 'Akmal', 'Sevara', 'Bobur', 'Nilufar', 'Javohir', 'Mohira'];
  var LN_ = ['Karimov', 'Yusupov', 'Rahimov', 'Tursunov', 'Aliyev', 'Saidov', 'Nazarov', 'Qodirov', 'Ergashev', 'Hasanov', 'Ismoilov', 'Mirzayev', 'Sobirov', 'Xolmatov', 'Abdullayev', 'Normatov'];
  function customers() {
    if (CUSTOMERS) return CUSTOMERS;
    var r = rng(77), list = [], now = Date.now();
    list.push({ id: 1, nm: S.user.nm, ph: S.user.ph, dist: S.user.dist, me: 1, join: now - 400 * D });
    for (var i = 2; i <= 1150; i++) {
      var f = FN[Math.floor(r() * FN.length)], l = LN_[Math.floor(r() * LN_.length)], fem = /a$|o$|r$/.test(f) && ['Dilnoza', 'Madina', 'Nodira', 'Gulnora', 'Shahlo', 'Malika', 'Zarina', 'Kamola', 'Feruza', 'Laylo', 'Sevara', 'Nilufar', 'Mohira'].indexOf(f) >= 0;
      var x = r(), cnt = x < .25 ? Math.floor(r() * 11) : x < .67 ? 11 + Math.floor(r() * 13) : x < .92 ? 24 + Math.floor(r() * 26) : 50 + Math.floor(r() * 60);
      list.push({ id: i, nm: f + ' ' + l + (fem ? 'a' : ''), ph: '+998 ' + ['90', '91', '93', '94', '97', '99', '33', '88'][Math.floor(r() * 8)] + ' ' + (100 + Math.floor(r() * 900)) + ' ' + (10 + Math.floor(r() * 90)) + ' ' + (10 + Math.floor(r() * 90)), dist: DISTRICTS[Math.floor(r() * DISTRICTS.length)], cnt: cnt, avg: 52000 + Math.floor(r() * 90000), join: now - Math.floor(r() * 500) * D, last: now - Math.floor(r() * 30 * D) });
    }
    CUSTOMERS = list; return list;
  }
  function custCount(c) { return c.me ? myCount() : c.cnt; }
  function custLevel(c) { var o = S.ov[c.id]; return o && o !== 'auto' ? o : levelFor(custCount(c)); }

  function history() {
    if (HIST) return HIST;
    var out = [], now = Date.now(), t0 = dayStart(now), r;
    var HW = [0, 0, 0, 0, 0, 0, 0, 0, .35, .6, .85, 1.15, 1.35, 1.1, .8, .75, .9, 1.2, 1.6, 1.75, 1.45, 1.0, .6, .3];
    var WW = [1.18, .92, .95, .97, 1.0, 1.08, 1.22]; // Yak..Shan
    var CUST = customers();
    for (var dd = 119; dd >= 0; dd--) {
      var day = t0 - dd * D, di = dayIdx(day), seq = 0; r = rng(di * 7919 + 13);
      var dow = new Date(day).getDay(), base = (78 + (119 - dd) * .22) * WW[dow] * (0.9 + r() * .2);
      for (var h = 8; h < 23; h++) {
        var n = Math.round(base * HW[h] / 13.85 * (0.75 + r() * .5));
        for (var k = 0; k < n; k++) {
          var ts = day + h * H + Math.floor(r() * H);
          if (ts > now || seq >= 169) continue;
          var items = [], m = 1 + Math.floor(r() * 5), sub = 0;
          for (var j = 0; j < m; j++) { var p = PRODUCTS[Math.floor(Math.pow(r(), 1.3) * PRODUCTS.length)], q = 1 + Math.floor(r() * 3); items.push([p.id, q, p.p, p.c]); sub += p.p * q; }
          var age = now - ts, st;
          if (age < 25 * 60e3) st = 0; else if (age < 45 * 60e3) st = r() < .5 ? 1 : 0; else if (age < 80 * 60e3) st = r() < .6 ? 2 : 1;
          else st = r() < .075 ? 4 : 3;
          var cu = CUST[1 + Math.floor(r() * (CUST.length - 1))], lv = levelFor(cu.cnt), code = '', ds = 0;
          if (r() < .16 && lv !== 'oddiy') {
            var ok = S.promos.filter(function (p) { return p.l.indexOf(lv) >= 0; });
            if (ok.length) { var pp = ok[Math.floor(r() * ok.length)]; if (sub >= pp.m * .6) { code = pp.c; ds = pp.t === '%' ? Math.round(sub * pp.v / 100) : Math.min(pp.v, sub); } }
          }
          var dl = sub >= 150000 ? 0 : 10000;
          out.push({ id: di * 200 + (seq++), ts: ts, dist: DISTRICTS[Math.floor(Math.pow(r(), 1.25) * DISTRICTS.length)], it: items, sub: sub, ds: ds, dl: dl, t: sub - ds + dl, pay: r() < .56 ? 'Naqd' : 'Karta', st: st, cid: cu.id, nm: cu.nm, lv: lv, code: code, nw: r() < .17 ? 1 : 0, mins: st === 3 ? Math.round(24 + r() * 26 + (h >= 18 && h <= 20 ? 8 : 0)) : 0, reason: st === 4 ? REASONS[Math.floor(Math.pow(r(), 1.4) * REASONS.length)] : '' });
        }
      }
    }
    HIST = out; return out;
  }
  /* jonli (localStorage) buyurtmalarni ham analitikaga qo'shish */
  function allOrders() {
    var live = S.orders.map(function (o) { return { id: o.id, ts: o.ts, dist: o.dist || 'Yunusobod', it: o.it.map(function (x) { var p = product(x.id); return [x.id, x.q, x.p, p ? p.c : 'oziq']; }), sub: o.sub, ds: o.ds, dl: o.dl, t: o.t, pay: o.pay, st: o.st, cid: o.mine ? 1 : 0, nm: o.nm, lv: o.mine ? myLevel() : (o.lv || 'silver'), code: o.code, nw: 0, mins: o.st === 3 ? 34 : 0, reason: o.reason || '', live: 1 }; });
    return history().concat(live);
  }

  /* serverga yuborish (server.py ishlayotgan bo'lsa) */
  function postOrder(o) {
    if (!/^https?:/.test(location.protocol)) return;
    try {
      fetch('/api/order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: o.nm, phone: o.ph, address: o.ad, comment: [o.note, o.code ? 'Promokod: ' + o.code + ' (−' + fmt(o.ds) + ')' : ''].filter(Boolean).join(' | '), payment: o.pay === 'Karta' ? 'card' : 'cash', items: o.it.map(function (x) { return { id: x.id, qty: x.q }; }) })
      }).catch(function () { });
    } catch (e) { }
  }

  w.EZ = {
    S: function () { return S; }, liveId: function (t) { return liveId(t, S.orders); }, save: save, reset: reset, IMG: IMG, CATS: CATS, PRODUCTS: PRODUCTS, DISTRICTS: DISTRICTS, STATUS: STATUS, STATUS_RU: STATUS_RU, REASONS: REASONS, LEVEL_NAMES: LEVEL_NAMES,
    fmt: fmt, fmtN: fmtN, short: short, esc: esc, dateLabel: dateLabel, dayLabel: dayLabel, isoDay: isoDay, dayStart: dayStart, hm: hm, D: D, H: H, MON: MON,
    product: product, cat: cat, price: price, inStock: inStock,
    levelsAsc: levelsAsc, levelFor: levelFor, myCount: myCount, myLevel: myLevel, nextLevel: nextLevel, levelColor: levelColor,
    findPromo: findPromo, checkPromo: checkPromo, promoLabel: promoLabel, promoLevelsText: promoLevelsText, aksiyalarFor: aksiyalarFor,
    cartLines: cartLines, cartSub: cartSub, cartQty: cartQty, addToCart: addToCart,
    customers: customers, custCount: custCount, custLevel: custLevel, history: history, allOrders: allOrders, postOrder: postOrder
  };
})(window);
