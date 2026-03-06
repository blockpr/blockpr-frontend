import type { EmissionStatus } from '@/types'
import { cn } from '@/lib/utils'

interface EmissionStatusBadgeProps {
  status: EmissionStatus
  className?: string
}

const config: Record<EmissionStatus, { label: string; className: string; dot: string }> = {
  verified: {
    label: 'Verificado',
    className: 'bg-[var(--color-success-muted)] text-[var(--color-success)] border-[var(--color-success)]/20',
    dot: 'bg-[var(--color-success)]',
  },
  pending: {
    label: 'Pendiente',
    className: 'bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-[var(--color-warning)]/20',
    dot: 'bg-[var(--color-warning)]',
  },
  failed: {
    label: 'Fallido',
    className: 'bg-[var(--color-danger-muted)] text-[var(--color-danger)] border-[var(--color-danger)]/20',
    dot: 'bg-[var(--color-danger)]',
  },
}

export function EmissionStatusBadge({ status, className }: EmissionStatusBadgeProps) {
  const { label, className: statusClass, dot } = config[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        statusClass,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {label}
    </span>
  )
}
