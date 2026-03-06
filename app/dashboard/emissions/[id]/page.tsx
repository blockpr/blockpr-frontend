import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmissionStatusBadge } from '@/components/shared/EmissionStatusBadge'
import { HashDisplay } from '@/components/shared/HashDisplay'
import { BlockchainTxLink } from '@/components/shared/BlockchainTxLink'
import { MOCK_EMISSIONS } from '@/lib/mocks/emissions'
import { formatDate } from '@/lib/utils'

interface Props {
  params: { id: string }
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-4 border-b border-[var(--color-border)] last:border-0">
      <dt className="text-sm text-[var(--color-text-muted)] sm:w-48 shrink-0">{label}</dt>
      <dd className="text-sm text-[var(--color-text-primary)] flex-1 break-all">{children}</dd>
    </div>
  )
}

export default function EmissionDetailPage({ params }: Props) {
  const emission = MOCK_EMISSIONS.find((e) => e.id === params.id)
  if (!emission) notFound()

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/emissions"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Emisiones
        </Link>
        <PageHeader
          title="Detalle de emisión"
          description={emission.id}
          actions={<EmissionStatusBadge status={emission.status} />}
        />
      </div>

      {/* Datos principales */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-medium text-[var(--color-text-primary)]">
            Información del certificado
          </h2>
        </div>
        <dl className="px-6">
          <DetailRow label="ID de emisión">
            <span className="font-mono text-xs">{emission.id}</span>
          </DetailRow>
          <DetailRow label="Fecha de registro">
            {formatDate(emission.date)}
          </DetailRow>
          <DetailRow label="Empresa emisora">
            {emission.company ?? '—'}
          </DetailRow>
          <DetailRow label="Estado">
            <EmissionStatusBadge status={emission.status} />
          </DetailRow>
        </dl>
      </div>

      {/* Datos criptográficos */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-medium text-[var(--color-text-primary)]">
            Respaldo criptográfico
          </h2>
        </div>
        <dl className="px-6">
          <DetailRow label="Hash SHA-256">
            <div className="space-y-1.5">
              <HashDisplay hash={emission.hash} />
              <p className="text-xs text-[var(--color-text-muted)]">
                Huella digital única del certificado
              </p>
            </div>
          </DetailRow>
          <DetailRow label="Transacción blockchain">
            {emission.txHash ? (
              <div className="space-y-1.5">
                <BlockchainTxLink txHash={emission.txHash} network="solana" />
                <p className="text-xs text-[var(--color-text-muted)]">Registrado en Solana</p>
              </div>
            ) : (
              <span className="text-[var(--color-text-muted)]">
                {emission.status === 'pending' ? 'En proceso de registro...' : 'No disponible'}
              </span>
            )}
          </DetailRow>
          {emission.blockNumber && (
            <DetailRow label="Bloque">
              <span className="font-mono text-xs">#{emission.blockNumber.toLocaleString('es-AR')}</span>
            </DetailRow>
          )}
          {emission.merkleProof && (
            <DetailRow label="Merkle proof">
              <div className="space-y-1">
                {emission.merkleProof.map((p, i) => (
                  <HashDisplay key={i} hash={p} truncate className="block" />
                ))}
              </div>
            </DetailRow>
          )}
        </dl>
      </div>

      {/* Verificación pública */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-medium text-[var(--color-text-primary)]">
            Verificación pública
          </h2>
        </div>
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Cualquier persona puede verificar la autenticidad de este certificado sin necesidad de
              crear una cuenta.
            </p>
            <a
              href={emission.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1.5 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors break-all"
            >
              {emission.verifyUrl}
            </a>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href={emission.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(emission.verifyUrl)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-sm text-white hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.187c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              Copiar link
            </button>
          </div>
        </div>
      </div>

      {/* Descarga */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Descargar información
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Exportá los datos completos de esta emisión en formato JSON
          </p>
        </div>
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(emission, null, 2)], {
              type: 'application/json',
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${emission.id}.json`
            a.click()
            URL.revokeObjectURL(url)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)] transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Descargar JSON
        </button>
      </div>
    </div>
  )
}
