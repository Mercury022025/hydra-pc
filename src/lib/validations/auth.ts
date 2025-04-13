    // src/lib/validations/auth.ts
    import { z } from "zod";

    export const loginSchema = z.object({
      email: z.string().email({ message: "Invalid email address." }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." }),
        // Add any other server-specific checks if needed
    });