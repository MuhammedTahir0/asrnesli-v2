import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const PrayerDetail = () => {
     const navigate = useNavigate()
     const sections = [
          { title: 'Sabah Duaları', desc: 'Bereket ve Korunma', icon: 'wb_sunny' },
          { title: 'Akşam Duaları', desc: 'Huzur ve Teslimiyet', icon: 'dark_mode' },
          { title: 'Zikirmatik', desc: 'Elektronik Tesbih', icon: 'touch_app', highlight: true },
          { title: 'Hacet Duaları', desc: 'İstek ve Murad', icon: 'volunteer_activism' },
          { title: 'Tüm Dualar', desc: 'Geniş Koleksiyon', icon: 'auto_stories' },
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
                         <h1 className="text-3xl font-bold text-white mb-1">Dualar ve Zikirler</h1>
                         <p className="text-white/60 text-sm">Rabbimize El Açış</p>
                    </div>
               </section>

               <section className="px-6 -mt-10 relative z-20">
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#222] shadow-xl border border-accent-gold/20">
                         <p className="text-sm font-serif italic text-center text-text-primary dark:text-gray-200">
                              "Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru."
                         </p>
                         <p className="text-[10px] font-bold text-accent-gold text-center mt-2 uppercase">Bakara Suresi, 201</p>
                    </div>
               </section>

               <section className="px-6 mt-8 space-y-4">
                    {sections.map((item, idx) => (
                         <motion.div
                              key={idx}
                              onClick={() => navigate('/categories/reader', {
                                   state: {
                                        title: item.title,
                                        subtitle: 'Dualar ve Zikirler',
                                        content: 'Allahümme entesselâmü ve minkesselâm. Tebârekte yâ zel-celâli vel-ikrâm. (Allah’ım! Sen selamsın, selamet sendendir. Ey celal ve ikram sahibi! Sen ne yücesin.)',
                                        arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
                                        source: 'Müslim, Mesâcid, 135'
                                   }
                              })}
                              className={`p-5 rounded-3xl border flex items-center gap-5 transition-all shadow-sm hover:shadow-md cursor-pointer ${item.highlight ? 'bg-accent-gold text-background-dark border-transparent' : 'bg-white dark:bg-[#222] border-gray-100 dark:border-white/5'}`}
                         >
                              <div className={`size-14 rounded-2xl flex items-center justify-center ${item.highlight ? 'bg-background-dark/10' : 'bg-accent-green/5 text-accent-green'}`}>
                                   <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                              </div>
                              <div className="flex-1">
                                   <h4 className={`font-bold text-lg ${item.highlight ? 'text-background-dark' : 'text-text-primary dark:text-white'}`}>{item.title}</h4>
                                   <p className={`text-xs font-medium opacity-60`}>{item.desc}</p>
                              </div>
                              <span className="material-symbols-outlined opacity-30">arrow_forward</span>
                         </motion.div>
                    ))}
               </section>
          </div>
     )
}

export default PrayerDetail
