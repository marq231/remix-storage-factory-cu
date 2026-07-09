import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const lang = request.cookies.get('lang')?.value || 'en'
  
  // Store language in response headers for components to access
  const response = NextResponse.next()
  response.headers.set('x-language', lang)
  
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}
