import { EmissionsTableSkeleton } from '@/components/emissions/EmissionsTable'

const sk = 'rounded-[4px] bg-[var(--color-border)] animate-pulse'

export default function EmissionsLoading() {
  return (
    <div className="p-8 space-y-6 bg-[var(--color-base)] min-h-full">
      {/* Filters skeleton */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className={`h-9 flex-1 sm:max-w-sm rounded-[6px] ${sk}`} />
          <div className={`h-9 w-44 rounded-[6px] ${sk}`} />
          <div className={`h-9 w-44 rounded-[6px] ${sk}`} />
        </div>
        <div className={`h-9 w-64 rounded-[6px] ${sk}`} />
      </div>

      {/* Table */}
      <div className="border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden rounded-[6px]">
        <EmissionsTableSkeleton />
      </div>
    </div>
  )
}
