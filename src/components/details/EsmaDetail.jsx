import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const EsmaDetail = () => {
     const navigate = useNavigate()
     const names = [
          { ar: 'ٱلْرَّحْمَـانُ', tr: 'er-Rahmân', meaning: 'Dünyada bütün mahlûkata merhamet eden.' },
          { ar: 'ٱلْرَّحِيْمُ', tr: 'er-Rahîm', meaning: 'Ahirette sadece mü\'minlere rahmet eden.' },
          { ar: 'ٱلْمَلِكُ', tr: 'el-Melik', meaning: 'Mülkün gerçek sahibi, mutlak hükümdar.' },
          { ar: 'ٱلْقُدُّوسُ', tr: 'el-Kuddûs', meaning: 'Her türlü noksanlıktan uzak, mukaddes olan.' },
          { ar: 'ٱلْسَّلَامُ', tr: 'es-Selâm', meaning: 'Esenlik veren, tehlikelerden kurtaran.' },
          { ar: 'ٱلْمُؤْمِنُ', tr: 'el-Mü\'min', meaning: 'Gönüllerde iman ışığı yakan, güven veren.' },
     ]

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24">
               <section className="relative h-64 shrink-0 overflow-hidden bg-[#1a2b1a]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a2b1a]/80"></div>

                    <div className="relative z-10 h-full flex flex-col px-8 pt-12">
                         <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-6">
                              <span className="material-symbols-outlined">arrow_back</span>
                         </button>
                         <h1 className="text-3xl font-bold text-white mb-1">Esma-ül Hüsna</h1>
                         <p className="text-white/60 text-sm">Allah'ın En Güzel İsimleri</p>
                    </div>
               </section>

               <section className="px-6 -mt-10 relative z-20">
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#222] shadow-xl border border-accent-gold/20">
                         <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent-gold mb-3 text-center">İsimlerin Fazileti</h3>
                         <p className="text-sm font-serif italic text-center text-text-primary dark:text-gray-200">
                              "Allah'ın 99 ismi vardır. Kim bunları ezberler (ve manalarını anlayıp hayatına tatbik ederse) cennete girer."
                         </p>
                    </div>
               </section>

               <section className="px-6 mt-8 grid grid-cols-1 gap-4">
                    {names.map((name, idx) => (
                         <motion.div
                              key={idx}
                              onClick={() => navigate('/categories/reader', {
                                   state: {
                                        title: 'Ya ' + name.tr,
                                        subtitle: 'Esma-ül Hüsna',
                                        content: name.meaning + ' Bu ismin zikri, kalbi nurlandırır, rızkı genişletir ve Allahu Teâlâ nın sevgisini kazanmaya vesile olur. Her gün belirlenen zikir adedince okunması tavsiye edilir.',
                                        arabic: name.ar,
                                        source: 'Zikir Adedi: Belirlenmedi'
                                   }
                              })}
                              className="p-6 rounded-3xl bg-white dark:bg-[#222] border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm group cursor-pointer"
                         >
                              <div className="flex-1">
                                   <h4 className="font-black text-xl text-accent-green dark:text-primary mb-1">{name.tr}</h4>
                                   <p className="text-xs text-text-secondary dark:text-gray-400 font-medium leading-relaxed">{name.meaning}</p>
                              </div>
                              <div className="size-16 rounded-2xl bg-accent-green/5 flex items-center justify-center">
                                   <span className="text-2xl text-accent-green calligraphy pt-1">{name.ar}</span>
                              </div>
                         </motion.div>
                    ))}
               </section>
          </div>
     )
}

export default EsmaDetail
