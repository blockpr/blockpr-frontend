import type { Emission } from '@/types'
import { CompanyAvatar } from './CompanyAvatar'

interface VerifyDataGridProps {
  emission: Emission
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getUTCDate()
  const month = MONTHS[d.getUTCMonth()]
  const year = d.getUTCFullYear()
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  return `${day} ${month} ${year} · ${hh}:${mm} UTC`
}

const cell: React.CSSProperties = {
  background: '#0a0a0a',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 10,
  padding: '16px 18px',
}

const label: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 500,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.25)',
  marginBottom: 8,
}

const value: React.CSSProperties = {
  fontSize: 13.5,
  color: 'rgba(255,255,255,0.75)',
  lineHeight: 1.4,
}

export function VerifyDataGrid({ emission }: VerifyDataGridProps) {
  const isVerified = emission.status === 'verified'
  const documentLabel = emission.documentName ?? emission.id

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        {/* Empresa emisora — ancho completo */}
        <div style={{ ...cell, gridColumn: '1 / -1' }}>
          <div style={label}>Empresa emisora</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CompanyAvatar name={emission.company ?? '?'} />
            <div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                {emission.company}
              </div>
            </div>
          </div>
        </div>

        {/* Documento */}
        <div style={cell}>
          <div style={label}>Documento</div>
          <div style={value}>{documentLabel}</div>
        </div>

        {/* Fecha de registro */}
        <div style={cell}>
          <div style={label}>Fecha de registro</div>
          <div style={value}>{formatDate(emission.date)}</div>
        </div>

        {/* Confirmado on-chain — solo en verified si existe */}
        {isVerified && emission.blockchainConfirmedAt && (
          <div style={cell}>
            <div style={label}>Confirmado on-chain</div>
            <div style={value}>{formatDate(emission.blockchainConfirmedAt)}</div>
          </div>
        )}

        {/* Hash SHA-256 — ancho completo */}
        <div style={{ ...cell, gridColumn: '1 / -1' }}>
          <div style={label}>Hash SHA-256</div>
          <div
            style={{
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              wordBreak: 'break-all',
              lineHeight: 1.5,
            }}
          >
            {emission.hash}
          </div>
        </div>

        {/* TX Blockchain — ancho completo */}
        <div style={{ ...cell, gridColumn: '1 / -1' }}>
          <div style={label}>Transacción blockchain</div>
          {isVerified && emission.txHash ? (
            <a
              href={`https://explorer.solana.com/tx/${emission.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(100,180,255,0.8)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontFamily: "'SF Mono', 'Fira Code', monospace",
              }}
            >
              {emission.txHash}
              <svg
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                style={{ flexShrink: 0 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          ) : (
            <div
              style={{
                color: 'rgba(255,255,255,0.2)',
                fontStyle: 'italic',
                fontSize: 12,
              }}
            >
              Sin transacción aún — en proceso
            </div>
          )}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '28px 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>
        <svg
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          style={{ flexShrink: 0 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        Este registro es inmutable. Fue sellado criptográficamente en Solana y no puede ser alterado.
      </div>
    </>
  )
}
