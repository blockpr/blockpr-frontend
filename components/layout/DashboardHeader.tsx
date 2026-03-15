'use client'

import { usePathname } from 'next/navigation'
import { useThemeStore } from '@/stores/themeStore'
import { HeaderMenu } from './HeaderMenu'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/emissions': 'Emisiones',
  '/dashboard/api-keys': 'API Keys',
  '/dashboard/profile': 'Perfil',
}

function getTitle(pathname: string): string {
  if (titles[pathname]) return titles[pathname]
  if (pathname.startsWith('/dashboard/emissions/')) return 'Detalle de emisión'
  return 'Dashboard'
}

export function DashboardHeader() {
  const pathname = usePathname()
  const { theme } = useThemeStore()
  const isLight = theme === 'light'
  const color = isLight ? '#1a1a22' : '#ffffff'

  return (
    <header className="shrink-0">
      <div className="h-16 flex items-center justify-center px-8 bg-[var(--color-surface)] relative">
        <h1 className="text-base font-normal" style={{ color }}>
          {getTitle(pathname)}
        </h1>
        <div className="absolute right-8">
          <HeaderMenu />
        </div>
      </div>
      <div className="border-b border-[var(--color-border)]" />
    </header>
  )
}
