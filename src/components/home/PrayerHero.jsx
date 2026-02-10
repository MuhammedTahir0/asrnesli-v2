import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getPrayerTimes, calculateNextPrayer, getCityName } from '../../services/prayerTimes'
import { notificationService } from '../../services/notificationService'

const PrayerHero = () => {
     const [nextPrayer, setNextPrayer] = useState(null)
     const [timeLeft, setTimeLeft] = useState('')
     const [location, setLocation] = useState('')
     const [isSoon, setIsSoon] = useState(false)
     const lastNotifiedRef = React.useRef({ prayer: null, minute: null })

     useEffect(() => {
          let timer;
          const init = async () => {
               // Önce cache kontrolü
               const cachedData = localStorage.getItem('prayer_data')
               const cachedLoc = localStorage.getItem('prayer_location')

               if (cachedLoc) {
                    setLocation(cachedLoc)
               }

               const processTimes = (times) => {
                    const update = () => {
                         const next = calculateNextPrayer(times.timings)
                         setNextPrayer(next)

                         if (next) {
                              const diff = next.targetDate - new Date()
                              const totalMinutes = Math.floor(diff / (1000 * 60))

                              if (diff > 0) {
                                   const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
                                   const m = Math.floor((diff / (1000 * 60)) % 60)

                                   let timeStr = ""
                                   if (h > 0) {
                                        timeStr = `${h}sa ${m}dk`
                                   } else {
                                        timeStr = `${m}dk`
                                   }
                                   setTimeLeft(timeStr)

                                   // Bildirim Mantığı: 15. dakikada bir kez bildirim gönder
                                   if (totalMinutes === 15 && (lastNotifiedRef.current.prayer !== next.name || lastNotifiedRef.current.minute !== totalMinutes)) {
                                        notificationService.sendNotification(
                                             `${next.name} Vaktine Az Kaldı`,
                                             `${next.name} vaktine 15 dakika kaldı. Hazırlık yapmayı unutmayın.`
                                        );
                                        lastNotifiedRef.current = { prayer: next.name, minute: totalMinutes };
                                   }

                                   setIsSoon(totalMinutes < 15)
                              } else {

                                   init();
                              }
                         }
                    }
                    update()
                    timer = setInterval(update, 1000)
               }

               if (cachedData) {
                    const parsed = JSON.parse(cachedData)
                    if (new Date(parsed.timestamp).getDate() === new Date().getDate()) {
                         processTimes(parsed.data)
                    }
               }

               // Konum al ve güncelle
               if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                         const { latitude, longitude } = position.coords

                         // Şehir ismini al
                         try {
                              const city = await getCityName(latitude, longitude)
                              if (city) {
                                   setLocation(city)
                                   localStorage.setItem('prayer_location', city)
                              }
                         } catch (err) {
                              console.error("Şehir alınamadı:", err)
                         }

                         // Vakitleri al
                         try {
                              const times = await getPrayerTimes(latitude, longitude)
                              if (times?.timings) {
                                   localStorage.setItem('prayer_data', JSON.stringify({
                                        data: times,
                                        timestamp: new Date().getTime()
                                   }))
                                   processTimes(times)
                              }
                         } catch (err) {
                              console.error("Vakitler alınamadı:", err)
                         }
                    }, (err) => {
                         console.error("Konum hatası:", err)
                    })
               }
          }
          init()
          return () => clearInterval(timer)
     }, [])

     if (!nextPrayer) return null

     return (
          <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col items-center justify-center py-4"
          >
               <div className="flex items-center gap-2 mb-3 bg-accent-green/10 dark:bg-accent-green/20 px-4 py-1.5 rounded-full border border-accent-green/20">
                    <span className="material-symbols-outlined text-[18px] text-accent-gold !leading-none">location_on</span>
                    <span className="text-xs font-bold text-accent-green dark:text-emerald-400 uppercase tracking-widest leading-none pt-0.5">{location || 'Konum Belirleniyor...'}</span>
               </div>

               <div className="flex flex-col items-center gap-1 mb-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.15em] text-text-secondary dark:text-gray-400">
                         Sıradaki Vakit: <span className="text-accent-green dark:text-emerald-500">{nextPrayer.name}</span>
                    </span>
                    <div className="text-6xl font-black font-display tracking-tighter text-text-primary dark:text-white">
                         {timeLeft}
                    </div>
               </div>

               {isSoon ? (
                    <motion.div
                         animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                         transition={{ repeat: Infinity, duration: 2 }}
                         className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-lg mt-2"
                    >
                         <span className="material-symbols-outlined text-[14px]">alarm</span>
                         Vaktin girmesine az kaldı
                    </motion.div>
               ) : (
                    <div className="h-1 w-12 bg-accent-green/20 rounded-full mt-4"></div>
               )}
          </motion.div>
     )
}

export default PrayerHero
