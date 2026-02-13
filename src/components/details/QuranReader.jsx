import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import { toggleFavorite, isFavorite } from '../../services/favoriteService'
import { toast } from 'react-hot-toast'

const QuranReader = () => {
     const navigate = useNavigate()
     const location = useLocation()
     const { user } = useAuth()
     const { scrollYProgress } = useScroll()
     const scaleX = useSpring(scrollYProgress, {
          stiffness: 100,
          damping: 30,
          restDelta: 0.001
     })

     const [verses, setVerses] = useState([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState(null)
     const [fontSize, setFontSize] = useState(20)
     const [selectedVerse, setSelectedVerse] = useState(null)
     const [isSaved, setIsSaved] = useState(false)
     const [saveLoading, setSaveLoading] = useState(false)
     const [viewMode, setViewMode] = useState(() => localStorage.getItem('quranViewMode') || 'both')
     const verseRefs = useRef({})

     const surahNumber = location.state?.surahNumber || 36
     const surahName = location.state?.surahName || 'Yasin'

     const viewModes = [
          { key: 'arabic', label: 'Arapça' },
          { key: 'turkish', label: 'Meal' },
          { key: 'both', label: 'Her ikisi' }
     ]

     useEffect(() => {
          fetchVerses()
          checkFavorite()
     }, [surahNumber, user])

     const fetchVerses = async () => {
          try {
               setLoading(true)
               const { data, error: fetchError } = await supabase
                    .from('verses')
                    .select('*')
                    .eq('surah_number', surahNumber)
                    .order('verse_number', { ascending: true })

               if (fetchError) throw fetchError
               setVerses(data || [])
          } catch (err) {
               console.error('Ayetler çekilirken hata:', err)
               setError('Ayetler yüklenirken bir hata oluştu.')
          } finally {
               setLoading(false)
          }
     }

     const checkFavorite = async () => {
          if (user) {
               const favorited = await isFavorite(user.id, `quran-${surahNumber}`, 'Ayetler')
               setIsSaved(favorited)
          }
     }

     const handleSave = async () => {
          if (!user) {
               toast.error('İçeriği kaydetmek için giriş yapmalısınız.')
               return
          }

          setSaveLoading(true)
          const { action, error } = await toggleFavorite(user.id, {
               content_id: `quran-${surahNumber}`,
               content_type: 'Ayetler',
               meta_data: { 
                    title: `${surahName} Suresi`, 
                    totalVerses: verses.length,
                    surahNumber
               }
          })
          setSaveLoading(false)

          if (error) {
               toast.error('Bir hata oluştu.')
          } else {
               setIsSaved(action === 'added')
               toast.success(action === 'added' ? 'Favorilerinize eklendi.' : 'Favorilerinizden çıkarıldı.')
          }
     }

     const handleShare = () => {
          const shareText = verses.slice(0, 3).map(v => 
               `${v.verse_number}. ${v.content_tr}`
          ).join('\n\n')
          
          navigate('/share', {
               state: {
                    text: shareText,
                    source: `${surahName} Suresi - ${verses.length} Ayet`,
                    arabic: verses[0]?.content_ar || ''
               }
          })
     }

     const scrollToVerse = (verseNumber) => {
           const element = verseRefs.current[verseNumber]
           if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setSelectedVerse(verseNumber)
                setTimeout(() => setSelectedVerse(null), 2000)
           }
     }

     const handleViewModeChange = (mode) => {
           setViewMode(mode)
           localStorage.setItem('quranViewMode', mode)
     }

     if (loading) {
          return (
               <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
                    <div className="flex flex-col items-center gap-4">
                         <div className="w-12 h-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin"></div>
                         <p className="text-sm text-text-secondary dark:text-gray-400">Ayetler yükleniyor...</p>
                    </div>
               </div>
          )
     }

     if (error) {
          return (
               <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
                    <div className="text-center px-6">
                         <span className="material-symbols-outlined text-6xl text-accent-gold/50 mb-4">error</span>
                         <p className="text-text-secondary dark:text-gray-400">{error}</p>
                         <button 
                              onClick={() => navigate(-1)}
                              className="mt-4 px-6 py-2 bg-accent-gold text-white rounded-full text-sm"
                         >
                              Geri Dön
                         </button>
                    </div>
               </div>
          )
     }

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24 relative">
               {/* Progress Bar */}
               <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-accent-gold z-50 origin-left"
                    style={{ scaleX }}
               />

               {/* Header */}
               <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-primary dark:text-white">
                         <span className="material-symbols-outlined font-light">arrow_back</span>
                    </button>

                     <div className="flex items-center gap-2">
                          <select 
                               onChange={(e) => scrollToVerse(Number(e.target.value))}
                               className="bg-transparent border border-gray-200 dark:border-white/10 rounded-full px-3 py-1 text-xs font-medium text-primary dark:text-white focus:outline-none focus:border-accent-gold"
                               value=""
                          >
                               <option value="">Ayet (1-10)</option>
                               {verses.slice(0, 10).map(v => (
                                    <option key={v.verse_number} value={v.verse_number}>
                                         {v.verse_number}. Ayet
                                    </option>
                               ))}
                          </select>

                         <button
                              onClick={() => setFontSize(prev => Math.max(16, prev - 2))}
                              className="size-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-primary dark:text-white"
                         >
                              <span className="text-xs font-bold">A-</span>
                         </button>
                         <button
                              onClick={() => setFontSize(prev => Math.min(36, prev + 2))}
                              className="size-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-primary dark:text-white"
                         >
                              <span className="text-lg font-bold">A+</span>
                         </button>
                    </div>
               </header>

                {/* Hero Section */}
                <section className="px-6 pt-6 pb-4 text-center">
                     <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                     >
                          <p className="text-[10px] font-bold uppercase tracking-widest text-accent-gold mb-2">Kur'an-ı Kerim</p>
                          <h1 className="text-3xl font-bold text-primary dark:text-accent-gold mb-2">{surahName} Suresi</h1>
                          <div className="flex items-center justify-center gap-3 mb-4">
                               <div className="h-px w-8 bg-accent-gold/30"></div>
                               <span className="text-xs text-text-secondary dark:text-gray-400 font-bold">{verses.length} Ayet</span>
                               <div className="h-px w-8 bg-accent-gold/30"></div>
                          </div>
                          
                          {/* View Mode Toggle */}
                          <div className="flex justify-center">
                               <div className="inline-flex gap-1 p-1 bg-gray-100 dark:bg-white/10 rounded-full">
                                    {viewModes.map((mode) => (
                                         <button
                                              key={mode.key}
                                              onClick={() => handleViewModeChange(mode.key)}
                                              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                                                   viewMode === mode.key 
                                                        ? 'bg-accent-gold text-white shadow-md' 
                                                        : 'text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white'
                                              }`}
                                         >
                                              {mode.label}
                                         </button>
                                    ))}
                               </div>
                          </div>
                     </motion.div>
                </section>

                {/* Verses List */}
                <main className="px-4 sm:px-6 space-y-4">
                     {/* ARAPÇA MODE - Tüm ayetler bitişik, Kuran gibi */}
                     {viewMode === 'arabic' && (
                          <motion.div
                               initial={{ opacity: 0, y: 20 }}
                               animate={{ opacity: 1, y: 0 }}
                               className="p-6 sm:p-8 rounded-2xl bg-[#f7f7f0] dark:bg-[#1a1f1a] border border-accent-gold/20 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
                          >
                               <p 
                                    className="text-right text-accent-green dark:text-accent-gold leading-[2.5] sm:leading-[3] calligraphy select-all"
                                    style={{ fontSize: Math.max(22, fontSize * 1.3) + 'px' }}
                               >
                                    {verses.map((verse, index) => (
                                         <span key={verse.verse_number} className="inline">
                                              <sup className="text-xs text-accent-gold mr-1">{verse.verse_number}</sup>
                                              {verse.content_ar}
                                              {index < verses.length - 1 && <span className="text-accent-gold mx-1">۝</span>}
                                         </span>
                                    ))}
                               </p>
                          </motion.div>
                     )}

                     {/* MEAL MODE - Her ayet ayrı, numarasız */}
                     {viewMode === 'turkish' && (
                          <AnimatePresence>
                               {verses.map((verse, index) => (
                                    <motion.div
                                         key={verse.id || verse.verse_number}
                                         ref={(el) => (verseRefs.current[verse.verse_number] = el)}
                                         initial={{ opacity: 0, y: 20 }}
                                         animate={{ 
                                              opacity: 1, 
                                              y: 0,
                                              backgroundColor: selectedVerse === verse.verse_number 
                                                   ? 'rgba(197, 160, 89, 0.1)' 
                                                   : 'transparent'
                                         }}
                                         transition={{ delay: index * 0.02 }}
                                         className="relative p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#1f291e]/50 border border-gray-100 dark:border-white/5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
                                    >
                                         {/* Turkish only - no verse number on right */}
                                         <p 
                                              className="text-text-primary dark:text-gray-200 leading-relaxed font-display text-justify"
                                              style={{ fontSize: fontSize + 'px' }}
                                         >
                                              {verse.content_tr}
                                         </p>
                                    </motion.div>
                               ))}
                          </AnimatePresence>
                     )}

                     {/* HER İKİSİ MODE - Mevcut hali */}
                     {viewMode === 'both' && (
                          <AnimatePresence>
                               {verses.map((verse, index) => (
                                    <motion.div
                                         key={verse.id || verse.verse_number}
                                         ref={(el) => (verseRefs.current[verse.verse_number] = el)}
                                         initial={{ opacity: 0, y: 20 }}
                                         animate={{ 
                                              opacity: 1, 
                                              y: 0,
                                              backgroundColor: selectedVerse === verse.verse_number 
                                                   ? 'rgba(197, 160, 89, 0.1)' 
                                                   : 'transparent'
                                         }}
                                         transition={{ delay: index * 0.02 }}
                                         className="relative p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#1f291e]/50 border border-gray-100 dark:border-white/5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
                                    >
                                         {/* Verse Number */}
                                         <div className="absolute top-3 right-3 size-8 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold font-bold text-xs">
                                              {verse.verse_number}
                                         </div>

                                         {/* Arabic */}
                                         <div className="pr-10 mb-4">
                                              <p 
                                                   className="text-right text-accent-green dark:text-accent-gold leading-[2.2] sm:leading-[2.5] calligraphy select-all"
                                                   style={{ fontSize: Math.max(20, fontSize * 1.3) + 'px' }}
                                              >
                                                   {verse.content_ar}
                                              </p>
                                         </div>

                                         {/* Turkish */}
                                         <div className="border-t border-gray-100 dark:border-white/5 pt-4">
                                              <div className="flex items-start gap-3">
                                                   <span className="mt-1 text-accent-gold/50 text-xs font-bold">{verse.verse_number}.</span>
                                                   <p 
                                                        className="text-text-primary dark:text-gray-200 leading-relaxed font-display text-justify flex-1"
                                                        style={{ fontSize: fontSize + 'px' }}
                                                   >
                                                        {verse.content_tr}
                                                   </p>
                                              </div>
                                         </div>
                                    </motion.div>
                               ))}
                          </AnimatePresence>
                     )}
                </main>

               {/* Footer Actions */}
               <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light/95 to-transparent dark:from-background-dark dark:via-background-dark/95">
                    <div className="flex items-center justify-between max-w-lg mx-auto">
                         <button
                              onClick={handleShare}
                              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-primary dark:text-white transition-all hover:bg-black/5 active:scale-95 shadow-sm"
                         >
                              <span className="material-symbols-outlined text-xl">ios_share</span>
                              <span className="text-xs font-bold uppercase tracking-widest">Paylaş</span>
                         </button>
                         <button
                              onClick={handleSave}
                              disabled={saveLoading}
                              className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 ${isSaved
                                   ? 'bg-white dark:bg-white/10 text-accent-gold border border-accent-gold/30'
                                   : 'bg-accent-gold text-white shadow-accent-gold/20'
                              }`}
                         >
                              {saveLoading ? (
                                   <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                   <span className={`material-symbols-outlined text-xl ${isSaved ? 'fill-1' : ''}`}>
                                        {isSaved ? 'bookmark_added' : 'bookmark'}
                                   </span>
                              )}
                              <span className="text-xs uppercase tracking-widest">{isSaved ? 'Kaydedildi' : 'Kaydet'}</span>
                         </button>
                    </div>
               </div>
          </div>
     )
}

export default QuranReader
