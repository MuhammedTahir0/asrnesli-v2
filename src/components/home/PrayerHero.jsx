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
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center justify-center pt-2 pb-6 w-full"
          >
               <div className="flex items-center gap-2 mb-6 bg-surface-light dark:bg-surface-dark px-5 py-2 rounded-full border border-accent-gold/20 shadow-soft">
                    <span className="material-symbols-outlined text-[18px] text-accent-gold">location_on</span>
                    <span className="text-[10px] font-bold text-primary dark:text-accent-gold uppercase tracking-widest">{location || 'Konum aranıyor...'}</span>
               </div>

               <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-4">
                         <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent-gold/30"></div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold bg-accent-gold/5 dark:bg-accent-gold/10 px-3 py-1 rounded-md">
                              {nextPrayer.name} Vaktine
                         </span>
                         <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent-gold/30"></div>
                    </div>

                    <div className="text-7xl font-bold tabular-nums tracking-tighter bg-gradient-to-b from-primary via-primary to-accent-green bg-clip-text text-transparent dark:from-accent-gold dark:via-accent-gold dark:to-accent-gold/50 py-1">
                         {timeLeft}
                    </div>
               </div>

               {isSoon ? (
                    <motion.div
                         animate={{ opacity: [0.5, 1, 0.5] }}
                         transition={{ repeat: Infinity, duration: 2 }}
                         className="flex items-center gap-2 text-[9px] font-bold text-red-500 uppercase tracking-widest bg-red-500/5 px-4 py-2 rounded-xl mt-4 border border-red-500/10 shadow-sm"
                    >
                         <span className="material-symbols-outlined text-[14px]">notifications_active</span>
                         Vaktin girmesine az kaldı
                    </motion.div>
               ) : (
                    <div className="flex items-center gap-2 mt-4 opacity-20">
                         <div className="size-1 rounded-full bg-accent-gold"></div>
                         <div className="w-8 h-0.5 bg-accent-gold rounded-full"></div>
                         <div className="size-1 rounded-full bg-accent-gold"></div>
                    </div>
               )}
          </motion.div>
     )
}

export default PrayerHero
