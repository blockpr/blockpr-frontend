'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/lib/api'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    try {
      await authApi.forgotPassword(data.email)
    } catch {
      // API always returns 200 to avoid user enumeration
    }
    setSentEmail(data.email)
    setSent(true)
  }

  if (sent) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-success-muted)] flex items-center justify-center mb-5">
            <svg className="w-6 h-6 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Revisá tu email
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Enviamos las instrucciones de recuperación a{' '}
            <span className="text-[var(--color-text-primary)] font-medium">{sentEmail}</span>
          </p>
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            ¿No llegó nada? Revisá la carpeta de spam o{' '}
            <button
              onClick={() => setSent(false)}
              className="text-[var(--color-accent)] hover:underline"
            >
              intentá de nuevo
            </button>
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

  return (
    <AuthLayout>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Volver
      </Link>

      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
        Recuperá tu acceso
      </h1>
      <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
        Ingresá el email de tu cuenta y te enviamos las instrucciones.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Email
          </label>
          <Input
            type="email"
            placeholder="empresa@ejemplo.com"
            error={!!errors.email}
            autoComplete="email"
            autoFocus
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-[var(--color-danger)]">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" fullWidth loading={isSubmitting} size="lg">
          Enviar instrucciones
        </Button>
      </form>
    </AuthLayout>
  )
}
