import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Define public paths that do not require authentication
const publicPaths = ['/'] // Add any other public paths here, e.g., '/blog'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  let user = null // Initialize user to null
  try {
    const {
      data: { user: fetchedUser }, // Rename to avoid conflict
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Error fetching user:', error)
      // Decide how to handle the error, maybe redirect to an error page or login
      // For now, we'll proceed with user as null
    } else {
      user = fetchedUser // Assign if fetch was successful
    }
  } catch (e) {
    console.error('Exception during getUser:', e)
    // Handle unexpected errors during the getUser call itself
  }

  const requestedPath = request.nextUrl.pathname

  // Check if the requested path is public
  const isPublicPath = publicPaths.some(path => requestedPath.startsWith(path))

  // Check if the path is related to authentication
  const isAuthPath = requestedPath.startsWith('/login') || requestedPath.startsWith('/auth')

  if (!user && !isPublicPath && !isAuthPath) {
    // no user, not a public path, and not an auth path -> redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}