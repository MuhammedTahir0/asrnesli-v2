import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const FiqhDetail = () => {
     const navigate = useNavigate()
     const topics = [
          { name: 'Temizlik (Taharet)', icon: 'water_drop' },
          { name: 'Namaz Rehberi', icon: 'mosque' },
          { name: 'Zekat ve Sadaka', icon: 'payments' },
          { name: 'Oruç (Savm)', icon: 'wb_sunny' },
          { name: 'Hac ve Umre', icon: 'flight_takeoff' },
          { name: 'Helal ve Haramlar', icon: 'gavel' },
     ]

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24">
               <section className="relative h-64 shrink-0 overflow-hidden bg-[#C5A059]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#C5A059]/80"></div>

                    <div className="relative z-10 h-full flex flex-col px-8 pt-12">
                         <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-6">
                              <span className="material-symbols-outlined">arrow_back</span>
                         </button>
                         <h1 className="text-3xl font-bold text-white mb-1">İlmihal</h1>
                         <p className="text-white/80 text-sm">Temel Dini Bilgiler</p>
                    </div>
               </section>

               <section className="px-6 mt-8 grid grid-cols-2 gap-4">
                    <h3 className="col-span-2 text-sm font-black uppercase tracking-[0.2em] text-accent-green mb-2">Konu Listesi</h3>
                    {topics.map((item, idx) => (
                         <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() => navigate('/categories/reader', {
                                   state: {
                                        title: item.name,
                                        subtitle: 'İlmihal',
                                        content: 'Namaz, lügatte dua etmek, hayır duada bulunmak demektir. Şeriatta ise, Allahu Teâlâ ya ibadet niyetiyle yapılan, başlangıcı iftitah tekbiri, sonu ise selam olan, belli rükünleri ve şartları bulunan özel bir ibadettir. Namaz, İslam’ın beş şartından biridir ve akıllı, bülüğ çağına ermiş her Müslümana farzdır.',
                                        source: 'Ömer Nasuhi Bilmen, Büyük İslam İlmihali'
                                   }
                              })}
                              className="p-6 rounded-[2rem] bg-white dark:bg-[#222] border border-gray-100 dark:border-white/5 flex flex-col items-center text-center gap-3 shadow-soft hover:shadow-xl transition-all h-40 justify-center group cursor-pointer"
                         >
                              <div className="size-12 rounded-full bg-[#fcf8f0] text-accent-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                                   <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                              </div>
                              <h4 className="font-bold text-sm text-text-primary dark:text-white leading-tight">{item.name}</h4>
                         </motion.div>
                    ))}
               </section>
          </div>
     )
}

export default FiqhDetail
