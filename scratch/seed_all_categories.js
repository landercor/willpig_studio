import { supabaseAdmin as supabase } from '../src/config/db.js';

async function seedCategories() {
    console.log("Insertando categorías faltantes...");
    const categories = [
        { id_categoria: 1, nombre: "Fantasía" },
        { id_categoria: 2, nombre: "Romance" },
        { id_categoria: 3, nombre: "Aventura" },
        { id_categoria: 4, nombre: "Drama" },
        { id_categoria: 5, nombre: "Infantil" }
    ];

    for (const cat of categories) {
        const { data, error } = await supabase
            .from('categorias')
            .upsert([cat])
            .select();

        if (error) {
            console.error(`Error en categoría ${cat.nombre}:`, error.message);
        } else {
            console.log(`Categoría lista: ${cat.nombre}`);
        }
    }
}

seedCategories();
