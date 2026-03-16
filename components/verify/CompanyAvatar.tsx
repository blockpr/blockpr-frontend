interface CompanyAvatarProps {
  name: string
}

export function CompanyAvatar({ name }: CompanyAvatarProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        background: '#1a1a2e',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.6)',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}
