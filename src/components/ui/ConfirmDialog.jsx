import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ open, title = 'Tasdiqlang', message, confirmLabel = 'O‘chirish', onConfirm, onClose }) {
  return (
    <Modal open={open} title={title} onClose={onClose} size="max-w-md">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/15">
          <AlertTriangle size={20} />
        </div>
        <p className="pt-1 text-sm text-slate-600 dark:text-slate-300">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onClose}>Bekor qilish</button>
        <button type="button" className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
