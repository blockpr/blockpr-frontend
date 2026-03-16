# Spec: Página pública de verificación `/verify/[id]`

**Fecha:** 2026-03-16
**Estado:** Aprobado por usuario

---

## Objetivo

Página pública que permite a cualquier persona verificar la autenticidad de un documento registrado en blockchain, sin necesidad de cuenta ni API key. Se accede por URL directa o QR incluido en el documento.

---

## Ruta y arquitectura

- **Ruta:** `app/(public)/verify/[id]/page.tsx`
- **Tipo:** Pure Server Component — sin `'use client'`, sin JS en cliente, sin TanStack Query, sin Zustand
- **Datos:** `lib/mocks/emissions.ts` (backend no construido aún)
- **`params`:** En Next.js 15+ los params son `Promise<{ id: string }>` y deben awaitearse: `const { id } = await params`

---

## Estados

| Estado | Condición | Muestra grilla |
|--------|-----------|----------------|
| `verified` | Emisión existe y hash confirmado en blockchain | Sí |
| `pending` | Emisión existe pero aún no confirmada on-chain | Sí |
| `not_found` | No existe emisión con ese ID (`getMockEmission` retorna `null`) | No |
| `failed` | `emission.status === 'failed'` | No |

---

## Layout

### Navbar
Componente `VerifyNavbar` mínimo: solo logo unickeys, sin links de navegación. Distinto al `LandingNavbar`.

### Banner de estado (ancho completo)

- **verified** — fondo `#071a0a`, borde `#1a4a1e`, ícono ✓ verde `#3dd65c`
- **pending** — fondo `#160d04`, borde `#4a2a0a`, ícono = 3 puntos naranjas `#e8832a` animados con CSS puro (`@keyframes` en un `<style>` tag del Server Component, sin `'use client'`)
- **not_found** — fondo `#111`, borde `#222`, ícono `?` gris, sin grilla
- **failed** — fondo `#1a0707`, borde `#4a1a1a`, ícono ✗ rojo `#d63d3d`, sin grilla

> **Decisión de animación:** los 3 puntos del estado `pending` se implementan con CSS `@keyframes` inline (Server Component válido). No se requiere `'use client'`.

### Grilla de datos (solo en `verified` y `pending`)

Grilla 2 columnas:

| Celda | Campo fuente | Notas |
|-------|-------------|-------|
| Empresa emisora (ancho completo) | `emission.company` (string) | Avatar con iniciales del nombre; sin CUIT (campo no disponible en `Emission`) |
| Documento | `emission.documentName ?? emission.id` | Fallback al ID si no hay nombre |
| Fecha de registro | `emission.date` | Formatear como "15 Mar 2026 · 14:32 UTC" |
| Confirmado on-chain | `emission.blockchainConfirmedAt` | Solo en `verified`; omitir si ausente |
| Hash SHA-256 (ancho completo) | `emission.hash` | Monospace, `word-break: break-all` |
| TX Blockchain (ancho completo) | `emission.txHash` | Link a Solana Explorer en `verified`; "En proceso" en `pending` |

> **`company`:** `Emission.company` es `string` (solo nombre). No hay CUIT disponible. El avatar muestra las iniciales del nombre.

### Footer
*"Este registro es inmutable. Fue sellado criptográficamente en Solana y no puede ser alterado."*

### Metadata
```ts
title: `Verificación ${id} — unickeys`  // "unickeys", no "BlockPR"
```

---

## Componentes nuevos

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `VerifyNavbar` | `components/layout/VerifyNavbar.tsx` | Navbar mínimo solo con logo |
| `VerifyBanner` | `components/verify/VerifyBanner.tsx` | Banner de estado con colores semánticos y CSS animation |
| `VerifyDataGrid` | `components/verify/VerifyDataGrid.tsx` | Grilla 2×2 de datos del documento |
| `CompanyAvatar` | `components/verify/CompanyAvatar.tsx` | Avatar cuadrado con iniciales de empresa |

### Componentes existentes reutilizados
- `components/shared/HashDisplay.tsx`
- `components/shared/BlockchainTxLink.tsx`

---

## Data flow

```
const { id } = await params
  → getMockEmission(id)         ← nueva función helper en lib/mocks/emissions.ts
  → null                        → estado not_found
  → emission.status === 'verified'  → VerifyBanner(verified) + VerifyDataGrid
  → emission.status === 'pending'   → VerifyBanner(pending)  + VerifyDataGrid
  → emission.status === 'failed'    → VerifyBanner(failed)   (sin grilla)
```

---

## Archivos a crear/modificar

| Archivo | Acción | Detalle |
|---------|--------|---------|
| `lib/mocks/emissions.ts` | Modificar | Agregar `getMockEmission(id: string): Emission \| null` |
| `app/(public)/verify/[id]/page.tsx` | Reescribir | Await params, usar getMockEmission, renderizar estado |
| `components/layout/VerifyNavbar.tsx` | Crear | Solo logo |
| `components/verify/VerifyBanner.tsx` | Crear | 4 estados con CSS animation inline |
| `components/verify/VerifyDataGrid.tsx` | Crear | Grilla de datos |
| `components/verify/CompanyAvatar.tsx` | Crear | Avatar con iniciales |

---

## Restricciones

- Sin `'use client'` en ningún componente de esta página
- Sin API keys expuestas en cliente
- TX Hash linkea a `https://explorer.solana.com/tx/{txHash}`
- Los 3 puntos de `pending` usan CSS puro, no React state
