// src/config/db.js
import { supabase } from 'supabaseCleint.js'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// Cliente normal (respeta RLS) — para operaciones de usuario
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Cliente admin (bypasea RLS) — solo para operaciones internas del servidor
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export { supabase, supabaseAdmin }
async function socialLogin() {
  const { data, error } = await
  supabase.auth.socialLogin({
    provider: 'google',
    options: {
      scopes: 'email profile'
    }
  })
  const { data: { session } } = await
  supabase.auth.getSession()

  const googleToken = 
  session.provider_token
}

