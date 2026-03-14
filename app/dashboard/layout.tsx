'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Verificar sesión al montar
  useEffect(() => {
    async function checkSession() {
      try {
        await authApi.me()
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
        router.replace('/login')
      }
    }
    checkSession()
  }, [router])

  // Mostrar loading mientras se verifica la sesión
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[var(--color-base)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    )
  }

  // No mostrar nada si no está autenticado (está redirigiendo)
  if (!isAuthenticated) {
    return null
  }

  return (
    <DashboardShell>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </DashboardShell>
  )
}
