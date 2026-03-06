// Server Component puro — sin 'use client', sin JS cliente
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Verificación ${params.id} — BlockPR`,
  }
}

export default async function VerifyPage({ params }: Props) {
  // TODO: fetch real al backend cuando esté disponible
  // const data = await fetch(`${process.env.API_URL}/verify/${params.id}`, { cache: 'no-store' })

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-base)] px-4">
      <div className="w-full max-w-lg">
        <p className="text-center text-[var(--color-text-secondary)] font-mono text-sm">
          {params.id}
        </p>
        <h1 className="mt-2 text-center text-2xl font-semibold text-[var(--color-text-primary)]">
          Verificación de certificado
        </h1>
      </div>
    </div>
  )
}
