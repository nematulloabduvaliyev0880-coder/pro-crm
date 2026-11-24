import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';
import { NAV_ITEMS } from '../utils/constants';
import { useApp } from '../context/AppContext';
import { formatDate, money } from '../utils/format';

export default function Topbar({ onMenuClick }) {
  const { data, settings, toggleTheme, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchRef = useRef(null);
  const notifyRef = useRef(null);

  const current = NAV_ITEMS.find((item) => item.path === location.pathname);
  const title = current ? t(current.key) : t('dashboard');

  useEffect(() => {
    const handler = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false);
      if (notifyRef.current && !notifyRef.current.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const go = (path) => `${path}?q=${encodeURIComponent(query.trim())}`;
    return [
      ...data.customers.filter((item) => `${item.name} ${item.phone} ${item.company}`.toLowerCase().includes(q))
        .slice(0, 3).map((item) => ({ id: item.id, type: 'Mijoz', label: item.name, sub: item.phone, path: go('/customers') })),
      ...data.products.filter((item) => `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(q))
        .slice(0, 3).map((item) => ({ id: item.id, type: 'Mahsulot', label: item.name, sub: money(item.price), path: go('/products') })),
      ...data.employees.filter((item) => `${item.firstName} ${item.lastName} ${item.position}`.toLowerCase().includes(q))
        .slice(0, 2).map((item) => ({ id: item.id, type: 'Xodim', label: `${item.firstName} ${item.lastName}`, sub: item.position, path: go('/employees') })),
      ...data.orders.filter((item) => item.id.toLowerCase().includes(q))
        .slice(0, 2).map((item) => ({ id: item.id, type: 'Buyurtma', label: item.id.toUpperCase(), sub: money(item.amount), path: go('/orders') })),
    ].slice(0, 7);
  }, [query, data]);

  const lowStock = settings.notifications?.lowStock
    ? data.products.filter((product) => product.stock <= 15)
    : [];

  const openResult = (path) => {
    navigate(path);
    setQuery('');
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b px-4 backdrop-blur-xl sm:px-6"
      style={{ background: 'color-mix(in srgb, var(--surface) 88%, transparent)', borderColor: 'var(--border)' }}>
      <button type="button" onClick={onMenuClick} className="icon-action lg:hidden" aria-label="Menyu"><Menu size={21} /></button>

      <div className="min-w-0">
        <h2 className="truncate text-lg font-extrabold tracking-tight sm:text-xl">{title}</h2>
        <p className="hidden text-[11px] text-slate-400 sm:block">Nova Business · {formatDate(new Date())}</p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div ref={searchRef} className="relative hidden sm:block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input w-48 py-2 pl-9 pr-3 text-xs lg:w-64"
            placeholder={t('search')}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && results[0]) openResult(results[0].path);
              if (event.key === 'Escape') setSearchOpen(false);
            }}
          />
          {searchOpen && query.trim() && (
            <div className="absolute right-0 top-full z-40 mt-2 w-[320px] overflow-hidden rounded-xl border shadow-xl" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              {results.length ? results.map((result) => (
                <button key={`${result.type}-${result.id}`} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => openResult(result.path)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-brand-50 dark:hover:bg-white/5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-[10px] font-bold text-brand-600 dark:bg-brand-500/10">{result.type.slice(0, 2)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">{result.label}</span>
                    <span className="block truncate text-[11px] text-slate-400">{result.sub}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{result.type}</span>
                </button>
              )) : <p className="px-4 py-5 text-center text-xs text-slate-400">Natija topilmadi</p>}
            </div>
          )}
        </div>

        <div ref={notifyRef} className="relative">
          <button type="button" onClick={() => setNotificationsOpen((v) => !v)} className="icon-action relative" aria-label="Bildirishnomalar">
            <Bell size={19} />
            {(data.activities.length > 0 || lowStock.length > 0) && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-[320px] overflow-hidden rounded-xl border shadow-xl" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="border-b px-4 py-3 text-xs font-bold" style={{ borderColor: 'var(--border)' }}>Bildirishnomalar</div>
              <div className="max-h-80 overflow-y-auto">
                {lowStock.map((product) => (
                  <button key={product.id} type="button" onClick={() => { navigate(`/products?q=${encodeURIComponent(product.name)}`); setNotificationsOpen(false); }}
                    className="flex w-full gap-3 px-4 py-3 text-left hover:bg-amber-50 dark:hover:bg-amber-500/5">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                    <span><span className="block text-xs font-semibold">Omborda kam qoldi: {product.name}</span><span className="text-[11px] text-slate-400">Jami {product.stock} dona</span></span>
                  </button>
                ))}
                {data.activities.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex gap-3 px-4 py-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                    <span><span className="block text-xs font-semibold">{item.message}</span><span className="text-[11px] text-slate-400">{formatDate(item.date, true)}</span></span>
                  </div>
                ))}
                {!data.activities.length && !lowStock.length && <p className="px-4 py-6 text-center text-xs text-slate-400">Bildirishnoma yo‘q</p>}
              </div>
            </div>
          )}
        </div>

        <button type="button" onClick={toggleTheme} className="icon-action" aria-label="Temani o‘zgartirish">
          {settings.theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <span className="avatar-grad hidden h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white sm:flex">
          {settings.ownerName?.slice(0, 1) || 'A'}
        </span>
      </div>
    </header>
  );
}
