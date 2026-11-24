import { useMemo, useState } from 'react';
import { Mail, Pencil, Phone, Plus, Search, Trash2, UserCog } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDate, initials, money } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import FormModal from '../components/ui/FormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';

const fields = [
  { name: 'firstName', label: 'Ism', required: true, placeholder: 'Ism' },
  { name: 'lastName', label: 'Familiya', required: true, placeholder: 'Familiya' },
  { name: 'position', label: 'Lavozimi', required: true, placeholder: 'Masalan: Savdo menejeri' },
  { name: 'phone', label: 'Telefon', required: true, placeholder: '+998 90 123 45 67' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'email@example.com' },
  { name: 'salary', label: 'Maoshi (so‘m)', type: 'number', min: 0, required: true },
  { name: 'active', label: 'Faollik holati', type: 'select', required: true, options: ['Faol', 'Nofaol'] },
];

export default function Employees() {
  const { data, create, update, remove } = useApp();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.employees.filter((e) => `${e.firstName} ${e.lastName} ${e.position} ${e.email} ${e.phone}`.toLowerCase().includes(q));
  }, [data.employees, search]);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (employee) => { setEditing(employee); setFormOpen(true); };
  const submit = (values) => {
    const payload = { ...values, active: values.active === 'Faol' };
    if (editing) update('employees', editing.id, payload);
    else create('employees', payload);
    setFormOpen(false);
    setEditing(null);
  };
  const toggleActive = (employee) => update('employees', employee.id, { active: !employee.active });

  const columns = [
    { key: 'name', label: 'Xodim', render: (row) => (
      <div className="flex items-center gap-3">
        <span className="avatar-grad flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white">{initials(`${row.firstName} ${row.lastName}`)}</span>
        <span><span className="block font-semibold">{row.firstName} {row.lastName}</span><span className="block text-[11px] text-slate-400">{row.position}</span></span>
      </div>
    ) },
    { key: 'phone', label: 'Telefon', render: (row) => <span className="flex items-center gap-1.5 text-slate-500"><Phone size={13} />{row.phone}</span> },
    { key: 'email', label: 'Email', render: (row) => <span className="flex items-center gap-1.5 text-slate-500"><Mail size={13} />{row.email}</span> },
    { key: 'salary', label: 'Maoshi', render: (row) => <b>{money(row.salary)}</b> },
    { key: 'active', label: 'Holat', render: (row) => <StatusBadge value={row.active ? 'Faol' : 'Nofaol'} /> },
    { key: 'createdAt', label: 'Qo‘shilgan', render: (row) => <span className="text-slate-400">{formatDate(row.createdAt)}</span> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Xodimlar" subtitle="Jamoa a’zolari, lavozimlar va maoshlar">
        <button type="button" className="btn-primary" onClick={openAdd}><Plus size={16} /> Xodim qo‘shish</button>
      </PageHeader>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center" style={{ borderColor: 'var(--border)' }}>
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Ism, lavozim yoki email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span className="text-xs font-semibold text-slate-400 sm:ml-auto">{rows.length} ta xodim</span>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          emptyTitle="Xodim topilmadi"
          emptyActionLabel={search ? 'Qidiruvni tozalash' : 'Xodim qo‘shish'}
          onEmptyAction={search ? () => setSearch('') : openAdd}
          actions={(row) => (
            <>
              <button type="button" className="icon-action" title={row.active ? 'Nofaol qilish' : 'Faol qilish'} onClick={() => toggleActive(row)}><UserCog size={16} /></button>
              <button type="button" className="icon-action" title="Tahrirlash" onClick={() => openEdit(row)}><Pencil size={16} /></button>
              <button type="button" className="icon-action hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10" title="O‘chirish" onClick={() => setDeleting(row)}><Trash2 size={16} /></button>
            </>
          )}
        />
      </div>

      <FormModal open={formOpen} title={editing ? 'Xodimni tahrirlash' : 'Yangi xodim'} fields={fields} initialValues={editing ? { ...editing, active: editing.active ? 'Faol' : 'Nofaol' } : { active: 'Faol' }} onSubmit={submit} onClose={() => setFormOpen(false)} />
      <ConfirmDialog open={Boolean(deleting)} title="Xodimni o‘chirish" message={`${deleting?.firstName} ${deleting?.lastName} o‘chirilsinmi?`} onClose={() => setDeleting(null)} onConfirm={() => { remove('employees', deleting.id); setDeleting(null); }} />
    </div>
  );
}
