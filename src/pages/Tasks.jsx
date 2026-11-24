import { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Pencil, Plus, Search, Trash2, UserRoundCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TASK_PRIORITIES, TASK_STATUSES } from '../utils/constants';
import { employeeName } from '../utils/lookup';
import { dateInputValue, formatDate } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import FormModal from '../components/ui/FormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';

export default function Tasks() {
  const { data, create, update, remove } = useApp();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fields = [
    { name: 'title', label: 'Vazifa nomi', required: true, full: true, placeholder: 'Masalan: Hisobot tayyorlash' },
    { name: 'employeeId', label: 'Mas’ul xodim', type: 'select', required: true, options: data.employees.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName}` })) },
    { name: 'priority', label: 'Muhimlik', type: 'select', required: true, options: TASK_PRIORITIES },
    { name: 'startDate', label: 'Boshlanish sanasi', type: 'date', required: true },
    { name: 'dueDate', label: 'Tugash muddati', type: 'date', required: true },
    { name: 'status', label: 'Holat', type: 'select', required: true, options: TASK_STATUSES },
  ];

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.tasks.filter((task) => {
      const text = `${task.title} ${employeeName(data.employees, task.employeeId)}`.toLowerCase();
      return (!q || text.includes(q)) && (!status || task.status === status);
    });
  }, [data.tasks, data.employees, search, status]);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (task) => { setEditing(task); setFormOpen(true); };
  const submit = (values) => {
    if (editing) update('tasks', editing.id, values);
    else create('tasks', values);
    setFormOpen(false);
    setEditing(null);
  };
  const toggleDone = (task) => update('tasks', task.id, { status: task.status === 'Bajarildi' ? 'Jarayonda' : 'Bajarildi' });

  const initial = editing
    ? { ...editing, startDate: dateInputValue(editing.startDate), dueDate: dateInputValue(editing.dueDate) }
    : { status: 'Yangi', priority: 'O‘rta', startDate: dateInputValue(new Date()), dueDate: dateInputValue(new Date(Date.now() + 3 * 86400000)) };

  const columns = [
    { key: 'done', label: '', render: (row) => (
      <button type="button" onClick={() => toggleDone(row)} title={row.status === 'Bajarildi' ? 'Qayta ochish' : 'Bajarildi deb belgilash'}
        className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all ${row.status === 'Bajarildi' ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300 text-transparent hover:border-brand-500 dark:border-slate-600'}`}>
        <CheckCircle2 size={14} />
      </button>
    ) },
    { key: 'title', label: 'Vazifa', render: (row) => <span className={row.status === 'Bajarildi' ? 'font-semibold text-slate-400 line-through' : 'font-semibold'}>{row.title}</span> },
    { key: 'employee', label: 'Mas’ul', render: (row) => <span className="flex items-center gap-1.5 text-slate-500"><UserRoundCheck size={13} />{employeeName(data.employees, row.employeeId)}</span> },
    { key: 'priority', label: 'Muhimlik', render: (row) => <StatusBadge value={row.priority} /> },
    { key: 'startDate', label: 'Boshlanish', render: (row) => <span className="text-slate-400">{formatDate(row.startDate)}</span> },
    { key: 'dueDate', label: 'Muddati', render: (row) => <span className="flex items-center gap-1.5 text-slate-400"><CalendarDays size={13} />{formatDate(row.dueDate)}</span> },
    { key: 'status', label: 'Holat', render: (row) => <StatusBadge value={row.status} /> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Vazifalar" subtitle="Jamoa vazifalari va ularning bajarilish holati">
        <button type="button" className="btn-primary" onClick={openAdd}><Plus size={16} /> Vazifa yaratish</button>
      </PageHeader>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center" style={{ borderColor: 'var(--border)' }}>
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Vazifa yoki xodim qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input sm:w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Barcha holatlar</option>
            {TASK_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <span className="text-xs font-semibold text-slate-400 sm:ml-auto">
            {data.tasks.filter((t) => t.status === 'Bajarildi').length}/{data.tasks.length} bajarildi
          </span>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          emptyTitle="Vazifa topilmadi"
          emptyActionLabel={search || status ? 'Filterlarni tozalash' : 'Vazifa yaratish'}
          onEmptyAction={search || status ? () => { setSearch(''); setStatus(''); } : openAdd}
          actions={(row) => (
            <>
              <button type="button" className="icon-action" title="Tahrirlash" onClick={() => openEdit(row)}><Pencil size={16} /></button>
              <button type="button" className="icon-action hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10" title="O‘chirish" onClick={() => setDeleting(row)}><Trash2 size={16} /></button>
            </>
          )}
        />
      </div>

      <FormModal open={formOpen} title={editing ? 'Vazifani tahrirlash' : 'Yangi vazifa'} fields={fields} initialValues={initial} onSubmit={submit} onClose={() => setFormOpen(false)} />
      <ConfirmDialog open={Boolean(deleting)} title="Vazifani o‘chirish" message={`${deleting?.title || ''} o‘chirilsinmi?`} onClose={() => setDeleting(null)} onConfirm={() => { remove('tasks', deleting.id); setDeleting(null); }} />
    </div>
  );
}
