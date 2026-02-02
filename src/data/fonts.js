// Paylaşım Stüdyosu Yazı Tipi Tanımları

export const fonts = [
     // Varsayılan
     { id: 'default', name: 'Varsayılan', family: 'inherit', category: 'sistem' },

     // Arapça Hat Fontları
     { id: 'amiri', name: 'Amiri', family: "'Amiri', serif", category: 'hat', googleFont: 'Amiri:400,700' },
     { id: 'scheherazade', name: 'Scheherazade', family: "'Scheherazade New', serif", category: 'hat', googleFont: 'Scheherazade+New:400,700' },
     { id: 'lateef', name: 'Lateef', family: "'Lateef', serif", category: 'hat', googleFont: 'Lateef:400,700' },

     // Modern Sans-Serif
     { id: 'inter', name: 'Inter', family: "'Inter', sans-serif", category: 'modern', googleFont: 'Inter:400,500,600,700' },
     { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif", category: 'modern', googleFont: 'Poppins:400,500,600,700' },
     { id: 'outfit', name: 'Outfit', family: "'Outfit', sans-serif", category: 'modern', googleFont: 'Outfit:400,500,600,700' },
     { id: 'nunito', name: 'Nunito', family: "'Nunito', sans-serif", category: 'modern', googleFont: 'Nunito:400,600,700' },

     // Klasik Serif
     { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif", category: 'klasik', googleFont: 'Playfair+Display:400,500,600,700' },
     { id: 'crimson', name: 'Crimson Text', family: "'Crimson Text', serif", category: 'klasik', googleFont: 'Crimson+Text:400,600,700' },
     { id: 'merriweather', name: 'Merriweather', family: "'Merriweather', serif", category: 'klasik', googleFont: 'Merriweather:400,700' },

     // El Yazısı
     { id: 'caveat', name: 'Caveat', family: "'Caveat', cursive", category: 'el yazısı', googleFont: 'Caveat:400,500,600,700' },
     { id: 'dancing', name: 'Dancing Script', family: "'Dancing Script', cursive", category: 'el yazısı', googleFont: 'Dancing+Script:400,500,600,700' },
     { id: 'pacifico', name: 'Pacifico', family: "'Pacifico', cursive", category: 'el yazısı', googleFont: 'Pacifico:400' }
]

export const fontCategories = [
     { id: 'all', name: 'Tümü' },
     { id: 'hat', name: 'Hat' },
     { id: 'modern', name: 'Modern' },
     { id: 'klasik', name: 'Klasik' },
     { id: 'el yazısı', name: 'El Yazısı' }
]

export const fontSizes = [
     { id: 'xs', name: 'Çok Küçük', class: 'text-base md:text-lg' },
     { id: 'sm', name: 'Küçük', class: 'text-lg md:text-xl' },
     { id: 'md', name: 'Orta', class: 'text-xl md:text-2xl' },
     { id: 'lg', name: 'Büyük', class: 'text-2xl md:text-3xl' },
     { id: 'xl', name: 'Çok Büyük', class: 'text-3xl md:text-4xl' }
]

export const textAlignments = [
     { id: 'left', name: 'Sol', icon: 'format_align_left' },
     { id: 'center', name: 'Orta', icon: 'format_align_center' },
     { id: 'right', name: 'Sağ', icon: 'format_align_right' }
]

// Google Fonts URL oluşturucu
export const getGoogleFontsUrl = (selectedFonts) => {
     const fontParams = selectedFonts
          .filter(f => f.googleFont)
          .map(f => f.googleFont)
          .join('&family=')

     if (!fontParams) return null
     return `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap`
}

export default fonts
