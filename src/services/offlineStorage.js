/**
 * Offline ve Senkronizasyon Veri Yönetimi
 * 
 * Bu yardımcı sınıf, Supabase'den gelen verileri localStorage'da yedekler
 * ve internet yokken bu verilerin kullanılmasını sağlar.
 */

const CACHE_KEYS = {
     DAILY_CONTENT: 'asr_nesli_daily_content',
     USER_PREFERENCES: 'asr_nesli_user_prefs',
     LAST_SYNC: 'asr_nesli_last_sync'
};

export const offlineStorage = {
     /**
      * Günlük içeriği kaydeder
      */
     saveDailyContent: (content) => {
          try {
               const data = {
                    content,
                    timestamp: new Date().toISOString(),
                    date: new Date().toISOString().split('T')[0]
               };
               localStorage.setItem(CACHE_KEYS.DAILY_CONTENT, JSON.stringify(data));
          } catch (e) {
               console.error('Offline storage save error:', e);
          }
     },

     /**
      * Önbellekteki günlük içeriği getirir
      */
     getDailyContent: () => {
          try {
               const cached = localStorage.getItem(CACHE_KEYS.DAILY_CONTENT);
               if (!cached) return null;

               const parsed = JSON.parse(cached);
               return parsed.content;
          } catch (e) {
               return null;
          }
     },

     /**
      * Favorileri yerelde yedekler
      */
     saveFavoritesLocally: (favorites) => {
          localStorage.setItem('asr_nesli_favorites_backup', JSON.stringify(favorites));
     },

     getFavoritesLocally: () => {
          const favs = localStorage.getItem('asr_nesli_favorites_backup');
          return favs ? JSON.parse(favs) : [];
     }
};
