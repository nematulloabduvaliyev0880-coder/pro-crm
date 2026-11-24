import { STATUS_STYLES } from '../../utils/constants';

export default function StatusBadge({ value }) {
  if (!value) return <span className="text-slate-400">—</span>;
  return <span className={`badge ${STATUS_STYLES[value] || 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300'}`}>{value}</span>;
}
