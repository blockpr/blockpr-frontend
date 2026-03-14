'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { apiKeysApi, type ApiKeyResponse } from '@/lib/api'
import { useThemeStore } from '@/stores/themeStore'
import type { ApiKey } from '@/types'

function Modal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useThemeStore()
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return createPortal(
    <div
      data-theme={theme === 'dark' ? undefined : theme}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
      style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
    >
      {children}
    </div>,
    document.body,
  )
}

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

function NewKeyModal({ secret, onClose }: { secret: string; onClose: () => void }) {
  return (
    <Modal>
      <div className="w-full max-w-md border border-[var(--color-border)] bg-[var(--color-card)] p-6 rounded-[6px]">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 bg-[var(--color-success-muted)] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">API Key generada</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Copiala ahora. No vas a poder verla de nuevo.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-[var(--color-surface)] border border-[var(--color-border)] mb-5 rounded-[6px]">
          <code className="flex-1 text-xs font-mono text-[var(--color-text-primary)] break-all">{secret}</code>
          <CopyButton text={secret} />
        </div>
        <Button onClick={onClose} fullWidth variant="secondary">Entendido, ya la copié</Button>
      </div>
    </Modal>
  )
}

function DeleteKeyModal({
  keyName,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  keyName: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}) {
  return (
    <Modal>
      <div className="w-full max-w-md border border-[var(--color-border)] bg-[var(--color-card)] p-6 rounded-[6px]">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 bg-[var(--color-danger-muted)] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[var(--color-danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Eliminar API Key</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <div className="mb-5">
          <p className="text-sm text-[var(--color-text-secondary)]">
            ¿Estás seguro de que querés eliminar la API key{' '}
            <span className="font-medium text-[var(--color-text-primary)]">"{keyName}"</span>?
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            Una vez eliminada, no podrás usar esta key para autenticarte.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onCancel} variant="secondary" disabled={isDeleting} className="flex-1 rounded-[6px]">
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-[6px] bg-[var(--color-danger)] hover:opacity-90 text-white"
          >
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function mapApiKeyResponse(response: ApiKeyResponse): ApiKey {
  const prefix = `bpk_...${response.id.slice(-8)}`
  return {
    id: response.id,
    name: response.name || 'Sin nombre',
    prefix,
    createdAt: response.created_at,
    lastUsed: response.last_used_at || undefined,
  }
}

interface ApiKeysClientProps {
  initialKeys: ApiKey[]
}

export default function ApiKeysClient({ initialKeys }: ApiKeysClientProps) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys)
  const [error, setError] = useState<string | null>(null)
  const [newSecret, setNewSecret] = useState<string | null>(null)
  const [creatingName, setCreatingName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingKeyName, setDeletingKeyName] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleCreate() {
    const trimmedName = creatingName.trim()
    if (!trimmedName) return

    try {
      setCreating(true)
      setError(null)
      const response = await apiKeysApi.create(trimmedName)
      setNewSecret(response.api_key)
      const updatedResponse = await apiKeysApi.list()
      setKeys(updatedResponse.map(mapApiKeyResponse))
      setCreatingName('')
      setShowCreateForm(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear la API key'
      setError(message)
    } finally {
      setCreating(false)
    }
  }

  function handleDeleteClick(id: string, name: string) {
    setDeletingId(id)
    setDeletingKeyName(name)
  }

  function handleDeleteCancel() {
    setDeletingId(null)
    setDeletingKeyName(null)
  }

  async function handleDeleteConfirm() {
    if (!deletingId) return

    try {
      setDeleting(deletingId)
      setError(null)
      await apiKeysApi.delete(deletingId)
      const updatedResponse = await apiKeysApi.list()
      setKeys(updatedResponse.map(mapApiKeyResponse))
      setDeletingId(null)
      setDeletingKeyName(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar la API key'
      setError(message)
      setDeletingId(null)
      setDeletingKeyName(null)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-8 space-y-6 bg-[var(--color-base)] min-h-full">
      {newSecret && (
        <NewKeyModal secret={newSecret} onClose={() => setNewSecret(null)} />
      )}

      {deletingId && deletingKeyName && (
        <DeleteKeyModal
          keyName={deletingKeyName}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={deleting === deletingId}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">API Keys</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Gestioná las claves de API para integrar BlockPR con tus sistemas
          </p>
        </div>
        {!showCreateForm && (
          <Button
            onClick={() => setShowCreateForm(true)}
            size="sm"
            className="rounded-[6px] bg-white !text-black hover:bg-gray-100 shrink-0"
          >
            + Nueva key
          </Button>
        )}
      </div>

      {error && (
        <div className="border border-[var(--color-danger-border)] bg-[var(--color-danger-surface)] text-[var(--color-danger)] px-4 py-3 rounded-[6px] text-sm">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="border border-[var(--color-border)] bg-[var(--color-card)] p-5 rounded-[6px] max-w-2xl">
          <p className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Nueva API Key</p>
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              placeholder="Nombre (ej: Producción, Testing)"
              value={creatingName}
              onChange={(e) => setCreatingName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="flex-1 px-3.5 py-2 rounded-[6px] text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            <Button
              onClick={handleCreate}
              disabled={!creatingName.trim() || creating}
              className="rounded-[6px] bg-white !text-black hover:bg-gray-100"
            >
              {creating ? 'Generando...' : 'Generar'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => { setShowCreateForm(false); setCreatingName('') }}
              className="rounded-[6px]"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden rounded-[6px] w-full">
        {keys.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">No hay API keys creadas</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Creá una para integrar BlockPR con tus sistemas
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {['Nombre', 'Prefijo', 'Creada', 'Último uso', ''].map((col) => (
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
                {keys.map((key) => (
                  <tr key={key.id} className="hover:bg-[var(--color-card-hover)] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">{key.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-2 py-1 rounded-[4px]">
                        {key.prefix}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[var(--color-text-secondary)]">{formatDate(key.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {key.lastUsed ? formatDate(key.lastUsed) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteClick(key.id, key.name)}
                        disabled={deleting === key.id}
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        className="rounded-[6px] overflow-hidden border"
        style={{ borderColor: 'var(--color-warning-border)', background: 'var(--color-warning-surface)' }}
      >
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 border-b"
          style={{ background: 'var(--color-warning-header-bg)', borderColor: 'var(--color-warning-header-border)' }}
        >
          <svg className="w-3.5 h-3.5 shrink-0 text-[var(--color-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className="text-xs font-semibold tracking-wide uppercase text-[var(--color-warning)]">
            Seguridad
          </span>
        </div>
        <ul className="px-4 py-3 space-y-1.5">
          {[
            'Las API keys dan acceso completo a tu cuenta. Tratálas como contraseñas.',
            'Nunca las incluyas en código público ni las compartas por canales inseguros.',
            'Si sospechás que una key fue comprometida, eliminala de inmediato.',
          ].map((tip) => (
            <li
              key={tip}
              className="flex items-start gap-2 text-xs"
              style={{ color: 'var(--color-warning-text-dim)' }}
            >
              <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--color-warning-text-dim)' }} />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
