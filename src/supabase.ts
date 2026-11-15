import { createClient } from '@supabase/supabase-js'

// The anon key is public by design; Row Level Security in the database is what
// keeps the data private. Both values come from .env.local (see .env.example)
// locally and from GitHub Actions secrets in production.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase =
  url && anonKey ? createClient(url, anonKey, { db: { schema: 'meals' } }) : null

export const supabaseConfigured = supabase !== null
