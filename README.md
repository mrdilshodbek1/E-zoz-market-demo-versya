# EZOZ MARKET — sayt, admin panel va Telegram bot

## Ishga tushirish
Oson yo'l: Windows'da `run.bat`, Linux/Mac'da `./run.sh`. Birinchi marta `.env.example` dan `.env` yaratiladi — `BOT_TOKEN`, `ADMIN_IDS`, `WEBAPP_URL` ni to'ldirib, qayta ishga tushiring.

Qo'lda:
1. `pip install -r requirements.txt`
2. `.env.example` → `.env`, qiymatlarni yozing
3. `python server.py` → http://localhost:8000

Fayllarni serversiz ham ochish mumkin (`1-bosh-sahifa.html` ni brauzerda oching) — bunda ma'lumotlar brauzerda saqlanadi, Telegram'ga xabar ketmaydi.

## Sahifalar
| Mijoz | Fayl |
|---|---|
| Bosh sahifa | `1-bosh-sahifa.html` |
| Savat va buyurtma | `2-savat.html` |
| Buyurtma qabul qilindi | `3-buyurtma-qabul.html` |
| Buyurtmalarim (sodiqlik darajasi) | `4-buyurtmalarim.html` |
| Telegram mini-ilova (eski) | `index.html` |

| Admin | Fayl |
|---|---|
| Boshqaruv paneli | `5-admin.html` |
| Buyurtmalar / Mahsulotlar / Mijozlar | `admin-buyurtmalar.html`, `admin-mahsulotlar.html`, `admin-mijozlar.html` |
| Promokodlar & Aksiyalar, darajalar | `admin-promokodlar.html` |
| Sozlamalar | `admin-sozlamalar.html` |
| Analitika (5 sahifa) | `admin-analitika-yangi.html`, `-jami`, `-tushum`, `-mijozlar`, `-promokod` |

Kod: `assets/css/*` (dizayn tizimi), `assets/js/store.js` (umumiy ma'lumotlar), `shop.js` + sahifa skriptlari (mijoz), `admin.js`, `analytics.js`, `charts.js` (admin).

## Loyallik darajalari
Yakunlangan buyurtmalar soni bo'yicha: Silver 11+, Bronze 24+, Gold 50+, 11 dan kam — «Oddiy mijoz». Chegaralar va ranglar admin paneldan o'zgartiriladi.

## Muhim
- Admin panelda hozircha parol yo'q — internetga chiqarishdan oldin login qo'shing yoki manzilni yoping.
- Saytdagi buyurtma serverga (`/api/order`) yuboriladi va Telegram'da adminga keladi. Promokod chegirmasi izohda ko'rsatiladi.
- Analitikadagi tarixiy raqamlar namunaviy (demo) ma'lumotlar.

## Telegram rollari
- **Admin** (`ADMIN_IDS`): yangi buyurtma tugmalar bilan keladi (Qabul → Tayyorlanmoqda → Kuryer tanlash). `/admin` — barcha buyruqlar.
- **Kuryer**: admin `/kuryer_qosh TelegramID Ism telefon` deydi. Kuryer: «Yo'lga chiqdim» → «Yetkazildi».
- **Mijoz**: /start, telefon yuboradi, saytdan buyurtma beradi, har bosqichda xabar oladi.
