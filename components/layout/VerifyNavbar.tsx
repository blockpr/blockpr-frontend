export function VerifyNavbar() {
  return (
    <nav
      style={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <a
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 15,
          fontWeight: 600,
          color: '#fff',
          textDecoration: 'none',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 200 200" fill="none">
          <path d="M100 100V42" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 100L148 128" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 100L52 128" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M100 114C107.732 114 114 107.732 114 100C114 92.268 107.732 86 100 86C92.268 86 86 92.268 86 100C86 107.732 92.268 114 100 114Z"
            fill="white"
            stroke="white"
            strokeWidth="4.5"
          />
          <path
            d="M100 50C104.418 50 108 46.4183 108 42C108 37.5817 104.418 34 100 34C95.5817 34 92 37.5817 92 42C92 46.4183 95.5817 50 100 50Z"
            fill="white"
            stroke="white"
            strokeWidth="4.5"
          />
          <path
            d="M148 136C152.418 136 156 132.418 156 128C156 123.582 152.418 120 148 120C143.582 120 140 123.582 140 128C140 132.418 143.582 136 148 136Z"
            fill="white"
            stroke="white"
            strokeWidth="4.5"
          />
          <path
            d="M52 136C56.4183 136 60 132.418 60 128C60 123.582 56.4183 120 52 120C47.5817 120 44 123.582 44 128C44 132.418 47.5817 136 52 136Z"
            fill="white"
            stroke="white"
            strokeWidth="4.5"
          />
        </svg>
        unickeys
      </a>
    </nav>
  )
}
