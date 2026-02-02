import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const QuranDetail = () => {
     const navigate = useNavigate()

     const surahCategories = {
          lastRead: { name: 'Mülk Suresi', verse: 12, page: 562 },
          popular: [
               { id: 36, name: 'Yâsîn', meaning: 'Ey İnsan', verses: 83, type: 'Mekki' },
               { id: 67, name: 'Mülk', meaning: 'Hükümranlık', verses: 30, type: 'Mekki' },
               { id: 78, name: 'Nebe', meaning: 'Haber', verses: 40, type: 'Mekki' },
               { id: 18, name: 'Kehf', meaning: 'Mağara', verses: 110, type: 'Mekki' },
               { id: 56, name: 'Vâkıa', meaning: 'Olay', verses: 96, type: 'Mekki' },
               { id: 48, name: 'Fetih', meaning: 'Zafer', verses: 29, type: 'Medine' },
          ],
          juzs: [
               { id: 30, name: '30. Cüz (Amme)', desc: 'Nebe - Nas Sureleri' },
               { id: 29, name: '29. Cüz (Tebareke)', desc: 'Mülk - Mürselat Sureleri' },
          ]
     }

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24">
               {/* Hero Section */}
               <section className="relative h-64 shrink-0 overflow-hidden bg-[#1b2b1a]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1b2b1a]/95"></div>

                    <div className="relative z-10 h-full flex flex-col px-8 pt-12">
                         <div className="flex items-center justify-between mb-6">
                              <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                   <span className="material-symbols-outlined">arrow_back</span>
                              </button>
                         </div>
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-auto pb-8"
                         >
                              <h1 className="text-3xl font-bold text-white mb-2">Kur'an-ı Kerim</h1>
                              <p className="text-white/70 text-sm font-medium">Alemlere Rahmet ve Hidayet Rehberi</p>
                         </motion.div>
                    </div>
               </section>

               {/* Last Read / Active */}
               <section className="px-6 -mt-8 relative z-20">
                    <div className="p-6 rounded-[2rem] bg-accent-gold text-background-dark shadow-xl flex items-center justify-between relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
                         <div className="absolute right-0 top-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 pointer-events-none"></div>
                         <div className="relative z-10">
                              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">
                                   <span className="size-1.5 rounded-full bg-background-dark animate-pulse"></span>
                                   Kaldığınız Yer
                              </span>
                              <h2 className="text-2xl font-bold mb-1">{surahCategories.lastRead.name}</h2>
                              <p className="text-xs font-bold opacity-80">Ayet {surahCategories.lastRead.verse} • Sayfa {surahCategories.lastRead.page}</p>
                         </div>
                         <div className="size-14 rounded-2xl bg-background-dark/10 flex items-center justify-center relative z-10">
                              <span className="material-symbols-outlined text-3xl">auto_stories</span>
                         </div>
                    </div>
               </section>

               {/* Popular Surahs */}
               <section className="px-6 mt-10 space-y-4">
                    <div className="flex items-center justify-between">
                         <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent-green">Sık Okunanlar</h3>
                         <button className="text-[10px] font-bold text-accent-gold uppercase tracking-widest hover:text-accent-green transition-colors">Tüm Liste</button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                         {surahCategories.popular.map((surah) => (
                              <motion.div
                                   key={surah.id}
                                   whileHover={{ scale: 1.01 }}
                                   onClick={() => navigate('/categories/reader', {
                                        state: {
                                             title: surah.name + ' Suresi',
                                             subtitle: 'Kur\'an-ı Kerim',
                                             content: 'Rahman ve Rahim olan Allah\'ın adıyla. (Sure içeriği buraya gelecek...)',
                                             arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
                                             source: surah.verses + ' Ayet • ' + surah.type
                                        }
                                   })}
                                   className="group p-4 rounded-2xl bg-white dark:bg-[#1f291e] border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-accent-gold/20 transition-all cursor-pointer"
                              >
                                   <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-xl bg-accent-green/5 dark:bg-white/5 flex items-center justify-center text-accent-green dark:text-accent-gold font-bold text-sm border border-accent-green/10 dark:border-white/5">
                                             {surah.id}
                                        </div>
                                        <div>
                                             <h4 className="font-bold text-base text-text-primary dark:text-white group-hover:text-accent-gold transition-colors">{surah.name}</h4>
                                             <p className="text-[10px] text-text-secondary dark:text-gray-400 font-bold uppercase tracking-wider">{surah.type} • {surah.verses} Ayet</p>
                                        </div>
                                   </div>
                                   <div className="flex flex-col items-end gap-1">
                                        <span className="text-sm font-medium text-text-secondary/50 dark:text-white/30">{surah.meaning}</span>
                                        <span className="material-symbols-outlined text-gray-300 text-lg group-hover:text-accent-gold transition-colors">chevron_right</span>
                                   </div>
                              </motion.div>
                         ))}
                    </div>
               </section>

               {/* Juzs Preview */}
               <section className="px-6 mt-10 mb-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent-green mb-4">Cüzler</h3>
                    <div className="grid grid-cols-2 gap-4">
                         {surahCategories.juzs.map((juz) => (
                              <div key={juz.id} className="p-4 rounded-2xl bg-[#f8f9fa] dark:bg-white/5 border border-transparent hover:border-accent-gold/20 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer text-center group">
                                   <span className="text-accent-gold material-symbols-outlined text-3xl mb-2 group-hover:scale-110 transition-transform">menu_book</span>
                                   <h4 className="font-bold text-sm text-primary dark:text-white mb-0.5">{juz.name}</h4>
                                   <p className="text-[10px] text-text-secondary dark:text-gray-400">{juz.desc}</p>
                              </div>
                         ))}
                    </div>
               </section>
          </div>
     )
}

export default QuranDetail
