import React, { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

const ContentReader = () => {
     const navigate = useNavigate()
     const location = useLocation()
     const { scrollYProgress } = useScroll()
     const scaleX = useSpring(scrollYProgress, {
          stiffness: 100,
          damping: 30,
          restDelta: 0.001
     })

     const [fontSize, setFontSize] = useState(18)
     const { title, subtitle, content, arabic, source } = location.state || {
          title: 'İçerik Başlığı',
          subtitle: 'Kategori',
          content: 'Lütfen bir içerik seçiniz.',
          arabic: '',
          source: ''
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
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold mb-3">{subtitle}</p>
                         <h1 className="text-4xl font-bold text-primary dark:text-white mb-2 leading-tight">{title}</h1>
                         <div className="flex items-center justify-center gap-3">
                              <div className="h-px w-8 bg-accent-gold/30"></div>
                              <span className="text-xs text-text-secondary font-medium italic">{source}</span>
                              <div className="h-px w-8 bg-accent-gold/30"></div>
                         </div>
                    </motion.div>
               </section>

               {/* Reading Content */}
               <main className="px-8 space-y-12">
                    {/* Arabic Section (Optional) */}
                    {arabic && (
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="p-10 rounded-[3rem] bg-accent-green/5 dark:bg-white/5 border border-accent-gold/10 relative group"
                         >
                              <div className="absolute top-6 left-6 opacity-10">
                                   <span className="material-symbols-outlined text-4xl text-accent-gold">script</span>
                              </div>
                              <p
                                   className="text-center text-accent-green dark:text-primary leading-[3] calligraphy select-all transition-all"
                                   style={{ fontSize: fontSize * 1.8 + 'px' }}
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
                              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-primary-dark transition-all hover:bg-black/5">
                                   <span className="material-symbols-outlined text-xl">share</span>
                                   <span className="text-xs font-bold uppercase tracking-widest">Paylaş</span>
                              </button>
                         </div>
                         <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-gold text-white font-bold transition-all shadow-lg shadow-accent-gold/20 hover:scale-105 active:scale-95">
                              <span className="material-symbols-outlined text-xl">bookmark</span>
                              <span className="text-xs uppercase tracking-widest">Kaydet</span>
                         </button>
                    </div>
               </main>
          </div>
     )
}

export default ContentReader
