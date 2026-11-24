# Pro CRM

Zamonaviy, to‘liq ishlaydigan CRM tizimi — React, Vite, Tailwind CSS, React Router, Lucide va Recharts yordamida yaratilgan. Barcha ma’lumotlar brauzerning LocalStorage’ida saqlanadi va sahifa yangilanganda yo‘qolmaydi.

## ✨ Imkoniyatlar

- **10 ta sahifa:** Dashboard, Mijozlar, Buyurtmalar, Xodimlar, Mahsulotlar, Savdo, To‘lovlar, Vazifalar, Hisobotlar, Sozlamalar.
- **To‘liq CRUD:** barcha bo‘limlarda qo‘shish, tahrirlash, o‘chirish.
- **Real statistika:** barcha ko‘rsatkichlar va grafiklar saqlangan ma’lumotlardan hisoblanadi.
- **Qidiruv va filterlar:** har bir ro‘yxatda ishlaydi, yuqoridagi global qidiruv esa barcha bo‘limlarda qidiradi.
- **To‘lovlar:** naqd/karta, qisman to‘lovlar, qarzdorlik avtomatik hisoblanadi.
- **Vazifalar:** mas’ul xodim, muddat, muhimlik va bajarilish holati.
- **Hisobotlar:** Recharts orqali oylik daromad, haftalik savdo, mijozlar o‘sishi, mahsulotlar ulushi va xodimlar samaradorligi.
- **Dark/Light mode**, 3 til (O‘zbekcha, English, Русский), bildirishnomalar, demo ma’lumotlarni qayta yuklash.
- **Toast xabarlari**, chiroyli bo‘sh holatlar, form validatsiyasi va responsive dizayn.

## 📁 Struktura

```
src/
  components/      # qayta ishlatiladigan UI komponentlar
  pages/           # 10 ta sahifa
  layouts/         # asosiy layout (sidebar + topbar)
  hooks/           # useLocalStorage
  context/         # AppContext (ma’lumotlar, CRUD, tema, til, toast)
  services/        # demo ma’lumotlar hisoblash xizmatlari
  utils/           # formatlash, konstantalar, lookup
  assets/
  App.jsx
  main.jsx
  index.css
```

## 🚀 Ishga tushirish

```bash
npm install
npm run dev
```

Keyin brauzerda **http://localhost:5173** ni oching.

Production build uchun:

```bash
npm run build
npm run preview
```

## 💾 Ma’lumotlar

- `procrm.data.v1` — barcha CRM yozuvlari.
- `procrm.settings.v1` — profil, til, tema va bildirishnoma sozlamalari.

Birinchi ochilishda demo ma’lumotlar avtomatik yuklanadi. **Sozlamalar → Demo ma’lumotlar** orqali ularni qayta tiklash, **Hammasini tozalash** orqali bo‘sh bazaga o‘tish mumkin.

## 🛠 Texnologiyalar

React 18 · Vite · Tailwind CSS · React Router DOM · Recharts · Lucide React · LocalStorage.
