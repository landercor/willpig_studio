import { supabaseAdmin as supabase } from '../src/config/db.js';

async function seedCategory() {
    console.log("Insertando categoría por defecto...");
    const { data, error } = await supabase
        .from('categorias')
        .insert([{
            nombre: "Fantasía"
        }])
        .select();

    if (error) {
        console.error("ERROR AL INSERTAR CATEGORIA:", JSON.stringify(error, null, 2));
    } else {
        console.log("CATEGORIA CREADA:", data);
    }
}

seedCategory();
