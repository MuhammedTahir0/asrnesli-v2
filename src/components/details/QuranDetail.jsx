import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const QuranDetail = () => {
     const navigate = useNavigate()
     const surahs = [
          { id: 1, name: 'Fâtiha', meaning: 'Açılış', verses: 7 },
          { id: 2, name: 'Bakara', meaning: 'Sığır', verses: 286 },
          { id: 3, name: 'Âl-i İmrân', meaning: 'İmran Ailesi', verses: 200 },
          { id: 4, name: 'Nisâ', meaning: 'Kadınlar', verses: 176 },
          { id: 5, name: 'Mâide', meaning: 'Sofra', verses: 120 },
          { id: 6, name: 'En\'âm', meaning: 'En\'âm', verses: 165 },
          { id: 67, name: 'Mülk', meaning: 'Mülk', verses: 30, active: true },
     ]

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24">
               {/* Hero Section */}
               <section className="relative h-64 shrink-0 overflow-hidden bg-[#1b2b1a]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1b2b1a]/80"></div>

                    <div className="relative z-10 h-full flex flex-col px-8 pt-12">
                         <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-6">
                              <span className="material-symbols-outlined">arrow_back</span>
                         </button>
                         <h1 className="text-3xl font-bold text-white mb-1">Kur'an-ı Kerim</h1>
                         <p className="text-white/60 text-sm">Yüce Allah'ın Kelamı</p>
                    </div>
               </section>

               {/* Last Read / Active */}
               <section className="px-6 -mt-10 relative z-20">
                    <div className="p-6 rounded-3xl bg-accent-gold text-background-dark shadow-xl flex items-center justify-between">
                         <div>
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Son Okunan</span>
                              <h2 className="text-xl font-bold">Mülk Suresi</h2>
                              <p className="text-xs font-medium">Ayet 12 • Sayfa 562</p>
                         </div>
                         <div className="size-14 rounded-2xl bg-background-dark/10 flex items-center justify-center">
                              <span className="material-symbols-outlined text-3xl">auto_stories</span>
                         </div>
                    </div>
               </section>

               {/* Surah List */}
               <section className="px-6 mt-8 space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent-green mb-4">Sure Listesi</h3>
                    {surahs.map((surah) => (
                         <div
                              key={surah.id}
                              onClick={() => navigate('/categories/reader', {
                                   state: {
                                        title: surah.name + ' Suresi',
                                        subtitle: 'Kur\'an-ı Kerim',
                                        content: 'Tebarekelleziy biyedihilmulkü ve hüve \'ala külli şey\'in kadiyr. Elleziy halakalmevte velhayate liyeblüveküm eyyüküm ahsenü \'amelâ. Ve hüvel\'aziyzülğafûr. Elleziy halaka seb\'a semavatin tibaka. Ma tera fiy halkırrahmanı min tefavüt. Ferci\'ilbasara hel tera min fütûr. Sümmerci\'ilbasara kerreteyni yenkalib ileykelbesaru hasien ve hüve hasiyr...',
                                        arabic: 'تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ . ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ',
                                        source: surah.verses + ' Ayet • ' + surah.meaning
                                   }
                              })}
                              className="group p-5 rounded-2xl bg-white dark:bg-[#222] border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer"
                         >
                              <div className="flex items-center gap-4">
                                   <div className="size-10 rounded-xl bg-accent-green/5 flex items-center justify-center text-accent-green font-bold text-xs">
                                        {surah.id}
                                   </div>
                                   <div>
                                        <h4 className="font-bold text-base text-text-primary dark:text-white">{surah.name}</h4>
                                        <p className="text-xs text-text-secondary dark:text-gray-400">{surah.meaning} • {surah.verses} Ayet</p>
                                   </div>
                              </div>
                              <span className="material-symbols-outlined text-gray-300 group-hover:text-accent-gold transition-colors">arrow_forward</span>
                         </div>
                    ))}
               </section>
          </div>
     )
}

export default QuranDetail
