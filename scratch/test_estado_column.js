import { supabaseAdmin as supabase } from '../src/config/db.js';

async function test() {
    const { data, error } = await supabase
        .from('cuentos')
        .select('*')
        .eq('estado', 'publicado')
        .limit(1);

    if (error) {
        console.error("ERROR EN BD:", JSON.stringify(error, null, 2));
    } else {
        console.log("CONSULTA EXITOSA. Datos:", data);
    }
}

test();
