import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import PrayerHero from './home/PrayerHero'

const Home = () => {
     const navigate = useNavigate()
     const [data, setData] = useState({
          verse: null,
          hadith: null,
          ilmihal: null,
          nameOfAllah: null
     })
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState(null)

     useEffect(() => {
          const fetchDailyContent = async () => {
               try {
                    setLoading(true)
                    // Bugünün içeriğini al
                    const { data: daily, error: dailyError } = await supabase
                         .from('daily_content')
                         .select(`
            *,
            verse:verses(*),
            hadith:hadiths(*),
            ilmihal:ilmihals(*),
            nameOfAllah:names_of_allah(*)
          `)
                         .eq('display_date', new Date().toISOString().split('T')[0])
                         .single()

                    if (dailyError) {
                         // Eğer bugün için içerik yoksa, en son ekleneni al
                         const { data: latest, error: latestError } = await supabase
                              .from('daily_content')
                              .select(`
              *,
              verse:verses(*),
              hadith:hadiths(*),
              ilmihal:ilmihals(*),
              nameOfAllah:names_of_allah(*)
            `)
                              .order('display_date', { ascending: false })
                              .limit(1)
                              .single()

                         if (latestError) throw latestError
                         setData({
                              verse: latest.verse,
                              hadith: latest.hadith,
                              ilmihal: latest.ilmihal,
                              nameOfAllah: latest.nameOfAllah
                         })
                    } else {
                         setData({
                              verse: daily.verse,
                              hadith: daily.hadith,
                              ilmihal: daily.ilmihal,
                              nameOfAllah: daily.nameOfAllah
                         })
                    }
               } catch (err) {
                    console.error('Veri çekme hatası:', err)
                    setError('İçerik yüklenirken bir sorun oluştu.')
               } finally {
                    setLoading(false)
               }
          }

          fetchDailyContent()
     }, [])

     if (loading) {
          return (
               <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-green"></div>
               </div>
          )
     }

     if (error) {
          return (
               <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <p className="text-red-500 font-medium">{error}</p>
               </div>
          )
     }

     return (
          <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar pb-28 px-5 sm:px-6 space-y-8">
               {/* Selamlama Bölümü */}
               <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center pt-8 pb-4 gap-3 text-center"
               >
                    <div className="w-full max-w-[280px] relative mb-1">
                         <h1 className="text-5xl text-accent-green dark:text-primary leading-tight calligraphy select-none drop-shadow-sm">
                              ﷽
                         </h1>
                    </div>
                    <div className="space-y-1">
                         <h2 className="text-xl font-bold text-text-primary dark:text-white tracking-tight">Hoş Geldiniz</h2>
                         <p className="text-gray-400 text-xs font-medium tracking-wide uppercase">Gününüz Hayırlı Olsun</p>
                    </div>
               </motion.div>

               {/* Ezan Geri Sayım Hero */}
               <PrayerHero />

               {/* Günün Ayeti Kartı - Modern Görsel Odaklı */}
               {data.verse && (
                    <motion.article
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="group relative rounded-[2rem] bg-white dark:bg-[#1e1e1e] shadow-xl shadow-gray-100/50 dark:shadow-none overflow-hidden"
                    >
                         <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-400"></div>

                         {/* Header */}
                         <div className="px-6 pt-6 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                   <div className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <span className="material-symbols-outlined text-[18px]">menu_book</span>
                                   </div>
                                   <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Günün Ayeti</span>
                              </div>
                              <button className="size-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 transition-colors">
                                   <span className="material-symbols-outlined text-[20px]">bookmark_add</span>
                              </button>
                         </div>

                         {/* Content */}
                         <div className="p-6 pt-4 space-y-6">
                              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] group-hover:shadow-lg transition-all duration-500">
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                   <img
                                        alt="Ayet Görseli"
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        src="https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=1000&auto=format&fit=crop"
                                   />
                                   <div className="absolute bottom-4 right-4 z-20 max-w-[90%] text-right">
                                        <p className="text-white text-xl md:text-2xl leading-relaxed calligraphy drop-shadow-md" dir="rtl">
                                             {data.verse.content_ar}
                                        </p>
                                   </div>
                              </div>

                              <div className="space-y-3">
                                   <h3 className="text-emerald-700 dark:text-emerald-400 font-bold text-sm flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        {data.verse.surah_name} Suresi, {data.verse.verse_number}. Ayet
                                   </h3>
                                   <p className="text-[#141514] dark:text-gray-100 text-lg font-medium leading-[1.7] font-serif">
                                        "{data.verse.content_tr}"
                                   </p>
                              </div>
                         </div>

                         {/* Actions */}
                         <div className="px-6 pb-6 pt-2 flex items-center justify-between">
                              <button className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity uppercase tracking-wider">
                                   Tefsirini Oku
                                   <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                              </button>
                              <Link
                                   to="/share"
                                   state={{
                                        text: `"${data.verse.content_tr}"`,
                                        source: `${data.verse.surah_name} Suresi, ${data.verse.verse_number}. Ayet`
                                   }}
                                   className="size-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors"
                              >
                                   <span className="material-symbols-outlined text-[20px]">share</span>
                              </Link>
                         </div>
                    </motion.article>
               )}

               {/* Günün Hadisi Kartı - Klasik/Minimalist */}
               {data.hadith && (
                    <motion.article
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.1 }}
                         className="relative rounded-[2rem] bg-[#FDFBF7] dark:bg-[#252525] border border-[#e3e1dd] dark:border-white/5 p-8 shadow-sm"
                    >
                         <div className="absolute top-6 left-6 opacity-5">
                              <span className="material-symbols-outlined text-8xl text-[#C5A059]">format_quote</span>
                         </div>

                         <div className="relative z-10 space-y-6">
                              <div className="flex items-center justify-center">
                                   <span className="px-4 py-1.5 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.2em]">Hadis-i Şerif</span>
                              </div>

                              <div className="text-center space-y-6">
                                   <p className="text-xl md:text-2xl text-[#141514] dark:text-white font-serif leading-[1.8] italic">
                                        "{data.hadith.content}"
                                   </p>
                                   <div className="flex items-center justify-center gap-3">
                                        <div className="h-px w-12 bg-[#C5A059]/30"></div>
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{data.hadith.source}</p>
                                        <div className="h-px w-12 bg-[#C5A059]/30"></div>
                                   </div>
                              </div>

                              <div className="flex justify-center pt-2">
                                   <Link
                                        to="/share"
                                        state={{
                                             text: `"${data.hadith.content}"`,
                                             source: data.hadith.source
                                        }}
                                        className="size-10 rounded-full border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all"
                                   >
                                        <span className="material-symbols-outlined text-[20px]">share</span>
                                   </Link>
                              </div>
                         </div>
                    </motion.article>
               )}

               {/* Esma-ül Hüsna Kartı - Premium/Gradient */}
               {data.nameOfAllah && (
                    <motion.article
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.2 }}
                         className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1B2B1A] to-[#2D5A27] shadow-xl shadow-green-900/20"
                    >
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                         <div className="relative z-10 p-8 flex flex-col items-center text-center gap-6">
                              <div className="size-20 rounded-full border-2 border-[#C5A059]/30 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-inner">
                                   <span className="text-4xl text-white calligraphy pt-2">{data.nameOfAllah.name_ar}</span>
                              </div>

                              <div className="space-y-2">
                                   <h3 className="text-3xl font-bold text-[#C5A059] font-serif tracking-wide">{data.nameOfAllah.name_tr}</h3>
                                   <p className="text-white/90 font-medium">{data.nameOfAllah.meaning}</p>
                              </div>

                              <p className="text-xs text-white/60 leading-relaxed max-w-[90%] border-t border-white/10 pt-4 mt-2">
                                   {data.nameOfAllah.description}
                              </p>
                         </div>
                    </motion.article>
               )}

               {/* İlmihal Kartı - Bilgi Odaklı */}
               {data.ilmihal && (
                    <motion.section
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.3 }}
                         className="bg-sky-50 dark:bg-sky-900/10 rounded-[2rem] p-1 border border-sky-100 dark:border-sky-800/30"
                    >
                         <div className="bg-white dark:bg-[#1a1c1a] rounded-[1.8rem] overflow-hidden">
                              <details className="group">
                                   <summary className="flex cursor-pointer items-start gap-4 p-6 list-none select-none hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <div className="size-10 rounded-2xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-1">
                                             <span className="material-symbols-outlined">help</span>
                                        </div>
                                        <div className="flex-1">
                                             <div className="flex items-center justify-between mb-1">
                                                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-500">Günlük İlmihal</span>
                                                  <span className="material-symbols-outlined text-gray-300 group-open:rotate-180 transition-transform">expand_more</span>
                                             </div>
                                             <h4 className="text-base font-bold text-[#141514] dark:text-white leading-snug">
                                                  {data.ilmihal.question}
                                             </h4>
                                        </div>
                                   </summary>
                                   <div className="px-6 pb-6 pt-0 ml-[3.5rem]">
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                             {data.ilmihal.answer}
                                        </p>
                                        <Link to="/categories" className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider hover:opacity-80">
                                             Detaylı Bilgi
                                             <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                        </Link>
                                   </div>
                              </details>
                         </div>
                    </motion.section>
               )}

               {/* Bottom Spacer */}
               <div className="h-6"></div>
          </div>
     )
}

export default Home
