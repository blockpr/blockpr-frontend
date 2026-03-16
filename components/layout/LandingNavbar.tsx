import Link from 'next/link'

export function LandingNavbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center px-8 bg-black border-b border-white/10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0">
        <svg className="w-9 h-9 text-white shrink-0" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 100V42" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M100 100L148 128" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M100 100L52 128" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M100 114C107.732 114 114 107.732 114 100C114 92.268 107.732 86 100 86C92.268 86 86 92.268 86 100C86 107.732 92.268 114 100 114Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
          <path d="M100 50C104.418 50 108 46.4183 108 42C108 37.5817 104.418 34 100 34C95.5817 34 92 37.5817 92 42C92 46.4183 95.5817 50 100 50Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
          <path d="M148 136C152.418 136 156 132.418 156 128C156 123.582 152.418 120 148 120C143.582 120 140 123.582 140 128C140 132.418 143.582 136 148 136Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
          <path d="M52 136C56.4183 136 60 132.418 60 128C60 123.582 56.4183 120 52 120C47.5817 120 44 123.582 44 128C44 132.418 47.5817 136 52 136Z" fill="currentColor" stroke="currentColor" strokeWidth="4.5"/>
          <path d="M100 104C102.209 104 104 102.209 104 100C104 97.7909 102.209 96 100 96C97.7909 96 96 97.7909 96 100C96 102.209 97.7909 104 100 104Z" fill="currentColor"/>
        </svg>
        <span className="text-base font-semibold text-white">unickeys</span>
      </Link>

      {/* Acciones */}
      <div className="ml-auto flex items-center gap-2.5">
        <Link
          href="/signup"
          className="px-3.5 py-1.5 rounded-[6px] text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          Empezar ahora
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
        <Link
          href="/login"
          className="px-3.5 py-1.5 rounded-[6px] text-xs text-white border border-white/20 hover:border-white/50 hover:bg-white/5 transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    </header>
  )
}
