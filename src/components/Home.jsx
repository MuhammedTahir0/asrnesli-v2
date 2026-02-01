import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

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
          <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar pb-24 px-4 sm:px-6">
               {/* Selamlama Bölümü */}
               <div className="flex flex-col items-center justify-center pt-8 pb-10 gap-4 text-center">
                    <div className="w-full max-w-[280px] h-16 relative mb-2">
                         <h1 className="text-4xl text-accent-green dark:text-primary leading-tight calligraphy select-none">
                              ﷽
                         </h1>
                    </div>
                    <div className="space-y-1">
                         <h2 className="text-2xl font-bold text-text-primary dark:text-white tracking-tight">Hoş Geldiniz</h2>
                         <p className="text-text-secondary dark:text-gray-400 text-sm italic">Gününüz bereketle dolsun.</p>
                    </div>
               </div>

               {/* Günün Ayeti Kartı */}
               {data.verse && (
                    <motion.article
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="group mb-6 relative overflow-hidden rounded-2xl bg-surface-light dark:bg-[#222] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] border border-accent-gold/10 transition-transform duration-300 hover:scale-[1.01]"
                    >
                         <div className="h-1.5 w-full bg-gradient-to-r from-accent-green/40 via-accent-green to-accent-green/40"></div>
                         <div className="p-6">
                              <div className="flex items-center justify-between mb-5">
                                   <div className="flex items-center gap-2">
                                        <span className="flex items-center justify-center size-8 rounded-full bg-accent-green/10 text-accent-green dark:text-primary">
                                             <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-accent-gold">Günün Ayeti</span>
                                   </div>
                                   <button className="text-text-secondary hover:text-accent-green transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                                   </button>
                              </div>
                              <div className="flex flex-col gap-4">
                                   <div className="w-full h-48 rounded-xl overflow-hidden relative">
                                        <div className="absolute inset-0 bg-accent-green/20 z-10"></div>
                                        <img
                                             alt="Huzurlu doğa manzarası"
                                             className="w-full h-full object-cover grayscale-[20%] opacity-90 transition-transform duration-700 group-hover:scale-105"
                                             src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/70 to-transparent">
                                             <p className="text-white text-right text-2xl font-serif leading-loose drop-shadow-md calligraphy">
                                                  {data.verse.content_ar}
                                             </p>
                                        </div>
                                   </div>
                                   <div className="space-y-3">
                                        <p className="text-accent-green dark:text-primary text-sm font-semibold">
                                             {data.verse.surah_name} Suresi, {data.verse.surah_number}:{data.verse.verse_number}
                                        </p>
                                        <p className="text-text-primary dark:text-gray-200 text-lg leading-relaxed font-medium">
                                             "{data.verse.content_tr}"
                                        </p>
                                   </div>
                              </div>
                         </div>
                         <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                              <button className="text-text-secondary hover:text-accent-green text-xs font-medium uppercase tracking-wide flex items-center gap-1">
                                   Tefsir Oku
                                   <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                              </button>
                              <Link to="/share" className="flex items-center justify-center size-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary transition-colors">
                                   <span className="material-symbols-outlined text-[20px]">share</span>
                              </Link>
                         </div>
                    </motion.article>
               )}

               {/* Günün Hadisi Kartı */}
               {data.hadith && (
                    <motion.article
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.1 }}
                         className="mb-6 rounded-2xl bg-surface-light dark:bg-[#222] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] border border-accent-gold/10 overflow-hidden"
                    >
                         <div className="p-6 flex flex-col gap-4">
                              <div className="flex items-center gap-2 mb-1">
                                   <span className="flex items-center justify-center size-8 rounded-full bg-accent-gold/10 text-accent-gold">
                                        <span className="material-symbols-outlined text-[18px]">format_quote</span>
                                   </span>
                                   <span className="text-xs font-bold uppercase tracking-wider text-accent-gold">Günün Hadisi</span>
                              </div>
                              <div className="relative pl-4 border-l-2 border-accent-gold/30">
                                   <p className="text-xl text-text-primary dark:text-white font-serif italic leading-relaxed">
                                        "{data.hadith.content}"
                                   </p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                   <p className="text-xs font-bold text-accent-green dark:text-primary uppercase tracking-wide">
                                        Kaynak: {data.hadith.source}
                                   </p>
                                   <Link to="/share" className="text-text-secondary hover:text-accent-gold transition-colors p-2 rounded-full hover:bg-background-light dark:hover:bg-white/5">
                                        <span className="material-symbols-outlined text-[20px]">ios_share</span>
                                   </Link>
                              </div>
                         </div>
                    </motion.article>
               )}

               {/* İlmihal Bölümü */}
               {data.ilmihal && (
                    <section className="mb-6">
                         <div className="flex items-center justify-between mb-3 px-1">
                              <h3 className="text-lg font-bold text-text-primary dark:text-white">Günlük İlmihal</h3>
                              <Link to="/categories" className="text-xs text-accent-gold font-medium hover:underline">Tümünü Gör</Link>
                         </div>
                         <div className="rounded-2xl bg-surface-light dark:bg-[#222] shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] border border-accent-gold/10 overflow-hidden">
                              <details className="group open:bg-background-light dark:open:bg-[#1a1a1a] transition-colors duration-300">
                                   <summary className="flex cursor-pointer items-center justify-between p-5 list-none select-none">
                                        <div className="flex items-center gap-3">
                                             <span className="flex items-center justify-center size-10 rounded-full bg-background-light dark:bg-white/5 text-accent-green dark:text-primary shrink-0">
                                                  <span className="material-symbols-outlined">help_center</span>
                                             </span>
                                             <span className="text-text-primary dark:text-white font-medium text-base">{data.ilmihal.question}</span>
                                        </div>
                                        <span className="material-symbols-outlined text-text-secondary transition-transform duration-300 group-open:rotate-180">expand_more</span>
                                   </summary>
                                   <div className="px-5 pb-5 pt-0 ml-[3.25rem]">
                                        <p className="text-text-secondary dark:text-gray-300 text-sm leading-relaxed border-l border-accent-gold/20 pl-4 py-1">
                                             {data.ilmihal.answer}
                                        </p>
                                        <Link to="/categories" className="inline-block mt-3 text-xs font-bold text-accent-green dark:text-primary uppercase tracking-wide hover:underline">Tamamını Oku</Link>
                                   </div>
                              </details>
                         </div>
                    </section>
               )}

               {/* Esma-ül Hüsna Kartı */}
               {data.nameOfAllah && (
                    <article className="mb-6 relative rounded-2xl bg-accent-green dark:bg-[#1f3a1d] text-white shadow-lg overflow-hidden">
                         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                         <div className="relative z-10 p-6 flex flex-row items-center justify-between gap-6">
                              <div className="flex-1">
                                   <span className="inline-block px-2 py-1 rounded bg-white/20 text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-sm text-white">Allah'ın Güzel İsimleri</span>
                                   <h3 className="text-3xl font-bold mb-1 font-serif text-accent-gold">{data.nameOfAllah.name_tr}</h3>
                                   <p className="text-white/90 text-sm font-light">{data.nameOfAllah.meaning}</p>
                                   <p className="mt-3 text-white/80 text-xs leading-relaxed line-clamp-2">
                                        {data.nameOfAllah.description}
                                   </p>
                              </div>
                              <div className="shrink-0 flex items-center justify-center size-24 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                                   <p className="text-4xl text-white calligraphy pt-2">{data.nameOfAllah.name_ar}</p>
                              </div>
                         </div>
                    </article>
               )}

               <div className="h-4"></div>
          </div>
     )
}

export default Home
