import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Eksik değişken varsa uygulamanın çökmesini önle
if (!supabaseUrl || !supabaseAnonKey) {
     console.error('DIKKAT: Supabase URL veya Key eksik! Lütfen Vercel ayarlarını kontrol edin.');
}



let supabaseInstance;

try {
     // Singleton pattern for HMR (Hot Module Replacement)
     if (import.meta.env.DEV && window.__supabase) {
          supabaseInstance = window.__supabase;
          supabaseInstance = window.__supabase;
     } else {
          supabaseInstance = createClient(
               supabaseUrl || 'https://placeholder-url.supabase.co',
               supabaseAnonKey || 'placeholder-key',
               {
                    auth: {
                         persistSession: true,
                         autoRefreshToken: true,
                         detectSessionInUrl: true,
                         // flowType ve lock kaldırıldı - varsayılan implicit flow kullan
                    }
               }
          );

          if (import.meta.env.DEV) {
               window.__supabase = supabaseInstance;
          }
          if (import.meta.env.DEV) {
               window.__supabase = supabaseInstance;
          }
     }
} catch (error) {
     console.error('❌ Supabase başlatma hatası:', error);
     // Hata durumunda dummy client
     supabaseInstance = {
          auth: {
               getSession: async () => ({ data: { session: null }, error: null }),
               onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
               signOut: async () => ({ error: null }),
               signInWithOAuth: async () => ({ data: null, error: new Error('Supabase başlatılamadı') }),
               signInWithPassword: async () => ({ data: null, error: new Error('Supabase başlatılamadı') }),
               signUp: async () => ({ data: null, error: new Error('Supabase başlatılamadı') }),
          },
          from: () => ({
               select: () => ({ eq: () => ({ single: () => ({ data: null, error: 'Supabase başlatılamadı' }) }) })
          })
     };
}

export const supabase = supabaseInstance;
