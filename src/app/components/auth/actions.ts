'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { loginSchema } from '@/lib/validations/auth';

export async function login(formData: FormData) {
  const supabase = await createClient()

  // 1. Extract data from FormData
  const rawFormData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  // 2. Validate using the Zod schema
  const validationResult = loginSchema.safeParse(rawFormData)

  // 3. Handle validation failure
  if (!validationResult.success) {
    console.error("Server-side validation failed:", validationResult.error.flatten())
    // Option 1: Redirect back with an error query parameter (simple)
    // return redirect('/login?error=Invalid credentials');

    // Option 2: Return an error object (requires handling in the client component with useFormState)
    return {
      success: false,
      message: "Invalid email or password.", // Generic message often better for login
      errors: validationResult.error.flatten().fieldErrors, // Can be more specific if needed
    }

    // Option 3: Throw an error (less common for form actions, often leads to error.tsx boundary)
    // throw new Error("Invalid credentials");
  }

  // 4. Validation passed - proceed with Supabase auth
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: validationResult.data.email, // Use validated data
    password: validationResult.data.password, // Use validated data
  })

  if (signInError) {
    console.error("Supabase login error:", signInError.message)
    // Redirect back to login page with a generic error
    // Or return an error object like in step 3
    return redirect('/login?error=Could not authenticate user')
  }

  // 5. Login successful - Fetch user object *and* role from DB
  // First, get the user object to obtain the ID
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

  if (getUserError || !user) {
      console.error("Error fetching user after login:", getUserError?.message);
      // Handle appropriately - maybe return an error to the form
      return {
        success: false,
        message: "Login successful, but could not retrieve user details.",
      };
      // Previous: return redirect('/login?error=Could not retrieve user details');
  }

  // Now, fetch the role from the database using the user ID
  let userRole: string | null = null;
  try {
      // Adjust table/column names ('user_profiles', 'user_id', 'role') if yours are different
      const { data: profileData, error: profileError } = await supabase
      .from('user_roles') // Your table name
      .select('role_id')       // The column containing the role
      .eq('user_id', user.id) // Match the user ID
      .single();           // Expect only one profile per user

      if (profileError) {
        console.error(`Error fetching profile for user ${user.id} after login:`, profileError.message);
        // Decide how to handle - maybe a generic user role or an error message
        userRole = 'user'; // Defaulting to 'user' for safety/simplicity here
      } else if (profileData) {
        userRole = profileData.role_id;
      } else {
        console.warn(`No profile found for user ${user.id} after login.`);
        userRole = 'user'; // Defaulting to 'user' if no profile found
      }
  } catch (e) {
      console.error('Exception fetching user profile after login:', e);
      userRole = 'user'; // Defaulting to 'user' on exception
  }

  // --- Role-based Redirect ---
  revalidatePath("/", "layout"); // Revalidate before redirect

  if (Number(userRole) === 2) {
    console.log(`Redirecting admin user ${user.id} to admin dashboard.`);
    return redirect("/admin-dashboard"); // Redirect admins
  } else {
    console.log(`Redirecting non-admin user ${user.id} to user dashboard.`);
    return redirect("/user-dashboard"); // Redirect non-admins
  }
}