import { truncateHash } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface HashDisplayProps {
  hash: string
  truncate?: boolean
  className?: string
}

export function HashDisplay({ hash, truncate = false, className }: HashDisplayProps) {
  const display = truncate ? truncateHash(hash) : hash

  return (
    <code
      className={cn(
        'font-mono text-xs text-[var(--color-text-secondary)] bg-[var(--color-border-subtle)] px-2 py-1 rounded',
        className
      )}
      title={hash}
    >
      {display}
    </code>
  )
}
