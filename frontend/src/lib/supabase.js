import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Helper to check if URL is likely valid
const isValidUrl = (url) => {
  try {
    return url && (typeof url === 'string') && (url.startsWith('http://') || url.startsWith('https://'))
  } catch {
    return false
  }
}

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
  console.warn(
    '[PulseForge] Supabase credentials are missing or invalid.\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.'
  )
}

// Use a valid URL format even for placeholders to prevent initialization crashes
const fallbackUrl = 'https://placeholder-project.supabase.co'
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIn0.placeholder'

export const supabase = createClient(
  isValidUrl(supabaseUrl) ? supabaseUrl : fallbackUrl,
  supabaseAnonKey || fallbackKey
)
