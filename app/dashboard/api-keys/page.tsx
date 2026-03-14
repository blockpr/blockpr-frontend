import { serverFetch } from '@/lib/server-api'
import type { ApiKeyResponse } from '@/lib/api'
import type { ApiKey } from '@/types'
import ApiKeysClient from './ApiKeysClient'

function mapApiKeyResponse(response: ApiKeyResponse): ApiKey {
  return {
    id: response.id,
    name: response.name || 'Sin nombre',
    prefix: `bpk_...${response.id.slice(-8)}`,
    createdAt: response.created_at,
    lastUsed: response.last_used_at || undefined,
  }
}

export default async function ApiKeysPage() {
  let initialKeys: ApiKey[] = []

  try {
    const response = await serverFetch<ApiKeyResponse[]>('/auth/api-keys')
    initialKeys = response.map(mapApiKeyResponse)
  } catch {
    // Si falla, renderizamos con lista vacía; el client puede reintentar
  }

  return <ApiKeysClient initialKeys={initialKeys} />
}
