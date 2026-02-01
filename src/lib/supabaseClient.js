import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Eksik değişken varsa uygulamanın çökmesini önle
if (!supabaseUrl || !supabaseAnonKey) {
     console.error('DIKKAT: Supabase URL veya Key eksik! Lütfen Vercel ayarlarını kontrol edin.');
}

console.log('🔌 Supabase Client Başlatılıyor...', { url: supabaseUrl ? 'Mevcut' : 'Eksik', key: supabaseAnonKey ? 'Mevcut' : 'Eksik' });

let supabaseInstance;

try {
     supabaseInstance = createClient(
          supabaseUrl || 'https://placeholder-url.supabase.co',
          supabaseAnonKey || 'placeholder-key'
     );
} catch (error) {
     console.error('❌ Supabase başlatma hatası:', error);
     // Hata durumunda boş bir obje döndür veya güvenli bir dummy client oluşturmaya çalış
     supabaseInstance = {
          from: () => ({
               select: () => ({ eq: () => ({ single: () => ({ error: 'Supabase başlatılamadı' }) }) })
          })
     };
}

export const supabase = supabaseInstance;
