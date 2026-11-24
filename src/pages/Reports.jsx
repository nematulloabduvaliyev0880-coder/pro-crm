import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Download, Package, TrendingUp, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getCustomerGrowth, getEmployeePerformance, getMonthlySales,
  getTopProducts, getWeeklySales,
} from '../services/calculations';
import { initials, money } from '../utils/format';
import ChartCard from '../components/ChartCard';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];
const axis = { axisLine: false, tickLine: false, tick: { fontSize: 11, fill: '#94a3b8' } };

export default function Reports() {
  const { data, notify } = useApp();
  const monthly = getMonthlySales(data.sales);
  const weekly = getWeeklySales(data.sales);
  const growth = getCustomerGrowth(data.customers);
  const topProducts = getTopProducts(data.sales, data.products);
  const performance = getEmployeePerformance(data.sales, data.employees, data.tasks);
  const totalRevenue = data.sales.reduce((sum, item) => sum + item.total, 0);

  const exportCSV = () => {
    const rows = [['Oy', 'Savdo (so‘m)'], ...monthly.map((m) => [m.name, m.savdo])];
    const csv = `\uFEFF${rows.map((row) => row.join(',')).join('\n')}`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'procrm-oylik-hisobot.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    notify('Hisobot CSV fayli yuklab olindi');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Hisobotlar" subtitle="Biznes ko‘rsatkichlari va samaradorlik tahlili">
        <button type="button" className="btn-secondary" onClick={exportCSV}><Download size={16} /> CSV yuklab olish</button>
      </PageHeader>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={TrendingUp} label="Umumiy daromad" value={money(totalRevenue)} tone="emerald" />
        <StatCard icon={Users} label="Jami mijozlar" value={data.customers.length} tone="blue" />
        <StatCard icon={Package} label="Sotilgan mahsulotlar" value={data.sales.reduce((s, item) => s + item.quantity, 0)} tone="violet" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Oylik daromad" subtitle="Oxirgi 6 oy bo‘yicha savdo hajmi">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" opacity={0.12} />
                <XAxis dataKey="name" {...axis} />
                <YAxis {...axis} tickFormatter={(v) => v >= 1000000 ? `${v / 1000000}M` : v >= 1000 ? `${v / 1000}K` : v} />
                <Tooltip cursor={{ fill: 'rgba(16,185,129,.06)' }} formatter={(v) => [money(v), 'Daromad']} />
                <Bar dataKey="savdo" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Haftalik savdo" subtitle="So‘nggi 7 kun bo‘yicha">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekly} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" opacity={0.12} />
                <XAxis dataKey="name" {...axis} />
                <YAxis {...axis} tickFormatter={(v) => v >= 1000000 ? `${v / 1000000}M` : v >= 1000 ? `${v / 1000}K` : v} />
                <Tooltip formatter={(v) => [money(v), 'Savdo']} />
                <Line type="monotone" dataKey="savdo" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Mijozlar soni" subtitle="Oylar bo‘yicha yangi mijozlar">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" opacity={0.12} />
                <XAxis dataKey="name" {...axis} />
                <YAxis allowDecimals={false} {...axis} />
                <Tooltip formatter={(v) => [`${v} ta`, 'Yangi mijoz']} />
                <Line type="monotone" dataKey="mijozlar" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Eng ko‘p sotilgan mahsulotlar" subtitle="Sotilgan dona soni bo‘yicha">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 16, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="currentColor" opacity={0.12} />
                <XAxis type="number" {...axis} />
                <YAxis type="category" dataKey="name" width={110} {...axis} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip formatter={(v) => [`${v} dona`, 'Sotildi']} />
                <Bar dataKey="sold" radius={[0, 6, 6, 0]}>
                  {topProducts.map((_, index) => <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard title="Mahsulotlar ulushi" subtitle="Daromad bo‘yicha" className="xl:col-span-1">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topProducts} dataKey="revenue" nameKey="name" outerRadius={78} paddingAngle={2}>
                  {topProducts.map((_, index) => <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => money(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="card overflow-hidden xl:col-span-2">
          <div className="border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold">Xodimlar samaradorligi</h3>
            <p className="text-xs text-slate-400">Savdo hajmi va bajarilgan vazifalar</p>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Xodim</th><th>Lavozim</th><th>Savdo</th><th>Bajarilgan vazifa</th></tr></thead>
              <tbody>
                {performance.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="avatar-grad flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white">{initials(`${employee.firstName} ${employee.lastName}`)}</span>
                        <span className="font-semibold">{employee.firstName} {employee.lastName}</span>
                      </div>
                    </td>
                    <td className="text-slate-400">{employee.position}</td>
                    <td className="font-bold text-brand-600 dark:text-brand-400">{money(employee.revenue)}</td>
                    <td>{employee.completedTasks} ta</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
