import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const EsmaDetail = () => {
     const navigate = useNavigate()
     const names = [
          { ar: 'ٱللَّٰهُ', tr: 'Allah', meaning: 'Eşi ve benzeri olmayan, bütün noksan sıfatlardan münezzeh tek İlah, her şeyin gerçek sahibi.' },
          { ar: 'ٱلْرَّحْمَـانُ', tr: 'er-Rahmân', meaning: 'Dünyada bütün mahlûkata merhamet eden, şefkat gösteren, ihsan eden.' },
          { ar: 'ٱلْرَّحِيْمُ', tr: 'er-Rahîm', meaning: 'Ahirette sadece mü\'minlere rahmet eden, merhametini onlardan esirgemeyen.' },
          { ar: 'ٱلْمَلِكُ', tr: 'el-Melik', meaning: 'Mülkün gerçek sahibi, bütün mevcudatın mutlak hükümdarı.' },
          { ar: 'ٱلْقُدُّوسُ', tr: 'el-Kuddûs', meaning: 'Her türlü noksanlıktan uzak, her türlü takdise layık, tertemiz.' },
          { ar: 'ٱلْسَّلَامُ', tr: 'es-Selâm', meaning: 'Her türlü tehlikeden, ayıptan, kederden, eksiklikten ve fani olmaktan uzak olan.' },
          { ar: 'ٱلْمُؤْمِنُ', tr: 'el-Mü\'min', meaning: 'Gönüllerde iman ışığı yakan, kendine sığınanlara güven veren ve onları koruyan.' },
          { ar: 'ٱلْمُهَيْمِنُ', tr: 'el-Müheymin', meaning: 'Bütün varlıkları ilim ve kontrolü altında tutan, gözeten ve koruyan.' },
          { ar: 'ٱلْعَزِيزُ', tr: 'el-Azîz', meaning: 'İzzet sahibi, her şeye galip gelen, mağlup edilmesi imkansız olan.' },
          { ar: 'ٱلْجَبَّارُ', tr: 'el-Cebbâr', meaning: 'Azamet ve kudret sahibi, dilediğini mutlak yapan, hükmüne karşı gelinemeyen.' },
          { ar: 'ٱلْمُتَكَبِّرُ', tr: 'el-Mütekebbir', meaning: 'Büyüklükte eşi olmayan, her şeyde ve her hadisede büyüklüğünü gösteren.' },
          { ar: 'ٱl-Hâlık', tr: 'el-Hâlık', meaning: 'Her şeyi yoktan var eden, yaratan, takdir eden.' }
     ]

     return (
          <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pb-24">
               <section className="relative h-64 shrink-0 overflow-hidden bg-[#1a2b1a]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a2b1a]/95"></div>

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
                              <p className="text-white/70 text-sm font-medium">En Güzel İsimler O'nundur</p>
                         </motion.div>
                    </div>
               </section>

               <section className="px-6 -mt-8 relative z-20">
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#222] shadow-xl border border-accent-gold/20 flex flex-col items-center text-center gap-2">
                         <span className="material-symbols-outlined text-accent-gold text-3xl mb-1">auto_awesome</span>
                         <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent-gold">Hadis-i Şerif</h3>
                         <p className="text-sm font-serif italic text-text-primary dark:text-gray-200 leading-relaxed">
                              "Allah'ın 99 ismi vardır. Kim bunları ezberler (ve manalarını anlayıp hayatına tatbik ederse) cennete girer."
                         </p>
                    </div>
               </section>

               <section className="px-6 mt-8 grid grid-cols-1 gap-4">
                    {names.map((name, idx) => (
                         <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() => navigate('/categories/reader', {
                                   state: {
                                        title: 'Ya ' + name.tr,
                                        subtitle: 'Esma-ül Hüsna',
                                        content: name.meaning + ' Bu mübarek ismin zikri, kalbi nurlandırır ve manevi dereceleri artırır.',
                                        arabic: name.ar,
                                        source: 'Zikir Adedi: 100 Defa'
                                   }
                              })}
                              className="p-5 rounded-3xl bg-white dark:bg-[#1f291e] border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-accent-gold/30 hover:-translate-y-1 transition-all group cursor-pointer"
                         >
                              <div className="flex-1 pr-4">
                                   <div className="flex items-center gap-3 mb-1">
                                        <div className="size-6 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center text-xs font-bold">
                                             {idx + 1}
                                        </div>
                                        <h4 className="font-bold text-lg text-primary dark:text-white group-hover:text-accent-gold transition-colors">{name.tr}</h4>
                                   </div>
                                   <p className="text-xs text-text-secondary dark:text-gray-400 font-medium leading-relaxed line-clamp-2">{name.meaning}</p>
                              </div>
                              <div className="size-14 shrink-0 rounded-2xl bg-[#fcf8f0] dark:bg-white/5 border border-accent-gold/10 flex items-center justify-center">
                                   <span className="text-2xl text-accent-green dark:text-accent-gold calligraphy pt-1">{name.ar}</span>
                              </div>
                         </motion.div>
                    ))}
               </section>
          </div>
     )
}

export default EsmaDetail
