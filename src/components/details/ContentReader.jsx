import React, { useState, useEffect } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { toggleFavorite, isFavorite } from '../../services/favoriteService'
import { toast } from 'react-hot-toast'

const ContentReader = () => {
     const navigate = useNavigate()
     const location = useLocation()
     const { user } = useAuth()
     const { scrollYProgress } = useScroll()
     const scaleX = useSpring(scrollYProgress, {
          stiffness: 100,
          damping: 30,
          restDelta: 0.001
     })

     const [fontSize, setFontSize] = useState(18)
     const [isSaved, setIsSaved] = useState(false)
     const [saveLoading, setSaveLoading] = useState(false)

     const { id, title, subtitle, content, arabic, source } = location.state || {
          id: null,
          title: 'İçerik Başlığı',
          subtitle: 'Kategori',
          content: 'Lütfen bir içerik seçiniz.',
          arabic: '',
          source: ''
     }

     // Favori durumunu kontrol et
     useEffect(() => {
          const checkFavorite = async () => {
               if (user && id) {
                    const favorited = await isFavorite(user.id, id, subtitle)
                    setIsSaved(favorited)
               }
          }
          checkFavorite()
     }, [user, id, subtitle])

     const handleSave = async () => {
          if (!user) {
               toast.error('İçeriği kaydetmek için giriş yapmalısınız.')
               return
          }

          if (!id) {
               toast.error('Bu içerik şu an kaydedilemiyor.')
               return
          }

          setSaveLoading(true)
          const { action, error } = await toggleFavorite(user.id, {
               content_id: id,
               content_type: subtitle,
               meta_data: { title, arabic, source, content }
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
          navigate('/share', {
               state: {
                    text: content,
                    source: `${title}${source ? ' — ' + source : ''}`,
                    arabic: arabic
               }
          })
     }

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24 relative">
               {/* Progress Bar */}
               <motion.div
                    className="fixed top-0 left-0 right-0 h-1 bg-accent-gold z-50 origin-left"
                    style={{ scaleX }}
               />

               {/* Header Controls */}
               <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-primary">
                         <span className="material-symbols-outlined font-light">arrow_back</span>
                    </button>

                    <div className="flex items-center gap-2">
                         <button
                              onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                              className="size-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-primary-dark"
                         >
                              <span className="text-xs font-bold">A-</span>
                         </button>
                         <button
                              onClick={() => setFontSize(prev => Math.min(32, prev + 2))}
                              className="size-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-primary-dark"
                         >
                              <span className="text-lg font-bold">A+</span>
                         </button>
                    </div>
               </header>

               {/* Meta Info Area */}
               <section className="px-8 pt-8 pb-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.02] bg-islamic-pattern scale-150 pointer-events-none"></div>
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8 }}
                    >
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold mb-3 opacity-90">{subtitle}</p>
                         <h1 className="text-2xl md:text-4xl font-bold text-primary dark:text-white mb-2 leading-tight">{title}</h1>
                         <div className="flex items-center justify-center gap-3">
                              <div className="h-px w-8 bg-accent-gold/30"></div>
                              <span className="text-[10px] sm:text-xs text-text-secondary font-medium italic">{source}</span>
                              <div className="h-px w-8 bg-accent-gold/30"></div>
                         </div>
                    </motion.div>
               </section>

               {/* Reading Content */}
               <main className="px-6 sm:px-8 space-y-8 sm:space-y-12">
                    {/* Arabic Section (Optional) */}
                    {arabic && (
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-accent-green/5 dark:bg-white/5 border border-accent-gold/10 relative group"
                         >
                              <div className="absolute top-6 left-6 opacity-10">
                                   <span className="material-symbols-outlined text-3xl sm:text-4xl text-accent-gold">script</span>
                              </div>
                              <p
                                   className="text-center text-accent-green dark:text-primary leading-[2.5] sm:leading-[3] calligraphy select-all transition-all"
                                   style={{ fontSize: Math.max(24, fontSize * 1.5) + 'px' }}
                              >
                                   {arabic}
                              </p>
                         </motion.div>
                    )}

                    {/* Turkish Section */}
                    <motion.div
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 0.5 }}
                         className="relative"
                    >
                         <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-gold to-transparent opacity-20 hidden sm:block"></div>
                         <p
                              className="text-text-primary dark:text-gray-100 leading-relaxed font-display text-justify transition-all"
                              style={{ fontSize: fontSize + 'px' }}
                         >
                              {content}
                         </p>
                    </motion.div>

                    {/* Footer Actions */}
                    <div className="pt-12 pb-12 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                         <div className="flex gap-4">
                              <button
                                   onClick={handleShare}
                                   className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-primary dark:text-white transition-all hover:bg-black/5 active:scale-95 shadow-sm"
                              >
                                   <span className="material-symbols-outlined text-xl">ios_share</span>
                                   <span className="text-xs font-black uppercase tracking-[0.1em]">Stüdyoda Paylaş</span>
                              </button>
                         </div>
                         <button
                              onClick={handleSave}
                              disabled={saveLoading}
                              className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all shadow-lg font-bold hover:scale-105 active:scale-95 disabled:opacity-50 ${isSaved
                                   ? 'bg-white dark:bg-white/10 text-accent-gold border border-accent-gold/30 shadow-none'
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
               </main>
          </div>
     )
}

export default ContentReader
