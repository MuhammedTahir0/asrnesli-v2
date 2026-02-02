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
     const [activeTheme, setActiveTheme] = useState('day')
     const [progress, setProgress] = useState(0)

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

     // Timer & Logic Loop
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

                    // Progress calculation
                    const totalSeconds = h * 3600 + m * 60 + s
                    const maxSeconds = 6 * 3600 // Max 6 hours assumed between prayers
                    setProgress(Math.max(0, Math.min(100, 100 - (totalSeconds / maxSeconds) * 100)))

                    // Theme
                    if (next.key === 'Sunrise') setActiveTheme('fajr')
                    else if (next.key === 'Dhuhr') setActiveTheme('morning')
                    else if (next.key === 'Asr') setActiveTheme('noon')
                    else if (next.key === 'Maghrib') setActiveTheme('afternoon')
                    else if (next.key === 'Isha') setActiveTheme('sunset')
                    else setActiveTheme('night')
               }

          }, 1000)

          return () => clearInterval(timer)
     }, [data])

     const themes = {
          fajr: { bg: 'from-[#0f172a] to-[#1e3a5f]', accent: 'text-indigo-300', card: 'bg-indigo-950/40', ring: 'stroke-indigo-400' },
          morning: { bg: 'from-sky-400 to-cyan-300', accent: 'text-sky-900', card: 'bg-white/30', ring: 'stroke-sky-600' },
          noon: { bg: 'from-amber-200 to-orange-300', accent: 'text-orange-900', card: 'bg-white/40', ring: 'stroke-orange-500' },
          afternoon: { bg: 'from-orange-300 to-rose-400', accent: 'text-rose-900', card: 'bg-white/30', ring: 'stroke-rose-500' },
          sunset: { bg: 'from-[#2c1a4d] to-[#6b2457]', accent: 'text-pink-200', card: 'bg-purple-900/40', ring: 'stroke-pink-400' },
          night: { bg: 'from-slate-900 to-gray-900', accent: 'text-slate-300', card: 'bg-slate-800/50', ring: 'stroke-slate-500' },
          day: { bg: 'from-[#2D5A27] to-[#1a3a1a]', accent: 'text-[#C5A059]', card: 'bg-black/20', ring: 'stroke-emerald-400' }
     }

     const currentTheme = themes[activeTheme] || themes.day

     const prayerList = [
          { key: 'Fajr', label: 'İmsak', icon: 'nightlight_round', desc: 'Sabah namazı başlangıcı' },
          { key: 'Sunrise', label: 'Güneş', icon: 'wb_twilight', desc: 'Güneş doğuşu' },
          { key: 'Dhuhr', label: 'Öğle', icon: 'sunny', desc: 'Öğle namazı vakti' },
          { key: 'Asr', label: 'İkindi', icon: 'light_mode', desc: 'İkindi namazı vakti' },
          { key: 'Maghrib', label: 'Akşam', icon: 'wb_twilight', desc: 'Akşam namazı ve iftar' },
          { key: 'Isha', label: 'Yatsı', icon: 'bedtime', desc: 'Yatsı namazı vakti' },
     ]

     if (loading) {
          return (
               <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background-light dark:bg-background-dark">
                    <div className="relative size-20">
                         <div className="absolute inset-0 rounded-full border-4 border-accent-gold/20" />
                         <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-gold animate-spin" />
                         <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-accent-gold text-2xl">mosque</span>
                    </div>
                    <p className="text-accent-green font-bold mt-6 animate-pulse">Konum ve Vakitler Alınıyor...</p>
               </div>
          )
     }

     return (
          <div className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-1000 bg-gradient-to-b ${currentTheme.bg}`}>
               {/* Ambient Effects */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                         animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
                         transition={{ duration: 12, repeat: Infinity }}
                         className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]"
                    />
                    <motion.div
                         animate={{ y: [0, 20, 0], opacity: [0.1, 0.3, 0.1] }}
                         transition={{ duration: 15, repeat: Infinity }}
                         className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]"
                    />
                    <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
               </div>

               <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col h-full overflow-y-auto no-scrollbar pb-32">

                    {/* Header */}
                    <div className="pt-6 px-6 flex items-center justify-between">
                         <button
                              onClick={() => navigate(-1)}
                              className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                         >
                              <span className="material-symbols-outlined">arrow_back</span>
                         </button>
                         <h1 className="text-lg font-bold text-white">Ezan Vakitleri</h1>
                         <button className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                              <span className="material-symbols-outlined">notifications</span>
                         </button>
                    </div>

                    {/* Location Badge */}
                    <div className="flex justify-center mt-4">
                         <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                              <span className="material-symbols-outlined text-[#C5A059] text-lg">location_on</span>
                              <span className="text-sm font-bold text-white tracking-wide">{locationName}</span>
                         </div>
                    </div>

                    {/* Circular Countdown */}
                    <div className="flex flex-col items-center justify-center py-8 px-6">
                         <div className="relative size-56">
                              {/* Background Ring */}
                              <svg className="absolute inset-0 w-full h-full -rotate-90">
                                   <circle
                                        cx="112" cy="112" r="100"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="8"
                                   />
                                   <motion.circle
                                        cx="112" cy="112" r="100"
                                        fill="none"
                                        className={currentTheme.ring}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={628}
                                        strokeDashoffset={628 - (628 * progress) / 100}
                                        initial={{ strokeDashoffset: 628 }}
                                        animate={{ strokeDashoffset: 628 - (628 * progress) / 100 }}
                                        transition={{ duration: 0.5 }}
                                   />
                              </svg>

                              {/* Inner Content */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                   <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-1">
                                        {nextPrayer?.name || 'Hesaplanıyor'}
                                   </span>
                                   <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black tabular-nums">{String(timeLeft.h).padStart(2, '0')}</span>
                                        <span className="text-2xl font-bold opacity-50">:</span>
                                        <span className="text-5xl font-black tabular-nums">{String(timeLeft.m).padStart(2, '0')}</span>
                                        <span className="text-2xl font-bold opacity-50">:</span>
                                        <span className="text-3xl font-bold tabular-nums opacity-70">{String(timeLeft.s).padStart(2, '0')}</span>
                                   </div>
                                   <span className="text-[10px] font-medium uppercase tracking-widest opacity-50 mt-2">Kalan Süre</span>
                              </div>
                         </div>

                         {/* Date Info */}
                         {data?.hijri && (
                              <div className="flex items-center gap-3 mt-4 text-white/60">
                                   <span className="text-xs font-medium">{data.hijri.day} {data.hijri.month.en} {data.hijri.year}</span>
                                   <span className="size-1 rounded-full bg-white/30" />
                                   <span className="text-xs font-medium">{data.date.readable}</span>
                              </div>
                         )}
                    </div>

                    {/* Prayer List */}
                    <div className="px-4 flex-1">
                         <div className={`rounded-[2rem] backdrop-blur-xl border border-white/10 p-3 shadow-2xl ${currentTheme.card}`}>
                              <div className="flex flex-col gap-2">
                                   {data?.timings && prayerList.map((p) => {
                                        const isNext = nextPrayer?.key === p.key
                                        const isPassed = !isNext && prayerList.findIndex(x => x.key === nextPrayer?.key) > prayerList.findIndex(x => x.key === p.key)

                                        return (
                                             <motion.div
                                                  key={p.key}
                                                  initial={{ opacity: 0, y: 10 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  className={`relative flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${isNext
                                                            ? 'bg-white text-gray-900 shadow-lg scale-[1.02]'
                                                            : isPassed
                                                                 ? 'opacity-50'
                                                                 : 'hover:bg-white/5 text-white'
                                                       }`}
                                             >
                                                  <div className="flex items-center gap-4">
                                                       <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors ${isNext ? 'bg-accent-green/10 text-accent-green' : 'bg-white/5 text-white/70'
                                                            }`}>
                                                            <span className="material-symbols-outlined text-2xl">{p.icon}</span>
                                                       </div>
                                                       <div>
                                                            <span className={`text-base font-bold tracking-wide block ${isNext ? 'text-gray-900' : ''}`}>
                                                                 {p.label}
                                                            </span>
                                                            <span className={`text-[10px] font-medium ${isNext ? 'text-gray-500' : 'text-white/50'}`}>
                                                                 {p.desc}
                                                            </span>
                                                       </div>
                                                  </div>

                                                  <div className="flex items-center gap-3">
                                                       {isNext && (
                                                            <motion.span
                                                                 animate={{ scale: [1, 1.1, 1] }}
                                                                 transition={{ repeat: Infinity, duration: 2 }}
                                                                 className="text-[9px] font-black uppercase tracking-widest bg-accent-gold text-white px-2 py-1 rounded-md"
                                                            >
                                                                 Sıradaki
                                                            </motion.span>
                                                       )}
                                                       {isPassed && (
                                                            <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
                                                       )}
                                                       <span className={`text-xl font-bold font-display ${isNext ? 'text-gray-900' : 'opacity-90'}`}>
                                                            {data.timings[p.key]}
                                                       </span>
                                                  </div>
                                             </motion.div>
                                        )
                                   })}
                              </div>
                         </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="px-6 mt-6 pb-4">
                         <div className="grid grid-cols-2 gap-3">
                              <button
                                   onClick={() => navigate('/qibla')}
                                   className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all"
                              >
                                   <span className="material-symbols-outlined text-[#C5A059]">explore</span>
                                   <span className="text-sm font-bold">Kıble Bulucu</span>
                              </button>
                              <button
                                   onClick={() => navigate('/categories/prayers')}
                                   className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all"
                              >
                                   <span className="material-symbols-outlined text-[#C5A059]">menu_book</span>
                                   <span className="text-sm font-bold">Dualar</span>
                              </button>
                         </div>
                    </div>

               </div>
          </div>
     )
}

export default PrayerTimes
