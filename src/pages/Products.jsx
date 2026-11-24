import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCT_CATEGORIES } from '../utils/constants';
import { formatDate, money } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import FormModal from '../components/ui/FormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const fields = [
  { name: 'name', label: 'Mahsulot nomi', required: true, placeholder: 'Masalan: Laptop Pro' },
  { name: 'sku', label: 'SKU kodi', placeholder: 'PRD-001' },
  { name: 'price', label: 'Narxi (so‘m)', type: 'number', min: 0, required: true },
  { name: 'category', label: 'Kategoriya', type: 'select', required: true, options: PRODUCT_CATEGORIES },
  { name: 'stock', label: 'Ombordagi soni', type: 'number', min: 0, required: true },
];

export default function Products() {
  const { data, create, update, remove } = useApp();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { setSearch(searchParams.get('q') || ''); }, [searchParams]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.products.filter((product) => {
      const matchesSearch = !q || `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(q);
      return matchesSearch && (!category || product.category === category);
    });
  }, [data.products, search, category]);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (product) => { setEditing(product); setFormOpen(true); };
  const submit = (values) => {
    if (editing) update('products', editing.id, values);
    else create('products', values);
    setFormOpen(false);
    setEditing(null);
  };

  const columns = [
    { key: 'name', label: 'Mahsulot', render: (row) => <span><span className="block font-semibold">{row.name}</span><span className="block text-[11px] text-slate-400">{row.sku || '—'}</span></span> },
    { key: 'category', label: 'Kategoriya', render: (row) => <span className="badge bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">{row.category}</span> },
    { key: 'price', label: 'Narxi', render: (row) => <b>{money(row.price)}</b> },
    { key: 'stock', label: 'Ombor', render: (row) => (
      <span className={`badge ${row.stock <= 15 ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/15' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15'}`}>
        {row.stock} dona{row.stock <= 15 ? ' · kam' : ''}
      </span>
    ) },
    { key: 'createdAt', label: 'Qo‘shilgan', render: (row) => <span className="text-slate-400">{formatDate(row.createdAt)}</span> },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Mahsulotlar" subtitle="Katalog, narxlar va ombor qoldiqlari">
        <button type="button" className="btn-primary" onClick={openAdd}><Plus size={16} /> Mahsulot qo‘shish</button>
      </PageHeader>

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center" style={{ borderColor: 'var(--border)' }}>
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9" placeholder="Nomi, SKU yoki kategoriya..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input sm:w-52" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Barcha kategoriyalar</option>
            {PRODUCT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <span className="text-xs font-semibold text-slate-400 sm:ml-auto">{rows.length} ta mahsulot</span>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          emptyTitle="Mahsulot topilmadi"
          emptyActionLabel={search || category ? 'Filterlarni tozalash' : 'Mahsulot qo‘shish'}
          onEmptyAction={search || category ? () => { setSearch(''); setCategory(''); } : openAdd}
          actions={(row) => (
            <>
              <button type="button" className="icon-action" title="Tahrirlash" onClick={() => openEdit(row)}><Pencil size={16} /></button>
              <button type="button" className="icon-action hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10" title="O‘chirish" onClick={() => setDeleting(row)}><Trash2 size={16} /></button>
            </>
          )}
        />
      </div>

      <FormModal open={formOpen} title={editing ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'} fields={fields} initialValues={editing || { category: 'Elektronika' }} onSubmit={submit} onClose={() => setFormOpen(false)} />
      <ConfirmDialog open={Boolean(deleting)} title="Mahsulotni o‘chirish" message={`${deleting?.name || ''} o‘chirilsa, unga bog‘liq savdolar ham o‘chiriladi. Davom etasizmi?`} onClose={() => setDeleting(null)} onConfirm={() => { remove('products', deleting.id); setDeleting(null); }} />
    </div>
  );
}
