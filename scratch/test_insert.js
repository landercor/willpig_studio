import { supabaseAdmin as supabase } from '../src/config/db.js';

async function testInsert() {
    console.log("Probando inserción de historia...");
    const { data, error } = await supabase
        .from('cuentos')
        .insert([{
            titulo: "Historia de Prueba",
            descripcion: "Prueba de error de BD",
            estado: 'borrador',
            cuenta_usuario_id: 'ae6e4504-4202-42b4-9508-3a0d08076ef0', // ID ficticio o de prueba
            audiencia: 'todo_publico',
            idioma: 'es',
            derechos: 'todos',
            clasificacion: 'todo'
        }])
        .select();

    if (error) {
        console.error("ERROR AL INSERTAR:", JSON.stringify(error, null, 2));
    } else {
        console.log("INSERCIÓN EXITOSA:", data);
    }
}

testInsert();
