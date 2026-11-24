import { useState } from 'react';
import { Bell, Building2, Database, Globe2, Moon, RotateCcw, Save, Sun, Trash2, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/ui/PageHeader';
import ConfirmDialog from '../components/ui/ConfirmDialog';

function Toggle({ checked, onChange, label, description }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors hover:border-brand-400" style={{ borderColor: 'var(--border)' }}>
      <span><span className="block text-sm font-semibold">{label}</span><span className="block text-[11px] text-slate-400">{description}</span></span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
    </button>
  );
}

export default function Settings() {
  const { settings, updateSettings, resetDemo, clearAll, notify, data } = useApp();
  const [draft, setDraft] = useState({
    ownerName: settings.ownerName,
    ownerEmail: settings.ownerEmail,
    phone: settings.phone,
    company: settings.company,
  });
  const [confirm, setConfirm] = useState(null);

  const setField = (name, value) => setDraft((prev) => ({ ...prev, [name]: value }));

  const saveProfile = () => {
    if (!draft.ownerName.trim() || !draft.company.trim()) {
      notify('Ism va kompaniya nomi to‘ldirilishi shart', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.ownerEmail)) {
      notify('To‘g‘ri email manzil kiriting', 'error');
      return;
    }
    updateSettings(draft);
    notify('Profil ma’lumotlari saqlandi');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Sozlamalar" subtitle="Profil, til, tema va ma’lumotlar boshqaruvi" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-5 flex items-center gap-2 text-sm font-bold"><UserRound size={17} className="text-brand-500" /> Profil ma’lumotlari</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label className="label">To‘liq ism</label><input className="input" value={draft.ownerName} onChange={(e) => setField('ownerName', e.target.value)} /></div>
            <div><label className="label">Email</label><input className="input" type="email" value={draft.ownerEmail} onChange={(e) => setField('ownerEmail', e.target.value)} /></div>
            <div><label className="label">Telefon</label><input className="input" value={draft.phone} onChange={(e) => setField('phone', e.target.value)} /></div>
            <div><label className="label">Kompaniya nomi</label><input className="input" value={draft.company} onChange={(e) => setField('company', e.target.value)} /></div>
          </div>
          <div className="mt-5 flex justify-end"><button type="button" className="btn-primary" onClick={saveProfile}><Save size={16} /> Saqlash</button></div>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold"><Globe2 size={17} className="text-brand-500" /> Til va ko‘rinish</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Til</label>
                <select className="input" value={settings.language} onChange={(e) => { updateSettings({ language: e.target.value }); notify('Til o‘zgartirildi', 'info'); }}>
                  <option value="uz">O‘zbekcha</option>
                  <option value="en">English</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
              <div>
                <label className="label">Tema</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => updateSettings({ theme: 'light' })} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${settings.theme === 'light' ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10' : ''}`} style={settings.theme === 'light' ? {} : { borderColor: 'var(--border)' }}>
                    <Sun size={16} /> Light
                  </button>
                  <button type="button" onClick={() => updateSettings({ theme: 'dark' })} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${settings.theme === 'dark' ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10' : ''}`} style={settings.theme === 'dark' ? {} : { borderColor: 'var(--border)' }}>
                    <Moon size={16} /> Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold"><Bell size={17} className="text-brand-500" /> Bildirishnomalar</h3>
            <div className="space-y-3">
              <Toggle checked={settings.notifications.toasts} onChange={(value) => updateSettings({ notifications: { toasts: value } })} label="Xabarlar" description="Harakatlar uchun toast bildirishnomalari" />
              <Toggle checked={settings.notifications.lowStock} onChange={(value) => updateSettings({ notifications: { lowStock: value } })} label="Ombor ogohlantirishi" description="Mahsulot qoldig‘i 15 donadan kam bo‘lsa" />
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold"><Database size={17} className="text-brand-500" /> Ma’lumotlar boshqaruvi</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Bazada {data.customers.length + data.orders + data.employees.length + data.products.length + data.sales.length + data.payments.length + data.tasks.length} ta yozuv mavjud</p>
            <p className="mt-1 text-xs text-slate-400">Barcha ma’lumotlar faqat shu brauzerda LocalStorage’da saqlanadi.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => setConfirm('reset')}><RotateCcw size={16} /> Demo ma’lumotlar</button>
            <button type="button" className="btn-danger" onClick={() => setConfirm('clear')}><Trash2 size={16} /> Hammasini tozalash</button>
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400"><Building2 size={14} /> {settings.company} · Pro CRM 1.0</p>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm === 'reset' ? 'Demo ma’lumotlarni yuklash' : 'Barcha ma’lumotlarni tozalash'}
        message={confirm === 'reset' ? 'Joriy ma’lumotlar demo ma’lumotlar bilan almashtiriladi. Davom etasizmi?' : 'Barcha mijozlar, buyurtmalar, savdolar va boshqa yozuvlar o‘chiriladi. Bu amalni qaytarib bo‘lmaydi.'}
        confirmLabel={confirm === 'reset' ? 'Ha, yuklash' : 'Ha, tozalash'}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm === 'reset') resetDemo(); else clearAll();
          setConfirm(null);
        }}
      />
    </div>
  );
}
