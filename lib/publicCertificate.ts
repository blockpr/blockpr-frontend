import { buildVerifyUrl } from '@/lib/utils'
import type { Emission, EmissionStatus } from '@/types'

const serverApiBase =
  (typeof window === 'undefined' ? process.env.API_URL : undefined) ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:8000'

export interface PublicCertificateBlockchain {
  transaction_signature: string | null
  explorer_url: string | null
  blockchain: string | null
  network: string | null
  status: string | null
  confirmed_at: string | null
}

export interface PublicCertificatePayload {
  certificate: {
    id: string
    external_id: string | null
    certificate_type: string | null
    document_hash: string
    metadata: Record<string, unknown> | null
    verification_url: string | null
    created_at: string
  }
  issuer: {
    company_name: string
  }
  blockchain: PublicCertificateBlockchain
}

function mapBlockchainStatus(status: string | null): EmissionStatus {
  if (status === 'confirmed') return 'verified'
  if (status === 'failed' || status === 'error' || status === 'rejected') return 'failed'
  return 'pending'
}

export function mapPublicPayloadToEmission(data: PublicCertificatePayload): Emission {
  const { certificate: c, issuer, blockchain: b } = data
  const status = mapBlockchainStatus(b.status)
  const txHash = b.transaction_signature ?? undefined
  const txExplorerUrl =
    b.explorer_url ?? (txHash ? `https://explorer.solana.com/tx/${txHash}` : undefined)

  return {
    id: c.id,
    date: c.created_at,
    hash: c.document_hash,
    status,
    documentName: c.external_id ?? c.certificate_type ?? undefined,
    documentType: c.certificate_type ?? undefined,
    txHash,
    verifyUrl: c.verification_url ?? buildVerifyUrl(c.id),
    blockchainNetwork: b.network ?? undefined,
    blockchainName: b.blockchain ?? undefined,
    blockchainConfirmedAt: b.confirmed_at ?? undefined,
    company: issuer.company_name || undefined,
    txExplorerUrl,
  }
}

/**
 * Server-only fetch para la página pública de verificación.
 */
export async function fetchPublicCertificate(id: string): Promise<PublicCertificatePayload | null> {
  const url = `${serverApiBase.replace(/\/$/, '')}/public/certificates/${encodeURIComponent(id)}`
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`public certificate ${res.status}`)
  }
  return res.json() as Promise<PublicCertificatePayload>
}
