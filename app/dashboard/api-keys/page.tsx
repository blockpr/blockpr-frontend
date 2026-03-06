'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { MOCK_API_KEYS } from '@/lib/mocks/emissions'
import { formatDate } from '@/lib/utils'
import type { ApiKey } from '@/types'

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
      className="p-1.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)] transition-colors"
      title="Copiar"
    >
      {copied ? (
        <svg className="w-3.5 h-3.5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.187c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      )}
    </button>
  )
}

function NewKeyModal({
  secret,
  onClose,
}: {
  secret: string
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-[var(--color-success-muted)] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              API Key generada
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Copiala ahora. No vas a poder verla de nuevo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] mb-5">
          <code className="flex-1 text-xs font-mono text-[var(--color-text-primary)] break-all">
            {secret}
          </code>
          <CopyButton text={secret} />
        </div>

        <Button onClick={onClose} fullWidth variant="secondary">
          Entendido, ya la copié
        </Button>
      </div>
    </div>
  )
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(MOCK_API_KEYS)
  const [newSecret, setNewSecret] = useState<string | null>(null)
  const [creatingName, setCreatingName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function handleCreate() {
    if (!creatingName.trim()) return
    const secret = `bpr_live_${Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')}`

    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: creatingName.trim(),
      prefix: secret.slice(0, 12) + '...',
      createdAt: new Date().toISOString(),
      secret,
    }

    setKeys((prev) => [newKey, ...prev])
    setNewSecret(secret)
    setCreatingName('')
    setShowCreateForm(false)
  }

  function handleDelete(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      {newSecret && (
        <NewKeyModal secret={newSecret} onClose={() => setNewSecret(null)} />
      )}

      <PageHeader
        title="API Keys"
        description="Claves de acceso para integrar BlockPR con tus sistemas"
        actions={
          !showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)} size="sm">
              + Nueva key
            </Button>
          )
        }
      />

      {/* Formulario de creación */}
      {showCreateForm && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
            Nueva API Key
          </p>
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Nombre (ej: Producción, Testing)"
              value={creatingName}
              onChange={(e) => setCreatingName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="flex-1 px-3.5 py-2 rounded-lg text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            <Button onClick={handleCreate} disabled={!creatingName.trim()}>
              Generar
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateForm(false)
                setCreatingName('')
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de keys */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        {keys.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">No hay API keys creadas</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Creá una para integrar BlockPR con tus sistemas
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Nombre', 'Prefijo', 'Creada', 'Último uso', ''].map((col) => (
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
              {keys.map((key) => (
                <tr key={key.id} className="hover:bg-[var(--color-card-hover)] transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {key.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-2 py-1 rounded">
                      {key.prefix}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {formatDate(key.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {key.lastUsed ? formatDate(key.lastUsed) : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {deletingId === key.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-[var(--color-text-muted)]">¿Confirmar?</span>
                        <button
                          onClick={() => handleDelete(key.id)}
                          className="text-xs text-[var(--color-danger)] hover:underline"
                        >
                          Sí, eliminar
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="text-xs text-[var(--color-text-muted)] hover:underline"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(key.id)}
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Nota de seguridad */}
      <div className="flex gap-3 p-4 rounded-xl border border-[var(--color-warning)]/20 bg-[var(--color-warning-muted)]">
        <svg className="w-4 h-4 text-[var(--color-warning)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-xs text-[var(--color-warning)]">
          Las API keys dan acceso completo a tu cuenta. Nunca las compartas ni las incluyas en código
          público. Si creés que una key fue comprometida, eliminala inmediatamente.
        </p>
      </div>
    </div>
  )
}
