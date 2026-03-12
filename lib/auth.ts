import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:8000'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          if (res.status === 403) throw new Error('EmailNotVerified')
          return null
        }
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.company_name,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Cuando el usuario inicia sesión, guardar los tokens
      if (user) {
        token.id = user.id
        token.accessToken = (user as { accessToken?: string }).accessToken
        token.refreshToken = (user as { refreshToken?: string }).refreshToken
        return token
      }

      // Si se solicita actualizar explícitamente (trigger === 'update')
      if (trigger === 'update') {
        // Sincronizar el nombre del usuario si viene en la sesión actualizada
        if (session?.user?.name) {
          token.name = session.user.name
        }

        // Refrescar el token de acceso si hay refreshToken disponible
        if (token.refreshToken) {
          try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: token.refreshToken }),
            })

            if (res.ok) {
              const data = await res.json()
              token.accessToken = data.access_token
              token.refreshToken = data.refresh_token
            } else {
              // Si el refresh falla, limpiar los tokens para forzar re-login
              token.accessToken = undefined
              token.refreshToken = undefined
            }
          } catch (error) {
            // Si hay un error, limpiar los tokens
            token.accessToken = undefined
            token.refreshToken = undefined
          }
        }

        return token
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.accessToken = token.accessToken as string | undefined
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
