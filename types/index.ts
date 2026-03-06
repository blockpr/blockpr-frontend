export type EmissionStatus = 'verified' | 'pending' | 'failed'

export interface Emission {
  id: string
  date: string
  hash: string
  status: EmissionStatus
  txHash?: string
  verifyUrl: string
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
