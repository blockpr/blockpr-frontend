import type { Emission, Company, ApiKey } from '@/types'

export const MOCK_COMPANY: Company = {
  id: 'comp_001',
  name: 'AutoCheck SA',
  cuit: '30-71234567-8',
  address: 'Av. Corrientes 1234, CABA',
  contactName: 'Juan Pérez',
  email: 'juan@autocheck.com.ar',
  tier: 'business',
  createdAt: '2025-01-15T10:00:00Z',
}

export const MOCK_EMISSIONS: Emission[] = [
  {
    id: 'emis_001',
    date: '2025-03-01T10:23:00Z',
    hash: 'a3f2c8d1e4b7f9c0d2e5a8b1c4d7e0f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5c8d1',
    status: 'verified',
    txHash: '5KJuW3xR9mPqL8nYvB2cD4eF6gH1iJ7kM3nO5pQ9rS2tU4vW6xY8zA1bC3dE5fG7',
    verifyUrl: 'http://localhost:3000/verify/emis_001',
    company: 'AutoCheck SA',
    merkleProof: ['b2c3d4...', 'e5f6a7...'],
    blockNumber: 287423891,
  },
  {
    id: 'emis_002',
    date: '2025-03-01T11:05:00Z',
    hash: 'b4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    status: 'pending',
    verifyUrl: 'http://localhost:3000/verify/emis_002',
    company: 'AutoCheck SA',
  },
  {
    id: 'emis_003',
    date: '2025-03-01T09:45:00Z',
    hash: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    status: 'failed',
    verifyUrl: 'http://localhost:3000/verify/emis_003',
    company: 'AutoCheck SA',
  },
  {
    id: 'emis_004',
    date: '2025-02-28T16:30:00Z',
    hash: 'd6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    status: 'verified',
    txHash: '3HiTq8mNk2LpO7rS5vX1yZ9aB4cD6eF8gH0iJ2kL4mN6oP8qR0sT2uV4wX6yZ8aB0',
    verifyUrl: 'http://localhost:3000/verify/emis_004',
    company: 'AutoCheck SA',
    blockNumber: 287401234,
  },
  {
    id: 'emis_005',
    date: '2025-02-28T14:12:00Z',
    hash: 'e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    status: 'verified',
    txHash: '7MnPq2rS5tU8vW1xY4zA7bC0dE3fG6hI9jK2lM5nO8pQ1rS4tU7vW0xY3zA6bC9dE',
    verifyUrl: 'http://localhost:3000/verify/emis_005',
    company: 'AutoCheck SA',
    blockNumber: 287398765,
  },
]

export const MOCK_API_KEYS: ApiKey[] = [
  {
    id: 'key_001',
    name: 'Producción',
    prefix: 'bpr_prod_',
    createdAt: '2025-01-20T10:00:00Z',
    lastUsed: '2025-03-01T11:00:00Z',
  },
  {
    id: 'key_002',
    name: 'Testing',
    prefix: 'bpr_test_',
    createdAt: '2025-02-10T10:00:00Z',
    lastUsed: '2025-02-28T09:00:00Z',
  },
]
