import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const HadithDetail = () => {
     const navigate = useNavigate()
     const collections = [
          { name: 'Kütüb-i Sitte', desc: 'Altı Temel Hadis Kitabı', icon: 'collections_bookmark' },
          { name: 'Riyazu\'s Salihin', desc: 'İmam Nevevi\'nin Seçkisi', icon: 'menu_book' },
          { name: 'Adab-ı Muaşeret', desc: 'Ahlak ve Edep Hadisleri', icon: 'auto_awesome' },
          { name: 'Kırk Hadis', desc: 'İmam Nevevi Klasikleri', icon: 'history_edu' },
     ]

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24">
               <section className="relative h-64 shrink-0 overflow-hidden bg-[#2D5A27]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2D5A27]/80"></div>

                    <div className="relative z-10 h-full flex flex-col px-8 pt-12">
                         <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-6">
                              <span className="material-symbols-outlined">arrow_back</span>
                         </button>
                         <h1 className="text-3xl font-bold text-white mb-1">Hadis-i Şerifler</h1>
                         <p className="text-white/60 text-sm">Peygamber Efendimiz'in (SAV) Sözleri</p>
                    </div>
               </section>

               <section className="px-6 mt-8 grid grid-cols-1 gap-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent-green mb-2">Hadis Koleksiyonu</h3>
                    {collections.map((item, idx) => (
                         <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              onClick={() => navigate('/categories/reader', {
                                   state: {
                                        title: item.name,
                                        subtitle: 'Hadis-i Şerifler',
                                        content: 'Ameller ancak niyetlere göredir. Herkesin niyet ettiği ne ise eline geçecek olan ancak odur. Kimin hicreti, Allah ve Resûlü için ise, onun hicreti Allah ve Resûlü’nedir. Kimin de hicreti elde edeceği bir dünyalık veya nikahlayacağı bir kadın için ise, onun hicreti de o hicret ettiği şeyedir.',
                                        arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
                                        source: 'Buhârî, Bed’ü’l-vahy, 1; Müslim, İmare, 155'
                                   }
                              })}
                              className="group p-6 rounded-[2rem] bg-white dark:bg-[#222] border border-gray-100 dark:border-white/5 flex items-center gap-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                         >
                              <div className="size-14 rounded-2xl bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                                   <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                              </div>
                              <div className="flex-1">
                                   <h4 className="font-bold text-lg text-text-primary dark:text-white">{item.name}</h4>
                                   <p className="text-xs text-text-secondary dark:text-gray-400 font-medium">{item.desc}</p>
                              </div>
                              <span className="material-symbols-outlined text-gray-200 group-hover:text-accent-gold transition-colors">arrow_forward_ios</span>
                         </motion.div>
                    ))}
               </section>
          </div>
     )
}

export default HadithDetail
