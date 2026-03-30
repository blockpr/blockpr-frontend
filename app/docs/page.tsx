'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useThemeStore } from '@/stores/themeStore'
import { HeaderMenu } from '@/components/layout/HeaderMenu'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

const NAV_SECTIONS = [
  { id: 'autenticacion', label: 'Autenticación' },
  { id: 'base-url', label: 'Base URL' },
  { id: 'registrar', label: 'Registrar certificado' },
  { id: 'listar-api-key', label: 'Listar por API key' },
  { id: 'consultar-publico', label: 'Consultar certificado público' },
  { id: 'errores', label: 'Códigos de error' },
  { id: 'notas', label: 'Notas importantes' },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="text-[10px] font-medium px-2 py-1 rounded-[4px] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)] transition-colors"
    >
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative group">
      <pre className="text-xs bg-[var(--color-base)] text-[var(--color-text-secondary)] p-4 rounded-[6px] border border-[var(--color-border)] overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={code} />
      </div>
    </div>
  )
}

function MethodBadge({ method }: { method: 'GET' | 'POST' | 'DELETE' | 'PUT' }) {
  const styles: Record<string, string> = {
    GET: 'bg-blue-500/10 text-blue-400',
    POST: 'bg-[var(--color-success-muted)] text-[var(--color-success)]',
    DELETE: 'bg-[var(--color-danger-muted)] text-[var(--color-danger)]',
    PUT: 'bg-orange-500/10 text-orange-400',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-[4px] text-xs font-bold tracking-wide ${styles[method]}`}>
      {method}
    </span>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4 pb-3 border-b border-[var(--color-border)]">
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  )
}

export default function DocsPage() {
  const { theme } = useThemeStore()
  const isLight = theme === 'light'
  const titleColor = isLight ? '#1a1a22' : '#ffffff'
  const [activeSection, setActiveSection] = useState('autenticacion')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div data-theme={theme === 'dark' ? undefined : theme} className="flex h-screen bg-[var(--color-base)] overflow-hidden">

      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)]">
        {/* Header */}
        <div className="h-16 flex items-center px-4 shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: titleColor }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
        </div>

        <div className="border-b border-[var(--color-border)]" />

        {/* Nav */}
        <div className="flex-1 py-4 px-2 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] px-3 mb-2">
            API Reference
          </p>
          <nav className="space-y-1.5">
            {NAV_SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === id
                    ? 'bg-[var(--color-nav-active-bg)] text-[var(--color-nav-active-text)] font-medium'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)]'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[var(--color-border)]">
          <p className="text-[11px] text-[var(--color-text-muted)]">
            unickeys API v1.0
          </p>
        </div>
      </aside>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 flex items-center justify-center px-8 bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-10 relative">
          <h1 className="text-base font-normal" style={{ color: titleColor }}>
            Documentación
          </h1>
          <div className="absolute right-8">
            <HeaderMenu />
          </div>
        </div>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-8 py-8 space-y-12">

          {/* Autenticación */}
          <Section id="autenticacion" title="Autenticación">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Esta API combina endpoints públicos y endpoints protegidos con API key. Podés generar tus claves desde el{' '}
              <Link href="/dashboard/api-keys" className="text-[var(--color-accent)] hover:underline">
                panel de control
              </Link>.
            </p>
            <div className="border border-[var(--color-border)] bg-[var(--color-card)] rounded-[6px] p-5">
              <p className="text-xs font-medium text-[var(--color-text-muted)] mb-3 uppercase tracking-wide">Modos soportados</p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                    Para <code>POST /public/certificates/hash</code>:
                  </p>
                  <CodeBlock code={`Authorization: Bearer YOUR_API_KEY
o
X-API-Key: YOUR_API_KEY`} />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                    Para <code>POST /public/certificates/by-api-key</code>:
                  </p>
                  <CodeBlock code={`{
  "api_key": "bpk_..."
}`} />
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  <code>GET /public/certificates/:id</code> no requiere API key.
                </p>
              </div>
            </div>
          </Section>

          {/* Base URL */}
          <Section id="base-url" title="Base URL">
            <div className="border border-[var(--color-border)] bg-[var(--color-card)] rounded-[6px] p-5">
              <code className="text-sm font-mono text-[var(--color-accent)]">{API_BASE}</code>
            </div>
          </Section>

          {/* Registrar */}
          <Section id="registrar" title="Registrar Certificado">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Calcula el hash SHA-256 de un PDF, lo registra en Solana y lo guarda en la base de datos.
            </p>
            <div className="border border-[var(--color-border)] bg-[var(--color-card)] rounded-[6px] overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)]">
                <MethodBadge method="POST" />
                <code className="text-sm font-mono text-[var(--color-text-primary)]">
                  /public/certificates/hash
                </code>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">
                    Parámetros — multipart/form-data
                  </p>
                  <div className="space-y-2">
                    {[
                      { name: 'pdf', type: 'archivo', desc: 'Archivo PDF del certificado', required: true },
                      { name: 'external_id', type: 'string', desc: 'ID externo del certificado', required: false },
                      { name: 'certificate_type', type: 'string', desc: 'Tipo de certificado', required: false },
                      { name: 'metadata', type: 'JSON string', desc: 'Metadatos adicionales', required: false },
                    ].map((p) => (
                      <div key={p.name} className="flex items-start gap-3 text-sm">
                        <code className="text-[var(--color-text-primary)] shrink-0 w-36">{p.name}</code>
                        <span className="text-[var(--color-text-muted)] text-xs shrink-0 w-20">{p.type}</span>
                        <span className="text-[var(--color-text-secondary)]">{p.desc}</span>
                        {p.required && (
                          <span className="text-[10px] font-semibold text-[var(--color-danger)] ml-auto shrink-0">
                            requerido
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">
                    Respuesta — 201
                  </p>
                  <CodeBlock code={`{
  "success": true,
  "hash": "sha256_hash_del_pdf",
  "transaction_signature": "solana_transaction_signature",
  "explorer_url": "https://solscan.io/tx/...",
  "certificate": {
    "id": "uuid",
    "user_id": "uuid",
    "external_id": "optional",
    "certificate_type": "optional",
    "document_hash": "sha256_hash",
    "created_at": "2024-01-01T00:00:00Z",
    "metadata": {}
  }
}`} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">
                    Ejemplo — cURL
                  </p>
                  <CodeBlock code={`curl -X POST ${API_BASE}/public/certificates/hash \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "pdf=@certificado.pdf" \\
  -F "external_id=CT-2024-001" \\
  -F "certificate_type=inspeccion" \\
  -F 'metadata={"vehiculo": "ABC123", "fecha": "2024-01-01"}'`} />
                </div>
              </div>
            </div>
          </Section>

          {/* Listar por API key */}
          <Section id="listar-api-key" title="Listar Certificados por API key">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Devuelve todos los certificados del usuario asociado a la API key enviada en el body.
            </p>
            <div className="border border-[var(--color-border)] bg-[var(--color-card)] rounded-[6px] overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)]">
                <MethodBadge method="POST" />
                <code className="text-sm font-mono text-[var(--color-text-primary)]">
                  /public/certificates/by-api-key
                </code>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">
                    Body — application/json
                  </p>
                  <CodeBlock code={`{
  "api_key": "bpk_..."
}`} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">
                    Respuesta — 200
                  </p>
                  <CodeBlock code={`{
  "certificates": [
    {
      "certificate": {
        "id": "uuid",
        "external_id": "optional",
        "certificate_type": "optional",
        "document_hash": "sha256_hash",
        "metadata": {},
        "verification_url": "https://.../verify/uuid",
        "created_at": "2024-01-01T00:00:00Z"
      },
      "issuer": {
        "company_name": "Empresa SA"
      },
      "blockchain": {
        "transaction_signature": "solana_signature",
        "explorer_url": "https://solscan.io/tx/...",
        "blockchain": "solana",
        "network": "mainnet",
        "status": "confirmed",
        "confirmed_at": "2024-01-01T00:00:30Z"
      }
    }
  ]
}`} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">
                    Ejemplo — cURL
                  </p>
                  <CodeBlock code={`curl -X POST ${API_BASE}/public/certificates/by-api-key \\
  -H "Content-Type: application/json" \\
  -d '{"api_key":"bpk_..."}'`} />
                </div>
              </div>
            </div>
          </Section>

          {/* Consultar público */}
          <Section id="consultar-publico" title="Consultar Certificado Público">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Obtiene un certificado puntual por ID sin autenticación. Es ideal para páginas de verificación pública.
            </p>
            <div className="border border-[var(--color-border)] bg-[var(--color-card)] rounded-[6px] overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)]">
                <MethodBadge method="GET" />
                <code className="text-sm font-mono text-[var(--color-text-primary)]">
                  /public/certificates/{'{certificate_id}'}
                </code>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">
                    Respuesta — 200
                  </p>
                  <CodeBlock code={`{
  "certificate": {
    "id": "uuid",
    "external_id": "optional",
    "certificate_type": "optional",
    "document_hash": "sha256_hash",
    "metadata": {},
    "verification_url": "https://.../verify/uuid",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "issuer": {
    "company_name": "Empresa SA"
  },
  "blockchain": {
    "transaction_signature": "solana_signature",
    "explorer_url": "https://solscan.io/tx/...",
    "blockchain": "solana",
    "network": "mainnet",
    "status": "confirmed",
    "confirmed_at": "2024-01-01T00:00:30Z"
  }
}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">
                    Ejemplo — cURL
                  </p>
                  <CodeBlock code={`curl ${API_BASE}/public/certificates/UUID_DEL_CERTIFICADO`} />
                </div>
              </div>
            </div>
          </Section>

          {/* Errores */}
          <Section id="errores" title="Códigos de Error">
            <div className="border border-[var(--color-border)] bg-[var(--color-card)] rounded-[6px] overflow-hidden">
              {[
                { code: '400', desc: 'Bad Request — parámetros inválidos o faltantes' },
                { code: '401', desc: 'Unauthorized — API key inválida o faltante' },
                { code: '500', desc: 'Internal Server Error — error del servidor' },
              ].map((item, i, arr) => (
                <div
                  key={item.code}
                  className={`flex items-center gap-4 px-5 py-3.5 text-sm ${i < arr.length - 1 ? 'border-b border-[var(--color-border)]' : ''}`}
                >
                  <code className="text-[var(--color-danger)] font-mono font-semibold w-8 shrink-0">
                    {item.code}
                  </code>
                  <span className="text-[var(--color-text-secondary)]">{item.desc}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Notas */}
          <Section id="notas" title="Notas Importantes">
            <div className="border border-[var(--color-border)] bg-[var(--color-card)] rounded-[6px] divide-y divide-[var(--color-border)]">
              {[
                <>Los archivos PDF deben ser válidos y comenzar con <code className="text-[var(--color-text-primary)]">%PDF</code></>,
                'El hash se calcula usando SHA-256 sobre el contenido completo del PDF',
                'Las transacciones se registran en la blockchain de Solana usando el programa Memo',
                <>Podés usar los campos <code className="text-[var(--color-text-primary)]">pdf</code>, <code className="text-[var(--color-text-primary)]">file</code> o <code className="text-[var(--color-text-primary)]">document</code> para enviar el archivo</>,
                <>El campo <code className="text-[var(--color-text-primary)]">metadata</code> debe ser un string JSON válido</>,
                <>Para <code className="text-[var(--color-text-primary)]">/public/certificates/hash</code> la API key va en header; para <code className="text-[var(--color-text-primary)]">/public/certificates/by-api-key</code> va en body como <code className="text-[var(--color-text-primary)]">api_key</code>.</>,
              ].map((note, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-text-muted)] shrink-0" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
