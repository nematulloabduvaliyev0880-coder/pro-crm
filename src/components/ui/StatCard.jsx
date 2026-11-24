import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

const tones = {
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
};

export default function StatCard({ icon: Icon, label, value, hint, tone = 'emerald', trend }) {
  return (
    <div className="card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone] || tones.emerald}`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`badge ${trend >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'}`}>
            {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p>
      {hint && <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
}
