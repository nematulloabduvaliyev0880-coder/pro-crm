import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Ma’lumot topilmadi', description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
        <Icon size={28} />
      </div>
      <h3 className="text-base font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description || 'Bu yerda hozircha ma’lumot yo‘q. Yangi yozuv qo‘shish yoki filterni o‘zgartirishni sinang.'}
      </p>
      {actionLabel && onAction && (
        <button type="button" className="btn-primary mt-5" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}
