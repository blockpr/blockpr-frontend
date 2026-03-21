import type { Metadata } from 'next'
import { fetchPublicCertificate, mapPublicPayloadToEmission } from '@/lib/publicCertificate'
import { VerifyNavbar } from '@/components/layout/VerifyNavbar'
import { VerifyBanner } from '@/components/verify/VerifyBanner'
import { VerifyDataGrid } from '@/components/verify/VerifyDataGrid'
import type { Emission } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Verificación ${id} — unickeys`,
  }
}

export default async function VerifyPage({ params }: Props) {
  const { id } = await params

  let emission: Emission | null = null
  let loadError = false

  try {
    const payload = await fetchPublicCertificate(id)
    if (payload) {
      emission = mapPublicPayloadToEmission(payload)
    }
  } catch {
    loadError = true
  }

  const state = loadError
    ? 'failed'
    : emission === null
      ? 'not_found'
      : emission.status === 'failed'
        ? 'failed'
        : emission.status === 'pending'
          ? 'pending'
          : 'verified'

  const showGrid = !loadError && emission !== null && (state === 'verified' || state === 'pending')

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>
      <VerifyNavbar />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          Verificación de documento
        </div>

        <VerifyBanner state={state} />

        {showGrid && emission && <VerifyDataGrid emission={emission} />}

        {state === 'not_found' && (
          <div
            style={{
              marginTop: 16,
              fontSize: 13,
              color: 'rgba(255,255,255,0.2)',
              textAlign: 'center',
              lineHeight: 1.7,
            }}
          >
            No existe ningún registro con este identificador.
            <br />
            Si creés que es un error, contactá a la empresa emisora del documento.
          </div>
        )}

        {state === 'failed' && loadError && (
          <div
            style={{
              marginTop: 16,
              fontSize: 13,
              color: 'rgba(255,255,255,0.2)',
              textAlign: 'center',
              lineHeight: 1.7,
            }}
          >
            No pudimos conectar con el servicio de verificación.
            <br />
            Intentá de nuevo más tarde.
          </div>
        )}
      </div>
    </div>
  )
}
