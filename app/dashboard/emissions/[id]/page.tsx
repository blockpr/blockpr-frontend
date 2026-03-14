'use client'

import Link from 'next/link'
import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { EmissionStatusBadge } from '@/components/shared/EmissionStatusBadge'
import { HashDisplay } from '@/components/shared/HashDisplay'
import { BlockchainTxLink } from '@/components/shared/BlockchainTxLink'
import { certificatesApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Emission, EmissionStatus } from '@/types'

const CERTIFICATES_LIMIT = 100

function mapBackendStatusToEmissionStatus(status: string | null): EmissionStatus {
  if (status === 'confirmed') return 'verified'
  if (status === 'failed' || status === 'error' || status === 'rejected') return 'failed'
  return 'pending'
}

function mapCertificateToEmission(certificate: Awaited<ReturnType<typeof certificatesApi.list>>['data'][number]): Emission {
  return {
    id: certificate.id,
    date: certificate.created_at,
    hash: certificate.document_hash,
    status: mapBackendStatusToEmissionStatus(certificate.blockchain.status),
    documentName: certificate.external_id ?? certificate.certificate_type ?? 'Sin nombre',
    documentType: certificate.certificate_type ?? 'sin_tipo',
    txHash: certificate.blockchain.transaction_signature ?? undefined,
    verifyUrl: certificate.blockchain.explorer_url ?? `/verify/${certificate.id}`,
    blockchainName: certificate.blockchain.blockchain ?? undefined,
    blockchainNetwork: certificate.blockchain.network ?? undefined,
    blockchainConfirmedAt: certificate.blockchain.confirmed_at ?? undefined,
  }
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-4 border-b border-[var(--color-border)] last:border-0">
      <dt className="text-sm text-[var(--color-text-muted)] sm:w-48 shrink-0">{label}</dt>
      <dd className="text-sm text-[var(--color-text-primary)] flex-1 break-all">{children}</dd>
    </div>
  )
}

