import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Eksik değişken varsa uygulamanın çökmesini önle
if (!supabaseUrl || !supabaseAnonKey) {
     console.error('DIKKAT: Supabase URL veya Key eksik! Lütfen Vercel ayarlarını kontrol edin.');
}

export const supabase = createClient(
     supabaseUrl || 'https://placeholder-url.supabase.co',
     supabaseAnonKey || 'placeholder-key'
);
