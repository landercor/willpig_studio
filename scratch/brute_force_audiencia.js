import { supabaseAdmin as supabase } from '../src/config/db.js';

async function getConstraintDefinition() {
    // We try to use a more clever way to find the constraint via a raw query if possible.
    // Since we can't do raw SQL, we can try to find if there's an RPC or something.
    // Instead, let's try to 'brute force' the common values but with more attention to case sensitivity.
    
    // Values to try (based on common Supabase/Postgres conventions)
    const values = [
        'TODO_PUBLICO', 'JUVENIL', 'ADULTO',
        'todo_publico', 'juvenil', 'adulto',
        'public', 'teen', 'mature',
        'General', 'G', 'PG', 'PG-13', 'R',
        'Todo Público', 'Juvenil', 'Adultos'
    ];
    
    console.log("Iniciando búsqueda exhaustiva de valores aceptados para 'audiencia'...");
    
    for (const v of values) {
        process.stdout.write(`Probando "${v}"... `);
        const { error } = await supabase
            .from('cuentos')
            .insert([{
                titulo: "Test",
                audiencia: v,
                cuenta_usuario_id: 'd7d73601-5de2-4c2e-bdf2-1a1a2568c5b2',
                categoria_id: 1,
                idioma: 'es',
                derechos: 'todos',
                clasificacion: 'todo'
            }]);
            
        if (!error) {
            console.log("✅ ¡ÉXITO!");
            return;
        } else {
            console.log("❌");
        }
    }
    console.log("No se encontró ningún valor válido en esta lista.");
}

getConstraintDefinition();
