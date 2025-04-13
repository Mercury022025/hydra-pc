import 'dotenv/config';
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import type { Config } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schemas/**/*.ts', // Tells drizzle-kit to look in this folder
  out: './drizzle', // Where to output migration files
  dialect: 'postgresql', // Specify the dialect
  dbCredentials: {
    // Add your database connection string or credentials here
    // Preferably load from environment variables
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
}) satisfies Config;