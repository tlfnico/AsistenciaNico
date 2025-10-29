import { createClient } from '@supabase/supabase-js';

// Reemplaza con tu URL y Clave Anónima de Supabase
// Se recomienda usar variables de entorno para esto
const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

if (supabaseUrl === 'https://YOUR_SUPABASE_URL.supabase.co' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn("La URL y la Clave Anónima de Supabase no están configuradas. Por favor, reemplace los valores de marcador de posición en services/supabaseClient.ts");
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
