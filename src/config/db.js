// src/config/db.js
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

<<<<<<< HEAD
// Cliente normal (respeta RLS) — para operaciones de usuario
=======
// Cliente Supabase normal (respeta RLS)
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

<<<<<<< HEAD
// Cliente admin (bypasea RLS) — solo para operaciones internas del servidor
=======
// Cliente admin (bypasea RLS)
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export { supabase, supabaseAdmin }