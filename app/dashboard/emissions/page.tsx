import { buildVerifyUrl } from '@/lib/utils'
import { serverFetch } from '@/lib/server-api'
import type { CertificatesListResponse } from '@/lib/api'
import type { Emission, EmissionStatus } from '@/types'
import EmissionsClient from './EmissionsClient'

const CERTIFICATES_LIMIT = 100

function mapStatus(status: string | null): EmissionStatus {
  if (status === 'confirmed') return 'verified'
  if (status === 'failed' || status === 'error' || status === 'rejected') return 'failed'
  return 'pending'
}

async function fetchAllEmissions(): Promise<Emission[]> {
  const first = await serverFetch<CertificatesListResponse>(
    `/certificates?page=1&limit=${CERTIFICATES_LIMIT}`,
  )
  let certs = [...first.data]

  if (first.pagination.pages > 1) {
    const rest = await Promise.all(
      Array.from({ length: first.pagination.pages - 1 }, (_, i) =>
        serverFetch<CertificatesListResponse>(
          `/certificates?page=${i + 2}&limit=${CERTIFICATES_LIMIT}`,
        ),
      ),
    )
    for (const page of rest) certs = certs.concat(page.data)
  }

  return certs.map((c) => ({
    id: c.id,
    date: c.created_at,
    hash: c.document_hash,
    status: mapStatus(c.blockchain.status),
    documentName: c.external_id ?? c.certificate_type ?? 'Sin nombre',
    documentType: c.certificate_type ?? 'sin_tipo',
    txHash: c.blockchain.transaction_signature ?? undefined,
    verifyUrl: buildVerifyUrl(c.id),
    blockchainName: c.blockchain.blockchain ?? undefined,
    blockchainNetwork: c.blockchain.network ?? undefined,
    blockchainConfirmedAt: c.blockchain.confirmed_at ?? undefined,
  }))
}

export default async function EmissionsPage() {
  let initialEmissions: Emission[] = []
  let fetchError = false

  try {
    initialEmissions = await fetchAllEmissions()
  } catch {
    fetchError = true
  }

  return <EmissionsClient initialEmissions={initialEmissions} fetchError={fetchError} />
}
