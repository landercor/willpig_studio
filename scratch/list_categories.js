import { supabaseAdmin as supabase } from '../src/config/db.js';

async function listCategories() {
    const { data, error } = await supabase
        .from('categorias')
        .select('id_categoria, nombre');

    if (error) {
        console.error("ERROR AL LISTAR CATEGORIAS:", error);
    } else {
        console.log("CATEGORIAS DISPONIBLES:", data);
    }
}

listCategories();
