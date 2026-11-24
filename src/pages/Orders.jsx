import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pencil, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ORDER_STATUSES } from '../utils/constants';
import { customerName } from '../utils/lookup';
import { dateInputValue, formatDate, money } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import FormModal from '../components/ui/FormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';

export default function Orders() {
  const { data, create, update, remove } = useApp();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { setSearch(searchParams.get('q') || ''); }, [searchParams]);

  const fields = [
    { name: 'customerId', label: 'Mijoz', type: 'select', required: true, options: data.customers.map((c) => ({ value: c.id, label: c.name })) },
    { name: 'amount', label: 'Buyurtma summasi', type: 'number', required: true, min: 0, placeholder: '0' },
    { name: 'date', label: 'Buyurtma sanasi', type: 'date', required: true },
    { name: 'status', label: 'Holat', type: 'select', required: true, options: ORDER_STATUSES },
    { name: 'notes', label: 'Izoh', type: 'textarea', full: true, placeholder: 'Qo‘shimcha ma’lumot...' },
  ];

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.orders.filter((order) => {
      const matchesSearch = !q || `${order.id} ${customerName(data.customers, order.customerId)}`.toLowerCase().includes(q);
      return matchesSearch && (!status || order.status === status);
    });
  }, [data.orders, data.customers, search, status]);

  const initial = editing ? { ...editing, date: dateInputValue(editing.date) } : { status: 'Kutilmoqda', date: dateInputValue(new Date()) };
  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (order) => { setEditing(order); setFormOpen(true); };

  const submit = (values) => {
    if (editing) update('orders', editing.id, values);
    else create('orders', values);
    setFormOpen(false);
    setEditing(null);
  };

  const columns = [
    { key: 'id', label: 'Buyurtma', render: (row) => <b className="text-brand-600 dark:text-brand-400">#{row.id.toUpperCase()}</b> },
    { key: 'customer', label: 'Mijoz', render: (row) => customerName(data.customers, row.customerId) },
    { key: 'amount', label: 'Summa', render: (row) => <b>{money(row.amount)}</b> },
    { key: 'date', label: 'Sana', render: (row) => <span className="text-slate-400">{formatDate(row.date)}</span> },
    { key: 'status', label: 'Holat', render: (row) => <StatusBadge value={row.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Buyurtmalar" subtitle="Barcha buyurtmalar va ularning holatlari">
        <button type="button" className="btn-primary" onClick={openAdd}><Plus size={16} /> Buyurtma yaratish</button>
      </PageHeader>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center" style={{ borderColor: 'var(--border)' }}>
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Buyurtma yoki mijoz qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input sm:w-52" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Barcha holatlar</option>
            {ORDER_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <span className="text-xs font-semibold text-slate-400 sm:ml-auto">{rows.length} ta buyurtma</span>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          emptyTitle="Buyurtma topilmadi"
          emptyDescription="Filterlarni o‘zgartiring yoki yangi buyurtma yaratng."
          emptyActionLabel={search || status ? 'Filterlarni tozalash' : 'Buyurtma yaratish'}
          onEmptyAction={search || status ? () => { setSearch(''); setStatus(''); } : openAdd}
          actions={(row) => (
            <>
              <button type="button" className="icon-action" title="Tahrirlash" onClick={() => openEdit(row)}><Pencil size={16} /></button>
              <button type="button" className="icon-action hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10" title="O‘chirish" onClick={() => setDeleting(row)}><Trash2 size={16} /></button>
            </>
          )}
        />
      </div>

      {!data.customers.length && (
        <div className="card mt-4 flex items-center gap-3 p-4 text-sm text-slate-500">
          <ShoppingCart size={18} className="text-brand-500" /> Buyurtma yaratish uchun avval mijoz qo‘shing.
        </div>
      )}

      <FormModal open={formOpen} title={editing ? 'Buyurtmani tahrirlash' : 'Yangi buyurtma'} fields={fields} initialValues={initial} onSubmit={submit} onClose={() => setFormOpen(false)} />
      <ConfirmDialog open={Boolean(deleting)} title="Buyurtmani o‘chirish" message={`#${deleting?.id?.toUpperCase()} buyurtmasi o‘chirilsinmi?`} onClose={() => setDeleting(null)} onConfirm={() => { remove('orders', deleting.id); setDeleting(null); }} />
    </div>
  );
}
