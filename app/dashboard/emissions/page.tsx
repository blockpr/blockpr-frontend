'use client'

import { useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, getSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { EmissionsTable } from '@/components/emissions/EmissionsTable'
import { certificatesApi, refreshSession } from '@/lib/api'
import type { EmissionStatus, Emission } from '@/types'

const PAGE_SIZE = 10
const CERTIFICATES_LIMIT = 100

const STATUS_OPTIONS: { label: string; value: EmissionStatus | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Verificados', value: 'verified' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Fallidos', value: 'failed' },
]

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

export default function EmissionsPage() {
  const router = useRouter()
  const { status, update } = useSession()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<EmissionStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const fetchCertificates = useCallback(async (): Promise<Emission[]> => {
    let currentSession = await getSession()

    if (!currentSession?.user?.accessToken) {
      throw new Error('No hay sesión activa')
    }

    try {
      const response = await certificatesApi.list(currentSession.user.accessToken, 1, CERTIFICATES_LIMIT)
      return response.data.map(mapCertificateToEmission)
    } catch (error: any) {
      if (error?.status === 401) {
        await update()
        await refreshSession()
        currentSession = await getSession()
        if (!currentSession?.user?.accessToken) {
          throw new Error('Sesión expirada. Iniciá sesión nuevamente.')
        }

        const retry = await certificatesApi.list(currentSession.user.accessToken, 1, CERTIFICATES_LIMIT)
        return retry.data.map(mapCertificateToEmission)
      }

      throw error
    }
  }, [update])

  const {
    data: allEmissions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard-emissions'],
    queryFn: fetchCertificates,
    enabled: status === 'authenticated',
  })

  useLayoutEffect(() => {
    const activeIndex = STATUS_OPTIONS.findIndex(o => o.value === statusFilter)
    const btn = btnRefs.current[activeIndex]
    if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [statusFilter])

  useEffect(() => {
    function handleResize() {
      const activeIndex = STATUS_OPTIONS.findIndex((o) => o.value === statusFilter)
      const btn = btnRefs.current[activeIndex]
      if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [statusFilter])

  const filtered = useMemo(() => {
    return allEmissions.filter((e) => {
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter
      const matchesSearch =
        search === '' ||
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.hash.toLowerCase().includes(search.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [allEmissions, search, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages)
    }
    if (totalPages === 0 && page !== 1) {
      setPage(1)
    }
  }, [page, totalPages])

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleStatus(value: EmissionStatus | 'all') {
    setStatusFilter(value)
    setPage(1)
  }

  return (
    <div className="p-8 space-y-6 bg-[var(--color-base)] min-h-full">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Búsqueda */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por ID o hash..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 rounded-[6px] pr-4 py-2 text-sm bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>

        {/* Filtro de estado */}
        <div className="rounded-[6px] relative flex items-center p-1 bg-[var(--color-card)] border border-[var(--color-border)]">
          {/* Indicador deslizante */}
          {indicator.width > 0 && (
            <span
              className="absolute top-1 bottom-1 rounded-md bg-white transition-all duration-200 ease-out pointer-events-none"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
          {STATUS_OPTIONS.map((opt, i) => (
            <button
              key={opt.value}
              ref={el => { btnRefs.current[i] = el }}
              onClick={() => handleStatus(opt.value)}
              className={`relative z-10 px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === opt.value
                  ? 'text-black'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden rounded-[6px]">
        {isLoading ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">Cargando emisiones...</p>
          </div>
        ) : isError ? (
          <div className="px-6 py-16 text-center space-y-3">
            <p className="text-sm text-[var(--color-text-secondary)]">
              {(error as { message?: string })?.message ?? 'No se pudieron cargar las emisiones'}
            </p>
            <button
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)] transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <EmissionsTable
            data={paginated}
            onRowClick={(emission) => router.push(`/dashboard/emissions/${emission.id}`)}
          />
        )}

        {/* Paginación */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between">
            <p className="text-xs text-[var(--color-text-muted)]">
              Página {page} de {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...')
                  acc.push(n)
                  return acc
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-xs text-[var(--color-text-muted)]">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className={`w-8 h-8 text-xs font-medium transition-colors ${
                        page === item
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)]'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
