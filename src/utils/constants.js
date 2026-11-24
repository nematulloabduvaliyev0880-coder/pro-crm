// Shared constants: navigation, statuses and lightweight translations.

export const NAV_ITEMS = [
  { path: '/', key: 'dashboard' },
  { path: '/customers', key: 'customers' },
  { path: '/orders', key: 'orders' },
  { path: '/employees', key: 'employees' },
  { path: '/products', key: 'products' },
  { path: '/sales', key: 'sales' },
  { path: '/payments', key: 'payments' },
  { path: '/tasks', key: 'tasks' },
  { path: '/reports', key: 'reports' },
  { path: '/settings', key: 'settings' },
];

export const ORDER_STATUSES = ['Kutilmoqda', 'Jarayonda', 'Yakunlandi', 'Bekor qilindi'];
export const TASK_STATUSES = ['Yangi', 'Jarayonda', 'Bajarildi'];
export const TASK_PRIORITIES = ['Yuqori', 'O‘rta', 'Past'];
export const PAYMENT_METHODS = ['Naqd', 'Karta', 'O‘tkazma'];
export const PRODUCT_CATEGORIES = ['Elektronika', 'Ofis', 'Mebel', 'Aksessuar', 'Boshqa'];

export const STATUS_STYLES = {
  'Kutilmoqda': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  'Jarayonda': 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  'Yakunlandi': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  'Bekor qilindi': 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  'Bajarildi': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  'Yangi': 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
  'Yuqori': 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  'O‘rta': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  'Past': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  'To‘langan': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  'Qisman': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  'To‘lanmagan': 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  'Faol': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  'Nofaol': 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
};

export const TRANSLATIONS = {
  uz: {
    dashboard: 'Dashboard', customers: 'Mijozlar', orders: 'Buyurtmalar', employees: 'Xodimlar',
    products: 'Mahsulotlar', sales: 'Savdo', payments: 'To‘lovlar', tasks: 'Vazifalar',
    reports: 'Hisobotlar', settings: 'Sozlamalar', workspace: 'ISH MAYDONI',
    preferences: 'SOZLAMALAR', add: 'Qo‘shish', edit: 'Tahrirlash', delete: 'O‘chirish',
    cancel: 'Bekor qilish', save: 'Saqlash', search: 'Qidirish...', all: 'Barchasi',
    actions: 'Harakatlar', status: 'Holat', date: 'Sana', amount: 'Summa',
    noData: 'Ma’lumot topilmadi', welcome: 'Xush kelibsiz', overview: 'Umumiy ko‘rinish',
  },
  en: {
    dashboard: 'Dashboard', customers: 'Customers', orders: 'Orders', employees: 'Employees',
    products: 'Products', sales: 'Sales', payments: 'Payments', tasks: 'Tasks',
    reports: 'Reports', settings: 'Settings', workspace: 'WORKSPACE',
    preferences: 'PREFERENCES', add: 'Add', edit: 'Edit', delete: 'Delete',
    cancel: 'Cancel', save: 'Save', search: 'Search...', all: 'All',
    actions: 'Actions', status: 'Status', date: 'Date', amount: 'Amount',
    noData: 'No data found', welcome: 'Welcome', overview: 'Overview',
  },
  ru: {
    dashboard: 'Главная', customers: 'Клиенты', orders: 'Заказы', employees: 'Сотрудники',
    products: 'Товары', sales: 'Продажи', payments: 'Платежи', tasks: 'Задачи',
    reports: 'Отчёты', settings: 'Настройки', workspace: 'РАБОЧЕЕ ПРОСТРАНСТВО',
    preferences: 'НАСТРОЙКИ', add: 'Добавить', edit: 'Изменить', delete: 'Удалить',
    cancel: 'Отмена', save: 'Сохранить', search: 'Поиск...', all: 'Все',
    actions: 'Действия', status: 'Статус', date: 'Дата', amount: 'Сумма',
    noData: 'Данные не найдены', welcome: 'Добро пожаловать', overview: 'Обзор',
  },
};
