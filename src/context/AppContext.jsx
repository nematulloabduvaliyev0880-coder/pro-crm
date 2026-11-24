import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createSeedData, EMPTY_DATA } from '../services/seed';
import { getDashboardStats } from '../services/calculations';
import { TRANSLATIONS } from '../utils/constants';
import { uid } from '../utils/format';

const AppContext = createContext(null);

export const DEFAULT_SETTINGS = {
  theme: 'light',
  language: 'uz',
  company: 'Nova Business',
  ownerName: 'Aziza Karimova',
  ownerEmail: 'admin@novabusiness.uz',
  phone: '+998 90 123 45 67',
  notifications: { toasts: true, lowStock: true },
};

const COLLECTION_LABELS = {
  customers: 'Mijoz', orders: 'Buyurtma', employees: 'Xodim', products: 'Mahsulot',
  sales: 'Savdo', payments: 'To‘lov', tasks: 'Vazifa',
};

const activity = (message, type) => ({
  id: uid('act'), message, type, date: new Date().toISOString(),
});

export function AppProvider({ children }) {
  const [data, setData] = useLocalStorage('procrm.data.v1', createSeedData);
  const [settings, setSettings] = useLocalStorage('procrm.settings.v1', DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState([]);
  const timers = useRef([]);

  // Theme + language are reflected on the root element.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', settings.theme === 'dark');
    root.setAttribute('data-theme', settings.theme);
    root.lang = settings.language || 'uz';
  }, [settings.theme, settings.language]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const dismissToast = (id) => setToasts((list) => list.filter((item) => item.id !== id));

  const notify = (message, type = 'success') => {
    if (settings.notifications?.toasts === false) return;
    const id = uid('toast');
    setToasts((list) => [...list, { id, message, type }]);
    timers.current.push(setTimeout(() => dismissToast(id), 3600));
  };

  const t = (key) => TRANSLATIONS[settings.language]?.[key] || TRANSLATIONS.uz[key] || key;

  const updateSettings = (patch) => {
    setSettings((prev) => ({
      ...prev,
      ...patch,
      notifications: { ...prev.notifications, ...(patch.notifications || {}) },
    }));
  };

  const create = (collection, item) => {
    const record = {
      ...item,
      id: item.id || uid(`${collection.slice(0, 3)}`),
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      [collection]: [record, ...(prev[collection] || [])],
      activities: [activity(`Yangi ${COLLECTION_LABELS[collection] || 'yozuv'} qo‘shildi`, collection), ...prev.activities].slice(0, 50),
    }));
    notify(`${COLLECTION_LABELS[collection] || 'Yozuv'} muvaffaqiyatli qo‘shildi`);
    return record;
  };

  const update = (collection, id, patch) => {
    setData((prev) => ({
      ...prev,
      [collection]: (prev[collection] || []).map((item) => (item.id === id ? { ...item, ...patch } : item)),
      activities: [activity(`${COLLECTION_LABELS[collection] || 'Yozuv'} ma’lumotlari yangilandi`, collection), ...prev.activities].slice(0, 50),
    }));
    notify('O‘zgarishlar saqlandi');
  };

  const remove = (collection, id) => {
    setData((prev) => {
      const next = { ...prev };
      next[collection] = (prev[collection] || []).filter((item) => item.id !== id);

      // Keep related records consistent when a parent is removed.
      if (collection === 'customers') {
        const saleIds = prev.sales.filter((s) => s.customerId === id).map((s) => s.id);
        next.orders = prev.orders.filter((o) => o.customerId !== id);
        next.sales = prev.sales.filter((s) => s.customerId !== id);
        next.payments = prev.payments.filter((p) => p.customerId !== id && !saleIds.includes(p.saleId));
      }
      if (collection === 'products') {
        const saleIds = prev.sales.filter((s) => s.productId === id).map((s) => s.id);
        next.sales = prev.sales.filter((s) => s.productId !== id);
        next.payments = prev.payments.filter((p) => !saleIds.includes(p.saleId));
      }
      if (collection === 'sales') next.payments = prev.payments.filter((p) => p.saleId !== id);
      if (collection === 'employees') {
        next.tasks = prev.tasks.map((task) => (task.employeeId === id ? { ...task, employeeId: '' } : task));
        next.sales = prev.sales.map((sale) => (sale.employeeId === id ? { ...sale, employeeId: '' } : sale));
      }

      next.activities = [activity(`${COLLECTION_LABELS[collection] || 'Yozuv'} o‘chirildi`, collection), ...prev.activities].slice(0, 50);
      return next;
    });
    notify(`${COLLECTION_LABELS[collection] || 'Yozuv'} o‘chirildi`, 'error');
  };

  const resetDemo = () => {
    setData(createSeedData());
    notify('Demo ma’lumotlar qayta yuklandi');
  };

  const clearAll = () => {
    setData({ ...EMPTY_DATA });
    notify('Barcha ma’lumotlar tozalandi', 'error');
  };

  const stats = useMemo(() => getDashboardStats(data), [data]);

  const value = {
    data, settings, stats, toasts, t,
    notify, dismissToast, updateSettings,
    create, update, remove, resetDemo, clearAll,
    toggleTheme: () => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' }),
    setLanguage: (language) => updateSettings({ language }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
