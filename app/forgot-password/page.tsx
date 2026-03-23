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

const ACCENT = '#4db888'

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

  /* ── Estado: email enviado ── */
  if (sent) {
    return (
      <AuthLayout formBrand="center">
        <div style={{ textAlign: 'center' }}>

          {/* Ícono check */}
          <div style={{
            width: 48, height: 48,
            borderRadius: '50%',
            border: `1px solid rgba(77,184,136,0.35)`,
            background: 'rgba(77,184,136,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10l4.5 4.5L16 6" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Título */}
          <h1 style={{
            fontWeight: 200,
            fontSize: 'clamp(24px, 3vw, 32px)',
            letterSpacing: '-0.03em',
            color: '#fff',
            margin: '0 0 12px',
            lineHeight: 1.1,
          }}>
            Revisá tu email.
          </h1>

          {/* Email en mono */}
          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.4)',
            margin: '0 0 6px',
            fontWeight: 300,
          }}>
            Enviamos las instrucciones a
          </p>
          <p style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 13,
            color: ACCENT,
            letterSpacing: '0.02em',
            margin: '0 0 28px',
          }}>
            {sentEmail}
          </p>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 24 }} />

          {/* Spam note */}
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: '0 0 24px', lineHeight: 1.6 }}>
            ¿No llegó nada? Revisá la carpeta de spam o{' '}
            <button
              onClick={() => setSent(false)}
              style={{
                background: 'none', border: 'none', padding: 0,
                color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                fontSize: 12, textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              intentá de nuevo
            </button>
          </p>

          {/* Volver */}
          <Link href="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12,
            color: 'rgba(255,255,255,0.3)',
            textDecoration: 'none',
            letterSpacing: '0.01em',
            transition: 'color 0.2s ease',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 6H2M4.5 3L2 6l2.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver al inicio de sesión
          </Link>

        </div>
      </AuthLayout>
    )
  }

  /* ── Estado: formulario ── */
  return (
    <AuthLayout formBrand="center">

      {/* Volver */}
      <Link href="/login" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
        textDecoration: 'none',
        letterSpacing: '0.01em',
        marginBottom: 36,
        transition: 'color 0.2s ease',
      }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M8 6H2M4.5 3L2 6l2.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver
      </Link>

      {/* Título */}
      <h1 style={{
        fontWeight: 200,
        fontSize: 'clamp(26px, 3.5vw, 38px)',
        letterSpacing: '-0.035em',
        color: '#fff',
        margin: '0 0 10px',
        lineHeight: 1.05,
      }}>
        Recuperá tu acceso.
      </h1>

      <p style={{
        fontSize: 13,
        color: 'rgba(255,255,255,0.32)',
        margin: '0 0 32px',
        lineHeight: 1.65,
        fontWeight: 300,
      }}>
        Ingresá el email de tu cuenta y te enviamos las instrucciones.
      </p>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 28 }} />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: 12,
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 8,
            letterSpacing: '0.01em',
          }}>
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
            <p style={{ marginTop: 6, fontSize: 11, color: 'var(--color-danger)' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          loading={isSubmitting}
          size="lg"
          className="!bg-white !text-black hover:!bg-white/90"
        >
          Enviar instrucciones
        </Button>
      </form>

    </AuthLayout>
  )
}
