const sk = 'rounded-[4px] bg-[var(--color-border)] animate-pulse'

function ApiKeyRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap"><div className={`h-4 w-24 ${sk}`} /></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className={`h-5 w-32 rounded-[4px] ${sk}`} /></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className={`h-4 w-28 ${sk}`} /></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className={`h-4 w-28 ${sk}`} /></td>
      <td className="px-6 py-4 text-right whitespace-nowrap"><div className={`h-4 w-16 ${sk} ml-auto`} /></td>
    </tr>
  )
}

export default function ApiKeysLoading() {
  return (
    <div className="p-8 space-y-6 bg-[var(--color-base)] min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className={`h-5 w-24 ${sk}`} />
          <div className={`h-4 w-64 ${sk}`} />
        </div>
        <div className={`h-8 w-28 rounded-[6px] ${sk}`} />
      </div>

      {/* Table */}
      <div className="border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden rounded-[6px]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Nombre', 'Prefijo', 'Creada', 'Último uso', ''].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {[1, 2, 3].map((i) => <ApiKeyRowSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
