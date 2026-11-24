import { useMemo, useState } from 'react';
import { Banknote, CreditCard, Pencil, Plus, Search, Trash2, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPaymentSummary, getSalesWithStatus } from '../services/calculations';
import { PAYMENT_METHODS } from '../utils/constants';
import { customerName } from '../utils/lookup';
import { dateInputValue, formatDate, money } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import FormModal from '../components/ui/FormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';

export default function Payments() {
  const { data, create, update, remove, notify } = useApp();
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const salesWithStatus = useMemo(() => getSalesWithStatus(data.sales, data.payments), [data.sales, data.payments]);
  const summary = getPaymentSummary(data.sales, data.payments);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.payments.filter((payment) => {
      const text = `${payment.id} ${customerName(data.customers, payment.customerId)} ${payment.method} ${payment.note}`.toLowerCase();
      return (!q || text.includes(q)) && (!method || payment.method === method);
    });
  }, [data.payments, data.customers, search, method]);

  const fields = [
    { name: 'saleId', label: 'Savdo', type: 'select', required: true, options: salesWithStatus.map((sale) => ({ value: sale.id, label: `#${sale.id.toUpperCase()} · ${customerName(data.customers, sale.customerId)} · qoldiq ${money(sale.remaining)}` })) },
    { name: 'amount', label: 'To‘langan summa', type: 'number', min: 0, required: true },
    { name: 'method', label: 'To‘lov usuli', type: 'select', required: true, options: PAYMENT_METHODS },
    { name: 'date', label: 'To‘lov sanasi', type: 'date', required: true },
    { name: 'note', label: 'Izoh', full: true, placeholder: 'Qo‘shimcha ma’lumot...' },
  ];

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (payment) => { setEditing(payment); setFormOpen(true); };

  const submit = (values) => {
    const sale = salesWithStatus.find((item) => item.id === values.saleId);
    if (!sale) { notify('Savdo topilmadi', 'error'); return; }
    const alreadyPaid = editing ? (salesWithStatus.find((s) => s.id === editing.saleId)?.paidAmount || 0) - editing.amount : sale.paidAmount;
    const remaining = sale.total - alreadyPaid;
    if (values.amount > remaining) {
      notify(`Bu savdo bo‘yicha qoldiq ${money(remaining)}`, 'error');
      return;
    }
    const payload = { ...values, customerId: sale.customerId, date: values.date };
    if (editing) update('payments', editing.id, payload);
    else create('payments', payload);
    setFormOpen(false);
    setEditing(null);
  };

  const initial = editing
    ? { ...editing, date: dateInputValue(editing.date) }
    : { method: 'Karta', date: dateInputValue(new Date()) };

  const columns = [
    { key: 'id', label: 'To‘lov', render: (row) => <b className="text-brand-600 dark:text-brand-400">#{row.id.toUpperCase()}</b> },
    { key: 'customer', label: 'Mijoz', render: (row) => customerName(data.customers, row.customerId) },
    { key: 'sale', label: 'Savdo', render: (row) => <span className="text-slate-400">#{row.saleId?.toUpperCase()}</span> },
    { key: 'amount', label: 'Summa', render: (row) => <b>{money(row.amount)}</b> },
    { key: 'method', label: 'Usul', render: (row) => (
      <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
        {row.method === 'Karta' ? <CreditCard size={12} /> : <Banknote size={12} />}{row.method}
      </span>
    ) },
    { key: 'date', label: 'Sana', render: (row) => <span className="text-slate-400">{formatDate(row.date)}</span> },
    { key: 'note', label: 'Izoh', render: (row) => <span className="text-slate-400">{row.note || '—'}</span> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="To‘lovlar" subtitle="Naqd va karta orqali qilingan to‘lovlar tarixi">
        <button type="button" className="btn-primary" onClick={openAdd}><Plus size={16} /> To‘lov qo‘shish</button>
      </PageHeader>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Banknote} label="Jami to‘langan" value={money(summary.paid)} tone="emerald" />
        <StatCard icon={Wallet} label="Qolgan qarzdorlik" value={money(summary.unpaid)} tone="rose" />
        <StatCard icon={CreditCard} label="To‘lovlar soni" value={data.payments.length} hint="Naqd, karta va o‘tkazma" tone="blue" />
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center" style={{ borderColor: 'var(--border)' }}>
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="To‘lov yoki mijoz qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input sm:w-48" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">Barcha usullar</option>
            {PAYMENT_METHODS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <span className="text-xs font-semibold text-slate-400 sm:ml-auto">{rows.length} ta to‘lov</span>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          emptyTitle="To‘lov topilmadi"
          emptyActionLabel={search || method ? 'Filterlarni tozalash' : 'To‘lov qo‘shish'}
          onEmptyAction={search || method ? () => { setSearch(''); setMethod(''); } : openAdd}
          actions={(row) => (
            <>
              <button type="button" className="icon-action" title="Tahrirlash" onClick={() => openEdit(row)}><Pencil size={16} /></button>
              <button type="button" className="icon-action hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10" title="O‘chirish" onClick={() => setDeleting(row)}><Trash2 size={16} /></button>
            </>
          )}
        />
      </div>

      <FormModal open={formOpen} title={editing ? 'To‘lovni tahrirlash' : 'Yangi to‘lov'} fields={fields} initialValues={initial} onSubmit={submit} onClose={() => setFormOpen(false)} />
      <ConfirmDialog open={Boolean(deleting)} title="To‘lovni o‘chirish" message="Bu to‘lov o‘chirilganda savdo bo‘yicha qarzdorlik qaytadan hisoblanadi." onClose={() => setDeleting(null)} onConfirm={() => { remove('payments', deleting.id); setDeleting(null); }} />
    </div>
  );
}
