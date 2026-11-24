import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const config = {
  success: { icon: CheckCircle2, color: 'text-emerald-500' },
  info: { icon: Info, color: 'text-blue-500' },
  error: { icon: XCircle, color: 'text-rose-500' },
};

export default function ToastHost() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2">
      {toasts.map((toast) => {
        const { icon: Icon, color } = config[toast.type] || config.success;
        return (
          <div key={toast.id} className="pointer-events-auto flex animate-toast-in items-center gap-3 rounded-xl border px-4 py-3 shadow-xl" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <Icon size={18} className={color} />
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button type="button" onClick={() => dismissToast(toast.id)} className="text-slate-400 hover:text-rose-500" aria-label="Yopish">
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
