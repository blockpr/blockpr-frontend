'use client'

import { useThemeStore } from '@/stores/themeStore'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()
  return (
    <div
      data-theme={theme === 'dark' ? undefined : theme}
      className="flex h-screen bg-[var(--color-base)] overflow-hidden"
    >
      {children}
    </div>
  )
}
