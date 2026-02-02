// Paylaşım Stüdyosu Platform Boyutları

export const platformSizes = [
     // Instagram
     {
          id: 'ig-story',
          name: 'Instagram Story',
          platform: 'instagram',
          icon: 'view_day',
          width: 1080,
          height: 1920,
          aspect: '9/16',
          aspectClass: 'aspect-[9/16]'
     },
     {
          id: 'ig-post',
          name: 'Instagram Gönderi',
          platform: 'instagram',
          icon: 'crop_portrait',
          width: 1080,
          height: 1350,
          aspect: '4/5',
          aspectClass: 'aspect-[4/5]'
     },
     {
          id: 'ig-square',
          name: 'Instagram Kare',
          platform: 'instagram',
          icon: 'crop_square',
          width: 1080,
          height: 1080,
          aspect: '1/1',
          aspectClass: 'aspect-square'
     },
     {
          id: 'ig-reels',
          name: 'Instagram Reels',
          platform: 'instagram',
          icon: 'movie',
          width: 1080,
          height: 1920,
          aspect: '9/16',
          aspectClass: 'aspect-[9/16]'
     },

     // WhatsApp
     {
          id: 'wa-status',
          name: 'WhatsApp Durum',
          platform: 'whatsapp',
          icon: 'circle',
          width: 1080,
          height: 1920,
          aspect: '9/16',
          aspectClass: 'aspect-[9/16]'
     },

     // TikTok
     {
          id: 'tiktok',
          name: 'TikTok',
          platform: 'tiktok',
          icon: 'music_note',
          width: 1080,
          height: 1920,
          aspect: '9/16',
          aspectClass: 'aspect-[9/16]'
     },

     // Twitter/X
     {
          id: 'twitter',
          name: 'Twitter/X',
          platform: 'twitter',
          icon: 'chat_bubble',
          width: 1200,
          height: 675,
          aspect: '16/9',
          aspectClass: 'aspect-video'
     },

     // Facebook
     {
          id: 'fb-post',
          name: 'Facebook Gönderi',
          platform: 'facebook',
          icon: 'thumb_up',
          width: 1200,
          height: 630,
          aspect: '1.91/1',
          aspectClass: 'aspect-[1.91/1]'
     },

     // YouTube
     {
          id: 'yt-thumbnail',
          name: 'YouTube Thumbnail',
          platform: 'youtube',
          icon: 'smart_display',
          width: 1280,
          height: 720,
          aspect: '16/9',
          aspectClass: 'aspect-video'
     }
]

export const platformGroups = [
     { id: 'instagram', name: 'Instagram', icon: 'photo_camera', color: 'from-purple-500 to-pink-500' },
     { id: 'whatsapp', name: 'WhatsApp', icon: 'chat', color: 'from-green-500 to-emerald-500' },
     { id: 'tiktok', name: 'TikTok', icon: 'music_note', color: 'from-gray-900 to-gray-700' },
     { id: 'twitter', name: 'Twitter/X', icon: 'tag', color: 'from-blue-400 to-blue-600' },
     { id: 'facebook', name: 'Facebook', icon: 'thumb_up', color: 'from-blue-600 to-blue-800' },
     { id: 'youtube', name: 'YouTube', icon: 'smart_display', color: 'from-red-500 to-red-700' }
]

export default platformSizes
