import { supabaseAdmin as supabase } from '../src/config/db.js';

async function checkAudienciaValues() {
    const { data, error } = await supabase
        .from('cuentos')
        .select('audiencia')
        .limit(20);

    if (error) {
        console.error("ERROR:", error);
    } else {
        const uniqueValues = [...new Set(data.map(d => d.audiencia))];
        console.log("VALORES ACTUALES DE AUDIENCIA EN BD:", uniqueValues);
    }
}

checkAudienciaValues();
