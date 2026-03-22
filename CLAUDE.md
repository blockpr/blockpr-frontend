# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
```

No test runner is configured yet.

## Repo structure

Flat structure — `app/`, `components/`, `lib/`, `stores/`, `types/`, `hooks/` all at repo root.
`@/*` alias points to root (`./`). No `src/` directory.

## Next.js 16 specifics

- `proxy.ts` at root replaces the deprecated `middleware.ts`. Auth guard lives there.
- Route groups like `(public)` do NOT add a URL segment — `app/(public)/verify/[id]/page.tsx` → `/verify/[id]`.
- Auth pages are at `app/auth/login/` and `app/auth/register/` (plain segment, not a route group) to get `/auth/login` URLs.

## What this is

**Product name: unickeys**

B2B platform for issuing tamper-proof technical certificates backed by blockchain. Certificates are hashed (SHA-256), batched into a Merkle Tree, and the root is recorded on Solana (1 tx per batch). The value prop is anti-fraud and legal verifiability, not crypto.

## Target stack (not all installed yet — install before using)

- **shadcn/ui** — component primitives in `components/ui/`
- **Zustand** — global state in `stores/`
- **TanStack Query** — all data fetching in dashboard (cache, pagination, refetch)
- **React Hook Form + Zod** — all forms
- **NextAuth.js** — authentication

## Target folder structure

```
src/
  app/
    (public)/page.tsx               # Landing
    (public)/verify/[id]/page.tsx   # Public verification - Server Component ONLY
    (auth)/login/page.tsx
    (auth)/register/page.tsx
    dashboard/layout.tsx            # Sidebar layout
    dashboard/page.tsx
    dashboard/emissions/page.tsx
    dashboard/emissions/[id]/page.tsx
    dashboard/profile/page.tsx
    dashboard/api-keys/page.tsx
  components/
    ui/           # shadcn - do not edit directly
    layout/       # Sidebar, Navbar, Footer
    emissions/    # EmissionsTable, filters, detail
    verify/       # VerificationResult
    shared/       # HashDisplay, EmissionStatusBadge, BlockchainTxLink, QRVerificationCode
  lib/
    api.ts        # HTTP client
    auth.ts       # NextAuth config
    utils.ts
    mocks/        # Hardcoded mock data (backend not built yet)
  hooks/          # Custom hooks (useEmissions, useVerification, etc.)
  stores/         # Zustand stores
  types/          # Global TypeScript types
```

## Route architecture

Two distinct layout trees via Route Groups:

- `app/(public)/` — landing and `/verify/[id]`. No auth, no shared layout with dashboard.
- `app/(auth)/` — login and register.
- `app/dashboard/` — all protected routes. `middleware.ts` at repo root intercepts and redirects to `/auth/login` if no valid session.

## Critical rules

**Auth:**
- JWT in `HttpOnly` + `Secure` + `SameSite=Strict` cookies. Never `localStorage`.
- `middleware.ts` at repo root guards all `/dashboard/*` routes.

**`/verify/[id]`:**
- Must be a pure Server Component. Fetch on server. No `'use client'`. No API keys in client. Minimal/no JS.

**API Keys:**
- Displayed to the user exactly once at creation (GitHub model). Never stored or shown in plaintext afterward.

**Domain components to build:**
- `<EmissionStatusBadge status="verified" | "pending" | "failed" />`
- `<HashDisplay hash="..." truncate />`
- `<BlockchainTxLink txHash="..." network="solana" />`
- `<VerificationResult valid={bool} timestamp={...} />`
- `<QRVerificationCode url="..." />`
- `<EmissionsTable data={[...]} onRowClick={...} />`

**Backend / mocks:**
- Backend does not exist yet. Use hardcoded mock data in `src/lib/mocks/` for all data-dependent components.

**Never use:** Redux, Material UI, Chakra UI, GraphQL, Create React App.

## Landing page design system

- Accent color: `#4db888` (verde) — definido como `const ACCENT` en cada componente de `components/layout/`
- Background: `#050505` con graph-paper grid `rgba(255,255,255,0.022)` en `48px 48px`
- Tipografía editorial: `fontWeight: 200`, `letterSpacing: '-0.03em'` a `-0.05em`
- Reglas horizontales: `1px solid rgba(255,255,255,0.07)` — separador estándar entre secciones
- `DIM = 'rgba(255,255,255,0.22)'` — color de texto secundario/labels en toda la landing
- Secciones sticky usan wrapper `height: Nvh` + `position: sticky, top: 0, height: 100vh`

## Canvas / partículas

- Patrón para texto como partículas: render texto en offscreen canvas → sample píxeles → crear nodos
- `STEP` controla densidad de partículas (2 = denso, 4 = disperso)
- Usar spatial grid O(N·k) para líneas entre partículas — evita O(N²)
- Canvas scroll-triggered: usar IntersectionObserver + doble `requestAnimationFrame` para esperar dimensiones reales antes de animar
- En secciones sticky con scroll complejo, detectar scroll hacia atrás en `onScroll` (no en `onWheel`) — resetear estado cuando `p < revealOriginRef - 0.03`
- `onWheel` solo para acciones hacia adelante; `onScroll` para resets bidireccionales

## Landing components (components/layout/)

- `LandingHero.tsx` — canvas con partículas orbitando logo SVG + texto "unickeys"
- `LandingProblem.tsx` — sticky 700vh, partículas wandering → convergen al texto → cards
- `LandingSolution.tsx` — sticky 300vh, 3 columnas editoriales
- `LandingStats.tsx` — métricas con scramble counter + chart canvas interactivo
- `LandingProcess.tsx` — 3 pasos con visual mocks (SignupMock, ApiMock, CertMock)
- `LandingCTA.tsx` — headline monumental + botones
- `LandingFooter.tsx` — canvas mini-hero de partículas + columnas de links

## Gotchas React

- El tamaño del array de dependencias de `useEffect` debe ser constante — si cambia entre renders da error en hot reload (se resuelve con full refresh, el código es correcto)
- Animated underline con CSS puro en inline styles: `backgroundImage: 'linear-gradient(currentColor, currentColor)'` + `backgroundSize: '0% 1px'` + `backgroundPosition: '0 100%'`, animar con `onMouseEnter/Leave`
