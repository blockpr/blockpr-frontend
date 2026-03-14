'use client'

import Link from 'next/link'
import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { StatsCard } from '@/components/shared/StatsCard'
import { EmissionStatusBadge } from '@/components/shared/EmissionStatusBadge'
import { HashDisplay } from '@/components/shared/HashDisplay'
import { certificatesApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Emission, EmissionStatus } from '@/types'

const INITIAL_STATS = {
  total: 0,
  verified: 0,
  pending: 0,
  failed: 0,
}

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
    txHash: certificate.blockchain.transaction_signature ?? undefined,
    verifyUrl: certificate.blockchain.explorer_url ?? `/verify/${certificate.id}`,
  }
}

function RecentEmissionsSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="hover:bg-[var(--color-card-hover)] transition-colors">
          <td className="px-6 py-3.5">
            <div className="h-4 w-20 bg-[var(--color-border)] rounded animate-pulse" />
          </td>
          <td className="px-6 py-3.5">
            <div className="h-4 w-24 bg-[var(--color-border)] rounded animate-pulse" />
          </td>
          <td className="px-6 py-3.5">
            <div className="h-5 w-32 bg-[var(--color-border)] rounded animate-pulse" />
          </td>
          <td className="px-6 py-3.5">
            <div className="h-5 w-20 bg-[var(--color-border)] rounded-full animate-pulse" />
          </td>
          <td className="px-6 py-3.5 text-right">
            <div className="h-4 w-4 bg-[var(--color-border)] rounded animate-pulse ml-auto" />
          </td>
        </tr>
      ))}
    </>
  )
}

export default function DashboardPage() {
  const fetchDashboardData = useCallback(async (): Promise<{ recent: Emission[]; stats: typeof INITIAL_STATS }> => {
    const firstPage = await certificatesApi.list(1, 100)

    let allCertificates = [...firstPage.data]
    if (firstPage.pagination.pages > 1) {
      const remainingPageCalls = Array.from(
        { length: firstPage.pagination.pages - 1 },
        (_, i) => certificatesApi.list(i + 2, 100)
      )
      const remainingResponses = await Promise.all(remainingPageCalls)
      for (const pageData of remainingResponses) {
        allCertificates = allCertificates.concat(pageData.data)
      }
    }

    const allEmissions = allCertificates.map(mapCertificateToEmission)
    const stats = allEmissions.reduce(
      (acc, emission) => {
        acc.total += 1
        if (emission.status === 'verified') acc.verified += 1
        if (emission.status === 'pending') acc.pending += 1
        if (emission.status === 'failed') acc.failed += 1
        return acc
      },
      { ...INITIAL_STATS }
    )

    return {
      stats,
      recent: allEmissions.slice(0, 5),
    }
  }, [])

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['dashboard-emissions-overview'],
    queryFn: fetchDashboardData,
  })

  const stats = data?.stats ?? INITIAL_STATS
  const recent = data?.recent ?? []

  return (
    <div className="p-8 space-y-8 bg-[var(--color-base)] min-h-full">
      {/* Stats + tabla agrupados con mismo gap */}
      <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Total emitidos"
          value={stats.total}
          accent="default"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
        />
        <StatsCard
          label="Verificados"
          value={stats.verified}
          accent="success"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          label="Pendientes"
          value={stats.pending}
          accent="warning"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          label="Fallidos"
          value={stats.failed}
          accent="danger"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          }
        />
      </div>

      {/* Emisiones recientes */}
      <div className="border rounded-[6px] border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">

        <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-sm font-medium text-[var(--color-text-primary)]">
              Emisiones recientes
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Últimos certificados procesados
            </p>
          </div>
          <Link
            href="/dashboard/emissions"
            className="text-xs text-[var(--color-text-primary)] hover:underline"
          >
            Ver todas →
          </Link>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {['ID', 'Fecha', 'Hash', 'Estado', ''].map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading && <RecentEmissionsSkeleton />}

            {isError && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-sm text-[var(--color-text-secondary)]">
                  {(error as { message?: string })?.message ?? 'No se pudieron cargar las emisiones recientes'}
                </td>
              </tr>
            )}

            {!isLoading && !isError && recent.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-sm text-[var(--color-text-secondary)]">
                  No hay emisiones recientes.
                </td>
              </tr>
            )}

            {!isLoading && !isError && recent.map((emission) => (
              <tr
                key={emission.id}
                className="hover:bg-[var(--color-card-hover)] transition-colors"
              >
                <td className="px-6 py-3.5">
                  <span className="font-mono text-xs text-[var(--color-text-secondary)]">
                    {emission.id}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {formatDate(emission.date)}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <HashDisplay hash={emission.hash} truncate />
                </td>
                <td className="px-6 py-3.5">
                  <EmissionStatusBadge status={emission.status} />
                </td>
                <td className="px-6 py-3.5 text-right">
                  <Link
                    href={`/dashboard/emissions/${emission.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  )
}
