import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  // Autenticación desactivada temporalmente para desarrollo
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
