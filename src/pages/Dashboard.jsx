import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  AlertTriangle, ArrowUpRight, Banknote, CheckCircle2, Clock3, Package, ShoppingCart, Users, Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  getMonthlySales, getPaymentSummary, getTopCustomers,
} from '../services/calculations';
import { customerName, employeeName } from '../utils/lookup';
import { formatDate, initials, money } from '../utils/format';
import StatCard from '../components/ui/StatCard';
import ChartCard from '../components/ChartCard';
import StatusBadge from '../components/ui/StatusBadge';
import PageHeader from '../components/ui/PageHeader';

export default function Dashboard() {
  const { data, stats, settings } = useApp();
  const monthly = getMonthlySales(data.sales);
  const payment = getPaymentSummary(data.sales, data.payments);
  const topCustomers = getTopCustomers(data.sales, data.customers);
  const lowStock = settings.notifications?.lowStock ? data.products.filter((p) => p.stock <= 15) : [];
  const pieData = [
    { name: 'To‘langan', value: payment.paid },
    { name: 'Qolgan', value: payment.unpaid },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Dashboard" subtitle={`Assalomu alaykum, ${settings.ownerName?.split(' ')[0] || 'admin'}! Bugungi biznes holati.`}>
        <Link to="/reports" className="btn-secondary"><ArrowUpRight size={16} /> Hisobotlar</Link>
        <Link to="/orders" className="btn-primary"><ShoppingCart size={16} /> Buyurtma qo‘shish</Link>
      </PageHeader>

      {lowStock.length > 0 && (
        <Link to="/products" className="mb-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle size={18} />
          <span><b>{lowStock.length} ta mahsulot</b> omborda kam qoldi. Tekshirib chiqing.</span>
          <ArrowUpRight size={16} className="ml-auto" />
        </Link>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Jami mijozlar" value={stats.totalCustomers} hint="Bazadagi barcha mijozlar" tone="blue" trend={12} />
        <StatCard icon={ShoppingCart} label="Jami buyurtmalar" value={stats.totalOrders} hint={`${stats.completedOrders} ta yakunlangan`} tone="violet" trend={8} />
        <StatCard icon={Wallet} label="Umumiy daromad" value={money(stats.revenue)} hint="Barcha savdolar bo‘yicha" tone="emerald" trend={18} />
        <StatCard icon={Clock3} label="Kutilayotgan buyurtmalar" value={stats.pendingOrders} hint="Tez orada ko‘rib chiqiladi" tone="amber" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Banknote} label="To‘langan summa" value={money(payment.paid)} hint={`${payment.percent}% to‘langan`} tone="emerald" />
        <StatCard icon={AlertTriangle} label="Qarzdorlik" value={money(payment.unpaid)} hint="To‘lanmagan savdolar" tone="rose" />
        <StatCard icon={CheckCircle2} label="Faol vazifalar" value={stats.activeTasks} hint={`${stats.activeEmployees} ta faol xodim`} tone="blue" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="Oylik savdo" subtitle="Oxirgi 6 oy bo‘yicha daromad" className="xl:col-span-2">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" opacity={0.12} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => v >= 1000000 ? `${v / 1000000}M` : v >= 1000 ? `${v / 1000}K` : v} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(value) => [money(value), 'Savdo']} />
                <Area type="monotone" dataKey="savdo" stroke="#059669" strokeWidth={2.5} fill="url(#salesGradient)" activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="To‘lovlar holati" subtitle="To‘langan va qolgan summa">
          <div className="relative h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={58} outerRadius={80} paddingAngle={4} stroke="none">
                  <Cell fill="#10b981" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip formatter={(value) => money(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold">{payment.percent}%</span>
              <span className="text-[11px] text-slate-400">to‘langan</span>
            </div>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-500"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> To‘langan</span><b>{money(payment.paid)}</b></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-500"><i className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Qolgan</span><b>{money(payment.unpaid)}</b></div>
          </div>
        </ChartCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="card overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
            <div><h3 className="text-sm font-bold">Oxirgi buyurtmalar</h3><p className="text-xs text-slate-400">Eng so‘nggi 5 ta buyurtma</p></div>
            <Link to="/orders" className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400">Barchasi →</Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Buyurtma</th><th>Mijoz</th><th>Summa</th><th>Holat</th><th>Sana</th></tr></thead>
              <tbody>
                {data.orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="font-semibold text-brand-600 dark:text-brand-400">#{order.id.toUpperCase()}</td>
                    <td>{customerName(data.customers, order.customerId)}</td>
                    <td className="font-semibold">{money(order.amount)}</td>
                    <td><StatusBadge value={order.status} /></td>
                    <td className="text-slate-400">{formatDate(order.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="text-sm font-bold">Eng faol mijozlar</h3><p className="text-xs text-slate-400">Savdo hajmi bo‘yicha</p></div>
            <Users size={17} className="text-brand-500" />
          </div>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center gap-3">
                <span className="avatar-grad flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white">{initials(customer.name)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold">{customer.name}</span>
                  <span className="block text-[11px] text-slate-400">{customer.orderCount} ta savdo</span>
                </span>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{money(customer.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <h3 className="mb-4 text-sm font-bold">So‘nggi faoliyatlar</h3>
          <div className="space-y-1">
            {data.activities.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50 dark:hover:bg-white/5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10"><CheckCircle2 size={15} /></span>
                <span className="flex-1 text-xs font-medium">{item.message}</span>
                <span className="text-[11px] text-slate-400">{formatDate(item.date, true)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold"><Package size={16} className="text-brand-500" /> Ombor holati</h3>
          <div className="space-y-3">
            {data.products.slice(0, 5).map((product) => (
              <div key={product.id}>
                <div className="flex justify-between text-xs"><span className="truncate">{product.name}</span><b className={product.stock <= 15 ? 'text-rose-500' : ''}>{product.stock} dona</b></div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className={`h-full rounded-full ${product.stock <= 15 ? 'bg-rose-500' : 'bg-brand-500'}`} style={{ width: `${Math.min(100, product.stock * 2)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-slate-400">Savdo bo‘yicha mas’ul: {employeeName(data.employees, data.sales[0]?.employeeId)}</p>
        </div>
      </div>
    </div>
  );
}
