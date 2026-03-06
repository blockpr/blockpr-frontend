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

const accentMap = {
  default: 'text-[var(--color-accent)] bg-[var(--color-accent-muted)]',
  success: 'text-[var(--color-success)] bg-[var(--color-success-muted)]',
  warning: 'text-[var(--color-warning)] bg-[var(--color-warning-muted)]',
  danger: 'text-[var(--color-danger)] bg-[var(--color-danger-muted)]',
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  accent = 'default',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
        <span className={cn('p-2 rounded-lg', accentMap[accent])}>{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-[var(--color-text-primary)]">
        {typeof value === 'number' ? value.toLocaleString('es-AR') : value}
      </p>
      {trend && (
        <p
          className={cn(
            'mt-1.5 text-xs',
            trend.positive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
          )}
        >
          {trend.positive ? '↑' : '↓'} {trend.value} este mes
        </p>
      )}
    </div>
  )
}
