import { redirect } from 'next/navigation'
import { serverFetch } from '@/lib/server-api'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import type { MeResponse } from '@/lib/api'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    await serverFetch<MeResponse>('/auth/me')
  } catch {
    redirect('/login')
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
