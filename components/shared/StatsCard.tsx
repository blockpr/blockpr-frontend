import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: string
    positive: boolean
  }
  accent?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

const accentConfig = {
  default: {
    icon: 'text-[var(--color-accent)] bg-[var(--color-accent-muted)]',
    bar: 'bg-[var(--color-accent)]',
  },
  success: {
    icon: 'text-[var(--color-success)] bg-[var(--color-success-muted)]',
    bar: 'bg-[var(--color-success)]',
  },
  warning: {
    icon: 'text-[var(--color-warning)] bg-[var(--color-warning-muted)]',
    bar: 'bg-[var(--color-warning)]',
  },
  danger: {
    icon: 'text-[var(--color-danger)] bg-[var(--color-danger-muted)]',
    bar: 'bg-[var(--color-danger)]',
  },
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  accent = 'default',
  className,
}: StatsCardProps) {
  const config = accentConfig[accent]

  return (
    <div
      className={cn(
        'relative border rounded-[6px] border-[var(--color-border)] bg-[var(--color-card)] p-5 overflow-hidden flex flex-col gap-4',
        className
      )}
    >

      <div className="flex items-center justify-between">
        <span className={cn('p-2 rounded-lg', config.icon)}>{icon}</span>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              trend.positive
                ? 'text-[var(--color-success)] bg-[var(--color-success-muted)]'
                : 'text-[var(--color-danger)] bg-[var(--color-danger-muted)]'
            )}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      <div>
        <p className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          {typeof value === 'number' ? value.toLocaleString('es-AR') : value}
        </p>
        <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{label}</p>
      </div>
    </div>
  )
}
