import { supabaseAdmin as supabase } from '../src/config/db.js';

async function listUsers() {
    const { data, error } = await supabase
        .from('cuenta_usuario')
        .select('id_cuenta_usuario, username, email')
        .limit(5);

    if (error) {
        console.error("ERROR AL LISTAR USUARIOS:", error);
    } else {
        console.log("USUARIOS DISPONIBLES:", data);
    }
}

listUsers();
