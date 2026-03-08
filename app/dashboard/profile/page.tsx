'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { MOCK_COMPANY } from '@/lib/mocks/emissions'

const schema = z.object({
  companyName: z.string().min(2, 'Requerido'),
  cuit: z.string().regex(/^\d{2}-\d{8}-\d{1}$/, 'Formato: XX-XXXXXXXX-X'),
  address: z.string().min(5, 'Requerido'),
  contactName: z.string().min(2, 'Requerido'),
  email: z.string().email('Email inválido'),
})

type FormData = z.infer<typeof schema>

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-sm font-medium text-[var(--color-text-primary)]">{title}</h2>
        {description && (
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{description}</p>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs text-[var(--color-danger)]">{message}</p>
}

export default function ProfilePage() {
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: MOCK_COMPANY.name,
      cuit: MOCK_COMPANY.cuit,
      address: MOCK_COMPANY.address,
      contactName: MOCK_COMPANY.contactName,
      email: MOCK_COMPANY.email,
    },
  })

  async function onSubmit(data: FormData) {
    // TODO: llamar a la API cuando el backend esté listo
    await new Promise((r) => setTimeout(r, 600))
    console.log('Guardado:', data)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-8 space-y-6 max-w-2xl bg-[var(--color-base)] min-h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Plan actual */}
        <SectionCard title="Plan actual">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)] capitalize">
                {MOCK_COMPANY.tier}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Hasta 2.000 certificados por mes
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]/20">
              Activo
            </span>
          </div>
        </SectionCard>

        {/* Datos de la empresa */}
        <SectionCard
          title="Datos de la empresa"
          description="Información institucional de tu organización"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                  Nombre de empresa
                </label>
                <Input error={!!errors.companyName} {...register('companyName')} />
                <FieldError message={errors.companyName?.message} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                  CUIT
                </label>
                <Input error={!!errors.cuit} {...register('cuit')} />
                <FieldError message={errors.cuit?.message} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                  Contacto
                </label>
                <Input error={!!errors.contactName} {...register('contactName')} />
                <FieldError message={errors.contactName?.message} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                  Dirección
                </label>
                <Input error={!!errors.address} {...register('address')} />
                <FieldError message={errors.address?.message} />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Datos de acceso */}
        <SectionCard
          title="Datos de acceso"
          description="Email asociado a la cuenta"
        >
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Email
            </label>
            <Input type="email" error={!!errors.email} {...register('email')} />
            <FieldError message={errors.email?.message} />
          </div>
        </SectionCard>

        {/* Acciones */}
        <div className="flex items-center gap-3 justify-end">
          {saved && (
            <p className="text-sm text-[var(--color-success)]">
              ✓ Cambios guardados
            </p>
          )}
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!isDirty}
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
