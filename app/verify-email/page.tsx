'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { authApi } from '@/lib/api'

type State = 'loading' | 'success' | 'error'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<State>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) {
      setErrorMsg('No se encontró el token de verificación.')
      setState('error')
      return
    }

    authApi
      .verifyEmail(token)
      .then(() => setState('success'))
      .catch((err: { message?: string }) => {
        setErrorMsg(err.message ?? 'El enlace es inválido o ya expiró.')
        setState('error')
      })
  }, [token])

  if (state === 'loading') {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-card)] flex items-center justify-center mb-5 animate-pulse">
            <svg className="w-6 h-6 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Verificando tu email...
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Un momento, por favor.
          </p>
        </div>
      </AuthLayout>
    )
  }

  if (state === 'success') {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-success-muted)] flex items-center justify-center mb-5">
            <svg className="w-6 h-6 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            ¡Email verificado!
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Tu cuenta está activa. Ya podés iniciar sesión.
          </p>
          <Link
            href="/login"
            className="inline-block mt-8 px-6 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-danger-muted)] flex items-center justify-center mb-5">
          <svg className="w-6 h-6 text-[var(--color-danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Verificación fallida
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {errorMsg}
        </p>
        <p className="mt-3 text-xs text-[var(--color-text-muted)]">
          ¿El enlace expiró?{' '}
          <Link href="/login" className="text-[var(--color-accent)] hover:underline">
            Iniciá sesión y pedí uno nuevo
          </Link>
        </p>
        <Link
          href="/login"
          className="inline-block mt-8 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          ← Volver al inicio de sesión
        </Link>
      </div>
    </AuthLayout>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}
