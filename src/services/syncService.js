import { supabase } from '../lib/supabaseClient'

/**
 * useSync Hook / Service
 * 
 * Verileri Supabase ile senkronize eder. 
 * İnternet yoksa verileri kuyruğa (queue) atar ve bağlantı geldiğinde gönderir.
 */

const SYNC_KEYS = {
     PREFERENCES: 'asr_nesli_sync_prefs',
     TASBIH: 'asr_nesli_sync_tasbih',
     FAVORITES: 'asr_nesli_sync_favs'
};

export const syncService = {
     /**
      * Kullanıcı tercihlerini senkronize eder
      */
     syncPreferences: async (userId, prefs) => {
          if (!userId) return;

          try {
               const { error } = await supabase
                    .from('user_preferences')
                    .upsert({
                         user_id: userId,
                         ...prefs,
                         updated_at: new Date().toISOString()
                    });

               if (error) throw error;
               return true;
          } catch (err) {
               console.error('Sync preferences error:', err);
               // Yerelde yedekle (offline queue)
               localStorage.setItem(SYNC_KEYS.PREFERENCES, JSON.stringify(prefs));
               return false;
          }
     },

     /**
      * Zikir sayılarını senkronize eder
      */
     syncTasbih: async (userId, countData) => {
          if (!userId) return;

          try {
               const { error } = await supabase
                    .from('user_stats')
                    .upsert({
                         user_id: userId,
                         tasbih_count: countData.total,
                         last_active: new Date().toISOString()
                    });

               if (error) throw error;
               return true;
          } catch (err) {
               localStorage.setItem(SYNC_KEYS.TASBIH, JSON.stringify(countData));
               return false;
          }
     },

     /**
      * İnternet geldiğinde bekleyen verileri gönderir
      */
     processQueue: async (userId) => {
          if (!userId || !navigator.onLine) return;

          const pendingPrefs = localStorage.getItem(SYNC_KEYS.PREFERENCES);
          if (pendingPrefs) {
               const success = await syncService.syncPreferences(userId, JSON.parse(pendingPrefs));
               if (success) localStorage.removeItem(SYNC_KEYS.PREFERENCES);
          }

          // Benzer şekilde favoriler ve zikirler için devam edebilir...
     }
};
