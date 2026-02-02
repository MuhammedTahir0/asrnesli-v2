// Paylaşım Stüdyosu Sticker ve Emoji Tanımları

export const stickers = [
     // İslami Stickerlar (Emoji temelli - SVG kullanılabilir)
     { id: 'mosque', name: 'Cami', emoji: '🕌', category: 'İslami' },
     { id: 'kaaba', name: 'Kâbe', emoji: '🕋', category: 'İslami' },
     { id: 'crescent', name: 'Hilal', emoji: '☪️', category: 'İslami' },
     { id: 'prayer-beads', name: 'Tesbih', emoji: '📿', category: 'İslami' },
     { id: 'quran', name: 'Kuran', emoji: '📖', category: 'İslami' },
     { id: 'prayer', name: 'Dua', emoji: '🤲', category: 'İslami' },
     { id: 'peace', name: 'Barış', emoji: '☮️', category: 'İslami' },

     // Doğa
     { id: 'star', name: 'Yıldız', emoji: '⭐', category: 'doğa' },
     { id: 'stars', name: 'Yıldızlar', emoji: '✨', category: 'doğa' },
     { id: 'moon', name: 'Ay', emoji: '🌙', category: 'doğa' },
     { id: 'sun', name: 'Güneş', emoji: '☀️', category: 'doğa' },
     { id: 'sunrise', name: 'Gün Doğumu', emoji: '🌅', category: 'doğa' },
     { id: 'sunset', name: 'Gün Batımı', emoji: '🌇', category: 'doğa' },
     { id: 'cloud', name: 'Bulut', emoji: '☁️', category: 'doğa' },
     { id: 'rainbow', name: 'Gökkuşağı', emoji: '🌈', category: 'doğa' },
     { id: 'flower', name: 'Çiçek', emoji: '🌸', category: 'doğa' },
     { id: 'rose', name: 'Gül', emoji: '🌹', category: 'doğa' },
     { id: 'leaf', name: 'Yaprak', emoji: '🍃', category: 'doğa' },
     { id: 'tree', name: 'Ağaç', emoji: '🌳', category: 'doğa' },

     // Kalpler
     { id: 'heart-red', name: 'Kırmızı Kalp', emoji: '❤️', category: 'kalpler' },
     { id: 'heart-green', name: 'Yeşil Kalp', emoji: '💚', category: 'kalpler' },
     { id: 'heart-gold', name: 'Sarı Kalp', emoji: '💛', category: 'kalpler' },
     { id: 'heart-sparkle', name: 'Parıldayan Kalp', emoji: '💖', category: 'kalpler' },

     // Dekoratif
     { id: 'sparkles', name: 'Parıltı', emoji: '✨', category: 'dekoratif' },
     { id: 'diamond', name: 'Elmas', emoji: '💎', category: 'dekoratif' },
     { id: 'fire', name: 'Ateş', emoji: '🔥', category: 'dekoratif' },
     { id: 'candle', name: 'Mum', emoji: '🕯️', category: 'dekoratif' },
     { id: 'lantern', name: 'Fener', emoji: '🏮', category: 'dekoratif' },
     { id: 'ribbon', name: 'Kurdele', emoji: '🎀', category: 'dekoratif' },
     { id: 'gift', name: 'Hediye', emoji: '🎁', category: 'dekoratif' },

     // Kutlama
     { id: 'celebration', name: 'Kutlama', emoji: '🎉', category: 'kutlama' },
     { id: 'confetti', name: 'Konfeti', emoji: '🎊', category: 'kutlama' },
     { id: 'balloon', name: 'Balon', emoji: '🎈', category: 'kutlama' },

     // İfadeler
     { id: 'dove', name: 'Güvercin', emoji: '🕊️', category: 'ifadeler' },
     { id: 'folded-hands', name: 'Dua Eden Eller', emoji: '🙏', category: 'ifadeler' },
     { id: 'raised-hands', name: 'Ellerini Kaldıran', emoji: '🙌', category: 'ifadeler' }
]

export const stickerCategories = [
     { id: 'all', name: 'Tümü', icon: 'apps' },
     { id: 'İslami', name: 'İslami', icon: 'mosque' },
     { id: 'doğa', name: 'Doğa', icon: 'eco' },
     { id: 'kalpler', name: 'Kalpler', icon: 'favorite' },
     { id: 'dekoratif', name: 'Dekoratif', icon: 'auto_awesome' },
     { id: 'kutlama', name: 'Kutlama', icon: 'celebration' },
     { id: 'ifadeler', name: 'İfadeler', icon: 'emoji_emotions' }
]

export default stickers
