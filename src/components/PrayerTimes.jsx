import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getPrayerTimes, getCityName, calculateNextPrayer } from '../services/prayerTimes'

const PrayerTimes = () => {
     const navigate = useNavigate()
     const [data, setData] = useState(null)
     const [locationName, setLocationName] = useState('Konum Belirleniyor...')
     const [loading, setLoading] = useState(true)
     const [nextPrayer, setNextPrayer] = useState(null)
     const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })

     // Initial Load
     useEffect(() => {
          const init = async () => {
               const cachedData = localStorage.getItem('prayer_data')
               const cachedLocation = localStorage.getItem('prayer_location')

               if (cachedData && cachedLocation) {
                    const parsed = JSON.parse(cachedData)
                    if (new Date(parsed.timestamp).getDate() === new Date().getDate()) {
                         setData(parsed.data)
                         setLocationName(cachedLocation)
                         setLoading(false)
                    }
               }

               if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                         async (position) => {
                              const { latitude, longitude } = position.coords

                              const [times, city] = await Promise.all([
                                   getPrayerTimes(latitude, longitude),
                                   getCityName(latitude, longitude)
                              ])

                              if (times) {
                                   setData(times)
                                   localStorage.setItem('prayer_data', JSON.stringify({
                                        data: times,
                                        timestamp: new Date().getTime()
                                   }))
                              }
                              if (city) {
                                   setLocationName(city)
                                   localStorage.setItem('prayer_location', city)
                              }
                              setLoading(false)
                         },
                         (err) => {
                              console.error(err)
                              setLocationName('Konum Alınamadı')
                              setLoading(false)
                         }
                    )
               } else {
                    setLocationName('Tarayıcı Desteklemiyor')
                    setLoading(false)
               }
          }
          init()
     }, [])

     // Timer Loop
     useEffect(() => {
          if (!data?.timings) return

          const timer = setInterval(() => {
               const next = calculateNextPrayer(data.timings)
               setNextPrayer(next)

               if (next) {
                    const diff = next.targetDate - new Date()
                    if (diff <= 0) return

                    const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
                    const m = Math.floor((diff / (1000 * 60)) % 60)
                    const s = Math.floor((diff / 1000) % 60)
                    setTimeLeft({ h, m, s })
               }
          }, 1000)

          return () => clearInterval(timer)
     }, [data])

     const prayerList = [
          { key: 'Fajr', label: 'İmsak', icon: 'nightlight_round' },
          { key: 'Sunrise', label: 'Güneş', icon: 'wb_twilight' },
          { key: 'Dhuhr', label: 'Öğle', icon: 'sunny' },
          { key: 'Asr', label: 'İkindi', icon: 'light_mode' },
          { key: 'Maghrib', label: 'Akşam', icon: 'wb_twilight' },
          { key: 'Isha', label: 'Yatsı', icon: 'bedtime' },
     ]

     if (loading) {
          return (
               <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-8">
                    <div className="relative size-16">
                         <div className="absolute inset-0 rounded-full border-2 border-accent-gold/10" />
                         <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-gold animate-spin" />
                    </div>
                    <p className="text-accent-gold font-medium mt-6 animate-pulse">Vakitler Yükleniyor...</p>
               </div>
          )
     }

     return (
          <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col relative pb-28">
               <div className="absolute inset-0 bg-islamic-pattern opacity-[0.05] pointer-events-none"></div>
               <div className="absolute inset-0 bg-gradient-to-b from-accent-gold/5 via-transparent to-accent-green/5 pointer-events-none"></div>

               {/* Header */}
               <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-b border-accent-gold/20">
                    <div className="flex items-center justify-between p-4 px-6">
                         <button
                              onClick={() => navigate(-1)}
                              className="size-10 rounded-full bg-surface-light dark:bg-surface-dark border border-accent-gold/20 flex items-center justify-center text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                         >
                              <span className="material-symbols-outlined">arrow_back</span>
                         </button>
                         <h2 className="text-2xl font-bold text-primary dark:text-accent-gold mb-1">Cami Vakitleri</h2>
                         <div className="w-10" />
                    </div>
               </header>

               <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-6 relative z-10">
                    {/* Location & Hijri Date */}
                    <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="flex flex-col items-center text-center space-y-2"
                    >
                         <div className="inline-flex items-center gap-2 bg-accent-green/10 dark:bg-primary/20 px-4 py-1.5 rounded-full border border-accent-gold/20 shadow-sm">
                              <span className="material-symbols-outlined text-accent-gold text-sm">location_on</span>
                              <span className="text-sm font-bold text-accent-green dark:text-primary tracking-wide uppercase">{locationName}</span>
                         </div>
                         {data?.hijri && (
                              <p className="text-accent-gold text-xs font-bold uppercase tracking-widest">
                                   {data.hijri.day} {data.hijri.month.en} {data.hijri.year}
                              </p>
                         )}
                    </motion.div>

                    {/* Next Prayer Countdown Card */}
                    <motion.div
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="relative bg-surface-light dark:bg-surface-dark rounded-[2.5rem] p-8 border border-accent-gold/20 shadow-soft overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 text-accent-gold pointer-events-none">
                              <span className="material-symbols-outlined text-9xl">mosque</span>
                         </div>

                         <div className="relative z-10 text-center space-y-4">
                              <span className="text-accent-gold text-xs font-bold uppercase tracking-[0.3em]">
                                   {nextPrayer?.name || 'Vakit Bekleniyor'} Vaktine Kalan Süre
                              </span>

                              <div className="flex items-center justify-center gap-4">
                                   <div className="flex flex-col">
                                        <span className="text-5xl font-bold text-primary dark:text-accent-gold tabular-nums tracking-tighter">
                                             {String(timeLeft.h).padStart(2, '0')}
                                        </span>
                                        <span className="text-[10px] font-bold text-text-secondary dark:text-accent-gold/60 uppercase tracking-widest">Saat</span>
                                   </div>
                                   <span className="text-4xl font-light text-accent-gold/40 mb-4">:</span>
                                   <div className="flex flex-col">
                                        <span className="text-5xl font-bold text-primary dark:text-accent-gold tabular-nums tracking-tighter">
                                             {String(timeLeft.m).padStart(2, '0')}
                                        </span>
                                        <span className="text-[10px] font-bold text-text-secondary dark:text-accent-gold/60 uppercase tracking-widest">Dakika</span>
                                   </div>
                                   <span className="text-4xl font-light text-accent-gold/40 mb-4">:</span>
                                   <div className="flex flex-col">
                                        <span className="text-5xl font-bold text-primary dark:text-accent-gold tabular-nums tracking-tighter">
                                             {String(timeLeft.s).padStart(2, '0')}
                                        </span>
                                        <span className="text-[10px] font-bold text-text-secondary dark:text-accent-gold/60 uppercase tracking-widest">Saniye</span>
                                   </div>
                              </div>
                         </div>
                    </motion.div>

                    {/* Prayer Times List Card */}
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.1 }}
                         className="bg-surface-light dark:bg-surface-dark rounded-[2.5rem] border border-accent-gold/20 overflow-hidden shadow-soft"
                    >
                         <div className="divide-y divide-accent-gold/10">
                              {data?.timings && prayerList.map((p) => {
                                   const isNext = nextPrayer?.key === p.key
                                   return (
                                        <div
                                             key={p.key}
                                             className={`flex items-center justify-between p-5 transition-colors ${isNext ? 'bg-accent-gold/5' : 'hover:bg-black/5 dark:hover:bg-white/5'
                                                  }`}
                                        >
                                             <div className="flex items-center gap-4">
                                                  <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${isNext ? 'bg-accent-gold text-white shadow-lg shadow-accent-gold/30' : 'bg-accent-gold/10 text-accent-gold'
                                                       }`}>
                                                       <span className="material-symbols-outlined text-xl">{p.icon}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                       <span className={`font-bold tabular-nums text-lg ${isNext ? 'text-primary dark:text-accent-gold scale-110' : 'text-primary dark:text-accent-gold/80'}`}>
                                                            {p.label}
                                                       </span>
                                                       {isNext && (
                                                            <span className="text-[9px] font-bold text-accent-gold uppercase tracking-widest">
                                                                 Sıradaki Vakit
                                                            </span>
                                                       )}
                                                  </div>
                                             </div>
                                             <span className={`text-xl font-bold font-serif transition-colors ${isNext ? 'text-accent-gold' : 'text-primary dark:text-accent-gold/80'
                                                  }`}>
                                                  {data.timings[p.key]}
                                             </span>
                                        </div>
                                   )
                              })}
                         </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                         <button
                              onClick={() => navigate('/qibla')}
                              className="group p-5 rounded-[2rem] bg-surface-light dark:bg-surface-dark border border-accent-gold/20 flex flex-col items-center gap-3 hover:border-accent-gold/40 hover:shadow-lg hover:shadow-accent-gold/5 transition-all"
                         >
                              <div className="size-12 rounded-2xl bg-accent-gold/10 flex items-center justify-center text-accent-gold group-hover:bg-accent-gold group-hover:text-white transition-all shadow-sm">
                                   <span className="material-symbols-outlined text-2xl font-light">explore</span>
                              </div>
                              <span className="text-xs font-bold text-primary dark:text-accent-gold uppercase tracking-widest">Kıble Bulucu</span>
                         </button>
                         <button
                              onClick={() => navigate('/categories/prayers')}
                              className="group p-5 rounded-[2rem] bg-surface-light dark:bg-surface-dark border border-accent-gold/20 flex flex-col items-center gap-3 hover:border-accent-gold/40 hover:shadow-lg hover:shadow-accent-gold/5 transition-all"
                         >
                              <div className="size-12 rounded-2xl bg-accent-gold/10 flex items-center justify-center text-accent-gold group-hover:bg-accent-gold group-hover:text-white transition-all shadow-sm">
                                   <span className="material-symbols-outlined text-2xl font-light">menu_book</span>
                              </div>
                              <span className="text-xs font-bold text-primary dark:text-accent-gold uppercase tracking-widest">Dualar</span>
                         </button>
                    </div>
               </main>
          </div>
     )
}
export default PrayerTimes
