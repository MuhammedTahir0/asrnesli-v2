import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import PrayerHero from './home/PrayerHero'
import { offlineStorage } from '../services/offlineStorage'
import { notificationService } from '../services/notificationService'
import { StoryCard, DuaCard, WisdomCard, ChecklistCard, InfoCard } from './home/ContentCards'

import { haptic } from '../utils/haptic'
import { toast } from 'react-hot-toast'

const HomeSkeleton = () => (
     <div className="flex flex-col gap-6 animate-pulse">
          {/* Hero Skeleton */}
          <div className="h-[250px] w-full rounded-[3rem] bg-gray-200 dark:bg-white/5 relative overflow-hidden">
               <div className="absolute inset-0 animate-shimmer" />
          </div>
          {/* Cards Skeleton */}
          {[1, 2, 3].map(i => (
               <div key={i} className="h-48 w-full rounded-[2.5rem] bg-gray-100 dark:bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer" />
                    <div className="p-8 space-y-4">
                         <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded" />
                         <div className="h-8 w-full bg-gray-200 dark:bg-white/10 rounded" />
                         <div className="h-4 w-2/3 bg-gray-200 dark:bg-white/10 rounded" />
                    </div>
               </div>
          ))}
     </div>
)

const Home = () => {
     const navigate = useNavigate()
     const { user, profile, refreshProfile } = useAuth()
     const [data, setData] = useState({
          verse: null,
          hadith: null,
          ilmihal: null,
          nameOfAllah: null,
          story: null,
          prayer: null,
          wisdom: null,
          info: null,
          checklist: [],
          completedTaskIds: []
     })
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState(null)
     const [refreshing, setRefreshing] = useState(false)
     const [visibility, setVisibility] = useState({
          verse: true,
          hadith: true,
          ilmihal: true,
          names_of_allah: true,
          story: true,
          prayer: true,
          wisdom: true,
          checklist: true,
          religious_info: true
     })

     const fetchUserSettings = async () => {
          try {
               const { data: { user } } = await supabase.auth.getUser()
               if (!user) return

               const { data, error } = await supabase
                    .from('user_settings')
                    .select('dashboard_visibility')
                    .eq('user_id', user.id)
                    .single()

               if (data?.dashboard_visibility) {
                    setVisibility(prev => ({
                         ...prev,
                         ...data.dashboard_visibility
                    }))
               }
          } catch (err) {
               console.error('Settings fetch error:', err)
          }
     }

     const fetchDailyContent = async () => {
          try {
               setLoading(true)
               setError(null)

               // Ayarları da getir
               await fetchUserSettings()

               const today = new Date().toISOString().split('T')[0]

               const { data: dailyList, error: dailyError } = await supabase
                    .from('daily_content')
                    .select(`
                         *,
                         verse:verses(*),
                         hadith:hadiths(*),
                         ilmihal:ilmihals(*),
                         nameOfAllah:names_of_allah(*),
                         story:stories(*),
                         prayer:prayers(*),
                         wisdom:wisdom_notes(*),
                         info:religious_info(*)
                    `)
                    .eq('display_date', today)
                    .limit(1)

               // Bugünün tamamlanan görevlerini çek
               let completedTaskIds = []
               if (user) {
                    const { data: completions } = await supabase
                         .from('user_checklist_completions')
                         .select('task_id')
                         .eq('user_id', user.id)
                         .eq('completion_date', today)

                    if (completions) {
                         completedTaskIds = completions.map(c => c.task_id)
                    }
               }

               if (dailyList && dailyList.length > 0) {
                    const daily = dailyList[0]
                    const now = new Date();
                    const hours = now.getHours();
                    let period = 'sabah';
                    if (hours >= 12 && hours < 16) period = 'ogle';
                    else if (hours >= 16 && hours < 19) period = 'ikindi';
                    else if (hours >= 19 && hours < 22) period = 'aksam';
                    else if (hours >= 22 || hours < 5) period = 'yatsi';

                    const { data: vaktinData } = await supabase
                         .from('prayer_time_content')
                         .select('*')
                         .eq('period', period)
                         .limit(1)
                         .single();

                    const { data: checklistData } = await supabase
                         .from('daily_checklists')
                         .select('*')
                         .limit(10) // 5 yerine 10 çeksizn

                    setData(prev => ({
                         ...prev,
                         verse: daily.verse,
                         hadith: daily.hadith,
                         ilmihal: daily.ilmihal,
                         nameOfAllah: daily.nameOfAllah,
                         story: daily.story,
                         prayer: daily.prayer,
                         wisdom: daily.wisdom,
                         info: daily.info,
                         vaktinIcerigi: vaktinData,
                         checklist: checklistData || [],
                         completedTaskIds
                    }))
               } else {
                    const { data: latestList } = await supabase
                         .from('daily_content')
                         .select(`
                               *,
                               verse:verses(*),
                               hadith:hadiths(*),
                               ilmihal:ilmihals(*),
                               nameOfAllah:names_of_allah(*),
                               story:stories(*),
                               prayer:prayers(*),
                               wisdom:wisdom_notes(*),
                               info:religious_info(*)
                          `)
                         .order('display_date', { ascending: false })
                         .limit(1)

                    const { data: checklistData } = await supabase
                         .from('daily_checklists')
                         .select('*')
                         .limit(10)

                    if (latestList && latestList.length > 0) {
                         const latest = latestList[0]
                         setData(prev => ({
                              ...prev,
                              verse: latest.verse,
                              hadith: latest.hadith,
                              ilmihal: latest.ilmihal,
                              nameOfAllah: latest.nameOfAllah,
                              story: latest.story,
                              prayer: latest.prayer,
                              wisdom: latest.wisdom,
                              info: latest.info,
                              vaktinIcerigi: null,
                              checklist: checklistData || [],
                              completedTaskIds
                         }))
                    }
               }
          } catch (err) {
               console.error('Fetch error:', err)
               const cachedData = offlineStorage.getDailyContent()
               if (cachedData) setData(cachedData)
          } finally {
               setLoading(false)
               setRefreshing(false)
          }
     }

     useEffect(() => {
          fetchDailyContent()
          notificationService.requestPermission()
     }, [])

     const handleRefresh = async () => {
          setRefreshing(true)
          await fetchDailyContent()
     }

     const handleChecklistToggle = async (task) => {
          if (!user) {
               toast.error('Lütfen giriş yapın');
               return;
          }

          try {
               const { data: result, error } = await supabase.rpc('toggle_checklist_item', {
                    p_user_id: user.id,
                    p_task_id: task.id,
                    p_points: task.points
               });

               if (error) throw error;

               if (result.status === 'added') {
                    toast.success(`${task.points} Puan Kazanıldı!`, {
                         icon: '✨',
                         style: { borderRadius: '1rem', background: '#0a9396', color: '#fff' }
                    });
                    setData(prev => ({
                         ...prev,
                         completedTaskIds: [...prev.completedTaskIds, task.id]
                    }))
               } else {
                    toast.success('Geri Alındı');
                    setData(prev => ({
                         ...prev,
                         completedTaskIds: prev.completedTaskIds.filter(id => id !== task.id)
                    }))
               }

               // Profil ve tokenları yenile (AuthContext üzerinden)
               // (useAuth içerisinde refreshProfile metodumuz var)
               if (typeof refreshProfile === 'function') {
                    await refreshProfile();
               }

          } catch (err) {
               console.error('Toggle error:', err);
               toast.error('İşlem başarısız oldu');
          }
     }

     if (loading && !refreshing) return (
          <div className="min-h-screen bg-background-light dark:bg-background-dark p-6">
               <HomeSkeleton />
          </div>
     )

     if (error) {
          return (
               <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <p className="text-red-500 font-medium">{error}</p>
               </div>
          )
     }

     return (
          <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar pb-28 px-5 sm:px-6 space-y-8 h-full">
               {/* Pull to Refresh Indicator */}
               {refreshing && (
                    <motion.div
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 60, opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="flex items-center justify-center overflow-hidden"
                    >
                         <div className="size-8 border-3 border-accent-gold border-t-transparent rounded-full animate-spin" />
                    </motion.div>
               )}
               {/* Selamlama Bölümü */}
               <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center pt-8 pb-4 gap-3 text-center"
               >
                    <div className="w-full relative mb-1 flex justify-center items-center">
                         <h1 className="text-accent-green dark:text-primary calligraphy select-none drop-shadow-sm py-2 text-center whitespace-nowrap" dir="rtl" style={{ fontSize: 'clamp(1.5rem, 5.5vw, 2.75rem)', lineHeight: '2' }}>
                              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                         </h1>
                    </div>
                    <div className="space-y-1">
                         <h2 className="text-2xl font-bold text-primary dark:text-accent-gold tracking-tight">Hoş Geldiniz</h2>
                         <p className="text-text-secondary dark:text-gray-400 text-[10px] font-bold tracking-widest uppercase">Gününüz Hayırlı Olsun</p>
                    </div>
               </motion.div>

               {/* Ezan Geri Sayım Hero */}
               <PrayerHero />

               {/* Günün Ayeti Kartı */}
               {visibility.verse && data.verse && (
                    <motion.article
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="group relative rounded-[2.5rem] bg-surface-light dark:bg-surface-dark shadow-soft border border-accent-gold/20 overflow-hidden"
                    >
                         <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent-green via-accent-gold to-accent-green opacity-80"></div>

                         {/* Header */}
                         <div className="px-6 pt-6 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                   <div className="size-8 rounded-xl bg-accent-green/10 dark:bg-accent-gold/20 flex items-center justify-center text-accent-green dark:text-accent-gold">
                                        <span className="material-symbols-outlined text-[18px] font-bold">menu_book</span>
                                   </div>
                                   <span className="text-[10px] font-bold uppercase tracking-widest text-accent-green dark:text-accent-gold">Günün Ayeti</span>
                              </div>
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
                                   <h3 className="text-accent-green dark:text-accent-gold font-bold text-[11px] flex items-center gap-2 uppercase tracking-wider">
                                        <span className="w-2 h-2 rounded-full bg-accent-gold shadow-sm"></span>
                                        {data.verse.surah_name} Suresi • {data.verse.verse_number}. Ayet
                                   </h3>
                                   <p className="text-[#141514] dark:text-accent-gold/90 text-lg font-medium leading-[1.7] font-serif">
                                        "{data.verse.content_tr}"
                                   </p>
                              </div>
                         </div>

                         {/* Actions */}
                         <div className="px-6 pb-6 pt-2 flex items-center justify-between">
                              <button className="flex items-center gap-2 text-xs font-bold text-accent-green dark:text-primary hover:opacity-80 transition-opacity uppercase tracking-wider">
                                   Tefsirini Oku
                                   <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                              </button>
                              <Link
                                   to="/share"
                                   state={{
                                        text: `"${data.verse.content_tr}"`,
                                        source: `${data.verse.surah_name} Suresi, ${data.verse.verse_number}. Ayet`
                                   }}
                                   className="size-10 rounded-full border border-accent-gold/30 flex items-center justify-center text-accent-gold hover:bg-accent-gold hover:text-white transition-all"
                              >
                                   <span className="material-symbols-outlined text-[20px]">share</span>
                              </Link>
                         </div>
                    </motion.article>
               )}

               {/* Günün Hadisi Kartı */}
               {visibility.hadith && data.hadith && (
                    <motion.article
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.1 }}
                         className="relative rounded-[2.5rem] bg-surface-light dark:bg-surface-dark border border-accent-gold/20 p-8 shadow-soft overflow-hidden"
                    >
                         <div className="absolute top-6 left-6 opacity-5">
                              <span className="material-symbols-outlined text-8xl text-accent-gold">format_quote</span>
                         </div>

                         <div className="relative z-10 space-y-6">
                              <div className="flex items-center justify-center">
                                   <span className="px-4 py-1.5 rounded-full border border-accent-gold/20 bg-accent-gold/5 text-accent-gold text-[10px] font-bold uppercase tracking-widest">Hadis-i Şerif</span>
                              </div>

                              <div className="text-center space-y-6 px-4">
                                   <p className="text-xl md:text-2xl text-primary dark:text-accent-gold font-serif leading-[1.8] italic font-medium">
                                        "{data.hadith.content}"
                                   </p>
                                   <div className="flex items-center justify-center gap-4">
                                        <div className="h-px flex-1 bg-accent-gold/30"></div>
                                        <p className="text-[10px] font-bold text-text-secondary dark:text-accent-gold/60 uppercase tracking-widest whitespace-nowrap">{data.hadith.source}</p>
                                        <div className="h-px flex-1 bg-accent-gold/30"></div>
                                   </div>
                              </div>

                              <div className="flex justify-center pt-2">
                                   <Link
                                        to="/share"
                                        state={{
                                             text: `"${data.hadith.content}"`,
                                             source: data.hadith.source
                                        }}
                                        className="size-10 rounded-full border border-accent-gold/30 flex items-center justify-center text-accent-gold hover:bg-accent-gold hover:text-white transition-all"
                                   >
                                        <span className="material-symbols-outlined text-[20px]">share</span>
                                   </Link>
                              </div>
                         </div>
                    </motion.article>
               )}

               {/* Esma-ül Hüsna Kartı */}
               {visibility.names_of_allah && data.nameOfAllah && (
                    <motion.article
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.2 }}
                         className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0d1a0d] to-primary shadow-xl shadow-primary/20"
                    >
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                         <div className="relative z-10 p-8 flex flex-col items-center text-center gap-6">
                              <div className="size-20 rounded-full border-2 border-accent-gold/30 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-inner">
                                   <span className="text-4xl text-white calligraphy pt-2">{data.nameOfAllah.name_ar}</span>
                              </div>

                              <div className="space-y-2">
                                   <h3 className="text-3xl font-bold text-accent-gold font-serif tracking-wide">{data.nameOfAllah.name_tr}</h3>
                                   <p className="text-white/90 font-medium">{data.nameOfAllah.meaning}</p>
                              </div>

                              <p className="text-xs text-white/60 leading-relaxed max-w-[90%] border-t border-white/10 pt-4 mt-2">
                                   {data.nameOfAllah.description}
                              </p>

                              <div className="flex justify-center pt-2 w-full border-t border-white/5">
                                   <Link
                                        to="/share"
                                        state={{
                                             text: data.nameOfAllah.meaning + ' — ' + data.nameOfAllah.description,
                                             source: 'Esma-ül Hüsna: Ya ' + data.nameOfAllah.name_tr,
                                             arabic: data.nameOfAllah.name_ar
                                        }}
                                        className="size-10 rounded-full border border-accent-gold/30 flex items-center justify-center text-accent-gold hover:bg-accent-gold hover:text-white transition-all"
                                   >
                                        <span className="material-symbols-outlined text-[20px]">share</span>
                                   </Link>
                              </div>
                         </div>
                    </motion.article>
               )}

               {/* İlmihal Kartı */}
               {visibility.ilmihal && data.ilmihal && (
                    <motion.section
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.3 }}
                         className="bg-accent-gold/10 dark:bg-accent-gold/5 rounded-[2.5rem] p-1 border border-accent-gold/20"
                    >
                         <div className="bg-surface-light dark:bg-surface-dark rounded-[2.3rem] overflow-hidden">
                              <details className="group">
                                   <summary className="flex cursor-pointer items-start gap-4 p-6 list-none select-none hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <div className="size-10 rounded-2xl bg-accent-gold/10 flex items-center justify-center text-accent-gold shrink-0 mt-1">
                                             <span className="material-symbols-outlined">help</span>
                                        </div>
                                        <div className="flex-1">
                                             <div className="flex items-center justify-between mb-1">
                                                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Günlük İlmihal</span>
                                                  <span className="material-symbols-outlined text-accent-gold group-open:rotate-180 transition-transform">expand_more</span>
                                             </div>
                                             <h3 className="text-base font-bold text-primary dark:text-accent-gold leading-snug">
                                                  {data.ilmihal.question}
                                             </h3>
                                        </div>
                                   </summary>
                                   <div className="px-6 pb-6 pt-0 ml-[3.5rem]">
                                        <p className="text-primary/90 dark:text-accent-gold/90 text-sm leading-relaxed font-serif italic">
                                             {data.ilmihal.answer}
                                        </p>
                                        <Link to="/categories" className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-accent-gold uppercase tracking-wider hover:opacity-80">
                                             Detaylı Bilgi
                                             <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                        </Link>
                                   </div>
                              </details>
                         </div>
                    </motion.section>
               )}

               {/* YENİ KARTLAR (Expansion) */}
               {visibility.story && <StoryCard story={data.story} />}
               {visibility.prayer && <DuaCard prayer={data.prayer} />}
               {visibility.wisdom && <WisdomCard wisdom={data.wisdom} />}
               {visibility.checklist && (
                    <ChecklistCard
                         tasks={data.checklist}
                         completedIds={data.completedTaskIds}
                         onToggle={handleChecklistToggle}
                    />
               )}
               {visibility.religious_info && <InfoCard info={data.info} />}

               {/* Bottom Spacer */}
               <div className="h-6"></div>
          </div>
     )
}

export default Home
