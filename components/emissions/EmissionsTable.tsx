'use client'

import Link from 'next/link'
import { EmissionStatusBadge } from '@/components/shared/EmissionStatusBadge'
import { HashDisplay } from '@/components/shared/HashDisplay'
import { formatDate } from '@/lib/utils'
import type { Emission } from '@/types'

interface EmissionsTableProps {
  data: Emission[]
  onRowClick?: (emission: Emission) => void
}

export function EmissionsTable({ data, onRowClick }: EmissionsTableProps) {
  if (data.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-[var(--color-border)] flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">No hay emisiones</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Las emisiones aparecerán aquí cuando se procesen
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            {['ID', 'Fecha', 'Hash', 'Estado', 'Verificación', ''].map((col) => (
              <th
                key={col}
                className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {data.map((emission) => (
            <tr
              key={emission.id}
              onClick={() => onRowClick?.(emission)}
              className="hover:bg-[var(--color-card-hover)] transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-mono text-xs text-[var(--color-text-secondary)]">
                  {emission.id}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {formatDate(emission.date)}
                </span>
              </td>
              <td className="px-6 py-4">
                <HashDisplay hash={emission.hash} truncate />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <EmissionStatusBadge status={emission.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a
                  href={emission.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Verificar
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Link
                  href={`/dashboard/emissions/${emission.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors opacity-0 group-hover:opacity-100"
                >
                  Ver detalle →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
