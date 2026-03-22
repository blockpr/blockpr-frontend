import type { Metadata } from 'next'
import { Inter, Geist_Mono, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { SessionProvider } from '@/components/providers/SessionProvider'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal'],
})


export const metadata: Metadata = {
  title: 'unickeys — Documentos digitales con respaldo blockchain',
  description:
    'Plataforma B2B para emisión y verificación de documentos digitales con prueba criptográfica inmutable.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${geistMono.variable} ${cormorant.variable} antialiased`} suppressHydrationWarning>
        <SessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
