// src/config/testConnection.js
import { supabase } from './db.js'

const testConnection = async () => {
  console.log('🔄 Probando conexión a Supabase...')

  const { data, error } = await supabase
    .from('categorias')
    .select('count')

  if (error) {
    console.error('❌ Error de conexión:', error.message)
    process.exit(1)
  }

  console.log('✅ Conexión exitosa a Supabase!')
  console.log('📦 Base de datos: willpig_studio')
  console.log('🗄️  Tablas accesibles correctamente')
  process.exit(0)
}

testConnection()