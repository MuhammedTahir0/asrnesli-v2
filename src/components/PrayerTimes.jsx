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
               <div className="min-h-screen bg-[#0a1a0a] flex flex-col items-center justify-center p-8">
                    <div className="relative size-16">
                         <div className="absolute inset-0 rounded-full border-2 border-[#C5A059]/10" />
                         <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#C5A059] animate-spin" />
                    </div>
                    <p className="text-[#C5A059] font-medium mt-6 animate-pulse">Vakitler Yükleniyor...</p>
               </div>
          )
     }

     return (
          <div className="min-h-screen bg-gradient-to-b from-[#0a1a0a] via-[#0f2a0f] to-[#0a1a0a] flex flex-col relative pb-28">
               {/* Header */}
               <header className="sticky top-0 z-50 bg-[#0a1a0a]/90 backdrop-blur-xl border-b border-[#C5A059]/10">
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

               <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-6">
                    {/* Location & Hijri Date */}
                    <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="flex flex-col items-center text-center space-y-2"
                    >
                         <div className="inline-flex items-center gap-2 bg-[#2D5A27]/20 px-4 py-1.5 rounded-full border border-[#2D5A27]/30">
                              <span className="material-symbols-outlined text-[#C5A059] text-sm">location_on</span>
                              <span className="text-sm font-medium text-white tracking-wide">{locationName}</span>
                         </div>
                         {data?.hijri && (
                              <p className="text-[#C5A059]/70 text-xs font-medium uppercase tracking-widest">
                                   {data.hijri.day} {data.hijri.month.en} {data.hijri.year}
                              </p>
                         )}
                    </motion.div>

                    {/* Next Prayer Countdown Card */}
                    <motion.div
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="bg-gradient-to-br from-[#1a2a1a] to-[#0f1f0f] rounded-3xl p-8 border border-[#C5A059]/20 shadow-2xl relative overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-8 opacity-5">
                              <span className="material-symbols-outlined text-8xl text-[#C5A059]">mosque</span>
                         </div>

                         <div className="relative z-10 text-center space-y-4">
                              <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.3em]">
                                   {nextPrayer?.name || 'Vakit Bekleniyor'} Vaktine Kalan Süre
                              </span>

                              <div className="flex items-center justify-center gap-4">
                                   <div className="flex flex-col">
                                        <span className="text-5xl font-black text-white tabular-nums tracking-tighter">
                                             {String(timeLeft.h).padStart(2, '0')}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Saat</span>
                                   </div>
                                   <span className="text-4xl font-light text-[#C5A059]/40 mb-4">:</span>
                                   <div className="flex flex-col">
                                        <span className="text-5xl font-black text-white tabular-nums tracking-tighter">
                                             {String(timeLeft.m).padStart(2, '0')}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Dakika</span>
                                   </div>
                                   <span className="text-4xl font-light text-[#C5A059]/40 mb-4">:</span>
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
                         className="bg-[#0f1f0f]/80 rounded-3xl border border-[#C5A059]/10 overflow-hidden backdrop-blur-md"
                    >
                         <div className="divide-y divide-[#C5A059]/5">
                              {data?.timings && prayerList.map((p) => {
                                   const isNext = nextPrayer?.key === p.key
                                   return (
                                        <div
                                             key={p.key}
                                             className={`flex items-center justify-between p-5 transition-colors ${isNext ? 'bg-[#C5A059]/5' : ''
                                                  }`}
                                        >
                                             <div className="flex items-center gap-4">
                                                  <div className={`size-10 rounded-xl flex items-center justify-center ${isNext ? 'bg-[#C5A059] text-[#0a1a0a]' : 'bg-white/5 text-white/50'
                                                       }`}>
                                                       <span className="material-symbols-outlined text-xl">{p.icon}</span>
                                                  </div>
                                                  <div className="flex flex-col">
                                                       <span className={`font-bold ${isNext ? 'text-white' : 'text-white/70'}`}>
                                                            {p.label}
                                                       </span>
                                                       {isNext && (
                                                            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">
                                                                 Sıradaki Vakit
                                                            </span>
                                                       )}
                                                  </div>
                                             </div>
                                             <span className={`text-xl font-bold font-serif ${isNext ? 'text-[#C5A059]' : 'text-white/90'
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
                              className="group p-4 rounded-2xl bg-[#0f1f0f]/50 border border-[#C5A059]/10 flex flex-col items-center gap-2 hover:bg-[#C5A059]/5 transition-all"
                         >
                              <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                                   <span className="material-symbols-outlined">explore</span>
                              </div>
                              <span className="text-xs font-bold text-white/70">Kıble Bulucu</span>
                         </button>
                         <button
                              onClick={() => navigate('/categories/prayers')}
                              className="group p-4 rounded-2xl bg-[#0f1f0f]/50 border border-[#C5A059]/10 flex flex-col items-center gap-2 hover:bg-[#C5A059]/5 transition-all"
                         >
                              <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
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
