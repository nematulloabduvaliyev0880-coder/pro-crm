import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, Banknote, Pencil, Plus, Search, Trash2, TrendingUp, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPaymentSummary, getSalesWithStatus } from '../services/calculations';
import { customerName, employeeName, productName } from '../utils/lookup';
import { dateInputValue, formatDate, money } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';
import StatCard from '../components/ui/StatCard';

const emptyForm = () => ({
  customerId: '', productId: '', employeeId: '', quantity: 1,
  unitPrice: 0, date: dateInputValue(new Date()),
});

export default function Sales() {
  const { data, create, update, remove, notify } = useApp();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});

  useEffect(() => { setSearch(searchParams.get('q') || ''); }, [searchParams]);

  const salesWithStatus = useMemo(() => getSalesWithStatus(data.sales, data.payments), [data.sales, data.payments]);
  const summary = getPaymentSummary(data.sales, data.payments);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return salesWithStatus.filter((sale) => {
      const text = `${sale.id} ${customerName(data.customers, sale.customerId)} ${productName(data.products, sale.productId)}`.toLowerCase();
      return (!q || text.includes(q)) && (!status || sale.status === status);
    });
  }, [salesWithStatus, data.customers, data.products, search, status]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (sale) => {
    setEditing(sale);
    setForm({ ...sale, date: dateInputValue(sale.date) });
    setErrors({});
    setFormOpen(true);
  };

  const changeProduct = (productId) => {
    const product = data.products.find((item) => item.id === productId);
    setForm((prev) => ({ ...prev, productId, unitPrice: product?.price || 0 }));
  };

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.customerId) next.customerId = 'Mijoz tanlanishi shart';
    if (!form.productId) next.productId = 'Mahsulot tanlanishi shart';
    if (!form.date) next.date = 'Sana kiritilishi shart';
    if (Number(form.quantity) < 1) next.quantity = 'Kamida 1 dona kiriting';
    if (Number(form.unitPrice) < 0) next.unitPrice = 'Narx noto‘g‘ri';
    if (Object.keys(next).length) { setErrors(next); return; }

    const payload = {
      customerId: form.customerId,
      productId: form.productId,
      employeeId: form.employeeId,
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice),
      total: Number(form.quantity) * Number(form.unitPrice),
      date: form.date,
    };
    if (editing) update('sales', editing.id, payload);
    else create('sales', payload);
    setFormOpen(false);
    setEditing(null);
  };

  const columns = [
    { key: 'id', label: 'Savdo', render: (row) => <b className="text-brand-600 dark:text-brand-400">#{row.id.toUpperCase()}</b> },
    { key: 'customer', label: 'Mijoz', render: (row) => customerName(data.customers, row.customerId) },
    { key: 'product', label: 'Mahsulot', render: (row) => productName(data.products, row.productId) },
    { key: 'quantity', label: 'Miqdor', render: (row) => `${row.quantity} dona` },
    { key: 'total', label: 'Summa', render: (row) => <b>{money(row.total)}</b> },
    { key: 'status', label: 'To‘lov', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'employee', label: 'Mas’ul', render: (row) => <span className="text-slate-400">{employeeName(data.employees, row.employeeId)}</span> },
    { key: 'date', label: 'Sana', render: (row) => <span className="text-slate-400">{formatDate(row.date)}</span> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Savdo" subtitle="Savdolar, to‘lov holati va daromad">
        <button type="button" className="btn-primary" onClick={openAdd}><Plus size={16} /> Savdo qo‘shish</button>
      </PageHeader>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={TrendingUp} label="Jami savdo" value={money(summary.totalSales)} tone="emerald" />
        <StatCard icon={Banknote} label="To‘langan" value={money(summary.paid)} hint={`${summary.percent}%`} tone="blue" />
        <StatCard icon={Wallet} label="Qarzdorlik" value={money(summary.unpaid)} tone="rose" />
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center" style={{ borderColor: 'var(--border)' }}>
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Savdo, mijoz yoki mahsulot..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input sm:w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Barcha to‘lovlar</option>
            <option>To‘langan</option><option>Qisman</option><option>To‘lanmagan</option>
          </select>
          <span className="text-xs font-semibold text-slate-400 sm:ml-auto">{rows.length} ta savdo</span>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          emptyTitle="Savdo topilmadi"
          emptyActionLabel={search || status ? 'Filterlarni tozalash' : 'Savdo qo‘shish'}
          onEmptyAction={search || status ? () => { setSearch(''); setStatus(''); } : openAdd}
          actions={(row) => (
            <>
              <button type="button" className="icon-action" title="Tahrirlash" onClick={() => openEdit(row)}><Pencil size={16} /></button>
              <button type="button" className="icon-action hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10" title="O‘chirish" onClick={() => setDeleting(row)}><Trash2 size={16} /></button>
            </>
          )}
        />
      </div>

      <Modal open={formOpen} title={editing ? 'Savdoni tahrirlash' : 'Yangi savdo'} subtitle="Miqdor va narx asosida summa avtomatik hisoblanadi" onClose={() => setFormOpen(false)}>
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
          <div>
            <label className="label">Mijoz *</label>
            <select className="input" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
              <option value="">Tanlang...</option>
              {data.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.customerId && <p className="mt-1 text-[11px] text-rose-500">{errors.customerId}</p>}
          </div>
          <div>
            <label className="label">Mahsulot *</label>
            <select className="input" value={form.productId} onChange={(e) => changeProduct(e.target.value)}>
              <option value="">Tanlang...</option>
              {data.products.map((p) => <option key={p.id} value={p.id}>{p.name} — {money(p.price)}</option>)}
            </select>
            {errors.productId && <p className="mt-1 text-[11px] text-rose-500">{errors.productId}</p>}
          </div>
          <div>
            <label className="label">Mas’ul xodim</label>
            <select className="input" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">Tanlanmagan</option>
              {data.employees.map((e) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Sana *</label>
            <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            {errors.date && <p className="mt-1 text-[11px] text-rose-500">{errors.date}</p>}
          </div>
          <div>
            <label className="label">Miqdor (dona) *</label>
            <input className="input" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            {errors.quantity && <p className="mt-1 text-[11px] text-rose-500">{errors.quantity}</p>}
          </div>
          <div>
            <label className="label">Birlik narxi (so‘m) *</label>
            <input className="input" type="number" min="0" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} />
            {errors.unitPrice && <p className="mt-1 text-[11px] text-rose-500">{errors.unitPrice}</p>}
          </div>
          <div className="sm:col-span-2 flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3 dark:bg-brand-500/10">
            <span className="text-xs font-semibold text-slate-500">Jami summa</span>
            <b className="text-lg text-brand-700 dark:text-brand-400">{money((Number(form.quantity) || 0) * (Number(form.unitPrice) || 0))}</b>
          </div>
          {(Object.keys(errors).length > 0) && (
            <p className="sm:col-span-2 flex items-center gap-1.5 text-xs text-rose-500"><AlertCircle size={14} /> Iltimos, belgilangan maydonlarni to‘g‘ri to‘ldiring.</p>
          )}
          <div className="sm:col-span-2 flex justify-end gap-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            <button type="button" className="btn-secondary" onClick={() => setFormOpen(false)}>Bekor qilish</button>
            <button type="submit" className="btn-primary">{editing ? 'O‘zgarishlarni saqlash' : 'Savdoni qo‘shish'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} title="Savdoni o‘chirish" message="Bu savdo va unga bog‘liq to‘lovlar o‘chiriladi." onClose={() => setDeleting(null)} onConfirm={() => { remove('sales', deleting.id); setDeleting(null); }} />
    </div>
  );
}
