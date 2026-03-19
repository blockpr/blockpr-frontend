export type EmissionStatus = 'verified' | 'pending' | 'failed'

export interface Emission {
  id: string
  date: string
  hash: string
  status: EmissionStatus
  documentName?: string
  documentType?: string
  txHash?: string
  verifyUrl: string
  blockchainNetwork?: string
  blockchainName?: string
  blockchainConfirmedAt?: string
  company?: string
  merkleProof?: string[]
  blockNumber?: number
}

export interface Company {
  id: string
  name: string
  cuit: string
  address: string
  contactName: string
  email: string
  tier: 'starter' | 'business' | 'enterprise'
  createdAt: string
}

export interface ApiKey {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsed?: string
  // secret solo se devuelve en el momento de creación
  secret?: string
}

export interface VerificationResult {
  valid: boolean
  emission?: Emission
  error?: string
  checkedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface UserSession {
  id: string
  user_id?: string | null
  device_name?: string
  device_specs?: string
  is_opened?: boolean
  created_at: string
  updated_at: string
}