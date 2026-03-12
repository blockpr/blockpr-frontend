export default function UserAvatar({ name, image }: { name?: string | null; image?: string | null }) {
    if (image) {
      return <img src={image} alt={name ?? ''} className="w-8 h-8 rounded-full object-cover shrink-0" />
    }
    const initials = name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() ?? '?'
    return (
      <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-medium shrink-0">
        {initials}
      </div>
    )
  }