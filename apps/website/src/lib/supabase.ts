import { createClient } from '@supabase/supabase-js'

// Use the same environment variable names as your index.html for consistency
const supabaseUrl = process.env.NEXT_PUBLIC_VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
