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
          <div className="min-h-screen bg-background-dark flex flex-col relative pb-28">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background-dark to-background-dark pointer-events-none"></div>

               {/* Header */}
               <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-xl border-b border-accent-gold/10">
                    <div className="flex items-center justify-between p-4">
                         <button
                              onClick={() => navigate(-1)}
                              className="p-2 rounded-full hover:bg-white/5 transition-colors"
                         >
                              <span className="material-symbols-outlined text-white">arrow_back</span>
                         </button>
                         <h1 className="text-lg font-bold text-white">Ezan Vakitleri</h1>
                         <div className="w-10" /> {/* Spacer */}
                    </div>
               </header>

               <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-6 relative z-10">
                    {/* Location & Hijri Date */}
                    <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="flex flex-col items-center text-center space-y-2"
                    >
                         <div className="inline-flex items-center gap-2 bg-accent-green/20 px-4 py-1.5 rounded-full border border-accent-green/30">
                              <span className="material-symbols-outlined text-accent-gold text-sm">location_on</span>
                              <span className="text-sm font-medium text-white tracking-wide">{locationName}</span>
                         </div>
                         {data?.hijri && (
                              <p className="text-accent-gold/70 text-xs font-medium uppercase tracking-widest">
                                   {data.hijri.day} {data.hijri.month.en} {data.hijri.year}
                              </p>
                         )}
                    </motion.div>

                    {/* Next Prayer Countdown Card */}
                    <motion.div
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="relative bg-gradient-to-br from-background-dark to-primary/20 rounded-3xl p-8 border border-accent-gold/20 shadow-2xl overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-8 opacity-5">
                              <span className="material-symbols-outlined text-8xl text-accent-gold">mosque</span>
                         </div>

                         <div className="relative z-10 text-center space-y-4">
                              <span className="text-accent-gold text-xs font-bold uppercase tracking-[0.3em]">
                                   {nextPrayer?.name || 'Vakit Bekleniyor'} Vaktine Kalan Süre
                              </span>

                              <div className="flex items-center justify-center gap-4">
                                   <div className="flex flex-col">
                                        <span className="text-5xl font-black text-white tabular-nums tracking-tighter">
                                             {String(timeLeft.h).padStart(2, '0')}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Saat</span>
                                   </div>
                                   <span className="text-4xl font-light text-accent-gold/40 mb-4">:</span>
                                   <div className="flex flex-col">
                                        <span className="text-5xl font-black text-white tabular-nums tracking-tighter">
                                             {String(timeLeft.m).padStart(2, '0')}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Dakika</span>
                                   </div>
                                   <span className="text-4xl font-light text-accent-gold/40 mb-4">:</span>
                                   <div className="flex flex-col">
                                        <span className="text-5xl font-black text-white tabular-nums tracking-tighter">
                                             {String(timeLeft.s).padStart(2, '0')}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Saniye</span>
                                   </div>
                              </div>
                         </div>
                    </motion.div>

                    {/* Prayer Times List Card */}
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.1 }}
                         className="bg-background-dark/80 rounded-3xl border border-accent-gold/10 overflow-hidden backdrop-blur-md"
                    >
                         <div className="divide-y divide-accent-gold/5">
                              {data?.timings && prayerList.map((p) => {
                                   const isNext = nextPrayer?.key === p.key
                                   return (
                                        <div
                                             key={p.key}
                                             className={`flex items-center justify-between p-5 transition-colors ${isNext ? 'bg-accent-gold/5' : ''
                                                  }`}
                                        >
                                             <div className="flex items-center gap-4">
                                                  <div className={`size-10 rounded-xl flex items-center justify-center ${isNext ? 'bg-accent-gold text-background-dark' : 'bg-white/5 text-white/50'
                                                       }`}>
                                                       <span className="material-symbols-outlined text-xl">{p.icon}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                       <span className={`font-bold ${isNext ? 'text-white' : 'text-white/70'}`}>
                                                            {p.label}
                                                       </span>
                                                       {isNext && (
                                                            <span className="text-[10px] font-bold text-accent-gold uppercase tracking-wider">
                                                                 Sıradaki Vakit
                                                            </span>
                                                       )}
                                                  </div>
                                             </div>
                                             <span className={`text-xl font-bold font-serif ${isNext ? 'text-accent-gold' : 'text-white/90'
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
                              className="group p-4 rounded-2xl bg-white/5 border border-accent-gold/10 flex flex-col items-center gap-2 hover:bg-accent-gold/5 transition-all"
                         >
                              <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-transform">
                                   <span className="material-symbols-outlined">explore</span>
                              </div>
                              <span className="text-xs font-bold text-white/70">Kıble Bulucu</span>
                         </button>
                         <button
                              onClick={() => navigate('/categories/prayers')}
                              className="group p-4 rounded-2xl bg-white/5 border border-accent-gold/10 flex flex-col items-center gap-2 hover:bg-accent-gold/5 transition-all"
                         >
                              <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-transform">
                                   <span className="material-symbols-outlined">menu_book</span>
                              </div>
                              <span className="text-xs font-bold text-white/70">Dualar</span>
                         </button>
                    </div>
               </main>
          </div>
     )
}
export default PrayerTimes

