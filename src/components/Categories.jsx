import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const Categories = () => {
     const navigate = useNavigate()
     const [categories, setCategories] = useState([])
     const [loading, setLoading] = useState(true)

     useEffect(() => {
          const fetchCategories = async () => {
               try {
                    const { data, error } = await supabase
                         .from('categories')
                         .select('*')
                         .order('name')

                    if (error) throw error
                    setCategories(data || [])
               } catch (err) {
                    console.error('Kategoriler yüklenirken hata:', err)
               } finally {
                    setLoading(false)
               }
          }

          fetchCategories()
     }, [])

     return (
          <div className="flex-1 flex flex-col relative bg-background-light dark:bg-background-dark overflow-hidden">
               {/* Decorative Background Elements */}
               <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-islamic-pattern scale-150 rotate-12"></div>
               <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[40%] bg-accent-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
               <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[40%] bg-accent-green/5 blur-[120px] rounded-full pointer-events-none"></div>

               {/* Header Section */}
               <header className="px-8 pt-10 pb-6 relative z-10">
                    <div className="flex items-center justify-between mb-8">
                         <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => navigate(-1)}
                              className="size-12 rounded-2xl bg-white dark:bg-white/5 shadow-soft border border-gray-100 dark:border-white/10 flex items-center justify-center text-primary"
                         >
                              <span className="material-symbols-outlined font-light">arrow_back</span>
                         </motion.button>
                         <div className="text-right">
                              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent-green to-accent-gold dark:from-white dark:to-accent-gold tracking-tight">İlim İrfan Meclisi</h1>
                              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold mt-1 calligraphy">ALIM VE HAKIM</p>
                         </div>
                    </div>

                    <div className="relative group">
                         <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                              <span className="material-symbols-outlined text-accent-gold text-xl">search</span>
                         </div>
                         <input
                              type="text"
                              placeholder="Kütüphanede ara..."
                              className="block w-full p-5 pl-14 text-sm bg-white/70 dark:bg-white/5 border border-white dark:border-white/10 rounded-[2rem] placeholder-primary/40 focus:ring-4 focus:ring-accent-gold/10 focus:outline-none backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-500"
                         />
                    </div>
               </header>

               {/* Categories Content */}
               <main className="flex-1 px-8 pb-24 pt-2 overflow-y-auto no-scrollbar relative z-10">
                    {loading ? (
                         <div className="flex flex-col items-center justify-center py-24 space-y-4">
                              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
                              <p className="text-xs font-bold text-accent-gold uppercase tracking-widest animate-pulse">Safhalar Yükleniyor...</p>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 gap-5">
                              {categories.map((cat, index) => (
                                   <motion.button
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                             delay: index * 0.1,
                                             duration: 0.8,
                                             ease: [0.22, 1, 0.36, 1]
                                        }}
                                        onClick={() => {
                                             const n = cat.name.toLowerCase().replace(/['’]/g, '');
                                             console.log('Tıklanan Kategori (Normalize):', n); // Test için log

                                             if (n.includes('kuran')) navigate('/categories/quran');
                                             else if (n.includes('hadis')) navigate('/categories/hadith');
                                             else if (n.includes('ilmihal') || n.includes('fikih') || n.includes('fıkıh') || n.includes('fiqh')) navigate('/categories/fiqh');
                                             else if (n.includes('esma')) navigate('/categories/esma');
                                             else if (n.includes('dua') || n.includes('zikir')) navigate('/categories/prayers');
                                             else if (n.includes('hac') || n.includes('umre')) navigate('/categories/hajj');
                                             else console.warn('Eşleşen rota bulunamadı:', n);
                                        }}
                                        className="group relative w-full h-32 overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#1f291e] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-white/5 cursor-pointer flex items-center px-8 transition-all hover:shadow-2xl hover:border-accent-gold/20 hover:-translate-y-1 text-left"
                                   >
                                        {/* Card Decoration */}
                                        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-green/5 dark:bg-white/5 text-accent-green group-hover:scale-110 group-hover:bg-accent-gold group-hover:text-white transition-all duration-500 shadow-sm shadow-accent-green/10 group-hover:shadow-accent-gold/30">
                                             <span className="material-symbols-outlined text-3xl font-light">
                                                  {cat.icon || 'menu_book'}
                                             </span>
                                        </div>

                                        <div className="ml-6 flex-1">
                                             <h3 className="text-xl font-bold text-primary dark:text-white mb-1 group-hover:text-accent-gold transition-colors duration-300">{cat.name}</h3>
                                             <div className="flex items-center gap-2">
                                                  <div className="h-px w-6 bg-accent-gold/30"></div>
                                                  <p className="text-[10px] text-text-secondary dark:text-gray-400 font-black uppercase tracking-widest">{cat.description || 'Kütüphane'}</p>
                                             </div>
                                        </div>

                                        <div className="size-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 group-hover:text-accent-gold group-hover:rotate-45 transition-all duration-500">
                                             <span className="material-symbols-outlined text-lg">arrow_outward</span>
                                        </div>
                                   </motion.button>
                              ))}
                         </div>
                    )}
               </main>
          </div>
     )
}

export default Categories
