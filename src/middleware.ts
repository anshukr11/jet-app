import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || ''
  if (!userAgent.includes('Chrome')) {
    return NextResponse.redirect('/error')
  }
}
