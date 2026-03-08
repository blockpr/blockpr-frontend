'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'

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

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return '¡Buenos días!'
  if (hour < 19) return '¡Buenas tardes!'
  return '¡Buenas noches!'
}

const DELAY_MS = 3.5 * 60 * 1000

export function DashboardHeader() {
  const pathname = usePathname()
  const { theme } = useThemeStore()
  const [showGreeting, setShowGreeting] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        setShowGreeting(true)
        setVisible(true)
      }, 300)
    }, DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  const text = showGreeting ? getGreeting() : getTitle(pathname)
  const color = theme === 'light' ? '#1a1a22' : '#ffffff'

  return (
    <header className="shrink-0">
      <div className="h-16 flex items-center px-8 bg-[var(--color-surface)]">
        <h1
          className="text-base font-semibold transition-opacity duration-300"
          style={{ color, opacity: visible ? 1 : 0 }}
        >
          {text}
        </h1>
      </div>
      <div className="border-b border-[var(--color-border)]" />
    </header>
  )
}
