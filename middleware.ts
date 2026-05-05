import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/client(.*)',
  '/tailor(.*)',
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl
  
  // Protect all dashboard routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth()
    
    if (!userId) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Force dynamic rendering and disable caching for pages that use Convex
  if (pathname.startsWith('/client/') || pathname.startsWith('/tailor/') || pathname.startsWith('/admin/')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }
  
  // Allow API routes to proceed even if auth fails
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
