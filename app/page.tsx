'use client'

import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingHero } from '@/components/layout/LandingHero'
import { LandingProblem } from '@/components/layout/LandingProblem'
import { LandingSolution } from '@/components/layout/LandingSolution'
import { LandingStats } from '@/components/layout/LandingStats'
import { LandingProcess } from '@/components/layout/LandingProcess'
import { LandingTrust } from '@/components/layout/LandingTrust'
import { LandingCTA } from '@/components/layout/LandingCTA'
import { LandingFooter } from '@/components/layout/LandingFooter'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black" style={{ overflowX: 'clip' }}>
      {/* Grid de fondo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <LandingNavbar />
      <LandingHero />
      <LandingProblem />
      <LandingSolution />
      <LandingStats />
      <LandingProcess />
      <LandingTrust />
      <LandingCTA />
      <LandingFooter />
    </main>
  )
}
