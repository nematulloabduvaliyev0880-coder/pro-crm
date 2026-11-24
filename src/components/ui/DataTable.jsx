import EmptyState from './EmptyState';

export default function DataTable({ columns = [], rows = [], actions, emptyTitle, emptyDescription, onEmptyAction, emptyActionLabel }) {
  if (!rows.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} actionLabel={emptyActionLabel} onAction={onEmptyAction} />;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => <th key={column.key}>{column.label}</th>)}
            {actions && <th className="text-right">Harakatlar</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index} className="animate-fade-in">
              {columns.map((column) => (
                <td key={column.key} className={column.className || ''}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {actions && <td><div className="flex justify-end gap-1">{actions(row)}</div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
