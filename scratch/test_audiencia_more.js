import { supabaseAdmin as supabase } from '../src/config/db.js';

async function testAudiencia(val) {
    console.log(`Probando valor: "${val}"`);
    const { data, error } = await supabase
        .from('cuentos')
        .insert([{
            titulo: "Test Audiencia",
            audiencia: val,
            cuenta_usuario_id: 'd7d73601-5de2-4c2e-bdf2-1a1a2568c5b2',
            categoria_id: 1,
            idioma: 'es',
            derechos: 'todos',
            clasificacion: 'todo'
        }])
        .select();

    if (error) {
        return false;
    } else {
        console.log(`EXITO con: "${val}"`);
        return true;
    }
}

async function run() {
    const values = ['Todos', 'Público', 'General', 'Apta para todo público', 'INFANTIL', 'JUVENIL', 'ADULTOS'];
    for (const v of values) {
        if (await testAudiencia(v)) break;
    }
}

run();
