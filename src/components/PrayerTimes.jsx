import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PrayerTimes = () => {
     const [location, setLocation] = useState(null)
     const [times, setTimes] = useState(null)
     const [cityName, setCityName] = useState('Konum Belirleniyor...')
     const [loading, setLoading] = useState(true)
     const [nextPrayer, setNextPrayer] = useState(null)

     useEffect(() => {
          const loadInitData = async () => {
               const cachedTimes = localStorage.getItem('prayer_times')
               const cachedCity = localStorage.getItem('city_name')
               const cachedDate = localStorage.getItem('prayer_date')
               const today = new Date().toLocaleDateString('tr-TR')

               if (cachedTimes && cachedCity && cachedDate === today) {
                    const parsedTimes = JSON.parse(cachedTimes)
                    setTimes(parsedTimes)
                    setCityName(cachedCity)
                    calculateNextPrayer(parsedTimes)
                    setLoading(false)
                    return
               }

               if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                         async (position) => {
                              const { latitude, longitude } = position.coords
                              setLocation({ latitude, longitude })
                              const timings = await fetchPrayerTimes(latitude, longitude)
                              const city = await fetchCityName(latitude, longitude)

                              if (timings && city) {
                                   localStorage.setItem('prayer_times', JSON.stringify(timings))
                                   localStorage.setItem('city_name', city)
                                   localStorage.setItem('prayer_date', today)
                              }
                         },
                         (error) => {
                              console.error('Konum hatası:', error)
                              setCityName('Konum Erişimi Reddedildi')
                              setLoading(false)
                         }
                    )
               }
          }

          loadInitData()
     }, [])

     const fetchPrayerTimes = async (lat, lng) => {
          try {
               const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=13`)
               const data = await response.json()
               if (data.code === 200) {
                    const timings = data.data.timings
                    setTimes(timings)
                    calculateNextPrayer(timings)
                    return timings
               }
          } catch (err) {
               console.error('Ezan vakitleri alınamadı:', err)
          } finally {
               setLoading(false)
          }
          return null
     }

     const fetchCityName = async (lat, lng) => {
          try {
               const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
               const data = await response.json()
               const city = data.address.city || data.address.town || data.address.province || 'Bilinmeyen Konum'
               setCityName(city)
               return city
          } catch (err) {
               console.error('Şehir adı alınamadı:', err)
          }
          return null
     }

     const calculateNextPrayer = (timings) => {
          if (!timings) return
          const now = new Date()
          const pTimes = [
               { name: 'İmsak', time: timings.Fajr },
               { name: 'Güneş', time: timings.Sunrise },
               { name: 'Öğle', time: timings.Dhuhr },
               { name: 'İkindi', time: timings.Asr },
               { name: 'Akşam', time: timings.Maghrib },
               { name: 'Yatsı', time: timings.Isha },
          ]

          const upcoming = pTimes.find(p => {
               const [h, m] = p.time.split(':')
               const pDate = new Date()
               pDate.setHours(h, m, 0)
               return pDate > now
          }) || pTimes[0]

          setNextPrayer(upcoming)
     }

     const prayerCards = [
          { name: 'İmsak', key: 'Fajr', icon: 'wb_twilight' },
          { name: 'Öğle', key: 'Dhuhr', icon: 'light_mode' },
          { name: 'İkindi', key: 'Asr', icon: 'flare' },
          { name: 'Akşam', key: 'Maghrib', icon: 'wb_sunset' },
          { name: 'Yatsı', key: 'Isha', icon: 'dark_mode' },
     ]

     if (loading) {
          return (
               <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FDFBF7]">
                    <motion.div
                         animate={{ rotate: 360 }}
                         transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                         className="size-16 rounded-full border-4 border-[#C5A059]/10 border-t-[#C5A059] mb-4"
                    />
                    <p className="text-[#2D5A27] font-bold animate-pulse">Vakitler Hesaplanıyor...</p>
               </div>
          )
     }

     return (
          <div className="flex-1 flex flex-col bg-[#FDFBF7] overflow-y-auto no-scrollbar pb-32">
               {/* Hero Section */}
               <section className="relative h-72 shrink-0 overflow-hidden bg-[#2D5A27]">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2D5A27]/80"></div>

                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-8 text-center pt-8">
                         <div className="flex items-center gap-2 mb-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                              <span className="material-symbols-outlined text-sm text-[#C5A059]">location_on</span>
                              <span className="text-xs font-bold tracking-widest uppercase">{cityName}</span>
                         </div>

                         <h2 className="text-sm font-bold opacity-70 uppercase tracking-[0.2em] mb-1">Sıradaki Vakit: {nextPrayer?.name}</h2>
                         <div className="text-6xl font-black font-display tracking-tighter mb-2">
                              {nextPrayer?.time}
                         </div>
                         <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">Vaktin girmesine az kaldı</p>
                    </div>

                    {/* Wave Ornament */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                         <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-[40px] w-full fill-[#FDFBF7]">
                              <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
                         </svg>
                    </div>
               </section>

               {/* Prayer Times List */}
               <section className="px-6 -mt-8 relative z-20 space-y-4">
                    {times && prayerCards.map((p, idx) => (
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              key={p.key}
                              className={`bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border flex items-center justify-between transition-all ${nextPrayer?.name === p.name ? 'border-[#C5A059] ring-4 ring-[#C5A059]/5' : 'border-gray-100'}`}
                         >
                              <div className="flex items-center gap-5">
                                   <div>
                                        <h3 className={`font-bold text-base tracking-wide ${nextPrayer?.name === p.name ? 'text-[#C5A059]' : 'text-[#141514]'}`}>{p.name}</h3>
                                        {nextPrayer?.name === p.name && <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Aktif Vakit</span>}
                                   </div>
                              </div>
                              <div className="flex flex-col items-end">
                                   <span className="text-2xl font-black font-display text-[#141514]">{times[p.key]}</span>
                              </div>
                         </motion.div>
                    ))}
               </section>

               {/* Extra Info */}
               <section className="px-8 mt-10">
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-[#1b2b1a] to-[#2D5A27] text-white relative overflow-hidden shadow-2xl">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                         <div className="relative z-10 flex flex-col gap-4">
                              <span className="material-symbols-outlined text-[#C5A059] text-4xl">info</span>
                              <h4 className="text-lg font-bold font-serif leading-tight">Vakitler bulunduğunuz konuma göre otomatik hesaplanır.</h4>
                              <p className="text-xs text-white/60 leading-relaxed font-medium">Hicri takvime göre gün akşam ezanı ile başlar. Vakitlerde Diyanet İşleri Başkanlığı hesaplama metodları esas alınmıştır.</p>
                         </div>
                    </div>
               </section>
          </div>
     )
}

export default PrayerTimes
