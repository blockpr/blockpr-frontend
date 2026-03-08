'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Input, PasswordInput } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/lib/api'

const schema = z
  .object({
    companyName: z.string().min(2, 'Nombre de empresa requerido'),
    cuit: z
      .string()
      .regex(/^\d{2}-\d{8}-\d{1}$/, 'Formato: XX-XXXXXXXX-X'),
    address: z.string().min(5, 'Dirección requerida'),
    contactName: z.string().min(2, 'Nombre de contacto requerido'),
    email: z.string().email('Email inválido'),
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

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-[var(--color-border)]" />
      <span className="text-xs text-[var(--color-text-muted)]">o</span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  )
}

function GoogleButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-transparent text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-card)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      {loading ? 'Redirigiendo...' : 'Continuar con Google'}
    </button>
  )
}

// Formatea el CUIT mientras el usuario escribe: XX-XXXXXXXX-X
function formatCuit(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`
}

export default function SignupPage() {
  const [googleLoading, setGoogleLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [registered, setRegistered] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setServerError(null)
    try {
      await authApi.register({
        email: data.email,
        password: data.password,
        company_name: data.companyName,
        tax_id: data.cuit,
        contact_name: data.contactName,
        address: data.address,
      })
      setRegisteredEmail(data.email)
      setRegistered(true)
    } catch (err: unknown) {
      const apiErr = err as { status?: number }
      if (apiErr.status === 409) {
        setServerError('Ya existe una cuenta con ese email.')
      } else {
        setServerError('Ocurrió un error al crear la cuenta. Intentá de nuevo.')
      }
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  if (registered) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-success-muted)] flex items-center justify-center mb-5">
            <svg className="w-6 h-6 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            ¡Cuenta creada!
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Enviamos un email de verificación a{' '}
            <span className="text-[var(--color-text-primary)] font-medium">{registeredEmail}</span>
          </p>
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            Hacé click en el enlace del email para activar tu cuenta y poder iniciar sesión.
          </p>
          <Link
            href="/login"
            className="inline-block mt-8 text-sm text-[var(--color-accent)] hover:underline font-medium"
          >
            Ir al inicio de sesión →
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Registrá tu empresa</h1>
      <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
        Empezá a emitir certificados con respaldo blockchain
      </p>

      <div className="mt-8 space-y-4">
        <GoogleButton onClick={handleGoogle} loading={googleLoading} />

        <Divider />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {serverError && (
            <div className="px-3.5 py-3 rounded-lg bg-[var(--color-danger-muted)] border border-[var(--color-danger)]/20">
              <p className="text-sm text-[var(--color-danger)]">{serverError}</p>
            </div>
          )}

          {/* Datos de la empresa */}
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider pt-1">
            Datos de la empresa
          </p>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Nombre de empresa
            </label>
            <Input
              placeholder="AutoCheck SA"
              error={!!errors.companyName}
              autoComplete="organization"
              {...register('companyName')}
            />
            <FieldError message={errors.companyName?.message} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                CUIT
              </label>
              <Input
                placeholder="30-71234567-8"
                error={!!errors.cuit}
                {...register('cuit', {
                  onChange: (e) => {
                    e.target.value = formatCuit(e.target.value)
                    setValue('cuit', e.target.value)
                  },
                })}
              />
              <FieldError message={errors.cuit?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                Contacto
              </label>
              <Input
                placeholder="Juan Pérez"
                error={!!errors.contactName}
                autoComplete="name"
                {...register('contactName')}
              />
              <FieldError message={errors.contactName?.message} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Dirección
            </label>
            <Input
              placeholder="Av. Corrientes 1234, CABA"
              error={!!errors.address}
              autoComplete="street-address"
              {...register('address')}
            />
            <FieldError message={errors.address?.message} />
          </div>

          {/* Datos de acceso */}
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider pt-2">
            Datos de acceso
          </p>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Email
            </label>
            <Input
              type="email"
              placeholder="juan@autocheck.com.ar"
              error={!!errors.email}
              autoComplete="email"
              {...register('email')}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                Contraseña
              </label>
              <PasswordInput
                placeholder="••••••••"
                error={!!errors.password}
                autoComplete="new-password"
                {...register('password')}
              />
              <FieldError message={errors.password?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                Confirmar
              </label>
              <PasswordInput
                placeholder="••••••••"
                error={!!errors.confirmPassword}
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              <FieldError message={errors.confirmPassword?.message} />
            </div>
          </div>

          <Button type="submit" fullWidth loading={isSubmitting} size="lg" className="mt-2">
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-[var(--color-accent)] hover:underline font-medium">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
