const sk = 'rounded-[4px] bg-[var(--color-border)] animate-pulse'

function StatsCardSkeleton() {
  return (
    <div className="border rounded-[6px] border-[var(--color-border)] bg-[var(--color-card)] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-lg ${sk}`} />
      </div>
      <div className="space-y-1.5">
        <div className={`h-7 w-16 ${sk}`} />
        <div className={`h-4 w-24 ${sk}`} />
      </div>
    </div>
  )
}

function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-3.5"><div className={`h-4 w-20 ${sk}`} /></td>
      <td className="px-6 py-3.5"><div className={`h-4 w-24 ${sk}`} /></td>
      <td className="px-6 py-3.5"><div className={`h-5 w-32 ${sk}`} /></td>
      <td className="px-6 py-3.5"><div className={`h-5 w-20 rounded-full ${sk}`} /></td>
      <td className="px-6 py-3.5 text-right"><div className={`h-4 w-4 ${sk} ml-auto`} /></td>
    </tr>
  )
}

export default function DashboardLoading() {
  return (
    <div className="p-8 space-y-8 bg-[var(--color-base)] min-h-full">
      <div className="space-y-4">
        {/* Stats cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <StatsCardSkeleton key={i} />)}
        </div>

        {/* Recent emissions table */}
        <div className="border rounded-[6px] border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--color-border)]">
            <div className="space-y-1.5">
              <div className={`h-4 w-36 ${sk}`} />
              <div className={`h-3 w-48 ${sk}`} />
            </div>
            <div className={`h-4 w-20 ${sk}`} />
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['ID', 'Fecha', 'Hash', 'Estado', ''].map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {[1, 2, 3, 4, 5].map((i) => <TableRowSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
