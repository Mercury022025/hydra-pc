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
  const { error } = await supabase.auth.signInWithPassword({
    email: validationResult.data.email, // Use validated data
    password: validationResult.data.password, // Use validated data
  })

  if (error) {
    console.error("Supabase login error:", error.message)
    // Redirect back to login page with a generic error
    // Or return an error object like in step 3
    return redirect('/login?error=Could not authenticate user')
  }

  // 5. Login successful - redirect to a protected page
  revalidatePath("/", "layout");
  return redirect("/user-dashboard"); // Or wherever users go after login
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
