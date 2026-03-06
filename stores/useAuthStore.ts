'use client'

import { create } from 'zustand'
import type { Company } from '@/types'

interface AuthStore {
  company: Company | null
  setCompany: (company: Company) => void
  clear: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  company: null,
  setCompany: (company) => set({ company }),
  clear: () => set({ company: null }),
}))
