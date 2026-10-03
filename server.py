"""EZOZ MARKET — sayt + Telegram bot (admin / kuryer / mijoz). Bitta fayl, bitta jarayon."""
import os, json, time, hmac, hashlib, sqlite3, threading, html, urllib.parse, re
from datetime import datetime, timezone, timedelta
import requests
from flask import Flask, request, jsonify, send_from_directory

BASE = os.path.dirname(os.path.abspath(__file__))


def load_env():
    p = os.path.join(BASE, ".env")
    if os.path.exists(p):
        for line in open(p, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


load_env()
TOKEN = os.getenv("BOT_TOKEN", "")
ADMINS = set()
for x in os.getenv("ADMIN_IDS", "").replace(" ", "").split(","):
    if x:
        try:
            ADMINS.add(int(x))
        except ValueError:
            print(f"⚠️ Noto'g'ri ADMIN_IDS qiymati: {x}")
WEBAPP_URL = os.getenv("WEBAPP_URL", "").rstrip("/")
PORT = int(os.getenv("PORT", "8000"))
PHONE = os.getenv("SHOP_PHONE", "+998 97-383-01-17")
FEE = int(os.getenv("DELIVERY_FEE", "10000"))
FREE_FROM = int(os.getenv("FREE_DELIVERY_FROM", "150000"))
DB = os.path.join(BASE, "ezoz.db")
API = f"https://api.telegram.org/bot{TOKEN}" if TOKEN else ""
TZ = timezone(timedelta(hours=5))

STATUS = {
    "new": "🆕 Yangi", "accepted": "✅ Qabul qilindi", "preparing": "📦 Tayyorlanmoqda",
    "assigned": "🧑‍✈️ Kuryer tayinlandi", "delivering": "🚚 Yo'lda",
    "delivered": "🏁 Yetkazildi", "cancelled": "❌ Bekor qilindi",
}
PAY = {"cash": "💵 Naqd pul (kuryerga)", "card": "💳 Karta orqali (onlayn)"}

# ---------------------------------------------------------------- DB
def db(sql, args=(), one=False, commit=False):
    con = sqlite3.connect(DB, timeout=10)
    con.row_factory = sqlite3.Row
    try:
        cur = con.execute(sql, args)
        if commit:
            con.commit()
            return cur.lastrowid
        rows = cur.fetchall()
        return (rows[0] if rows else None) if one else rows
    finally:
        con.close()


SEED = [
    ("Coca-Cola 1.5L", 9000, "Ichimliklar", "🥤"), ("Borjomi 0.5L", 11000, "Ichimliklar", "💧"),
    ("Mineral suv 1.5L", 4000, "Ichimliklar", "💧"), ("Alokozay choy 100 dona", 24000, "Ichimliklar", "🍵"),
    ("Musaffo sut 3.2% 1L", 11500, "Sut mahsulotlari", "🥛"), ("Qatiq 1L", 12000, "Sut mahsulotlari", "🥛"),
    ("Tvorog 400g", 18000, "Sut mahsulotlari", "🧀"), ("Saryog' 200g", 22000, "Sut mahsulotlari", "🧈"),
    ("Tuxum 1-toifa (10 dona)", 38000, "Oziq-ovqat", "🥚"), ("Guruch lazer 1kg", 26000, "Oziq-ovqat", "🍚"),
    ("Shakar 1kg", 13000, "Oziq-ovqat", "🧂"), ("Kungaboqar yog'i 1L", 18500, "Oziq-ovqat", "🛢️"),
    ("Makaron 400g", 8000, "Oziq-ovqat", "🍝"), ("Un 2kg", 16000, "Oziq-ovqat", "🌾"),
    ("Mol go'shti 1kg", 95000, "Go'sht", "🥩"), ("Tovuq go'shti 1kg", 42000, "Go'sht", "🍗"),
    ("Banan 1kg", 22000, "Meva-sabzavot", "🍌"), ("Olma 1kg", 14000, "Meva-sabzavot", "🍎"),
    ("Pomidor 1kg", 12000, "Meva-sabzavot", "🍅"), ("Kartoshka 1kg", 7000, "Meva-sabzavot", "🥔"),
    ("Oloy tandir non", 3000, "Non", "🥖"), ("Bulochka", 4500, "Non", "🍞"),
    ("Nestlé sutli shokolad 90g", 14000, "Shirinliklar", "🍫"), ("Pechenye 300g", 15000, "Shirinliklar", "🍪"),
    ("Fairy idish yuvish 900ml", 21000, "Maishiy", "🧴"), ("Kir yuvish kukuni 3kg", 58000, "Maishiy", "🧺"),
]


def init_db():
    db("""CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price INTEGER,
        category TEXT, emoji TEXT DEFAULT '🛒', active INTEGER DEFAULT 1)""", commit=True)
    db("""CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, address TEXT,
        comment TEXT, payment TEXT, items TEXT, fee INTEGER, total INTEGER, status TEXT DEFAULT 'new', tg_id INTEGER,
        courier_id INTEGER, admin_msg INTEGER, created INTEGER)""", commit=True)
    db("CREATE TABLE IF NOT EXISTS couriers(tg_id INTEGER PRIMARY KEY, name TEXT, phone TEXT)", commit=True)
    db("CREATE TABLE IF NOT EXISTS customers(tg_id INTEGER PRIMARY KEY, name TEXT, phone TEXT)", commit=True)
    if not db("SELECT 1 FROM products LIMIT 1", one=True):
        for n, p, c, e in SEED:
            db("INSERT INTO products(name,price,category,emoji) VALUES(?,?,?,?)", (n, p, c, e), commit=True)


# ---------------------------------------------------------------- helpers
def fmt(n):
    return f"{int(n):,}".replace(",", " ") + " so'm"


def digits(s):
    return re.sub(r"\D", "", s or "")


def esc(s):
    return html.escape(str(s or ""), quote=False)


def tg(method, **p):
    if not API:
        print(f"TG xato: BOT_TOKEN sozlanmagan ({method})")
        return {}
    try:
        r = requests.post(f"{API}/{method}", json=p, timeout=40)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print("TG xato:", method, e)
        return {}


def send(chat, text, kb=None):
    p = dict(chat_id=chat, text=text, parse_mode="HTML", disable_web_page_preview=True)
    if kb:
        p["reply_markup"] = kb
    return tg("sendMessage", **p)


def edit(chat, mid, text, kb=None):
    p = dict(chat_id=chat, message_id=mid, text=text, parse_mode="HTML")
    p["reply_markup"] = kb or {"inline_keyboard": []}
    return tg("editMessageText", **p)


def order_text(o):
    items = json.loads(o["items"])
    lines = "\n".join(f"{i}. {esc(x['name'])} × {x['qty']} = {fmt(x['price'] * x['qty'])}" for i, x in enumerate(items, 1))
    t = (f"🛒 <b>Buyurtma #{o['id']}</b> — {STATUS[o['status']]}\n"
         f"👤 {esc(o['name'])}\n📞 {esc(o['phone'])}\n📍 {esc(o['address'])}\n")
    if o["comment"]:
        t += f"💬 {esc(o['comment'])}\n"
    t += f"\n{lines}\n\n🚚 Yetkazish: {fmt(o['fee'])}\n💰 <b>Jami: {fmt(o['total'])}</b>\n{PAY.get(o['payment'], '')}"
    return t


def get_order(oid):
    return db("SELECT * FROM orders WHERE id=?", (oid,), one=True)


def admin_kb(o):
    i, s = o["id"], o["status"]
    cancel = {"text": "❌ Bekor", "callback_data": f"a:{i}:cancel"}
    if s == "new":
        return {"inline_keyboard": [[{"text": "✅ Qabul qilish", "callback_data": f"a:{i}:acc"}, cancel]]}
    if s == "accepted":
        return {"inline_keyboard": [[{"text": "📦 Tayyorlanmoqda", "callback_data": f"a:{i}:prep"}, cancel]]}
    if s in ("preparing", "assigned"):
        lbl = "🚴 Kuryer tanlash" if s == "preparing" else "🔁 Kuryerni almashtirish"
        return {"inline_keyboard": [[{"text": lbl, "callback_data": f"a:{i}:pick"}, cancel]]}
    return None


def courier_kb(o):
    i, s = o["id"], o["status"]
    if s == "assigned":
        return {"inline_keyboard": [[{"text": "🚚 Yo'lga chiqdim", "callback_data": f"k:{i}:go"}]]}
    if s == "delivering":
        return {"inline_keyboard": [[{"text": "🏁 Yetkazildi", "callback_data": f"k:{i}:done"}]]}
    return None


def courier_info(o):
    if not o["courier_id"]:
        return ""
    c = db("SELECT * FROM couriers WHERE tg_id=?", (o["courier_id"],), one=True)
    if not c:
        return ""
    return f"\n🧑‍✈️ Kuryer: <b>{esc(c['name'])}</b>" + (f" — {esc(c['phone'])}" if c["phone"] else "")


CUSTOMER_MSG = {
    "accepted": "✅ Buyurtmangiz qabul qilindi.",
    "preparing": "📦 Mahsulotlar yig'ilmoqda.",
    "assigned": "🧑‍✈️ Buyurtmangizga kuryer tayinlandi.",
    "delivering": "🚚 Kuryer yo'lga chiqdi, tez orada yetib boradi!",
    "delivered": "🏁 Buyurtmangiz yetkazildi. Xaridingiz uchun rahmat! ❤️",
    "cancelled": "❌ Afsuski, buyurtmangiz bekor qilindi. Savollar bo'lsa: " + PHONE,
}


def set_status(oid, status, **extra):
    sets = ["status=?"] + [f"{k}=?" for k in extra]
    db(f"UPDATE orders SET {', '.join(sets)} WHERE id=?", (status, *extra.values(), oid), commit=True)
    o = get_order(oid)
    if o["admin_msg"]:
        edit(next(iter(ADMINS)), o["admin_msg"], order_text(o) + courier_info(o), admin_kb(o))
    if o["tg_id"] and status in CUSTOMER_MSG:
        send(o["tg_id"], f"<b>Buyurtma #{oid}</b>\n{CUSTOMER_MSG[status]}" + courier_info(o))
    return o


def send_to_courier(o):
    send(o["courier_id"], "🆕 <b>Sizga yangi buyurtma!</b>\n\n" + order_text(o), courier_kb(o))


# ---------------------------------------------------------------- bot: kirish
def main_menu(uid):
    rows = []
    if WEBAPP_URL.startswith("https://"):
        rows.append([{"text": "🛍 Do'konni ochish", "web_app": {"url": WEBAPP_URL}}])
    rows.append([{"text": "📦 Buyurtmalarim"}, {"text": "☎️ Aloqa"}])
    if uid in ADMINS:
        rows += [[{"text": "📋 Faol buyurtmalar"}, {"text": "📊 Statistika"}],
                 [{"text": "🛒 Mahsulotlar"}, {"text": "🚴 Kuryerlar"}]]
    return {"keyboard": rows, "resize_keyboard": True}


ADMIN_HELP = (
    "👑 <b>Admin buyruqlari</b>\n\n"
    "/buyurtmalar — faol buyurtmalar\n/statistika — bugungi hisobot\n/mahsulotlar — mahsulotlar ro'yxati\n"
    "/mahsulot_qosh nom | narx | kategoriya | emoji\n/narx ID yangi_narx\n/ochirish ID — mahsulotni o'chirish/yoqish\n"
    "/kuryer_qosh TelegramID Ism [telefon]\n/kuryerlar\n/kuryer_ochirish TelegramID\n"
    "/xabar matn — barcha mijozlarga xabar"
)


def on_message(m):
    uid, chat = m["from"]["id"], m["chat"]["id"]
    name = m["from"].get("first_name", "")
    text = (m.get("text") or "").strip()

    if "contact" in m:
        ph = m["contact"]["phone_number"]
        db("INSERT OR REPLACE INTO customers(tg_id,name,phone) VALUES(?,?,?)", (uid, name, ph), commit=True)
        db("UPDATE couriers SET phone=? WHERE tg_id=? AND (phone IS NULL OR phone='')", (ph, uid), commit=True)
        return send(chat, "✅ Raqamingiz saqlandi. Endi do'konni ochishingiz mumkin!", main_menu(uid))

    if not text:
        return
    cmd, _, arg = text.partition(" ")
    cmd = cmd.split("@")[0].lower()
    arg = arg.strip()

    if cmd == "/start":
        if not db("SELECT 1 FROM customers WHERE tg_id=?", (uid,), one=True):
            db("INSERT INTO customers(tg_id,name,phone) VALUES(?,?,NULL)", (uid, name), commit=True)
        role = "\n👑 Siz <b>adminsiz</b> — /admin" if uid in ADMINS else (
            "\n🚴 Siz <b>kuryersiz</b> — buyurtmalar shu yerga keladi." if db("SELECT 1 FROM couriers WHERE tg_id=?", (uid,), one=True) else "")
        send(chat, f"Assalomu alaykum, <b>{esc(name)}</b>! 👋\n<b>EZOZ MARKET</b> — onlayn supermarket.\n"
                   f"Tez yetkazib berish, buyurtma holati shu botda keladi.{role}", main_menu(uid))
        c = db("SELECT phone FROM customers WHERE tg_id=?", (uid,), one=True)
        if not c["phone"]:
            send(chat, "Buyurtma holatini bilish uchun telefon raqamingizni yuboring 👇",
                 {"keyboard": [[{"text": "📱 Raqamni yuborish", "request_contact": True}]], "resize_keyboard": True, "one_time_keyboard": True})
        if WEBAPP_URL and not WEBAPP_URL.startswith("https://"):
            send(chat, "🛍 Do'kon:", {"inline_keyboard": [[{"text": "Do'konni ochish", "url": WEBAPP_URL}]]})
        return
    if cmd in ("/buyurtmalarim",) or text == "📦 Buyurtmalarim":
        rows = db("SELECT * FROM orders WHERE tg_id=? ORDER BY id DESC LIMIT 5", (uid,))
        if not rows:
            return send(chat, "Hozircha buyurtmalaringiz yo'q.")
        for o in rows:
            send(chat, order_text(o) + courier_info(o))
        return
    if text == "☎️ Aloqa":
        return send(chat, f"☎️ Operator: <b>{esc(PHONE)}</b>\n🕗 Ish vaqti: 08:00 – 23:00")

    # --- kuryer
    if cmd == "/mening" and db("SELECT 1 FROM couriers WHERE tg_id=?", (uid,), one=True):
        rows = db("SELECT * FROM orders WHERE courier_id=? AND status IN ('assigned','delivering')", (uid,))
        if not rows:
            return send(chat, "Faol buyurtma yo'q.")
        for o in rows:
            send(chat, order_text(o), courier_kb(o))
        return

    # --- admin
    if uid not in ADMINS:
        return
    if cmd in ("/admin", "/help"):
        return send(chat, ADMIN_HELP)
    if cmd == "/buyurtmalar" or text == "📋 Faol buyurtmalar":
        rows = db("SELECT * FROM orders WHERE status NOT IN ('delivered','cancelled') ORDER BY id DESC LIMIT 15")
        if not rows:
            return send(chat, "Faol buyurtma yo'q ✅")
        for o in rows:
            send(chat, order_text(o) + courier_info(o), admin_kb(o))
        return
    if cmd == "/statistika" or text == "📊 Statistika":
        start = int(datetime.now(TZ).replace(hour=0, minute=0, second=0, microsecond=0).timestamp())
        r = db("SELECT COUNT(*) c, COALESCE(SUM(total),0) s FROM orders WHERE created>=? AND status!='cancelled'", (start,), one=True)
        d = db("SELECT COUNT(*) c FROM orders WHERE created>=? AND status='delivered'", (start,), one=True)
        n = db("SELECT COUNT(*) c FROM orders WHERE status IN ('new','accepted','preparing','assigned','delivering')", one=True)
        allc = db("SELECT COUNT(*) c FROM customers", one=True)
        return send(chat, f"📊 <b>Bugun</b>\nBuyurtmalar: <b>{r['c']}</b>\nYetkazilgan: <b>{d['c']}</b>\n"
                          f"Savdo: <b>{fmt(r['s'])}</b>\nFaol: <b>{n['c']}</b>\nMijozlar (bot): <b>{allc['c']}</b>")
    if cmd == "/mahsulotlar" or text == "🛒 Mahsulotlar":
        rows = db("SELECT * FROM products ORDER BY category, id")
        out, cat = "", None
        for p in rows:
            if p["category"] != cat:
                cat = p["category"]
                out += f"\n<b>{esc(cat)}</b>\n"
            out += f"{p['id']}. {p['emoji']} {esc(p['name'])} — {fmt(p['price'])}{'' if p['active'] else ' (o‘chiq)'}\n"
        for i in range(0, len(out), 3800):
            send(chat, out[i:i + 3800])
        return
    if cmd == "/mahsulot_qosh":
        parts = [x.strip() for x in arg.split("|")]
        if len(parts) < 3 or not digits(parts[1]):
            return send(chat, "Format: /mahsulot_qosh Nom | narx | Kategoriya | emoji")
        pid = db("INSERT INTO products(name,price,category,emoji) VALUES(?,?,?,?)",
                 (parts[0], int(digits(parts[1])), parts[2], parts[3] if len(parts) > 3 else "🛒"), commit=True)
        return send(chat, f"✅ Qo'shildi (ID {pid}).")
    if cmd == "/narx":
        p = arg.split()
        if len(p) != 2 or not p[0].isdigit() or not digits(p[1]):
            return send(chat, "Format: /narx ID yangi_narx")
        db("UPDATE products SET price=? WHERE id=?", (int(digits(p[1])), int(p[0])), commit=True)
        return send(chat, "✅ Narx yangilandi.")
    if cmd == "/ochirish":
        if not arg.isdigit():
            return send(chat, "Format: /ochirish ID")
        db("UPDATE products SET active=1-active WHERE id=?", (int(arg),), commit=True)
        return send(chat, "✅ Holat almashtirildi (saytda ko'rinadi/yashiriladi).")
    if cmd == "/kuryer_qosh":
        p = arg.split()
        if len(p) < 2 or not p[0].isdigit():
            return send(chat, "Format: /kuryer_qosh TelegramID Ism [telefon]\nKuryer avval botga /start bosishi kerak.")
        db("INSERT OR REPLACE INTO couriers(tg_id,name,phone) VALUES(?,?,?)", (int(p[0]), p[1], p[2] if len(p) > 2 else ""), commit=True)
        send(int(p[0]), "🚴 Siz EZOZ MARKET kuryeri sifatida qo'shildingiz. Buyurtmalar shu yerga keladi.")
        return send(chat, "✅ Kuryer qo'shildi.")
    if cmd == "/kuryerlar" or text == "🚴 Kuryerlar":
        rows = db("SELECT * FROM couriers")
        return send(chat, "🚴 <b>Kuryerlar</b>\n" + ("\n".join(f"{c['tg_id']} — {esc(c['name'])} {esc(c['phone'])}" for c in rows) or "Hali yo'q. /kuryer_qosh"))
    if cmd == "/kuryer_ochirish":
        if arg.isdigit():
            db("DELETE FROM couriers WHERE tg_id=?", (int(arg),), commit=True)
        return send(chat, "✅ O'chirildi.")
    if cmd == "/xabar":
        if not arg:
            return send(chat, "Format: /xabar matn")
        n = 0
        for c in db("SELECT tg_id FROM customers"):
            if send(c["tg_id"], "📢 " + esc(arg)).get("ok"):
                n += 1
            time.sleep(0.05)
        return send(chat, f"✅ {n} ta mijozga yuborildi.")


def on_callback(cb):
    uid, data = cb["from"]["id"], cb.get("data", "")
    msg = cb["message"]
    kind, oid, act = (data.split(":") + ["", "", ""])[:3]
    if not oid.isdigit():
        return
    oid = int(oid)
    o = get_order(oid)
    answer = lambda t="": tg("answerCallbackQuery", callback_query_id=cb["id"], text=t)
    if not o:
        return answer("Topilmadi")

    if kind == "a" and uid in ADMINS:
        if act == "acc" and o["status"] == "new":
            set_status(oid, "accepted")
        elif act == "prep" and o["status"] == "accepted":
            set_status(oid, "preparing")
        elif act == "cancel" and o["status"] not in ("delivered", "cancelled"):
            set_status(oid, "cancelled")
            if o["courier_id"]:
                send(o["courier_id"], f"❌ Buyurtma #{oid} bekor qilindi.")
        elif act == "pick":
            cs = db("SELECT * FROM couriers")
            if not cs:
                return answer("Avval /kuryer_qosh bilan kuryer qo'shing")
            kb = [[{"text": f"🚴 {c['name']}", "callback_data": f"c:{oid}:{c['tg_id']}"}] for c in cs]
            kb.append([{"text": "⬅️ Orqaga", "callback_data": f"a:{oid}:back"}])
            tg("editMessageReplyMarkup", chat_id=msg["chat"]["id"], message_id=msg["message_id"], reply_markup={"inline_keyboard": kb})
        elif act == "back":
            tg("editMessageReplyMarkup", chat_id=msg["chat"]["id"], message_id=msg["message_id"], reply_markup=admin_kb(o) or {"inline_keyboard": []})
        return answer()

    if kind == "c" and uid in ADMINS and o["status"] in ("preparing", "assigned"):
        cid = int(act)
        if o["courier_id"] and o["courier_id"] != cid:
            send(o["courier_id"], f"ℹ️ Buyurtma #{oid} boshqa kuryerga berildi.")
        o = set_status(oid, "assigned", courier_id=cid)
        send_to_courier(o)
        return answer("Kuryerga yuborildi")

    if kind == "k" and o["courier_id"] == uid:
        if act == "go" and o["status"] == "assigned":
            o = set_status(oid, "delivering")
        elif act == "done" and o["status"] == "delivering":
            o = set_status(oid, "delivered")
        else:
            return answer("Allaqachon bajarilgan")
        edit(msg["chat"]["id"], msg["message_id"], order_text(o), courier_kb(o))
        return answer("OK")
    answer()


def poll():
    offset = 0
    tg("deleteWebhook")
    print("Bot ishga tushdi ✅")
    while True:
        r = tg("getUpdates", offset=offset, timeout=30, allowed_updates=["message", "callback_query"])
        for u in r.get("result", []):
            offset = u["update_id"] + 1
            try:
                if "message" in u:
                    on_message(u["message"])
                elif "callback_query" in u:
                    on_callback(u["callback_query"])
            except Exception as e:
                print("Xato:", e)
        if not r.get("ok"):
            time.sleep(3)


# ---------------------------------------------------------------- sayt API
app = Flask(__name__, static_folder=None)


def webapp_user(init_data):
    """Telegram WebApp initData tekshiruvi -> user id yoki None."""
    try:
        d = dict(urllib.parse.parse_qsl(init_data, keep_blank_values=True))
        h = d.pop("hash")
        check = "\n".join(f"{k}={d[k]}" for k in sorted(d))
        secret = hmac.new(b"WebAppData", TOKEN.encode(), hashlib.sha256).digest()
        if hmac.compare_digest(hmac.new(secret, check.encode(), hashlib.sha256).hexdigest(), h):
            return json.loads(d["user"])["id"]
    except Exception:
        pass
    return None


SITE_HOME = "1-bosh-sahifa.html"
STATIC_EXT = {".html", ".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico", ".woff2"}


@app.get("/")
def index():
    """Asosiy sayt. Telegram mini-ilova (eski index.html) /index.html manzilida qoladi."""
    return send_from_directory(BASE, SITE_HOME)


@app.get("/<path:name>")
def static_files(name):
    """Faqat sayt fayllari: .env, .db, .py va boshqa maxfiy fayllar hech qachon berilmaydi."""
    full = os.path.normpath(os.path.join(BASE, name))
    if not full.startswith(BASE + os.sep) or os.path.splitext(full)[1].lower() not in STATIC_EXT or not os.path.isfile(full):
        return jsonify(error="Topilmadi"), 404
    return send_from_directory(BASE, os.path.relpath(full, BASE))


@app.get("/api/config")
def config():
    return jsonify(fee=FEE, free_from=FREE_FROM, phone=PHONE)


@app.get("/api/products")
def products():
    rows = db("SELECT id,name,price,category,emoji FROM products WHERE active=1 ORDER BY id")
    return jsonify([dict(r) for r in rows])


@app.post("/api/order")
def new_order():
    d = request.get_json(force=True, silent=True) or {}
    name, phone, addr = (d.get("name") or "").strip(), (d.get("phone") or "").strip(), (d.get("address") or "").strip()
    if len(name) < 2 or len(digits(phone)) < 9 or len(addr) < 5:
        return jsonify(error="Ism, telefon va manzilni to'ldiring"), 400
    items, sub = [], 0
    for it in d.get("items", [])[:60]:
        try:
            product_id = int(it.get("id", 0))
            q = max(1, min(int(it.get("qty", 1)), 99))
        except (TypeError, ValueError):
            continue
        p = db("SELECT * FROM products WHERE id=? AND active=1", (product_id,), one=True)
        if p:
            items.append({"id": p["id"], "name": p["name"], "price": p["price"], "qty": q})
            sub += p["price"] * q
    if not items:
        return jsonify(error="Savat bo'sh"), 400
    fee = 0 if sub >= FREE_FROM else FEE
    tg_id = webapp_user(d.get("initData", "")) if d.get("initData") else None
    if not tg_id:
        c = db("SELECT tg_id FROM customers WHERE phone LIKE ?", ("%" + digits(phone)[-9:],), one=True)
        tg_id = c["tg_id"] if c else None
    oid = db("INSERT INTO orders(name,phone,address,comment,payment,items,fee,total,tg_id,created) VALUES(?,?,?,?,?,?,?,?,?,?)",
             (name[:80], phone[:30], addr[:300], (d.get("comment") or "")[:300],
              "card" if d.get("payment") == "card" else "cash", json.dumps(items, ensure_ascii=False),
              fee, sub + fee, tg_id, int(time.time())), commit=True)
    o = get_order(oid)
    admin_message_saved = False
    for a in ADMINS:
        r = send(a, "🔔 <b>Yangi buyurtma!</b>\n\n" + order_text(o), admin_kb(o))
        if r.get("ok") and not admin_message_saved:
            db("UPDATE orders SET admin_msg=? WHERE id=?", (r["result"]["message_id"], oid), commit=True)
            admin_message_saved = True
    if tg_id:
        send(tg_id, f"✅ <b>Buyurtma #{oid} qabul qilindi!</b>\nJami: {fmt(o['total'])}\nHolati shu yerda yangilanib turadi.")
    return jsonify(id=oid, total=o["total"], linked=bool(tg_id))


@app.get("/api/order/<int:oid>")
def track(oid):
    o = get_order(oid)
    if not o or digits(o["phone"])[-9:] != digits(request.args.get("phone", ""))[-9:]:
        return jsonify(error="Topilmadi"), 404
    c = db("SELECT * FROM couriers WHERE tg_id=?", (o["courier_id"],), one=True) if o["courier_id"] else None
    return jsonify(id=oid, status=o["status"], text=STATUS[o["status"]], total=o["total"],
                   courier=({"name": c["name"], "phone": c["phone"]} if c and o["status"] in ("assigned", "delivering", "delivered") else None))


init_db()
if __name__ == "__main__":
    if not TOKEN:
        print("⚠️ BOT_TOKEN yo'q — Telegram bot ishlamaydi. .env faylini to'ldiring.")
    elif not ADMINS:
        print("⚠️ ADMIN_IDS yo'q — bot ishlaydi, lekin admin funksiyalari ishlamaydi.")
        threading.Thread(target=poll, daemon=True).start()
    else:
        threading.Thread(target=poll, daemon=True).start()
    app.run(host="0.0.0.0", port=PORT, threaded=True)
