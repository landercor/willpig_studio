// src/config/db.js
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