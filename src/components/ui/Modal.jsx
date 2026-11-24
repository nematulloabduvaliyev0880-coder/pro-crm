import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, title, subtitle, onClose, children, size = 'max-w-2xl' }) {
  useEffect(() => {
    if (!open) return undefined;
    const handler = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className={`my-auto w-full ${size} animate-fade-in rounded-2xl border shadow-2xl`} style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-start justify-between gap-4 border-b px-6 py-5" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="icon-action" aria-label="Yopish"><X size={18} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
