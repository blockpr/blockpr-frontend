import { cn } from '@/lib/utils'

/** Marca gráfica (mismo SVG que el sidebar del dashboard). Hereda color vía `currentColor`. */
export function UnickeysLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn('shrink-0', className)}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M100 100V42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 100L148 128" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 100L52 128" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M100 114C107.732 114 114 107.732 114 100C114 92.268 107.732 86 100 86C92.268 86 86 92.268 86 100C86 107.732 92.268 114 100 114Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="4.5"
      />
      <path
        d="M100 50C104.418 50 108 46.4183 108 42C108 37.5817 104.418 34 100 34C95.5817 34 92 37.5817 92 42C92 46.4183 95.5817 50 100 50Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="4.5"
      />
      <path
        d="M148 136C152.418 136 156 132.418 156 128C156 123.582 152.418 120 148 120C143.582 120 140 123.582 140 128C140 132.418 143.582 136 148 136Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="4.5"
      />
      <path
        d="M52 136C56.4183 136 60 132.418 60 128C60 123.582 56.4183 120 52 120C47.5817 120 44 123.582 44 128C44 132.418 47.5817 136 52 136Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="4.5"
      />
      <path
        d="M100 104C102.209 104 104 102.209 104 100C104 97.7909 102.209 96 100 96C97.7909 96 96 97.7909 96 100C96 102.209 97.7909 104 100 104Z"
        fill="currentColor"
      />
    </svg>
  )
}