export default function EmissionDetailPage() {
  const { id } = useParams<{ id: string }>()

  const fetchEmission = useCallback(async (): Promise<Emission | null> => {
    const firstPage = await certificatesApi.list(1, CERTIFICATES_LIMIT)
    let allCertificates = [...firstPage.data]

    if (firstPage.pagination.pages > 1) {
      const remainingPageCalls = Array.from(
        { length: firstPage.pagination.pages - 1 },
        (_, i) => certificatesApi.list(i + 2, CERTIFICATES_LIMIT)
      )
      const remainingResponses = await Promise.all(remainingPageCalls)
      for (const response of remainingResponses) {
        allCertificates = allCertificates.concat(response.data)
      }
    }

    const emission = allCertificates.map(mapCertificateToEmission).find((item) => item.id === id)
    return emission ?? null
  }, [id])

  const {
    data: emission,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['dashboard-emission-detail', id],
    queryFn: fetchEmission,
    enabled: !!id,
  })

  if (isLoading) {
    const sk = 'rounded-lg bg-[var(--color-border)] animate-pulse'
    return (
      <div className="p-8 space-y-6 max-w-4xl bg-[var(--color-base)] min-h-full">
        {/* Back link skeleton */}
        <div className={`h-4 w-24 ${sk}`} />

        {/* Card 1 — Información del certificado */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <div className={`h-3.5 w-44 ${sk}`} />
          </div>
          <div className="px-6 divide-y divide-[var(--color-border)]">
            {/* ID */}
            <div className="flex gap-4 py-4">
              <div className={`h-3.5 w-32 shrink-0 ${sk}`} />
              <div className={`h-3.5 w-48 ${sk}`} />
            </div>
            {/* Nombre */}
            <div className="flex gap-4 py-4">
              <div className={`h-3.5 w-32 shrink-0 ${sk}`} />
              <div className={`h-3.5 w-36 ${sk}`} />
            </div>
            {/* Tipo */}
            <div className="flex gap-4 py-4">
              <div className={`h-3.5 w-32 shrink-0 ${sk}`} />
              <div className={`h-3.5 w-24 ${sk}`} />
            </div>
            {/* Fecha */}
            <div className="flex gap-4 py-4">
              <div className={`h-3.5 w-32 shrink-0 ${sk}`} />
              <div className={`h-3.5 w-28 ${sk}`} />
            </div>
            {/* Estado */}
            <div className="flex gap-4 py-4">
              <div className={`h-3.5 w-32 shrink-0 ${sk}`} />
              <div className={`h-5 w-20 rounded-full ${sk}`} />
            </div>
          </div>
        </div>

        {/* Card 2 — Respaldo criptográfico */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <div className={`h-3.5 w-40 ${sk}`} />
          </div>
          <div className="px-6 divide-y divide-[var(--color-border)]">
            {/* Hash */}
            <div className="flex gap-4 py-4">
              <div className={`h-3.5 w-32 shrink-0 ${sk}`} />
              <div className="flex-1 space-y-2">
                <div className={`h-3.5 w-full max-w-sm ${sk}`} />
                <div className={`h-3 w-40 ${sk}`} />
              </div>
            </div>
            {/* TX */}
            <div className="flex gap-4 py-4">
              <div className={`h-3.5 w-32 shrink-0 ${sk}`} />
              <div className={`h-3.5 w-52 ${sk}`} />
            </div>
          </div>
        </div>

        {/* Card 3 — Verificación pública */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <div className={`h-3.5 w-36 ${sk}`} />
          </div>
          <div className="px-6 py-5 flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <div className={`h-3.5 w-full max-w-xs ${sk}`} />
              <div className={`h-3 w-48 ${sk}`} />
            </div>
            <div className="flex gap-2 shrink-0">
              <div className={`h-9 w-20 rounded-lg ${sk}`} />
              <div className={`h-9 w-28 rounded-lg ${sk}`} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 space-y-3">
        <p className="text-sm text-[var(--color-text-secondary)]">
          {(error as { message?: string })?.message ?? 'No se pudo cargar la emision'}
        </p>
        <Link href="/dashboard/emissions" className="text-sm text-[var(--color-accent)] hover:underline">
          Volver a emisiones
        </Link>
      </div>
    )
  }

  if (!emission) {
    return (
      <div className="p-8 space-y-3">
        <p className="text-sm text-[var(--color-text-secondary)]">No se encontro esta emision.</p>
        <Link href="/dashboard/emissions" className="text-sm text-[var(--color-accent)] hover:underline">
          Volver a emisiones
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl bg-[var(--color-base)] min-h-full">
      <Link
        href="/dashboard/emissions"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Emisiones
      </Link>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-medium text-[var(--color-text-primary)]">Informacion del certificado</h2>
        </div>
        <dl className="px-6">
          <DetailRow label="ID de emision">
            <span className="font-mono text-xs">{emission.id}</span>
          </DetailRow>
          <DetailRow label="Nombre del documento">{emission.documentName ?? 'Sin nombre'}</DetailRow>
          <DetailRow label="Tipo de documento">{emission.documentType ?? '-'}</DetailRow>
          <DetailRow label="Fecha de registro">{formatDate(emission.date)}</DetailRow>
          <DetailRow label="Estado">
            <EmissionStatusBadge status={emission.status} />
          </DetailRow>
        </dl>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-medium text-[var(--color-text-primary)]">Respaldo criptografico</h2>
        </div>
        <dl className="px-6">
          <DetailRow label="Hash SHA-256">
            <div className="space-y-1.5">
              <HashDisplay hash={emission.hash} />
              <p className="text-xs text-[var(--color-text-muted)]">Huella digital unica del certificado</p>
            </div>
          </DetailRow>
          <DetailRow label="Transaccion blockchain">
            {emission.txHash ? (
              <div className="space-y-1.5">
                <BlockchainTxLink txHash={emission.txHash} network="solana" />
                <p className="text-xs text-[var(--color-text-muted)]">Registrado en {emission.blockchainName ?? 'blockchain'}</p>
              </div>
            ) : (
              <span className="text-[var(--color-text-muted)]">
                {emission.status === 'pending' ? 'Pendiente de confirmacion en blockchain' : 'No disponible'}
              </span>
            )}
          </DetailRow>
          {emission.blockchainConfirmedAt && (
            <DetailRow label="Confirmado en">
              {formatDate(emission.blockchainConfirmedAt)}
            </DetailRow>
          )}
        </dl>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-medium text-[var(--color-text-primary)]">Verificacion publica</h2>
        </div>
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Cualquier persona puede verificar la autenticidad de este certificado sin necesidad de crear una cuenta.
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
              Abrir
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(emission.verifyUrl)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-sm text-white hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Copiar link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
