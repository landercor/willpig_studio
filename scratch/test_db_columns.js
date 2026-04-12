import { supabaseAdmin as supabase } from '../src/config/db.js';

async function test() {
    const { data, error } = await supabase
        .from('cuentos')
        .select('*')
        .limit(1);

    if (error) {
        console.error("ERROR EN BD:", error);
    } else {
        console.log("CONEXIÓN EXITOSA. Columnas disponibles:", Object.keys(data[0] || {}));
    }
}

test();
