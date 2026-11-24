// Deterministic demo data — generated relative to "today" so charts always look alive.

const at = (dayOffset = 0, hour = 10, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const monthsBack = (months, day = 5, hour = 12) => {
  const d = new Date();
  d.setDate(day);
  d.setMonth(d.getMonth() - months);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export function createSeedData() {
  const customers = [
    ['Aziza Karimova', '+998 90 123 45 67', 'aziza@itech.uz', 'iTech'],
    ['Bobur Toshmatov', '+998 91 234 56 78', 'bobur@global.uz', 'Global Trade'],
    ['Dilshod Rahmatov', '+998 93 345 67 89', 'dilshod@delta.uz', 'Delta Group'],
    ['Malika Yusupova', '+998 94 456 78 90', 'malika@nova.uz', 'Nova Studio'],
    ['Otabek Sodiqov', '+998 95 567 89 01', 'otabek@prime.uz', 'Prime Solution'],
    ['Nodira Aliyeva', '+998 96 678 90 12', 'nodira@market.uz', 'Market Plus'],
    ['Jasur Ergashev', '+998 97 789 01 23', 'jasur@build.uz', 'Build Company'],
    ['Sevara Qodirova', '+998 98 890 12 34', 'sevara@soft.uz', 'SoftLab'],
    ['Rustam Valiyev', '+998 99 901 23 45', 'rustam@logistic.uz', 'Logistic Pro'],
    ['Gulnora Hasanova', '+998 88 112 23 34', 'gulnora@med.uz', 'MedCenter'],
  ].map(([name, phone, email, company], i) => ({
    id: `c${i + 1}`, name, phone, email, company,
    createdAt: monthsBack(5 - (i % 5), 3 + i),
  }));

  const employees = [
    ['Dilnoza', 'Rahmatova', 'Savdo menejeri', '+998 90 111 22 33', 'dilnoza@procrm.uz', 6500000, true],
    ['Sherzod', 'Qodirov', 'Mijozlar bilan ishlash', '+998 91 222 33 44', 'sherzod@procrm.uz', 5800000, true],
    ['Nilufar', 'Olimova', 'Marketing mutaxassisi', '+998 93 333 44 55', 'nilufar@procrm.uz', 6200000, true],
    ['Behzod', 'Akbarov', 'Ombor boshlig‘i', '+998 94 444 55 66', 'behzod@procrm.uz', 5400000, true],
    ['Shahnoza', 'Tursunova', 'Buxgalter', '+998 95 555 66 77', 'shahnoza@procrm.uz', 6000000, false],
    ['Akmal', 'Jo‘rayev', 'Dasturchi', '+998 96 666 77 88', 'akmal@procrm.uz', 7500000, true],
  ].map(([firstName, lastName, position, phone, email, salary, active], i) => ({
    id: `e${i + 1}`, firstName, lastName, position, phone, email, salary, active,
    createdAt: monthsBack(4, 2 + i),
  }));

  const products = [
    ['Laptop Pro 15', 12500000, 'Elektronika', 24],
    ['Monitor 27" 4K', 4200000, 'Elektronika', 38],
    ['Ofis stoli', 2800000, 'Mebel', 15],
    ['Ergonomik kreslo', 1950000, 'Mebel', 32],
    ['Simsiz sichqoncha', 320000, 'Aksessuar', 120],
    ['Mexanik klaviatura', 780000, 'Aksessuar', 64],
    ['Printer laser', 3500000, 'Ofis', 11],
    ['Headphones Studio', 1150000, 'Elektronika', 47],
  ].map(([name, price, category, stock], i) => ({
    id: `p${i + 1}`, name, price, category, stock,
    sku: `PRD-${String(i + 1).padStart(3, '0')}`,
    createdAt: monthsBack(5, 4 + i),
  }));

  const orderStatuses = ['Yakunlandi', 'Yakunlandi', 'Jarayonda', 'Kutilmoqda', 'Yakunlandi', 'Bekor qilindi'];
  const orders = Array.from({ length: 16 }, (_, i) => ({
    id: `o${i + 1}`,
    customerId: `c${(i % 10) + 1}`,
    amount: 850000 + ((i * 137) % 40) * 320000,
    status: orderStatuses[i % orderStatuses.length],
    date: at(-i * 2, 9 + (i % 8)),
    notes: i % 3 === 0 ? 'Tez yetkazib berish talab qilingan' : '',
    createdAt: at(-i * 2, 9 + (i % 8)),
  }));

  const sales = [];
  let saleIndex = 0;
  for (let m = 5; m >= 0; m -= 1) {
    const count = m === 0 ? 5 : 4;
    for (let j = 0; j < count; j += 1) {
      saleIndex += 1;
      const product = products[(saleIndex * 3 + j) % products.length];
      const quantity = 1 + ((saleIndex + j) % 4);
      sales.push({
        id: `s${saleIndex}`,
        customerId: `c${((saleIndex * 2) % 10) + 1}`,
        productId: product.id,
        employeeId: `e${((saleIndex * 3) % 6) + 1}`,
        quantity,
        unitPrice: product.price,
        total: product.price * quantity,
        date: m === 0 ? at(-((j + 1) * 3), 11 + j) : monthsBack(m, 4 + j * 5, 11 + j),
        createdAt: at(-saleIndex, 11),
      });
    }
  }

  const payments = [];
  sales.forEach((sale, i) => {
    if (i % 4 === 3) return; // leave some sales unpaid on purpose
    const paid = i % 5 === 0 ? Math.round(sale.total * 0.5) : sale.total;
    payments.push({
      id: `pay${i + 1}`,
      saleId: sale.id,
      customerId: sale.customerId,
      amount: paid,
      method: i % 2 === 0 ? 'Karta' : 'Naqd',
      date: sale.date,
      note: paid < sale.total ? 'Qisman to‘lov' : '',
      createdAt: sale.date,
    });
  });

  const tasks = [
    ['Yangi mijozlar bazasini yangilash', 'e1', -6, 2, 'Bajarildi', 'Yuqori'],
    ['Choraklik savdo hisobotini tayyorlash', 'e3', -3, 1, 'Jarayonda', 'Yuqori'],
    ['Ombor inventarizatsiyasi', 'e4', -2, 0, 'Jarayonda', 'O‘rta'],
    ['To‘lanmagan hisoblar bo‘yicha qo‘ng‘iroq', 'e2', -1, 3, 'Yangi', 'Yuqori'],
    ['Veb-sayt kontentini yangilash', 'e6', 0, 7, 'Yangi', 'Past'],
    ['Mijozlarga bayram tabriklari', 'e3', 1, 5, 'Yangi', 'O‘rta'],
    ['Xodimlar uchun trening', 'e5', 2, 9, 'Yangi', 'O‘rta'],
    ['Yangi mahsulot katalogi', 'e6', 3, 12, 'Yangi', 'Past'],
  ].map(([title, employeeId, start, due, status, priority], i) => ({
    id: `t${i + 1}`, title, employeeId,
    startDate: at(start, 9), dueDate: at(due, 18),
    status, priority, createdAt: at(start - 1, 10),
  }));

  const activities = [
    ['Yangi buyurtma qabul qilindi', 'orders', at(0, 9, 20)],
    ['To‘lov qayd etildi', 'payments', at(0, 10, 45)],
    ['Mijoz ma’lumotlari yangilandi', 'customers', at(-1, 15, 10)],
    ['Vazifa bajarildi', 'tasks', at(-1, 17, 5)],
    ['Yangi mahsulot omborga keldi', 'products', at(-2, 11, 30)],
    ['Savdo amalga oshirildi', 'sales', at(-2, 14, 15)],
    ['Xodim qo‘shildi', 'employees', at(-3, 10, 0)],
    ['Hisobot eksport qilindi', 'reports', at(-4, 16, 40)],
  ].map(([message, type, date], i) => ({ id: `a${i + 1}`, message, type, date }));

  return { customers, orders, employees, products, sales, payments, tasks, activities };
}

export const EMPTY_DATA = {
  customers: [], orders: [], employees: [], products: [],
  sales: [], payments: [], tasks: [], activities: [],
};
