import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const HajjDetail = () => {
     const navigate = useNavigate()
     const steps = [
          { title: 'İhram', desc: 'Niyet ve telbiye ile kutsal iklime giriş.', icon: 'checkroom' },
          { title: 'Tavaf', desc: 'Kabe\'nin etrafında yedi kez kutsal yürüyüş.', icon: 'sync' },
          { title: 'Sa\'y', desc: 'Safa ve Merve tepeleri arasında sabır yürüyüşü.', icon: 'directions_walk' },
          { title: 'Vakfe', desc: 'Arafat\'ta Allah\'ın huzurunda duruş.', icon: 'nature_people' },
     ]

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24">
               <section className="relative h-64 shrink-0 overflow-hidden bg-[#1b2b1a]">
                    <div className="absolute inset-0 grayscale opacity-40 bg-[url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1b2b1a]"></div>

                    <div className="relative z-10 h-full flex flex-col px-8 pt-12">
                         <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-6">
                              <span className="material-symbols-outlined">arrow_back</span>
                         </button>
                         <h1 className="text-3xl font-bold text-white mb-1">Hac & Umre</h1>
                         <p className="text-white/60 text-sm">Yol Arkadaşım</p>
                    </div>
               </section>

               <section className="px-8 mt-10">
                    <div className="p-8 rounded-[2.5rem] bg-accent-gold text-background-dark relative overflow-hidden shadow-2xl">
                         <div className="relative z-10">
                              <h2 className="text-2xl font-black mb-2">Mübarek Yolculuk</h2>
                              <p className="text-sm font-medium opacity-80 leading-relaxed">Mübarek topraklarda ibadetlerinizi huzurla yerine getirmeniz için pratik ipuçları ve hazırlık listesi.</p>
                         </div>
                    </div>
               </section>

               <section className="px-8 mt-10 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent-green pl-1">Uygulama Adımları</h3>
                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-accent-gold before:via-accent-gold/20 before:to-transparent">
                         {steps.map((step, idx) => (
                              <motion.div
                                   key={idx}
                                   initial={{ opacity: 0, x: 20 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   transition={{ delay: idx * 0.1 }}
                                   onClick={() => navigate('/categories/reader', {
                                        state: {
                                             title: step.title,
                                             subtitle: 'Hac & Umre Rehberi',
                                             content: step.desc + ' Bu aşama, kutsal yolculuğun en önemli rüknlerinden biridir. Sabır, huşu ve teslimiyetle yerine getirilmesi tavsiye edilir. Gerekli dualar ve hazırlıklar hakkında detaylı bilgi için resmi rehberleri takip ediniz.',
                                             source: 'Diyanet Hac Rehberi'
                                        }
                                   })}
                                   className="relative flex items-center justify-between group cursor-pointer"
                              >
                                   <div className="flex items-center gap-6">
                                        <div className="size-10 rounded-full bg-accent-gold text-background-dark flex items-center justify-center shrink-0 z-10 shadow-lg shadow-accent-gold/30">
                                             <span className="material-symbols-outlined text-xl">{step.icon}</span>
                                        </div>
                                        <div>
                                             <h4 className="font-bold text-lg text-text-primary dark:text-white leading-none mb-1">{step.title}</h4>
                                             <p className="text-xs text-text-secondary dark:text-gray-400 font-medium">{step.desc}</p>
                                        </div>
                                   </div>
                              </motion.div>
                         ))}
                    </div>
               </section>
          </div>
     )
}

export default HajjDetail
