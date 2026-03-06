import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </DashboardShell>
  )
}
