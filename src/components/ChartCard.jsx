export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
