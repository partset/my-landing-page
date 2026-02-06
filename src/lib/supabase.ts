// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Load environment variables stored in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize and export the Supabase client for use throughout the application
export const supabase = createClient(supabaseUrl, supabaseAnonKey);