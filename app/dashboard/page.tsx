import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatsCard } from '@/components/shared/StatsCard'
import { EmissionStatusBadge } from '@/components/shared/EmissionStatusBadge'
import { HashDisplay } from '@/components/shared/HashDisplay'
import { MOCK_EMISSIONS, MOCK_COMPANY } from '@/lib/mocks/emissions'
import { formatDate } from '@/lib/utils'

const stats = {
  total: 1847,
  verified: 1823,
  pending: 18,
  failed: 6,
}

const recent = MOCK_EMISSIONS.slice(0, 5)

export default function DashboardPage() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <PageHeader
        title={`${greeting}, ${MOCK_COMPANY.name}`}
        description="Resumen de actividad de tu cuenta"
      />

      {/* Stats + tabla agrupados con mismo gap */}
      <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Total emitidos"
          value={stats.total}
          accent="default"
          trend={{ value: '247', positive: true }}
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
          trend={{ value: '245', positive: true }}
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
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">

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
            className="text-xs text-[var(--color-accent)] hover:underline"
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
            {recent.map((emission) => (
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
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    Ver →
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
