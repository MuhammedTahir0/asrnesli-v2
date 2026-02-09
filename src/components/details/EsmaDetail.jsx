import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getEsmaulHusna } from '../../services/contentService'

const EsmaDetail = () => {
     const navigate = useNavigate()
     const [names, setNames] = useState([])
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState(null)
     const [searchTerm, setSearchTerm] = useState('')

     useEffect(() => {
          const fetchData = async () => {
               const { data, error } = await getEsmaulHusna()
               if (error) {
                    setError('Veriler yüklenirken bir hata oluştu.')
               } else {
                    setNames(data || [])
               }
               setLoading(false)
          }
          fetchData()
     }, [])

     const filteredNames = names.filter(name =>
          name.name_tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          name.meaning.toLowerCase().includes(searchTerm.toLowerCase())
     )

     if (loading) {
          return (
               <div className="min-h-screen bg-[#0a1a0a] flex flex-col items-center justify-center p-8">
                    <div className="relative size-16">
                         <div className="absolute inset-0 rounded-full border-2 border-[#C5A059]/10" />
                         <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#C5A059] animate-spin" />
                    </div>
                    <p className="text-[#C5A059] font-medium mt-6 animate-pulse">Esma-ül Hüsna Yükleniyor...</p>
               </div>
          )
     }

     return (
          <div className="min-h-screen bg-gradient-to-b from-[#0a1a0a] via-[#0f2a0f] to-[#0a1a0a] pb-24">
               {/* Hero Header */}
               <section className="relative h-64 shrink-0 overflow-hidden bg-[#0a1a0a]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a0a]/50 to-[#0a1a0a]"></div>

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
                              <h1 className="text-3xl font-bold text-white mb-2">Esma-ül Hüsna</h1>
                              <p className="text-[#C5A059] text-sm font-medium tracking-widest uppercase">En Güzel İsimler O'nundur</p>
                         </motion.div>
                    </div>
               </section>

               {/* Search & Hadith */}
               <section className="px-6 -mt-8 relative z-20 space-y-6">
                    {/* Hadith Box */}
                    <motion.div
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="p-6 rounded-3xl bg-gradient-to-br from-[#1a2a1a] to-[#0f1f0f] shadow-2xl border border-[#C5A059]/20 flex flex-col items-center text-center gap-2"
                    >
                         <span className="material-symbols-outlined text-[#C5A059] text-3xl mb-1">auto_awesome</span>
                         <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]">Hadis-i Şerif</h3>
                         <p className="text-sm font-serif italic text-white/90 leading-relaxed">
                              "Allah'ın 99 ismi vardır. Kim bunları ezberler ve manalarını anlayıp hayatına tatbik ederse cennete girer."
                         </p>
                    </motion.div>

                    {/* Search Bar */}
                    <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#C5A059]/50">search</span>
                         <input
                              type="text"
                              placeholder="İsim veya anlam ara..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full bg-[#1a2a1a] border border-[#C5A059]/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#C5A059]/30 transition-all placeholder:text-white/20"
                         />
                    </div>
               </section>

               {/* List */}
               <section className="px-6 mt-8 grid grid-cols-1 gap-4">
                    {filteredNames.length > 0 ? (
                         filteredNames.map((name, idx) => (
                              <motion.div
                                   key={name.id}
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: idx * 0.02 }}
                                   onClick={() => navigate('/categories/reader', {
                                        state: {
                                             id: name.id,
                                             title: 'Ya ' + name.name_tr,
                                             subtitle: 'Esma-ül Hüsna',
                                             content: name.description || name.meaning,
                                             virtue: name.virtue,
                                             arabic: name.name_ar,
                                             source: `Zikir Adedi: ${name.dhikr_count} Defa`,
                                             ebced: name.dhikr_count
                                        }
                                   })}
                                   className="p-5 rounded-3xl bg-[#0f1f0f]/80 border border-[#C5A059]/10 flex items-center justify-between shadow-xl hover:bg-[#C5A059]/5 hover:border-[#C5A059]/30 transition-all group cursor-pointer"
                              >
                                   <div className="flex-1 pr-4">
                                        <div className="flex items-center gap-3 mb-1">
                                             <div className="size-6 rounded-lg bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center text-[10px] font-black border border-[#C5A059]/20">
                                                  {name.display_order || idx + 1}
                                             </div>
                                             <h4 className="font-bold text-lg text-white group-hover:text-[#C5A059] transition-colors">{name.name_tr}</h4>
                                        </div>
                                        <p className="text-xs text-white/50 font-medium leading-relaxed line-clamp-2">{name.meaning}</p>
                                   </div>
                                   <div className="size-16 shrink-0 rounded-2xl bg-[#C5A059]/5 border border-[#C5A059]/10 flex items-center justify-center">
                                        <span className="text-3xl text-[#C5A059] arabic-font pt-1">{name.name_ar}</span>
                                   </div>
                              </motion.div>
                         ))
                    ) : (
                         <div className="text-center py-20">
                              <span className="material-symbols-outlined text-4xl text-[#C5A059]/20 mb-2">search_off</span>
                              <p className="text-white/40">Aradığınız isim bulunamadı.</p>
                         </div>
                    )}
               </section>
          </div>
     )
}

export default EsmaDetail
