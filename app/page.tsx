'use client'

import { useState } from 'react'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LandingHero } from '@/components/layout/LandingHero'
import { PageLoader } from '@/components/layout/PageLoader'

export default function HomePage() {
  const [loaded, setLoaded] = useState(false)

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      {!loaded && <PageLoader onDone={() => setLoaded(true)} />}
      <LandingNavbar />
      <LandingHero />
    </main>
  )
}
