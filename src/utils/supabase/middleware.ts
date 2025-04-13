import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Define public paths that do not require authentication
const publicPaths = ["/", "/login", "/auth/callback"]; // Added common auth paths

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
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
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
      console.error('Error fetching user in middleware:', error)
      // Decide how to handle the error, maybe redirect to an error page or login
      // For now, we'll proceed with user as null
    } else {
      user = fetchedUser // Assign if fetch was successful
    }
  } catch (e) {
    console.error('Exception during getUser in middleware:', e)
    // Handle unexpected errors during the getUser call itself
  }

  const requestedPath = request.nextUrl.pathname

  // Check if the path is explicitly public or an auth-related path
  const isPublicPath = publicPaths.some(path => requestedPath === path || (path !== '/' && requestedPath.startsWith(path + '/')));
  const isAuthPath = requestedPath.startsWith('/login') || requestedPath.startsWith('/auth'); // Keep /auth group for potential future routes like password reset

  // Check if the path is related to authentication
  if (!user && !isPublicPath && !isAuthPath) {
    // no user, not a public path, and not an auth path -> redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    console.log(`Redirecting unauthenticated user from ${requestedPath} to /login`);
    // Ensure cookies from original request are passed if needed, though usually not for login redirect
    return NextResponse.redirect(url)
  }

  // --- Authorization (RBAC) Check ---
  if (user && requestedPath.startsWith('/admin')) {
    let userRole: string | null = null; // Initialize role

    try {
      // Fetch role from the 'user_profiles' table
      // Adjust table/column names ('user_profiles', 'user_id', 'role') if yours are different
      const { data: profileData, error: profileError } = await supabase
        .from('user_roles') // Your table name
        .select('role_id')       // The column containing the role
        .eq('user_id', user.id) // Match the user ID
        .single();            // Expect only one profile per user

      if (profileError) {
        console.error(`Error fetching profile for user ${user.id}:`, profileError.message);
        // Decide how to handle profile fetch errors - perhaps redirect to error page or deny access
        // For safety, we'll deny access if the profile can't be fetched
        userRole = null;
      } else if (profileData) {
        userRole = profileData.role_id; // Assign role from fetched data
      } else {
        console.warn(`No profile found for user ${user.id}`);
        // Handle cases where a user exists in auth but not in profiles (if possible)
        userRole = null; // Treat as non-admin if no profile
      }
    } catch (e) {
      console.error('Exception fetching user profile in middleware:', e);
      userRole = null; // Treat as non-admin on exception
    }

    // Perform the check using the fetched role
    if (Number(userRole) !== 2) {
      const url = request.nextUrl.clone();
      url.pathname = '/user-dashboard'; // Redirect non-admins
      console.log(`Redirecting non-admin user (${user.id}, role: ${userRole}) from ${requestedPath} to ${url.pathname}`);

      const redirectResponse = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirectResponse;
    }
    // If user IS an admin (userRole === 'admin'), allow request to proceed
  }

  // --- Allow access if none of the above conditions caused a redirect ---
  // Continue by returning the original response with updated session cookies.
  return supabaseResponse
}