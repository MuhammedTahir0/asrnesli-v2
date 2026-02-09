import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const HadithDetail = () => {
     const navigate = useNavigate()
     const categories = [
          {
               id: 'kutub',
               name: 'Kütüb-i Sitte',
               desc: 'İslam\'ın en temel 6 hadis kitabı kaynağı.',
               icon: 'library_books',
               color: 'text-blue-500',
               bg: 'bg-blue-500/10'
          },
          {
               id: 'riyaz',
               name: 'Riyazü\'s Salihin',
               desc: 'Salihlerin bahçesi, ahlak ve edep hadisleri.',
               icon: 'menu_book',
               color: 'text-emerald-500',
               bg: 'bg-emerald-500/10'
          },
          {
               id: 'kirk',
               name: '40 Hadis',
               desc: 'İmam Nevevi\'nin meşhur derlemesi.',
               icon: 'format_quote',
               color: 'text-amber-500',
               bg: 'bg-amber-500/10'
          },
          {
               id: 'kudsi',
               name: 'Kudsi Hadisler',
               desc: 'Manası Allah\'a, sözü Peygamber\'e ait hadisler.',
               icon: 'auto_awesome',
               color: 'text-purple-500',
               bg: 'bg-purple-500/10'
          },
     ]

     const dailyHadith = {
          text: "Müslüman, elinden ve dilinden diğer Müslümanların emin olduğu kimsedir.",
          source: "Buhârî, Îmân 4"
     }

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24">
               <section className="relative h-64 shrink-0 overflow-hidden bg-[#2D5A27]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2D5A27]/95"></div>

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
                              <h1 className="text-3xl font-bold text-white mb-2">Hadis-i Şerifler</h1>
                              <p className="text-white/70 text-sm font-medium">Sünnet-i Seniyye Kaynağı</p>
                         </motion.div>
                    </div>
               </section>

               <section className="px-6 -mt-8 relative z-20">
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#222] shadow-xl border border-accent-gold/20 flex flex-col gap-3">
                         <div className="flex items-center gap-2 mb-1">
                              <span className="p-1 px-2 rounded-md bg-accent-gold/10 text-accent-gold text-[10px] font-black uppercase tracking-widest">Günün Hadisi</span>
                         </div>
                         <p className="text-lg font-serif font-bold text-text-primary dark:text-white leading-relaxed">
                              "{dailyHadith.text}"
                         </p>
                         <p className="text-xs text-text-secondary dark:text-gray-400 font-medium text-right">— {dailyHadith.source}</p>
                    </div>
               </section>

               <section className="px-6 mt-10 grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between mb-2">
                         <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent-green">Ders Halkaları</h3>
                    </div>
                    {categories.map((item, idx) => (
                         <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              onClick={() => navigate('/categories/reader', {
                                   state: {
                                        id: 'hadith-' + item.id,
                                        title: item.name,
                                        subtitle: 'Hadis Koleksiyonu',
                                        content: 'Ameller ancak niyetlere göredir. Herkesin niyet ettiği ne ise eline geçecek olan ancak odur...',
                                        arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
                                        source: item.desc
                                   }
                              })}
                              className="group p-5 rounded-[2rem] bg-white dark:bg-[#1f291e] border border-gray-100 dark:border-white/5 flex items-center gap-5 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-accent-gold/20 hover:-translate-y-1 transition-all cursor-pointer"
                         >
                              <div className={`size-16 shrink-0 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                   <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                              </div>
                              <div className="flex-1">
                                   <h4 className="font-bold text-lg text-text-primary dark:text-white mb-1 group-hover:text-accent-gold transition-colors">{item.name}</h4>
                                   <p className="text-xs text-text-secondary dark:text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                              </div>
                              <span className="material-symbols-outlined text-gray-200 group-hover:text-accent-gold transition-colors">arrow_forward_ios</span>
                         </motion.div>
                    ))}
               </section>
          </div>
     )
}

export default HadithDetail
