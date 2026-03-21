import { truncateHash } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface BlockchainTxLinkProps {
  txHash: string
  /** Si viene del backend (p. ej. explorer_url), se usa en lugar del explorador por defecto */
  href?: string
  network?: 'solana'
  /** false = firma completa con salto de línea (p. ej. detalle a ancho completo) */
  truncate?: boolean
  className?: string
}

const explorers: Record<string, string> = {
  solana: 'https://solscan.io/tx',
}

export function BlockchainTxLink({
  txHash,
  href: hrefProp,
  network = 'solana',
  truncate = true,
  className,
}: BlockchainTxLinkProps) {
  const baseUrl = explorers[network]
  const href = hrefProp ?? `${baseUrl}/${txHash}`
  const label = truncate ? truncateHash(txHash) : txHash

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1 font-mono text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline-offset-2 hover:underline transition-colors',
        className
      )}
    >
      {label}
      <svg
        className="w-3 h-3 opacity-70"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  )
}
