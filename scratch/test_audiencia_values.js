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
        console.error("ERROR:", error.message);
        return false;
    } else {
        console.log("EXITO!");
        return true;
    }
}

async function run() {
    const values = ['Todo público', 'Juvenil', 'Adultos', 'Todo publico', 'Adulto'];
    for (const v of values) {
        if (await testAudiencia(v)) break;
    }
}

run();
