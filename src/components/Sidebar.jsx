import { NavLink } from 'react-router-dom';
import {
  BarChart3, CheckSquare, CreditCard, LayoutDashboard, Package,
  Settings, ShoppingCart, Sparkles, TrendingUp, UserCog, Users, X,
} from 'lucide-react';
import { NAV_ITEMS } from '../utils/constants';
import { useApp } from '../context/AppContext';

const ICONS = {
  dashboard: LayoutDashboard,
  customers: Users,
  orders: ShoppingCart,
  employees: UserCog,
  products: Package,
  sales: TrendingUp,
  payments: CreditCard,
  tasks: CheckSquare,
  reports: BarChart3,
  settings: Settings,
};

export default function Sidebar({ open, onClose }) {
  const { t, settings, data } = useApp();

  const menu = NAV_ITEMS.map((item) => ({
    ...item,
    icon: ICONS[item.key],
    label: t(item.key),
  }));

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between px-5 py-6">
        <NavLink to="/" onClick={onClose} className="flex items-center gap-3">
          <span className="avatar-grad flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg shadow-emerald-500/20">
            <Sparkles size={20} />
          </span>
          <span className="text-lg font-extrabold tracking-tight">Pro<span className="text-brand-600 dark:text-brand-400">CRM</span></span>
        </NavLink>
        <button type="button" onClick={onClose} className="icon-action lg:hidden" aria-label="Menyni yopish"><X size={19} /></button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="mb-2 px-3 text-[10px] font-bold tracking-[.14em] text-slate-400">{t('workspace')}</p>
        <div className="space-y-1">
          {menu.slice(0, 9).map(({ path, key, icon: Icon, label }) => (
            <NavLink
              key={key}
              to={path}
              end={path === '/'}
              onClick={onClose}
              className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-brand-600 dark:text-brand-400' : ''} />
                  <span>{label}</span>
                  {key === 'tasks' && data.tasks.filter((task) => task.status !== 'Bajarildi').length > 0 && (
                    <span className="ml-auto rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                      {data.tasks.filter((task) => task.status !== 'Bajarildi').length}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <p className="mb-2 mt-7 px-3 text-[10px] font-bold tracking-[.14em] text-slate-400">{t('preferences')}</p>
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
          }`}
        >
          <Settings size={18} /> <span>{t('settings')}</span>
        </NavLink>
      </nav>

      <NavLink to="/settings" onClick={onClose} className="m-3 flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-brand-400" style={{ borderColor: 'var(--border)' }}>
        <span className="avatar-grad flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
          {settings.ownerName?.slice(0, 1) || 'A'}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-bold">{settings.ownerName}</span>
          <span className="block truncate text-[11px] text-slate-400">{settings.company}</span>
        </span>
      </NavLink>
    </aside>
  );
}
