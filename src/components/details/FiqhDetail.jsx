import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const FiqhDetail = () => {
     const navigate = useNavigate()
     const topics = [
          { name: 'İman Esasları', icon: 'verified', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { name: 'Temizlik (Taharet)', icon: 'water_drop', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
          { name: 'Namaz Rehberi', icon: 'mosque', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { name: 'Oruç (Savm)', icon: 'wb_sunny', color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { name: 'Zekat ve Sadaka', icon: 'volunteer_activism', color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { name: 'Hac ve Umre', icon: 'flight_takeoff', color: 'text-slate-500', bg: 'bg-slate-500/10' },
          { name: 'Helal ve Haramlar', icon: 'do_not_touch', color: 'text-red-500', bg: 'bg-red-500/10' },
          { name: 'Aile Hayatı', icon: 'family_restroom', color: 'text-pink-500', bg: 'bg-pink-500/10' },
     ]

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24">
               <section className="relative h-64 shrink-0 overflow-hidden bg-[#C5A059]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#C5A059]/95"></div>

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
                              <h1 className="text-3xl font-bold text-white mb-2">İlmihal</h1>
                              <p className="text-white/80 text-sm font-medium">Büyük İslam İlmihali Rehberi</p>
                         </motion.div>
                    </div>
               </section>

               <section className="px-6 -mt-8 relative z-20">
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#222] shadow-xl border border-accent-gold/20 mb-8">
                         <div className="flex items-start gap-4">
                              <div className="size-12 rounded-full bg-accent-gold/10 flex items-center justify-center shrink-0">
                                   <span className="material-symbols-outlined text-accent-gold text-2xl">school</span>
                              </div>
                              <div>
                                   <h3 className="text-lg font-bold text-primary dark:text-white mb-1">İlim Talep Etmek</h3>
                                   <p className="text-sm text-text-secondary dark:text-gray-400">
                                        "İlim talep etmek her Müslümana farzdır." (İbn Mâce)
                                   </p>
                              </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         {topics.map((item, idx) => (
                              <motion.div
                                   key={idx}
                                   initial={{ opacity: 0, scale: 0.9 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   transition={{ delay: idx * 0.05 }}
                                   onClick={() => navigate('/categories/reader', {
                                        state: {
                                             id: 'fiqh-' + idx,
                                             title: item.name,
                                             subtitle: 'İlmihal',
                                             content: 'Namaz, lügatte dua etmek, hayır duada bulunmak demektir. Şeriatta ise, Allahu Teâlâ ya ibadet niyetiyle yapılan, başlangıcı iftitah tekbiri, sonu ise selam olan, belli rükünleri ve şartları bulunan özel bir ibadettir...',
                                             source: 'Ömer Nasuhi Bilmen, Büyük İslam İlmihali'
                                        }
                                   })}
                                   className="p-5 rounded-[2rem] bg-white dark:bg-[#1f291e] border border-gray-100 dark:border-white/5 flex flex-col items-center text-center gap-3 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-accent-gold/20 transition-all h-36 justify-center group cursor-pointer"
                              >
                                   <div className={`size-12 rounded-full ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                   </div>
                                   <h4 className="font-bold text-sm text-text-primary dark:text-white leading-tight">{item.name}</h4>
                              </motion.div>
                         ))}
                    </div>
               </section>
          </div>
     )
}

export default FiqhDetail
