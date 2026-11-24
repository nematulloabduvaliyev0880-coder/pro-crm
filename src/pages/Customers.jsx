import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, Mail, Pencil, Phone, Plus, Search, Trash2, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import FormModal from '../components/ui/FormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/ui/Modal';
import { formatDate, initials, money } from '../utils/format';
import StatusBadge from '../components/ui/StatusBadge';

const fields = [
  { name: 'name', label: 'Ism va familiya', required: true, placeholder: 'Masalan: Aziza Karimova' },
  { name: 'phone', label: 'Telefon raqami', required: true, placeholder: '+998 90 123 45 67' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'email@example.com' },
  { name: 'company', label: 'Kompaniya', placeholder: 'Kompaniya nomi' },
];

export default function Customers() {
  const { data, create, update, remove } = useApp();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [history, setHistory] = useState(null);

  useEffect(() => { setSearch(searchParams.get('q') || ''); }, [searchParams]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.customers.filter((customer) =>
      `${customer.name} ${customer.phone} ${customer.email} ${customer.company}`.toLowerCase().includes(q));
  }, [data.customers, search]);

  const salesTotal = (customerId) => data.sales.filter((s) => s.customerId === customerId).reduce((sum, s) => sum + s.total, 0);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (customer) => { setEditing(customer); setFormOpen(true); };

  const submit = (values) => {
    if (editing) update('customers', editing.id, values);
    else create('customers', values);
    setFormOpen(false);
    setEditing(null);
  };

  const columns = [
    { key: 'name', label: 'Mijoz', render: (row) => (
      <div className="flex items-center gap-3">
        <span className="avatar-grad flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white">{initials(row.name)}</span>
        <span><span className="block font-semibold">{row.name}</span><span className="block text-[11px] text-slate-400">{row.company || '—'}</span></span>
      </div>
    ) },
    { key: 'phone', label: 'Telefon', render: (row) => <span className="flex items-center gap-1.5 text-slate-500"><Phone size={13} />{row.phone}</span> },
    { key: 'email', label: 'Email', render: (row) => <span className="flex items-center gap-1.5 text-slate-500"><Mail size={13} />{row.email}</span> },
    { key: 'sales', label: 'Savdolar', render: (row) => `${data.sales.filter((s) => s.customerId === row.id).length} ta` },
    { key: 'total', label: 'Jami summa', render: (row) => <b className="text-brand-600 dark:text-brand-400">{money(salesTotal(row.id))}</b> },
    { key: 'createdAt', label: 'Qo‘shilgan', render: (row) => <span className="text-slate-400">{formatDate(row.createdAt)}</span> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Mijozlar" subtitle="Mijozlar bazasi va ularning buyurtmalar tarixi">
        <button type="button" className="btn-primary" onClick={openAdd}><Plus size={16} /> Mijoz qo‘shish</button>
      </PageHeader>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Ism, telefon yoki email bo‘yicha qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span className="text-xs font-semibold text-slate-400">{rows.length} ta mijoz topildi</span>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          emptyTitle="Mijoz topilmadi"
          emptyDescription={search ? 'Boshqa qidiruv so‘zi bilan sinang.' : 'Birinchi mijozingizni qo‘shing.'}
          emptyActionLabel={search ? 'Qidiruvni tozalash' : 'Mijoz qo‘shish'}
          onEmptyAction={search ? () => setSearch('') : openAdd}
          actions={(row) => (
            <>
              <button type="button" className="icon-action" title="Buyurtmalar tarixi" onClick={() => setHistory(row)}><Eye size={16} /></button>
              <button type="button" className="icon-action" title="Tahrirlash" onClick={() => openEdit(row)}><Pencil size={16} /></button>
              <button type="button" className="icon-action hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10" title="O‘chirish" onClick={() => setDeleting(row)}><Trash2 size={16} /></button>
            </>
          )}
        />
      </div>

      <FormModal open={formOpen} title={editing ? 'Mijozni tahrirlash' : 'Yangi mijoz'} subtitle="Mijoz aloqa ma’lumotlarini kiriting" fields={fields} initialValues={editing || {}} onSubmit={submit} onClose={() => setFormOpen(false)} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Mijozni o‘chirish"
        message={`${deleting?.name || ''} o‘chirilganda uning buyurtmalari va savdolari ham o‘chiriladi. Davom etasizmi?`}
        onClose={() => setDeleting(null)}
        onConfirm={() => { remove('customers', deleting.id); setDeleting(null); }}
      />

      <Modal open={Boolean(history)} title={history?.name || ''} subtitle="Mijozning buyurtmalar tarixi" onClose={() => setHistory(null)}>
        {history && (
          <div>
            <div className="mb-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-brand-50 p-4 dark:bg-brand-500/10"><p className="text-[11px] text-slate-500">Jami savdo</p><p className="text-lg font-extrabold text-brand-600 dark:text-brand-400">{money(salesTotal(history.id))}</p></div>
              <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10"><p className="text-[11px] text-slate-500">Savdolar soni</p><p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{data.sales.filter((s) => s.customerId === history.id).length}</p></div>
            </div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Savdolar</h4>
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {data.sales.filter((s) => s.customerId === history.id).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)' }}>
                  <span><span className="block text-xs font-semibold">#{sale.id.toUpperCase()}</span><span className="text-[11px] text-slate-400">{formatDate(sale.date)} · {sale.quantity} dona</span></span>
                  <b className="text-sm">{money(sale.total)}</b>
                </div>
              ))}
              {!data.sales.some((s) => s.customerId === history.id) && <p className="py-6 text-center text-xs text-slate-400">Bu mijozda hali savdo yo‘q.</p>}
            </div>
            <h4 className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Buyurtmalar</h4>
            <div className="space-y-2">
              {data.orders.filter((o) => o.customerId === history.id).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)' }}>
                  <span><span className="block text-xs font-semibold">#{order.id.toUpperCase()}</span><span className="text-[11px] text-slate-400">{formatDate(order.date)}</span></span>
                  <div className="flex items-center gap-3"><b className="text-sm">{money(order.amount)}</b><StatusBadge value={order.status} /></div>
                </div>
              ))}
              {!data.orders.some((o) => o.customerId === history.id) && <p className="py-4 text-center text-xs text-slate-400">Buyurtma topilmadi.</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
