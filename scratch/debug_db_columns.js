import { supabaseAdmin as supabase } from '../src/config/db.js';

async function test() {
    const { data: catData, error: catError } = await supabase
        .from('categorias')
        .select('*')
        .limit(1);

    if (catError) {
        console.error("ERROR EN CATEGORIAS:", catError);
    } else {
        console.log("COLUMNAS CATEGORIAS:", Object.keys(catData[0] || {}));
    }

    const { data: storyData, error: storyError } = await supabase
        .from('cuentos')
        .select('*')
        .limit(1);

    if (storyError) {
        console.error("ERROR EN CUENTOS:", storyError);
    } else {
        console.log("COLUMNAS CUENTOS:", Object.keys(storyData[0] || {}));
    }
}

test();
