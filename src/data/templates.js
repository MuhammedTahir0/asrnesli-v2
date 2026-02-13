// Paylaşım Stüdyosu Şablon Tanımları

export const templates = {
     // Mevcut Şablonlar
     minimal: {
          id: 'minimal',
          name: 'Nur',
          icon: 'light_mode',
          category: 'klasik',
          container: 'bg-[#FDFBF7] text-gray-800',
          overlay: null,
          text: 'font-serif text-2xl md:text-3xl italic leading-relaxed text-[#2c3e50]',
          source: 'text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase mt-6',
          decoration: 'border'
     },
     nature: {
          id: 'nature',
          name: 'Doğa',
          icon: 'landscape',
          category: 'fotoğraf',
          container: 'bg-gray-900 text-white relative overflow-hidden',
          overlay: 'absolute inset-0 bg-black/40 z-0',
          text: 'relative z-10 font-medium text-xl md:text-2xl leading-relaxed drop-shadow-lg text-center px-6',
          source: 'relative z-10 text-xs font-medium tracking-wide opacity-90 mt-4',
          decoration: null,
          defaultBg: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=1000&auto=format&fit=crop'
     },
     classic: {
          id: 'classic',
          name: 'Hat',
          icon: 'history_edu',
          category: 'klasik',
          container: 'bg-[#1F2937] text-[#E5E7EB]',
          overlay: null,
          text: 'font-serif text-xl md:text-2xl leading-loose text-[#D1D5DB] px-8 border-l-2 border-[#C5A059] pl-6 italic',
          source: 'text-xs text-[#C5A059] font-bold mt-6 self-start pl-8',
          decoration: 'lines'
     },
     modern: {
          id: 'modern',
          name: 'Gece',
          icon: 'dark_mode',
          category: 'modern',
          container: 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#000000] text-white',
          overlay: null,
          text: 'font-sans font-bold text-2xl md:text-3xl tracking-tight leading-tight',
          source: 'text-xs font-bold px-3 py-1 bg-white/10 rounded-full mt-6 backdrop-blur-md',
          decoration: 'glow'
     },

     // Yeni Şablonlar
     ramadan: {
          id: 'ramadan',
          name: 'Ramazan',
          icon: 'mosque',
          category: 'özel gün',
          container: 'bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] text-white',
          overlay: 'stars',
          text: 'font-serif text-xl md:text-2xl leading-relaxed text-center px-6',
          source: 'text-xs font-medium tracking-wide text-[#C5A059] mt-4',
          decoration: 'crescent',
          accent: '#C5A059'
     },
     friday: {
          id: 'friday',
          name: 'Cuma',
          icon: 'wb_twilight',
          category: 'özel gün',
          container: 'bg-gradient-to-b from-[#1e3a2f] via-[#2D5A27] to-[#1a3a1a] text-white',
          overlay: 'mosque-silhouette',
          text: 'font-serif text-xl md:text-2xl leading-relaxed text-center px-6',
          source: 'text-xs font-bold tracking-widest text-[#C5A059] uppercase mt-4',
          decoration: null,
          accent: '#C5A059'
     },
     mevlid: {
          id: 'mevlid',
          name: 'Mevlid',
          icon: 'auto_awesome',
          category: 'özel gün',
          container: 'bg-gradient-to-br from-[#4a1942] via-[#2d1b4e] to-[#1a1a2e] text-white',
          overlay: 'lanterns',
          text: 'font-serif text-xl md:text-2xl leading-relaxed text-center px-6 text-amber-100',
          source: 'text-xs font-medium tracking-wide text-amber-300/80 mt-4',
          decoration: 'glow-warm',
          accent: '#fbbf24'
     },
     morningAzkar: {
          id: 'morningAzkar',
          name: 'Sabah',
          icon: 'wb_sunny',
          category: 'azkar',
          container: 'bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#fcd34d] text-gray-800',
          overlay: null,
          text: 'font-medium text-xl md:text-2xl leading-relaxed text-center px-6 text-amber-900',
          source: 'text-xs font-bold tracking-wide text-amber-700 mt-4',
          decoration: 'sun-rays',
          accent: '#d97706'
     },
     eveningAzkar: {
          id: 'eveningAzkar',
          name: 'Akşam',
          icon: 'nights_stay',
          category: 'azkar',
          container: 'bg-gradient-to-b from-[#7c3aed] via-[#4c1d95] to-[#1e1b4b] text-white',
          overlay: 'gradient-overlay',
          text: 'font-medium text-xl md:text-2xl leading-relaxed text-center px-6',
          source: 'text-xs font-medium tracking-wide text-violet-300 mt-4',
          decoration: 'moon',
          accent: '#a78bfa'
     },
     gradient: {
          id: 'gradient',
          name: 'Gradient',
          icon: 'gradient',
          category: 'modern',
          container: 'bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 text-white',
          overlay: null,
          text: 'font-bold text-2xl md:text-3xl leading-tight text-center px-6 drop-shadow-lg',
          source: 'text-xs font-bold tracking-widest uppercase mt-4 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm',
          decoration: null,
          customizable: true // Gradient renkleri değiştirilebilir
     },
     geometric: {
          id: 'geometric',
          name: 'Geometrik',
          icon: 'texture',
          category: 'İslami',
          container: 'bg-[#1a3a3a] text-white',
          overlay: 'geometric-pattern',
          text: 'font-serif text-xl md:text-2xl leading-relaxed text-center px-8',
          source: 'text-xs font-bold tracking-widest text-[#C5A059] uppercase mt-4',
          decoration: 'border-geometric',
          accent: '#C5A059'
     }
}

export const templateCategories = [
     { id: 'all', name: 'Tümü', icon: 'apps' },
     { id: 'klasik', name: 'Klasik', icon: 'style' },
     { id: 'modern', name: 'Modern', icon: 'auto_awesome' },
     { id: 'özel gün', name: 'Özel Gün', icon: 'celebration' },
     { id: 'azkar', name: 'Azkar', icon: 'menu_book' },
     { id: 'fotoğraf', name: 'Fotoğraf', icon: 'photo_camera' },
     { id: 'İslami', name: 'İslami', icon: 'mosque' }
]

export default templates
