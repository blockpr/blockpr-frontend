'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { PasswordInput } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/lib/api'

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Al menos una mayúscula')
      .regex(/[0-9]/, 'Al menos un número'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs text-[var(--color-danger)]">{message}</p>
}

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    if (!token) {
      setServerError('Token inválido. Solicitá un nuevo enlace de recuperación.')
      return
    }
    setServerError(null)
    try {
      await authApi.changePassword(token, data.password)
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      setServerError(apiErr.message ?? 'El enlace es inválido o ya expiró.')
    }
  }

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Enlace inválido
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Este enlace de recuperación no es válido.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block mt-8 text-sm text-[var(--color-accent)] hover:underline"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </AuthLayout>
    )
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-success-muted)] flex items-center justify-center mb-5">
            <svg className="w-6 h-6 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Contraseña actualizada
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Tu contraseña fue cambiada exitosamente. Redirigiendo al inicio de sesión...
          </p>
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
        Nueva contraseña
      </h1>
      <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
        Ingresá tu nueva contraseña para restablecer el acceso.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && (
          <div className="px-3.5 py-3 rounded-lg bg-[var(--color-danger-muted)] border border-[var(--color-danger)]/20">
            <p className="text-sm text-[var(--color-danger)]">{serverError}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Nueva contraseña
          </label>
          <PasswordInput
            placeholder="••••••••"
            error={!!errors.password}
            autoComplete="new-password"
            autoFocus
            {...register('password')}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
            Confirmá la contraseña
          </label>
          <PasswordInput
            placeholder="••••••••"
            error={!!errors.confirmPassword}
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <Button type="submit" fullWidth loading={isSubmitting} size="lg">
          Guardar nueva contraseña
        </Button>
      </form>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}
