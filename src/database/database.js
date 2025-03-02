import { createClient } from '@supabase/supabase-js';
import "dotenv/config"

const SUPABASE_URL = process.env.SUPABASE_PROJECT;
const SUPABASE_ANON_KEY = process.env.SUPABASE_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const connection = async () => {
    try {
        // Realiza una verificación de entidades para asegurarse una conexión exitosa.
        const { data, error } = await supabase.from('cliente').select('*').limit(1);
        if (error) throw error;
        console.log("Conexión exitosa a Supabase.");
    } catch (e) {
        console.error(`Error en la conexión a Supabase: ${e.message}`);
    }
};

export { supabase, connection };