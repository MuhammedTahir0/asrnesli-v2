/**
 * Web Notification Service
 * 
 * Tarayıcı tabanlı bildirimleri yönetir.
 */

export const notificationService = {
     /**
      * Bildirim izni ister
      */
     requestPermission: async () => {
          if (!('Notification' in window)) {
               console.warn('Bu tarayıcı bildirimleri desteklemiyor.');
               return false;
          }

          const permission = await Notification.requestPermission();
          return permission === 'granted';
     },

     /**
      * Bildirim gönderir
      */
     sendNotification: (title, body, icon = '/pwa-192x192.png') => {
          if (Notification.permission === 'granted') {
               try {
                    const n = new Notification(title, {
                         body,
                         icon,
                         badge: icon,
                         vibrate: [200, 100, 200]
                    });

                    n.onclick = () => {
                         window.focus();
                         n.close();
                    };
               } catch (e) {
                    // Bazı mobil tarayıcılarda service worker üzerinden gönderim gerekebilir
                    console.error('Notification error:', e);
               }
          }
     },

     /**
      * Ezan vakti için planlanmış bildirim (Örnek mantık)
      */
     schedulePrayerNotification: (prayerName, time) => {
          // Not: Safari ve Chrome mobil kısıtlamaları nedeniyle 
          // gerçek zamanlı planlanmış bildirimler genellikle bir backend/push service gerektirir.
          // Ancak uygulama açıkken setTimeout veya sistem saati kontrolüyle simüle edilebilir.
          console.log(`Bildirim planlandı: ${prayerName} saat ${time}`);
     }
};
